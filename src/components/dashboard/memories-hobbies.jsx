"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Heart } from "lucide-react"

export function MemoriesHobbies({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("memory")
  const [imageUrl, setImageUrl] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    fetchItems()
  }, [userId])

  const fetchItems = async () => {
    const { data } = await supabase
      .from("memories_hobbies")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) setItems(data)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("memories_hobbies").insert({
        user_id: userId,
        title,
        description,
        category,
        image_url: imageUrl || null,
        date: date || null,
      })

      if (error) {
        console.log("[v0] Insert error:", error)
        toast.error("Failed to add item")
      } else {
        toast.success("Item added successfully!")
        setTitle("")
        setDescription("")
        setImageUrl("")
        setDate("")
        fetchItems()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("memories_hobbies").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete item")
    } else {
      toast.success("Item deleted")
      fetchItems()
    }
  }

  const memories = items.filter((i) => i.category === "memory")
  const hobbies = items.filter((i) => i.category === "hobby")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Memory or Hobby</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Memory or hobby name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="memory">Memory</option>
                  <option value="hobby">Hobby</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell the story or describe your hobby"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display Memories Section */}
      {memories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            My Memories ({memories.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {memories.map((item) => (
              <Card key={item.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                {item.image_url && (
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  {item.date && (
                    <Badge variant="outline" className="mb-3">
                      {new Date(item.date).toLocaleDateString()}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Display Hobbies Section */}
      {hobbies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">My Hobbies ({hobbies.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {hobbies.map((item) => (
              <Card key={item.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                {item.image_url && (
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
