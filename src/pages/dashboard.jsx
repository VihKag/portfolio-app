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

export default function DashboardPage({ session }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (session?.user) {
          setUser(session.user)
          setLoading(false)
          return
        }

        // Fallback: Check if there's an active session
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser()

        if (error || !authUser) {
          toast.error("Please log in to access the dashboard")
          navigate("/auth/login", { replace: true })
          return
        }

        setUser(authUser)
      } catch (err) {
        console.error("[v0] Error checking user:", err)
        toast.error("Authentication error")
        navigate("/auth/login", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate, session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
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
