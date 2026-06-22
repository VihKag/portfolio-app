"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { RichText } from "@/components/ui/rich-text"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { ResumeSection } from "@/components/portfolio/resume-section"
import { ContactForm } from "@/components/portfolio/contact-form"
import { SecretVault } from "@/components/portfolio/secret-vault"
import { Header } from "@/components/layout/header"
import {
  Mail, Loader2, Twitter, Linkedin, Github, Instagram, Globe, Heart,
  ArrowDown, ArrowUpRight, Sparkles,
} from "lucide-react"

const PLATFORM_CONFIG = {
  twitter:   { icon: Twitter,   label: "Twitter",   color: "hover:border-sky-400/60 hover:text-sky-400" },
  linkedin:  { icon: Linkedin,  label: "LinkedIn",  color: "hover:border-blue-500/60 hover:text-blue-400" },
  github:    { icon: Github,    label: "GitHub",    color: "hover:border-purple-400/60 hover:text-purple-400" },
  instagram: { icon: Instagram, label: "Instagram", color: "hover:border-pink-400/60 hover:text-pink-400" },
}

function SectionHeading({ index, title, subtitle, themeColor }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-mono font-semibold tracking-wider" style={{ color: themeColor }}>
          {index}
        </span>
        <span className="h-px w-14" style={{ backgroundColor: `${themeColor}55` }} />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
    </div>
  )
}

