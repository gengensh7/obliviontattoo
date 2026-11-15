import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { config } from 'dotenv'

const log = (message: string) => console.log(`[IndexNow] ${message}`)
const local = process.argv.includes('--local')
const mode = process.env.NODE_ENV || 'production'
config({
  path: [`.env.${mode}.local`, ...(mode === 'test' ? [] : ['.env.local']), `.env.${mode}`, '.env'],
  quiet: true
})
const dryRun = process.argv.includes('--dry-run') || process.env.INDEXNOW_DRY_RUN === 'true'

async function request(url: string, init: RequestInit = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, redirect: 'manual', signal: AbortSignal.timeout(10_000) })
      const body = await response.text()
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        if (attempt < 2) {
          const retryAfter = response.headers.get('retry-after')
          const seconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : 2 ** attempt
          log(`HTTP ${response.status}; retry ${attempt + 1}/2 in ${Math.min(seconds, 10)}s.`)
          await delay(Math.min(seconds, 10) * 1000)
          continue
        }
      }
      return { status: response.status, headers: response.headers, body }
    } catch (error) {
      if (attempt === 2) throw error
      log(`Network error or timeout; retry ${attempt + 1}/2.`)
      await delay(1000 * 2 ** attempt)
    }
  }
}

function sameSite(value: string, site: URL): URL | undefined {
  try {
    const url = new URL(value)
    if (url.origin === site.origin && !url.username && !url.password && !url.hash) return url
  } catch { /* Ignore invalid sitemap URLs. */ }
}

function decodeXml(value: string) {
  return value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity: string) => {
    if (entity.startsWith('#')) {
      return String.fromCodePoint(entity[1].toLowerCase() === 'x'
        ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10))
    }
    return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" } as Record<string, string>)[entity.toLowerCase()]
  })
}

async function sitemapUrls(site: URL) {
  const visited = new Set<string>()
  const pages = new Set<string>()
  async function visit(url: URL) {
    if (visited.has(url.href)) return
    if (visited.size >= 1000) throw new Error('Sitemap traversal limit reached.')
    visited.add(url.href)
    let xml: string
    if (local) {
      xml = await readFile(path.join('.next/server/app', `${url.pathname}.body`), 'utf8')
    } else {
      const response = await request(url.href)
      if (response.status !== 200) throw new Error(`Sitemap ${url.pathname}: HTTP ${response.status}.`)
      xml = response.body
    }
    if (/<!DOCTYPE/i.test(xml)) throw new Error('Unsupported sitemap DOCTYPE.')
    const index = /<sitemapindex(?:\s|>)/i.test(xml)
    if (!index && !/<urlset(?:\s|>)/i.test(xml)) throw new Error(`Invalid sitemap: ${url.pathname}.`)
    const entries = index ? /<sitemap\b[^>]*>([\s\S]*?)<\/sitemap>/gi : /<url\b[^>]*>([\s\S]*?)<\/url>/gi
    for (const entry of xml.matchAll(entries)) {
      // Match page locations only, never image:loc, video content or alternate links.
      const loc = entry[1].match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)
      if (!loc) continue
      const target = sameSite(decodeXml(loc[1].trim()), site)
      if (!target) continue
      if (index) await visit(target)
      else {
        const segments = decodeURIComponent(target.pathname).toLowerCase().split('/')
        if (target.search || segments.some((segment) => /^(?:api|trpc|admin|dashboard|auth|login|logout|signin|signup|account|preview|_.*)$/.test(segment))) continue
        pages.add(target.href)
      }
    }
  }
  await visit(new URL('/sitemap.xml', site))
  log(`Read ${visited.size} sitemap(s); ${pages.size} unique public URLs.`)
  return [...pages]
}

function hasNoindex(body: string, headers: Headers) {
  if (/\b(noindex|none)\b/i.test(headers.get('x-robots-tag') || '')) return true
  return [...body.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) => {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
      .map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]]))
    return /^(robots|bingbot)$/i.test(attributes.name || '') && /\b(noindex|none)\b/i.test(attributes.content || '')
  })
}

