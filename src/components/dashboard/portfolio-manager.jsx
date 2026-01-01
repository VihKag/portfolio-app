"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function PortfolioManager({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentType, setContentType] = useState("image")
  const [imageUrl, setImageUrl] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [tags, setTags] = useState("")

  useEffect(() => {
    fetchItems()
  }, [userId])

  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) setItems(data)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("portfolio_items").insert({
        user_id: userId,
        content_type: contentType,
        title,
        description,
        image_url: imageUrl,
        project_url: projectUrl || null,
        video_url: videoUrl || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })

      if (error) {
        console.log("[v0] Insert error:", error)
        toast.error("Failed to add item")
      } else {
        toast.success("Item added successfully!")
        setTitle("")
        setDescription("")
        setImageUrl("")
        setProjectUrl("")
        setVideoUrl("")
        setTags("")
        fetchItems()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete item")
    } else {
      toast.success("Item deleted")
      fetchItems()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentType">Type</Label>
                <Select value={contentType} onValueChange={(v) => setContentType(v)}>
                  <SelectTrigger id="contentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {contentType === "project" && (
              <div className="space-y-2">
                <Label htmlFor="projectUrl">Project URL</Label>
                <Input
                  id="projectUrl"
                  placeholder="https://example.com/project"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                />
              </div>
            )}

            {contentType === "video" && (
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="design, web, 2024" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Your Items</h3>
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6 flex gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
