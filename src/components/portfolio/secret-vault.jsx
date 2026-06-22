"use client"

import { useEffect } from "react"
import { X, Lock, Heart, Sparkles } from "lucide-react"

/**
 * A hidden "secret room" overlay.
 *
 * It renders nothing inline on the portfolio. The page mounts it and toggles
 * `open` when the visitor clicks the hidden trigger element (the footer heart).
 * Closes on backdrop click, the X button, or the Escape key.
 */
export function SecretVault({ open, onClose, items = [], displayName, themeColor = "#14b8a6" }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  const favorites = items.filter((i) => i.category === "favorite")
  const facts = items.filter((i) => i.category === "fact")

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Personal vault"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border/60 bg-card shadow-2xl animate-slide-up"
        style={{ boxShadow: `0 30px 80px -20px ${themeColor}40` }}
      >
        {/* Glow accents */}
        <div
          className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${themeColor}22` }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-8 sm:p-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-5"
            style={{ borderColor: `${themeColor}40`, backgroundColor: `${themeColor}12`, color: themeColor }}
          >
            <Lock className="w-3.5 h-3.5" />
            You found the secret room
          </div>

          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6" style={{ color: themeColor }} />
            The real {displayName}
          </h2>
          <p className="text-muted-foreground mb-8">
            A few personal things I don't put on the front page.
          </p>

          {items.length === 0 && (
            <p className="text-muted-foreground text-sm">Nothing here yet — come back later.</p>
          )}

          {facts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">A little about me</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {facts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 px-4 py-3"
                  >
                    <span className="text-2xl">{item.emoji || "✨"}</span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      {item.value && <p className="font-medium truncate">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favorites.length > 0 && (
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Things I love
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {favorites.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 px-4 py-3"
                  >
                    <span className="text-2xl">{item.emoji || "💛"}</span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      {item.value && <p className="font-medium truncate">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
