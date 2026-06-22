"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Menu, X, Sparkles, ExternalLink, LayoutDashboard, LogOut } from "lucide-react"

export function Header() {
  const [session, setSession] = useState(null)
  const [username, setUsername] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const fetchUsername = async (userId) => {
    const { data } = await supabase.from("users").select("username").eq("id", userId).single()
    if (data?.username) setUsername(data.username)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user?.id) fetchUsername(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user?.id) fetchUsername(session.user.id)
      else setUsername(null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-accent/12 border border-accent/25 flex items-center justify-center group-hover:bg-accent/22 group-hover:border-accent/40 transition-all duration-200">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xl font-bold text-gradient">Folio</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1.5 items-center">
          {session ? (
            <>
              {username && (
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-accent gap-1.5 h-9">
                  <a href={`/portfolio/${username}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    My Portfolio
                  </a>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm" className="hover:text-accent gap-1.5 h-9">
                <Link to="/dashboard">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 h-9 border-border/50 hover:border-accent/50 hover:text-accent ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-9">
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent-sm font-semibold h-9 ml-1">
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/30 glass-dark animate-slide-down">
          <nav className="flex flex-col gap-1 p-3">
            {session ? (
              <>
                {username && (
                  <a
                    href={`/portfolio/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-accent rounded-lg hover:bg-accent/8 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    My Portfolio
                  </a>
                )}
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start gap-2.5 hover:text-accent"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="justify-start gap-2.5 mt-1 border-border/50 hover:border-accent/50 hover:text-accent"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:text-accent"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground mt-1"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/auth/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