export default function PortfolioPage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [memoriesHobbies, setMemoriesHobbies] = useState([])
  const [vaultItems, setVaultItems] = useState([])
  const [vaultOpen, setVaultOpen] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([])
  const [skills, setSkills] = useState([])
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [themeColor, setThemeColor] = useState("#14b8a6")
  const [backgroundColor, setBackgroundColor] = useState("#0e0e16")

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
        if (profileData.theme_color) {
          setThemeColor(profileData.theme_color)
          document.documentElement.style.setProperty("--portfolio-accent", profileData.theme_color)
        }
        if (profileData.background_color) {
          setBackgroundColor(profileData.background_color)
          document.documentElement.style.setProperty("--portfolio-background", profileData.background_color)
        }

        const [
          { data: itemsData },
          { data: linksData },
          { data: memoriesData },
          { data: vaultData },
          expRes, eduRes, skillsRes, certRes,
        ] = await Promise.all([
          supabase.from("portfolio_items").select("*").eq("user_id", profileData.id).order("created_at", { ascending: false }),
          supabase.from("social_links").select("*").eq("user_id", profileData.id),
          supabase.from("memories_hobbies").select("*").eq("user_id", profileData.id).order("created_at", { ascending: false }),
          supabase.from("personal_vault").select("*").eq("user_id", profileData.id).order("sort_order"),
          supabase.from("experiences").select("*").eq("user_id", profileData.id).order("sort_order"),
          supabase.from("education").select("*").eq("user_id", profileData.id).order("sort_order"),
          supabase.from("skills").select("*").eq("user_id", profileData.id).order("sort_order"),
          supabase.from("certifications").select("*").eq("user_id", profileData.id).order("sort_order"),
        ])

        if (itemsData) setItems(itemsData)
        if (linksData) setSocialLinks(linksData)
        if (memoriesData) setMemoriesHobbies(memoriesData)
        if (vaultData) setVaultItems(vaultData)
        if (expRes.data) setExperiences(expRes.data)
        if (eduRes.data) setEducation(eduRes.data)
        if (skillsRes.data) setSkills(skillsRes.data)
        if (certRes.data) setCertifications(certRes.data)
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
        <p className="text-muted-foreground">
          The portfolio <span className="text-foreground font-medium">@{username}</span> doesn't exist.
        </p>
      </div>
    )
  }

  const memories = memoriesHobbies.filter((i) => i.category === "memory")
  const hobbies  = memoriesHobbies.filter((i) => i.category === "hobby")

  const displayName = profile.full_name || username
  const firstName = (displayName || "").trim().split(/\s+/)[0]
  const initial = (displayName || username || "?")[0].toUpperCase()

  const hasResume =
    experiences.length > 0 || education.length > 0 || skills.length > 0 || certifications.length > 0
  const hasAbout = memories.length > 0 || hobbies.length > 0
  const skillCount = skills.reduce((n, g) => n + ((g.items || []).length), 0)

  const gradientText = {
    background: `linear-gradient(120deg, ${themeColor}, ${themeColor}99 70%, hsl(265 55% 72%))`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }

  const stats = [
    items.length > 0       && { value: items.length,        label: items.length === 1 ? "Project" : "Projects" },
    experiences.length > 0 && { value: experiences.length,  label: experiences.length === 1 ? "Role" : "Roles" },
    skillCount > 0         && { value: skillCount,           label: "Skills" },
    certifications.length > 0 && { value: certifications.length, label: "Certs" },
  ].filter(Boolean)

  const sections = [
    items.length > 0 && { id: "work", label: "Work" },
    hasResume && { id: "resume", label: "Resume" },
    hasAbout && { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ].filter(Boolean)

  // Two-digit ordinal for a section, based on its position in `sections`
  const sectionNo = (id) =>
    String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0")

  return (
    <div
      className="min-h-screen"
      style={{ "--portfolio-accent": themeColor, "--portfolio-background": backgroundColor, backgroundColor }}
    >
      <Header />

      {/* ── HERO ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {profile.cover_image_url && (
            <>
              <img src={profile.cover_image_url} alt="" className="w-full h-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/90 to-background" />
            </>
          )}
          <div
            className="absolute -top-24 left-[8%] w-80 h-80 rounded-full blur-3xl animate-pulse-glow"
            style={{ backgroundColor: `${themeColor}26` }}
          />
          <div
            className="absolute -bottom-16 right-[10%] w-96 h-96 rounded-full blur-3xl animate-float"
            style={{ backgroundColor: "hsl(265 55% 62% / 0.12)" }}
          />
        </div>

        <div className="container mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl animate-slide-up">
            {/* Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-8">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full rounded-2xl object-cover ring-1 ring-white/10 shadow-2xl shadow-black/50"
                  style={{ boxShadow: `0 0 0 1px ${themeColor}40, 0 20px 50px -10px ${themeColor}40` }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${themeColor}33, hsl(265 55% 62% / 0.25))`, boxShadow: `0 0 0 1px ${themeColor}40` }}
                >
                  <span className="text-4xl font-bold" style={gradientText}>{initial}</span>
                </div>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-400 border-2 border-background" />
              </span>
            </div>

            {/* Status pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-6"
              style={{ borderColor: `${themeColor}40`, backgroundColor: `${themeColor}12`, color: themeColor }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Available for new opportunities
            </div>

            {/* Greeting + Name */}
            <p className="text-muted-foreground text-lg mb-2">Hi, I'm</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              <span style={gradientText}>{displayName}</span>
            </h1>

            {profile.bio && (
              <RichText
                text={profile.bio}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8"
              />
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: themeColor, color: "#06121a", boxShadow: `0 10px 30px -8px ${themeColor}80` }}
              >
                <Mail className="w-4 h-4" />
                Get in touch
              </a>
              {items.length > 0 && (
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-semibold text-sm border border-border/60 bg-card/50 hover:bg-card transition-colors"
                >
                  View my work
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2.5 flex-wrap mb-12">
                {socialLinks.map((link) => {
                  const cfg = PLATFORM_CONFIG[link.platform] || {}
                  const Icon = cfg.icon || Globe
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={cfg.label || link.platform}
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border border-border/50 bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 ${cfg.color || "hover:border-accent/50 hover:text-accent"}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-border/30">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: themeColor }}>
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sections.length > 1 && (
            <a
              href={`#${sections[0].id}`}
              className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-16 w-fit"
            >
              <ArrowDown className="w-4 h-4 animate-float" />
              Scroll to explore
            </a>
          )}
        </div>
      </section>

      {/* ── Sticky section nav ─────────────────── */}
      {sections.length > 1 && (
        <nav className="sticky top-14 z-40 border-y border-border/30 glass-dark">
          <div className="container mx-auto px-4">
            <ul className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-block px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      <div className="container mx-auto px-4">
        {/* ── Work ─────────────────────────────── */}
        {items.length > 0 && (
          <section id="work" className="scroll-mt-28 pt-20 mb-8">
            <SectionHeading
              index={sectionNo("work")}
              title={firstName ? `${firstName}'s Work` : "Selected Work"}
              subtitle={`${items.length} piece${items.length !== 1 ? "s" : ""} — images, projects, blogs & videos`}
              themeColor={themeColor}
            />
            <PortfolioGrid items={items} themeColor={themeColor} backgroundColor={backgroundColor} />
          </section>
        )}

        {/* ── Resume ───────────────────────────── */}
        {hasResume && (
          <section id="resume" className="scroll-mt-28 pt-20">
            <SectionHeading
              index={sectionNo("resume")}
              title="Career & Skills"
              subtitle="Experience, education, skills, and certifications"
              themeColor={themeColor}
            />
            <ResumeSection
              experiences={experiences}
              education={education}
              skills={skills}
              certifications={certifications}
              themeColor={themeColor}
              hideHeading
            />
          </section>
        )}

        {/* ── About (memories & hobbies) ───────── */}
        {hasAbout && (
          <section id="about" className="scroll-mt-28 pt-20 mb-8">
            <SectionHeading
              index={sectionNo("about")}
              title={firstName ? `Beyond the résumé` : "About Me"}
              subtitle="A few memories and the things I love doing"
              themeColor={themeColor}
            />
            <div className="grid lg:grid-cols-2 gap-12">
              {memories.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5" style={{ color: themeColor }} />
                    Memories
                  </h3>
                  <div className="space-y-4">
                    {memories.map((item) => (
                      <Card key={item.id} className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <RichText text={item.description} className="text-muted-foreground text-sm leading-relaxed" />
                          {item.date && (
                            <p className="text-xs text-muted-foreground mt-3">
                              {new Date(item.date).toLocaleDateString()}
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
                  <h3 className="text-xl font-semibold mb-6">Hobbies</h3>
                  <div className="space-y-4">
                    {hobbies.map((item) => (
                      <Card key={item.id} className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <RichText text={item.description} className="text-muted-foreground text-sm leading-relaxed" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Contact ──────────────────────────── */}
        <section id="contact" className="scroll-mt-28 pt-20 pb-24">
          <SectionHeading
            index={sectionNo("contact")}
            title={firstName ? `Let's build something` : "Get in Touch"}
            subtitle="Have a question or a project idea? Drop me a message."
            themeColor={themeColor}
          />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm userId={profile.id} />
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-border/50 bg-card">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact Info</h3>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                  <a href={`mailto:${profile.email}`} className="text-foreground hover:underline break-all">
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
        </section>
      </div>

      {/* Footer — the heart is a hidden trigger for the secret vault */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {displayName} · Built with{" "}
          <button
            type="button"
            onClick={() => setVaultOpen(true)}
            aria-label="secret"
            title=""
            className="inline-flex align-middle -mt-0.5 cursor-pointer rounded-full transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Heart className="w-3.5 h-3.5" style={{ color: themeColor }} />
          </button>{" "}
          on Folio
        </div>
      </footer>

      <SecretVault
        open={vaultOpen}
        onClose={() => setVaultOpen(false)}
        items={vaultItems}
        displayName={firstName || displayName}
        themeColor={themeColor}
      />
    </div>
  )
}
