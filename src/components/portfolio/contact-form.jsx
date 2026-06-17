"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ContactForm({ userId, themeColor = "#14b8a6" }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("contact_messages").insert({
        user_id: userId,
        sender_name: name,
        sender_email: email,
        message,
      })

      if (error) {
        toast.error("Failed to send message")
      } else {
        toast.success("Message sent successfully!")
        setName("")
        setEmail("")
        setMessage("")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 text-white"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 15px ${themeColor}40`,
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.filter = "brightness(1.1)"
                e.currentTarget.style.boxShadow = `0 0 20px ${themeColor}60`
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)"
              e.currentTarget.style.boxShadow = `0 0 15px ${themeColor}40`
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
