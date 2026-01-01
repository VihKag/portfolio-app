"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioManager } from "@/components/dashboard/portfolio-manager"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { SocialLinksManager } from "@/components/dashboard/social-links-manager"
import { ContactMessages } from "@/components/dashboard/contact-messages"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "sonner"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser()

        if (error || !authUser) {
          toast.error("Please log in first")
          navigate("/auth/login")
          return
        }

        console.log("[v0] Authenticated user:", authUser.id)
        setUser(authUser)
      } catch (err) {
        console.error("[v0] Error checking user:", err)
        navigate("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioManager userId={user.id} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings userId={user.id} />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialLinksManager userId={user.id} />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ContactMessages userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
