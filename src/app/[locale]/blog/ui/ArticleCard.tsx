import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import FoldText from '@/shared/FoldText'

export type Article = {
  title: string
  slug: string
  href: string
  excerpt: string
  cover?: { src: string; alt: string }
  dateTime: string
  dateLabel: string
}

export type ArticleLabels = { featured: string; read: string }

export function ArticleCard({ article, labels, featured = false }: { article: Article; labels: ArticleLabels; featured?: boolean }) {
  const { cover, title, href, dateLabel, dateTime, excerpt } = article
  return (
    <article className={featured
      ? 'grid overflow-hidden rounded-xl border border-white/10 bg-zinc-900 md:grid-cols-2'
      : 'flex min-w-0 flex-col gap-4 border-t border-white/15 pt-5'}>
      <div className={featured ? 'relative isolate aspect-video overflow-hidden bg-zinc-800 md:aspect-auto md:min-h-80' : 'relative isolate aspect-video overflow-hidden rounded-lg bg-zinc-800'}>
        <Image
          src={cover?.src ?? '/images/homePage/hero-section/hero-1.webp'}
          alt={cover?.alt ?? ''}
          fill
          sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw'}
          unoptimized={!!cover && /^https?:/i.test(cover.src)}
          className="object-cover"
        />
        {!cover && (
          <div aria-hidden="true" className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/75 via-transparent to-transparent p-5">
            <Image src="/logo.svg" alt="" width={46} height={65} unoptimized className="h-14 w-auto" />
          </div>
        )}
      </div>
      <div className={featured ? 'flex min-w-0 flex-col items-start justify-center gap-4 p-5 sm:gap-5 sm:p-8 xl:p-12' : 'flex grow flex-col items-start gap-3'}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold tracking-wide text-zinc-400">
          {featured && <span className="inline-flex items-center gap-2 text-zinc-200 uppercase"><span aria-hidden="true" className="size-2 bg-brand-red" />{labels.featured}</span>}
          <time dateTime={dateTime}>{dateLabel}</time>
        </div>
        <h3 className={`font-bold tracking-tight text-pretty wrap-anywhere ${featured ? 'text-2xl/tight lg:text-3xl/tight xl:text-4xl/tight' : 'text-xl/snug sm:text-2xl/snug'}`}>
          <FoldText text={title} subtle />
        </h3>
        {excerpt && <p className="text-base/relaxed wrap-anywhere text-zinc-300">{excerpt}</p>}
        <Link href={href} target="_blank" rel="noopener noreferrer" data-gtm="blog-read-more"
          className="inline-flex min-h-12 items-center gap-2 text-sm font-bold no-underline hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red">
          {labels.read}<span className="sr-only"> — {title}</span><ArrowUpRight aria-hidden="true" className="size-4 text-brand-red" />
        </Link>
      </div>
    </article>
  )
}