async function indexableUrls(urls: string[]) {
  const result: string[] = []
  // Limit concurrent requests to the public site.
  for (let offset = 0; offset < urls.length; offset += 5) {
    const checked = await Promise.all(urls.slice(offset, offset + 5).map(async (url) => {
      const response = await request(url)
      if (response.status !== 200 || !/text\/html/i.test(response.headers.get('content-type') || '') || hasNoindex(response.body, response.headers)) {
        log(`Excluded ${new URL(url).pathname}: HTTP ${response.status}, non-HTML or noindex.`)
        return undefined
      }
      return url
    }))
    result.push(...checked.filter((url): url is string => !!url))
  }
  return result
}

async function main() {
  const key = process.env.INDEXNOW_KEY
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('INDEXNOW_KEY must contain 8–128 letters, numbers or hyphens.')
  const keyPath = path.join('public', `${key}.txt`)
  if (process.argv.includes('--prepare')) {
    await mkdir('public', { recursive: true })
    // Derive the public file from the effective environment on every build.
    await writeFile(keyPath, key, 'utf8')
    log('Verification file prepared in public/.')
    return
  }
  if (local && !dryRun) throw new Error('--local is allowed only with --dry-run.')
  const preview = (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') ||
    (process.env.CONTEXT && process.env.CONTEXT !== 'production')
  const disabled = process.env.INDEXNOW_ENABLED === 'false' || ['development', 'test'].includes(process.env.NODE_ENV || '')
  const localBuild = process.argv.includes('--postbuild') && process.env.VERCEL_ENV !== 'production' && process.env.INDEXNOW_ENABLED !== 'true'
  if (!dryRun && (preview || disabled || localBuild)) {
    log('Skipped: local build, preview, development/test or INDEXNOW_ENABLED=false.')
    return
  }
  const domain = process.env.NEXT_PUBLIC_DOMAIN_URL
  if (!domain) throw new Error('NEXT_PUBLIC_DOMAIN_URL is required.')
  const site = new URL(domain)
  // This integration is scoped to the canonical production domain, never a preview or localhost.
  if (site.origin !== 'https://obliviontattoo.xyz' || site.username || site.password || site.pathname !== '/' || site.search || site.hash) {
    throw new Error('NEXT_PUBLIC_DOMAIN_URL must be https://obliviontattoo.xyz.')
  }
  if (await readFile(keyPath, 'utf8') !== key) throw new Error('Local key file mismatch. Run node --import tsx scripts/indexnow.ts --prepare.')
  const keyLocation = `${site.origin}/${key}.txt`
  if (!local) {
    const response = await request(keyLocation)
    if (response.status !== 200 || response.body !== key) {
      throw new Error(`Public key is unavailable or differs from INDEXNOW_KEY (HTTP ${response.status}). Deploy first, then run pnpm indexnow.`)
    }
    log('Public key verified.')
  }
  let urls = await sitemapUrls(site)
  if (!local) urls = await indexableUrls(urls)
  else log('Offline dry-run: public key, HTTP status and runtime noindex are not checked.')
  if (!urls.length) throw new Error('No indexable URLs found; nothing submitted.')
  if (dryRun) {
    log(`DRY RUN: ${urls.length} URLs; host=${site.host}; keyLocation=${keyLocation}; no IndexNow requests.`)
    urls.forEach((url) => log(url))
    return
  }
  let accepted = 0
  for (let offset = 0; offset < urls.length; offset += 10_000) {
    const batch = urls.slice(offset, offset + 10_000)
    const response = await request('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: site.host, key, keyLocation, urlList: batch })
    })
    if (response.status !== 200 && response.status !== 202) throw new Error(`IndexNow HTTP ${response.status}; accepted ${accepted}/${urls.length} URLs.`)
    accepted += batch.length
    log(`HTTP ${response.status}; accepted ${accepted}/${urls.length} URLs.`)
  }
}

main().catch((error: unknown) => {
  console.warn(`[IndexNow] ${error instanceof Error ? error.message : String(error)} Build result is unaffected.`)
  if (!process.argv.includes('--postbuild') && !process.argv.includes('--prepare')) process.exitCode = 1
})
