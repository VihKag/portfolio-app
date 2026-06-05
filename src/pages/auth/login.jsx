"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Welcome back!")
        navigate("/dashboard")
      }
    } catch {
      toast.error("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-[400px] h-[400px] bg-accent/6 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow animation-delay-700" />
      </div>

      <Header />

      <div className="relative flex items-center justify-center min-h-[calc(100vh-65px)] px-4 py-12">
        <div className="w-full max-w-md animate-scale-in">
          {/* Card */}
          <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/30">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/12 border border-accent/25 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h1 className="text-2xl font-bold mb-1.5">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to manage your portfolio</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 border-border/50 focus:border-accent/60 focus:ring-accent/20 h-11"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 border-border/50 focus:border-accent/60 focus:ring-accent/20 h-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent font-semibold mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
