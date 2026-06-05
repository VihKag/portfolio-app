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
import { Loader2, LayoutGrid, User, Link as LinkIcon, MessageSquare } from "lucide-react"

const TABS = [
  { value: "portfolio", label: "Portfolio",   icon: LayoutGrid   },
  { value: "profile",   label: "Profile",     icon: User         },
  { value: "social",    label: "Social Links", icon: LinkIcon    },
  { value: "messages",  label: "Messages",    icon: MessageSquare },
]

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (error || !authUser) {
          toast.error("Please log in first")
          navigate("/auth/login")
          return
        }

        setUser(authUser)
      } catch {
        navigate("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-7 h-7 animate-spin text-accent" />
        <span className="text-sm">Loading dashboard…</span>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-card border border-border/50 rounded-xl mb-8">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 py-2.5 text-sm rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm data-[state=active]:glow-accent-sm transition-all"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="portfolio" className="mt-0 animate-fade-in">
            <PortfolioManager userId={user.id} />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 animate-fade-in">
            <ProfileSettings userId={user.id} />
          </TabsContent>

          <TabsContent value="social" className="mt-0 animate-fade-in">
            <SocialLinksManager userId={user.id} />
          </TabsContent>

          <TabsContent value="messages" className="mt-0 animate-fade-in">
            <ContactMessages userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
