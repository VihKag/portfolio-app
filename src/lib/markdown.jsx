// Lightweight, safe markdown-lite helpers shared by the rich-text editor
// and renderer. Supports **bold**, *italic*, [label](https://url) and
// `-`/`*` bullet lists.

// Inline tokens, matched in this order so `**bold**` wins over `*italic*`.
const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

// Parse a single line of text into an array of React nodes. Safe by
// construction — text is rendered as React children, never as raw HTML.
export function renderInline(text, keyPrefix = "i") {
  const out = []
  let last = 0
  let match
  let k = 0
  INLINE.lastIndex = 0
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    if (match[1] !== undefined) {
      out.push(<strong key={`${keyPrefix}-${k}`}>{match[1]}</strong>)
    } else if (match[2] !== undefined) {
      out.push(<em key={`${keyPrefix}-${k}`}>{match[2]}</em>)
    } else {
      out.push(
        <a
          key={`${keyPrefix}-${k}`}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-accent"
        >
          {match[3]}
        </a>,
      )
    }
    last = INLINE.lastIndex
    k++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

// Group lines into paragraph and bullet-list blocks.
export function toBlocks(text) {
  const blocks = []
  let list = null
  for (const line of String(text).split(/\r?\n/)) {
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      if (!list) list = []
      list.push(bullet[1])
      continue
    }
    if (list) {
      blocks.push({ type: "ul", items: list })
      list = null
    }
    if (line.trim() !== "") blocks.push({ type: "p", text: line })
  }
  if (list) blocks.push({ type: "ul", items: list })
  return blocks
}

// Strip markdown markers to plain text — for clamped previews where
// block-level formatting can't be rendered.
export function stripMarkdown(text) {
  if (!text) return ""
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
}
