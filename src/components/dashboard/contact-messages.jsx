"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ContactMessages({ userId }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [userId])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) setMessages(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading messages...</div>
  }

  if (messages.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No messages yet</div>
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Card key={msg.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{msg.sender_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{msg.sender_email}</p>
              </div>
              {msg.read ? <Badge variant="outline">Read</Badge> : <Badge>New</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
