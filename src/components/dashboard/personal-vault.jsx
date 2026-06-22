"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Lock, Heart, Info } from "lucide-react"

export function PersonalVault({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("favorite")
  const [label, setLabel] = useState("")
  const [value, setValue] = useState("")
  const [emoji, setEmoji] = useState("")

  useEffect(() => {
    fetchItems()
  }, [userId])

  const fetchItems = async () => {
    const { data } = await supabase
      .from("personal_vault")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (data) setItems(data)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("personal_vault").insert({
        user_id: userId,
        category,
        label,
        value: value || null,
        emoji: emoji || null,
        sort_order: items.filter((i) => i.category === category).length,
      })

      if (error) {
        console.error("[personal-vault] Insert error:", error)
        toast.error("Failed to add item")
      } else {
        toast.success("Saved to your private vault!")
        setLabel("")
        setValue("")
        setEmoji("")
        fetchItems()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("personal_vault").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete item")
    } else {
      toast.success("Item deleted")
      fetchItems()
    }
  }

  const favorites = items.filter((i) => i.category === "favorite")
  const facts = items.filter((i) => i.category === "fact")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            Private Vault
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Personal info and things you love. This is hidden on your public portfolio — visitors only see it
            after triggering the secret element (the footer heart).
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pv-category">Type</Label>
                <select
                  id="pv-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="favorite">Something I like</option>
                  <option value="fact">Personal info</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pv-emoji">Emoji (optional)</Label>
                <Input
                  id="pv-emoji"
                  placeholder="🎬"
                  maxLength={4}
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pv-label">Label</Label>
                <Input
                  id="pv-label"
                  placeholder={category === "favorite" ? "Favourite movie" : "Nickname"}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pv-value">Value</Label>
                <Input
                  id="pv-value"
                  placeholder={category === "favorite" ? "Inception" : "Khang"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Add to vault"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {favorites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Things I like ({favorites.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {favorites.map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="flex items-center gap-3 py-4">
                  <span className="text-2xl">{item.emoji || "💛"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    {item.value && <p className="font-medium truncate">{item.value}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {facts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" />
            Personal info ({facts.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {facts.map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="flex items-center gap-3 py-4">
                  <span className="text-2xl">{item.emoji || "✨"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    {item.value && <p className="font-medium truncate">{item.value}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-3 opacity-50" />
            Your vault is empty. Add a few favourites or personal facts above.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
