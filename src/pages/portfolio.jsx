"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { ContactForm } from "@/components/portfolio/contact-form"
import { Header } from "@/components/layout/header"
import { Mail, Loader2, Twitter, Linkedin, Github, Instagram, Globe } from "lucide-react"

const PLATFORM_CONFIG = {
  twitter:   { icon: Twitter,   label: "Twitter",   color: "hover:border-sky-400/60 hover:text-sky-400" },
  linkedin:  { icon: Linkedin,  label: "LinkedIn",  color: "hover:border-blue-500/60 hover:text-blue-400" },
  github:    { icon: Github,    label: "GitHub",    color: "hover:border-purple-400/60 hover:text-purple-400" },
  instagram: { icon: Instagram, label: "Instagram", color: "hover:border-pink-400/60 hover:text-pink-400" },
}

export default function PortfolioPage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single()

        if (error || !profileData) { setLoading(false); return }

        setProfile(profileData)

        const [{ data: itemsData }, { data: linksData }] = await Promise.all([
          supabase.from("portfolio_items").select("*").eq("user_id", profileData.id).order("created_at", { ascending: false }),
          supabase.from("social_links").select("*").eq("user_id", profileData.id),
        ])

        if (itemsData) setItems(itemsData)
        if (linksData) setSocialLinks(linksData)
      } catch (err) {
        console.error("Error fetching portfolio:", err)
      } finally {
        setLoading(false)
      }
    }

    if (username) fetchPortfolio()
  }, [username])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-muted-foreground">
        <Loader2 className="w-7 h-7 animate-spin text-accent" />
        <span className="text-sm">Loading portfolio…</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">Portfolio not found</h1>
        <p className="text-muted-foreground">The portfolio <span className="text-foreground font-medium">@{username}</span> doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image */}
      <div className={`relative overflow-hidden ${profile.cover_image_url ? "h-52 sm:h-72 md:h-80" : "h-36 sm:h-48"}`}>
        {profile.cover_image_url ? (
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-accent/12 via-background to-secondary/10" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background/70" />

        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 left-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 w-48 h-48 bg-secondary/8 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Section */}
        <div className="relative -mt-16 sm:-mt-20 mb-14">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-background shadow-2xl shadow-black/40 ring-2 ring-accent/20"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-linear-to-br from-accent/20 to-secondary/20 border-4 border-background shadow-2xl flex items-center justify-center ring-2 ring-accent/20">
                  <span className="text-4xl font-bold text-gradient">
                    {(profile.full_name || username || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-1 sm:pt-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-gradient">
                {profile.full_name || username}
              </h1>

              {profile.bio && (
                <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2.5 flex-wrap">
                  {socialLinks.map((link) => {
                    const cfg = PLATFORM_CONFIG[link.platform] || {}
                    const Icon = cfg.icon || Globe
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-card text-muted-foreground text-sm font-medium transition-all duration-200 hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 ${cfg.color || "hover:border-accent/50 hover:text-accent"}`}
                      >
                        <Icon className="w-4 h-4" />
                        {cfg.label || link.platform}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {items.length > 0 && (
          <div className="mb-24">
            <div className="flex items-end justify-between mb-10 pb-5 border-b border-border/30">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">My Work</h2>
                <p className="text-muted-foreground text-sm">
                  {items.length} item{items.length !== 1 ? "s" : ""} across images, projects, blogs & videos
                </p>
              </div>
            </div>
            <PortfolioGrid items={items} />
          </div>
        )}

        {/* Contact Section */}
        <div className="pb-24">
          <div className="flex items-end justify-between mb-10 pb-5 border-b border-border/30">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Get in Touch</h2>
              <p className="text-muted-foreground text-sm">Have a question or a project idea? Let's talk.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm userId={profile.id} />
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-border/50 bg-card">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact Info</h3>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-foreground hover:text-accent transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="p-6 rounded-2xl border border-border/50 bg-card">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Find Me Online</h3>
                  <div className="space-y-3">
                    {socialLinks.map((link) => {
                      const cfg = PLATFORM_CONFIG[link.platform] || {}
                      const Icon = cfg.icon || Globe
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {cfg.label || link.platform}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
