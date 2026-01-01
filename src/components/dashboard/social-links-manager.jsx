"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function SocialLinksManager({ userId }) {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState("twitter")
  const [url, setUrl] = useState("")

  useEffect(() => {
    fetchLinks()
  }, [userId])

  const fetchLinks = async () => {
    const { data } = await supabase.from("social_links").select("*").eq("user_id", userId)

    if (data) setLinks(data)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("social_links").insert({
        user_id: userId,
        platform,
        url,
      })

      if (error) {
        toast.error("Failed to add link")
      } else {
        toast.success("Link added!")
        setUrl("")
        fetchLinks()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete link")
    } else {
      toast.success("Link deleted")
      fetchLinks()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Social Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v)}>
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://twitter.com/yourname"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Your Social Links</h3>
        <div className="grid gap-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium capitalize">{link.platform}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {link.url}
                </a>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
