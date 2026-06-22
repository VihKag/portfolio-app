"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioManager } from "@/components/dashboard/portfolio-manager"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { ResumeManager } from "@/components/dashboard/resume-manager"
import { SocialLinksManager } from "@/components/dashboard/social-links-manager"
import { ContactMessages } from "@/components/dashboard/contact-messages"
import { MemoriesHobbies } from "@/components/dashboard/memories-hobbies"
import { PersonalVault } from "@/components/dashboard/personal-vault"
import { ThemeCustomizer } from "@/components/dashboard/theme-customizer"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "sonner"

export default function DashboardPage({ session }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (session?.user) {
          setUser(session.user)
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()
          setUserProfile(profile)
          setLoading(false)
          return
        }

        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (error || !authUser) {
          toast.error("Please log in to access the dashboard")
          navigate("/auth/login", { replace: true })
          return
        }

        setUser(authUser)
        const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single()
        setUserProfile(profile)
      } catch (err) {
        console.error("Error checking user:", err)
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

  const handleThemeUpdate = (newColor) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, theme_color: newColor })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} username={userProfile?.username} />

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="memories">Memories</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioManager userId={user.id} themeColor={userProfile?.theme_color} />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 animate-fade-in">
            <ProfileSettings userId={user.id} />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <ResumeManager userId={user.id} />
          </TabsContent>

          <TabsContent value="memories" className="mt-6">
            <MemoriesHobbies userId={user.id} />
          </TabsContent>

          <TabsContent value="personal" className="mt-6">
            <PersonalVault userId={user.id} />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialLinksManager userId={user.id} />
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <ThemeCustomizer
              userId={user.id}
              currentTheme={userProfile?.theme_color}
              currentBackground={userProfile?.background_color}
              onUpdate={handleThemeUpdate}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ContactMessages userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
