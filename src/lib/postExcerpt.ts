import { htmlToDOM } from 'html-react-parser'
import type { DOMNode } from 'html-react-parser'

function paragraphText(nodes: DOMNode[], inParagraph = false): string {
  let text = ''
  for (const node of nodes) {
    if (node.type === 'text' && inParagraph) text += node.data
    if (node.type !== 'tag') continue
    if (node.name === 'br') text += ' '
    const childText = paragraphText(node.children as DOMNode[], inParagraph || node.name === 'p')
    if (!inParagraph && childText.trim()) return childText
    text += childText
  }
  return text
}

export function postExcerpt(html: string) {
  const nodes = htmlToDOM(html)
  const introduction = paragraphText(nodes).trim() || paragraphText(nodes, true).trim()
  const text = introduction.replace(/\s+/g, ' ')
  if (text.length <= 180) return text
  return text.slice(0, 180).replace(/\s+\S*$/, '').trimEnd() + '…'
}
