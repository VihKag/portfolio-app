"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [session, setSession] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity">
          Portfolio
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {session ? (
            <>
              <Button asChild variant="ghost" className="hover:text-accent">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut()
                  navigate("/")
                  setMenuOpen(false)
                }}
                className="hover:border-accent hover:text-accent"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hover:text-accent">
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-card/50 backdrop-blur-sm">
          <nav className="flex flex-col gap-3 p-4">
            {session ? (
              <>
                <Button asChild variant="ghost" className="justify-start hover:text-accent">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    navigate("/")
                    setMenuOpen(false)
                  }}
                  className="hover:border-accent hover:text-accent"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="justify-start hover:text-accent">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
