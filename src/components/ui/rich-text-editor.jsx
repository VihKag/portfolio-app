"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Bold, Italic, List, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const TOOLBAR_BTN =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

// A textarea with a small markdown formatting toolbar (bold, italic,
// bullet list, link). Keeps the same value/onChange contract as Textarea
// so it's a drop-in replacement, but writes markdown-lite into the value.
export const RichTextEditor = forwardRef(function RichTextEditor(
  { value = "", onChange, className, toolbarClassName, ...props },
  ref,
) {
  const innerRef = useRef(null)
  useImperativeHandle(ref, () => innerRef.current)

  // Push a new value through onChange, then restore the caret/selection.
  const commit = (next, selStart, selEnd) => {
    onChange?.({ target: { value: next } })
    requestAnimationFrame(() => {
      const el = innerRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(selStart, selEnd)
    })
  }

  // Wrap the current selection (or caret) with a marker like ** or *.
  const wrap = (marker) => {
    const el = innerRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const before = value.slice(0, start)
    const selected = value.slice(start, end)
    const after = value.slice(end)
    const next = `${before}${marker}${selected}${marker}${after}`
    if (selected) {
      commit(next, start + marker.length, end + marker.length)
    } else {
      const caret = start + marker.length
      commit(next, caret, caret)
    }
  }

  // Toggle "- " bullet prefixes on every line the selection touches.
  const toggleBullets = () => {
    const el = innerRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    let lineEnd = value.indexOf("\n", end)
    if (lineEnd === -1) lineEnd = value.length
    const block = value.slice(lineStart, lineEnd)
    const lines = block.split("\n")
    const allBulleted = lines.every((l) => l.trim() === "" || /^\s*-\s+/.test(l))
    const updated = lines
      .map((l) =>
        l.trim() === "" ? l : allBulleted ? l.replace(/^(\s*)-\s+/, "$1") : `- ${l}`,
      )
      .join("\n")
    const next = value.slice(0, lineStart) + updated + value.slice(lineEnd)
    commit(next, lineStart, lineStart + updated.length)
  }

  // Insert a [label](url) link, using the selection as the label.
  const insertLink = () => {
    const el = innerRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const label = value.slice(start, end) || "link text"
    const snippet = `[${label}](https://)`
    const next = value.slice(0, start) + snippet + value.slice(end)
    // Place caret inside the empty url parens, after "https://".
    const urlPos = start + label.length + 3 + "https://".length
    commit(next, urlPos, urlPos)
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className,
      )}
    >
      <div className={cn("flex items-center gap-0.5 border-b border-border px-1.5 py-1", toolbarClassName)}>
        <button type="button" onClick={() => wrap("**")} aria-label="Bold" title="Bold" className={TOOLBAR_BTN}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => wrap("*")} aria-label="Italic" title="Italic" className={TOOLBAR_BTN}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={toggleBullets} aria-label="Bullet list" title="Bullet list" className={TOOLBAR_BTN}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={insertLink} aria-label="Link" title="Link" className={TOOLBAR_BTN}>
          <Link2 className="h-4 w-4" />
        </button>
      </div>
      <Textarea
        ref={innerRef}
        value={value}
        onChange={onChange}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    </div>
  )
})
