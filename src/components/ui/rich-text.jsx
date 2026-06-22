import { cn } from "@/lib/utils"
import { renderInline, toBlocks } from "@/lib/markdown"

// Render markdown-lite text as formatted React elements. Supports
// **bold**, *italic*, [links](url), and `-`/`*`-prefixed bullet lists.
export function RichText({ text, className }) {
  if (!text) return null
  const blocks = toBlocks(text)
  return (
    <div className={cn("space-y-2", className)}>
      {blocks.map((b, i) =>
        b.type === "ul" ? (
          <ul key={i} className="list-disc pl-5 space-y-1">
            {b.items.map((item, j) => (
              <li key={j}>{renderInline(item, `${i}-${j}`)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(b.text, `${i}`)}</p>
        ),
      )}
    </div>
  )
}
