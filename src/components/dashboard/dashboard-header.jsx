"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sparkles, LogOut, ExternalLink, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function DashboardHeader({ user, onLogout }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    supabase.from("users").select("username, full_name, avatar_url").eq("id", user.id).single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [user?.id])

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="border-b border-border/30 bg-card/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Left — Logo + context */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent/12 border border-accent/25 flex items-center justify-center group-hover:bg-accent/22 transition-colors">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="text-lg font-bold text-gradient hidden sm:inline">Folio</span>
          </Link>
          <span className="text-border/60 select-none hidden sm:inline">/</span>
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">Dashboard</span>
          </div>
        </div>

        {/* Right — User info + actions */}
        <div className="flex items-center gap-2.5">
          {profile?.username && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-accent h-9">
              <a href={`/portfolio/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
                View Portfolio
              </a>
            </Button>
          )}

          <div className="flex items-center gap-2.5 pl-2.5 border-l border-border/40">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "Avatar"}
                className="w-8 h-8 rounded-full object-cover border-2 border-accent/25"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent/12 border border-accent/25 flex items-center justify-center">
                <span className="text-xs font-bold text-accent">{initials}</span>
              </div>
            )}
            <div className="hidden md:block">
              {profile?.full_name && (
                <p className="text-sm font-medium leading-tight">{profile.full_name}</p>
              )}
              <p className="text-xs text-muted-foreground leading-tight">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-1.5 text-muted-foreground hover:text-accent h-9"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
