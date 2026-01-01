/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Save, Camera } from "lucide-react"

export function ProfileSettings({ userId }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    const { data } = await supabase.from("users").select("*").eq("id", userId).single()

    if (data) {
      setProfile(data)
      setDisplayName(data.full_name || "")
      setBio(data.bio || "")
      setAvatarUrl(data.avatar_url || "")
      setCoverImageUrl(data.cover_image_url || "")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: displayName,
          bio,
          avatar_url: avatarUrl,
          cover_image_url: coverImageUrl,
        })
        .eq("id", userId)

      if (error) {
        toast.error("Failed to update profile")
      } else {
        toast.success("Profile updated successfully!")
        fetchProfile()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {(avatarUrl || coverImageUrl) && (
        <Card className="overflow-hidden border-border">
          <div className="relative">
            {coverImageUrl && (
              <img src={coverImageUrl || "/placeholder.svg"} alt="Cover preview" className="w-full h-40 object-cover" />
            )}
            {avatarUrl && (
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-background absolute bottom-0 left-6 -translate-y-1/2"
              />
            )}
          </div>
          <div className="pt-16 p-6">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
          </div>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                placeholder="https://example.com/cover.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground glow-accent"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
