"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase/client"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "sonner"

// Pages
import LandingPage from "./pages/landing"
import LoginPage from "./pages/auth/login"
import SignupPage from "./pages/auth/signup"
import DashboardPage from "./pages/dashboard"
import PortfolioPage from "./pages/portfolio"
import NotFound from "./pages/not-found"

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={session ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/auth/signup" element={session ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route
          path="/dashboard"
          element={session ? <DashboardPage session={session} /> : <Navigate to="/auth/login" />}
        />
        <Route path="/portfolio/:username" element={<PortfolioPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}
