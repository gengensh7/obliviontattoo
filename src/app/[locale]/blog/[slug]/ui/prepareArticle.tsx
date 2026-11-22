import { attributesToProps, domToReact, htmlToDOM, type DOMNode, type Element } from 'html-react-parser'
import { firstImage } from '@/lib/postExcerpt'

function textOf(node: DOMNode): string {
  if (node.type === 'text') return node.data
  if (node.type !== 'tag') return ''
  if (node.name === 'br') return ' '
  const text = (node.children as DOMNode[]).map(textOf).join('')
  return /^(?:p|div|section|h[1-6]|li|td|th|blockquote)$/.test(node.name) ? ` ${text} ` : text
}

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

// Older posts wrap the title and introduction in an article and a div.
function takeOpening(nodes: DOMNode[], matches: (node: Element) => boolean): Element | undefined {
  const index = nodes.findIndex(node => node.type !== 'comment' && !(node.type === 'text' && !node.data.trim()))
  const first = nodes[index]
  if (first?.type !== 'tag') return
  if (matches(first)) {
    nodes.splice(index, 1)
    return first
  }
  if (/^(article|div|header|section)$/.test(first.name)) {
    const children = first.children as DOMNode[]
    const result = takeOpening(children, matches)
    if (result && !Object.keys(first.attribs).length && children.every(n => n.type === 'text' && !n.data.trim())) {
      nodes.splice(index, 1)
    }
    return result
  }
}

export function prepareArticle(content: string, excerpt: string) {
  const nodes = htmlToDOM(content)
  const words = normalize(nodes.map(textOf).join('')).match(/\S+/g)?.length ?? 0
  const cover = firstImage(nodes)
  const takeCover = () => cover && takeOpening(nodes, node => {
    const imageBlock = ['img', 'figure', 'picture'].includes(node.name) ||
      (['p', 'a'].includes(node.name) && !normalize(textOf(node)))
    return imageBlock && firstImage([node])?.src === cover.src
  })
  let openingImage = takeCover()
  const title = takeOpening(nodes, node => node.name === 'h1')
  openingImage ??= takeCover()
  const lead = takeOpening(nodes, node => {
    if (node.name !== 'p') return false
    const text = normalize(textOf(node))
    const summary = normalize(excerpt)
    return text === summary || (summary.endsWith('…') && text.startsWith(summary.slice(0, -1)))
  })
  openingImage ??= takeCover()
  // The route owns the article landmark. Keep the author's attributes and section structure.
  for (const node of nodes) {
    if (node.type === 'tag' && node.name === 'article') node.name = 'div'
  }

  return {
    heading: title && domToReact([title]),
    headingText: title && normalize(textOf(title)),
    description: lead ? domToReact([lead]) : <p>{excerpt}</p>,
    cover,
    openingImage: openingImage && domToReact([openingImage]),
    minutes: Math.max(1, Math.ceil(words / 200)),
    body: domToReact(nodes, {
      replace(node) {
        if (node.type !== 'tag') return
        if (node.name === 'h1') {
          return <h2 {...attributesToProps(node.attribs)}>{domToReact(node.children as DOMNode[])}</h2>
        }
        if (node.name === 'table') {
          return <div className="overflow-x-auto">{domToReact([node])}</div>
        }
      }
    })
  }
}
