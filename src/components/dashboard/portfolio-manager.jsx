/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { stripMarkdown } from "@/lib/markdown"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Upload } from "lucide-react"

export function PortfolioManager({ userId, themeColor }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentType, setContentType] = useState("image")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
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

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToStorage = async (file) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("portfolio_images").upload(fileName, file)

    if (error) {
      toast.error("Failed to upload image")
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio_images").getPublicUrl(fileName)

    return publicUrl
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""
      if (imageFile) {
        imageUrl = await uploadImageToStorage(imageFile)
        if (!imageUrl) {
          setLoading(false)
          return
        }
      }

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
        setImageFile(null)
        setImagePreview("")
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
              <RichTextEditor
                id="description"
                placeholder="Describe your item"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageFile">Upload Image</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="cursor-pointer"
                />
                <Upload className="w-4 h-4 text-muted-foreground" />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{
                backgroundColor: `${themeColor || "#14b8a6"} !important`,
                color: `${getContrastColor(themeColor || "#14b8a6")} !important`,
              }}
            >
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Preview: Your Content Links</h3>
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="border-border hover:border-accent transition-colors">
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
                      <p className="text-sm text-muted-foreground mt-1">{stripMarkdown(item.description)}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {item.project_url && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            style={{
                              backgroundColor: `${themeColor || "#14b8a6"} !important`,
                              borderColor: `${themeColor || "#14b8a6"} !important`,
                              color: `${getContrastColor(themeColor || "#14b8a6")} !important`,
                            }}
                            className="hover:bg-opacity-10 transition-colors bg-transparent"
                          >
                            <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </Button>
                        )}
                        {item.video_url && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            style={{
                              backgroundColor: `${themeColor || "#14b8a6"} !important`,
                              borderColor: `${themeColor || "#14b8a6"} !important`,
                              color: `${getContrastColor(themeColor || "#14b8a6")} !important`,
                            }}
                            className="hover:bg-opacity-10 transition-colors bg-transparent"
                          >
                            <a href={item.video_url} target="_blank" rel="noopener noreferrer">
                              Watch Video
                            </a>
                          </Button>
                        )}
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

function getContrastColor(hexColor) {
  const r = Number.parseInt(hexColor.substr(1, 2), 16)
  const g = Number.parseInt(hexColor.substr(3, 2), 16)
  const b = Number.parseInt(hexColor.substr(5, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#ffffff"
}
