"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { ContactForm } from "@/components/portfolio/contact-form"
import { Header } from "@/components/layout/header"
import { Mail, Loader, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PortfolioPage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [memoriesHobbies, setMemoriesHobbies] = useState([])
  const [loading, setLoading] = useState(true)
  const [themeColor, setThemeColor] = useState("#14b8a6")
  const [backgroundColor, setBackgroundColor] = useState("#0e0e16")

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
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
        if (profileData.theme_color) {
          setThemeColor(profileData.theme_color)
          document.documentElement.style.setProperty("--portfolio-accent", profileData.theme_color)
        }
        if (profileData.background_color) {
          setBackgroundColor(profileData.background_color)
          document.documentElement.style.setProperty("--portfolio-background", profileData.background_color)
        }

        const { data: itemsData } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false })

        if (itemsData) setItems(itemsData)

        const { data: linksData } = await supabase.from("social_links").select("*").eq("user_id", profileData.id)

        if (linksData) setSocialLinks(linksData)

        const { data: memoriesData } = await supabase
          .from("memories_hobbies")
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false })

        if (memoriesData) setMemoriesHobbies(memoriesData)
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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] text-xl text-muted-foreground">
          Portfolio not found
        </div>
      </div>
    )
  }

  const memories = memoriesHobbies.filter((i) => i.category === "memory")
  const hobbies = memoriesHobbies.filter((i) => i.category === "hobby")

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        "--portfolio-accent": themeColor,
        "--portfolio-background": backgroundColor,
        backgroundColor: backgroundColor,
      }}
    >
      <Header />

      {profile.cover_image_url && (
        <div className="h-48 sm:h-64 md:h-80 overflow-hidden relative bg-muted">
          <img src={profile.cover_image_url || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-16">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 -mt-20 sm:-mt-24 transition-transform duration-300 hover:scale-105"
              style={{ borderColor: themeColor }}
            />
          )}
          <div className="flex-1 pt-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gradient">{profile.full_name}</h1>
            {profile.bio && (
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl leading-relaxed">{profile.bio}</p>
            )}

            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    asChild
                    variant="outline"
                    className="capitalize transition-all duration-300 hover:shadow-lg bg-transparent"
                    style={{
                      borderColor: themeColor,
                      "--tw-shadow-color": `${themeColor}20`,
                    }}
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

        {items.length > 0 && (
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">My Work</h2>
              <p className="text-muted-foreground">
                Browse my portfolio by type: images, projects, blog posts, and videos
              </p>
            </div>
            <PortfolioGrid items={items} themeColor={themeColor} backgroundColor={backgroundColor} />
          </div>
        )}

        {(memories.length > 0 || hobbies.length > 0) && (
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">About Me</h2>
              <p className="text-muted-foreground">Explore my memories and hobbies</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {memories.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Heart className="w-6 h-6" style={{ color: themeColor }} />
                    My Memories
                  </h3>
                  <div className="space-y-4">
                    {memories.map((item) => (
                      <Card
                        key={item.id}
                        className="border-border overflow-hidden hover:transition-all duration-300 hover:shadow-lg"
                        style={{
                          "--tw-shadow-color": `${themeColor}20`,
                        }}
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                          {item.date && (
                            <p className="text-xs text-muted-foreground mt-3">
                              📅 {new Date(item.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {hobbies.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">My Hobbies</h3>
                  <div className="space-y-4">
                    {hobbies.map((item) => (
                      <Card
                        key={item.id}
                        className="border-border overflow-hidden hover:transition-all duration-300 hover:shadow-lg"
                        style={{
                          "--tw-shadow-color": `${themeColor}20`,
                        }}
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">Have a question? Let's connect!</p>
            <ContactForm userId={profile.id} themeColor={themeColor} />
          </div>
          <div>
            <Card className="p-8 border-border bg-card/50 sticky top-24">
              <h3 className="font-semibold mb-6 flex items-center gap-3 text-lg">
                <Mail className="w-5 h-5" style={{ color: themeColor }} />
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
