"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Palette, Save } from "lucide-react"

const THEME_PRESETS = [
  { name: "Teal", color: "#14b8a6" },
  { name: "Blue", color: "#0ea5e9" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Orange", color: "#f97316" },
  { name: "Emerald", color: "#10b981" },
  { name: "Indigo", color: "#6366f1" },
]

const BACKGROUND_PRESETS = [
  { name: "Dark Navy", color: "#0e0e16" },
  { name: "Charcoal", color: "#1a1a2e" },
  { name: "Deep Blue", color: "#0f172a" },
  { name: "Dark Slate", color: "#1e293b" },
  { name: "Almost Black", color: "#0a0a0a" },
  { name: "Navy Dark", color: "#001a33" },
  { name: "Midnight", color: "#0d1117" },
  { name: "Graphite", color: "#2b2d31" },
]

export function ThemeCustomizer({ userId, currentTheme, currentBackground }) {
  const [selectedColor, setSelectedColor] = useState(currentTheme || "#14b8a6")
  const [selectedBackground, setSelectedBackground] = useState(currentBackground || "#0e0e16")
  const [loading, setLoading] = useState(false)
  const [previewStyle, setPreviewStyle] = useState({})

  useEffect(() => {
    setPreviewStyle({
      "--accent": selectedColor,
      backgroundColor: selectedBackground,
    })
  }, [selectedColor, selectedBackground])

  const handleSaveTheme = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          theme_color: selectedColor,
          background_color: selectedBackground,
        })
        .eq("id", userId)

      if (error) {
        toast.error("Failed to save theme colors")
      } else {
        toast.success("Theme colors updated successfully!")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCustomColor = (e) => {
    setSelectedColor(e.target.value)
  }

  const handleCustomBackground = (e) => {
    setSelectedBackground(e.target.value)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          Portfolio Theme Customization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div
            className="border-2 border-border rounded-lg p-8 space-y-4 transition-colors duration-300"
            style={previewStyle}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              <p className="text-sm text-muted-foreground">This is how your portfolio will look</p>
              <button
                className="px-4 py-2 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: selectedColor,
                  color: getContrastColor(selectedColor),
                }}
              >
                Sample Button
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Accent Color</h3>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Preset Colors</Label>
              <div className="grid grid-cols-4 gap-3">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() => setSelectedColor(preset.color)}
                    className="relative group"
                    title={preset.name}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg transition-all duration-300 ${
                        selectedColor === preset.color ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                      } hover:scale-105`}
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <Label htmlFor="colorPicker" className="text-sm font-medium">
                Custom Accent Color
              </Label>
              <div className="flex gap-3 items-center">
                <input
                  id="colorPicker"
                  type="color"
                  value={selectedColor}
                  onChange={handleCustomColor}
                  className="w-16 h-10 rounded-lg cursor-pointer border border-border"
                />
                <code className="text-sm bg-muted px-3 py-2 rounded font-mono flex-1">{selectedColor}</code>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Background Color</h3>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Preset Colors</Label>
              <div className="grid grid-cols-4 gap-3">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() => setSelectedBackground(preset.color)}
                    className="relative group"
                    title={preset.name}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg transition-all duration-300 border ${
                        selectedBackground === preset.color
                          ? "ring-2 ring-offset-2 ring-accent scale-110"
                          : "border-border"
                      } hover:scale-105`}
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <Label htmlFor="backgroundPicker" className="text-sm font-medium">
                Custom Background Color
              </Label>
              <div className="flex gap-3 items-center">
                <input
                  id="backgroundPicker"
                  type="color"
                  value={selectedBackground}
                  onChange={handleCustomBackground}
                  className="w-16 h-10 rounded-lg cursor-pointer border border-border"
                />
                <code className="text-sm bg-muted px-3 py-2 rounded font-mono flex-1">{selectedBackground}</code>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveTheme}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Theme Colors"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getContrastColor(hexColor) {
  const r = Number.parseInt(hexColor.substr(1, 2), 16)
  const g = Number.parseInt(hexColor.substr(3, 2), 16)
  const b = Number.parseInt(hexColor.substr(5, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#ffffff"
}
