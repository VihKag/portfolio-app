"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { ContactForm } from "@/components/portfolio/contact-form"
import { Header } from "@/components/layout/header"
import { Mail, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PortfolioPage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single()

        if (profileError || !profileData) {
          setLoading(false)
          return
        }

        setProfile(profileData)

        // Fetch portfolio items
        const { data: itemsData } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false })

        if (itemsData) setItems(itemsData)

        // Fetch social links
        const { data: linksData } = await supabase.from("social_links").select("*").eq("user_id", profileData.id)

        if (linksData) setSocialLinks(linksData)
      } catch (error) {
        console.error("Error fetching portfolio:", error)
      } finally {
        setLoading(false)
      }
    }

    if (username) fetchPortfolio()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader className="w-6 h-6 animate-spin text-accent" />
        <span>Loading portfolio...</span>
      </div>
    )
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Portfolio not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image with enhanced styling */}
      {profile.cover_image_url && (
        <div className="h-48 sm:h-64 md:h-80 overflow-hidden relative bg-muted">
          <img src={profile.cover_image_url || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Profile Section */}
        <div className="flex flex-col md:items-end sm:flex-row gap-6 mb-12">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-accent/30 shadow-xl shadow-accent/10 mt-0 sm:-mt-24 transition-transform duration-300 hover:scale-105"
            />
          )}
          <div className="flex-col flex-1 pt-2">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{profile.full_name}</h1>
            {profile.bio && (
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl leading-relaxed">{profile.bio}</p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    asChild
                    variant="outline"
                    className="hover:border-accent capitalize transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 bg-transparent"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.platform}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Items Section with Type Categorization */}
        {items.length > 0 && (
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">My Work</h2>
              <p className="text-muted-foreground">
                Browse my portfolio by type: images, projects, blog posts, and videos
              </p>
            </div>
            <PortfolioGrid items={items} />
          </div>
        )}

        {/* Contact Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">Have a question? Let's connect!</p>
            <ContactForm userId={profile.id} />
          </div>
          <div>
            <Card className="p-8 border-border bg-card/50 sticky top-24">
              <h3 className="font-semibold mb-6 flex items-center gap-3 text-lg">
                <Mail className="w-5 h-5 text-accent" />
                Contact Info
              </h3>
              <p className="text-muted-foreground break-all hover:text-foreground transition-colors">{profile.email}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
