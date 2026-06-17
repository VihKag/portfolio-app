"use client"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"

export function DashboardHeader({ user, onLogout, username }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-3">
          {username && (
            <Button asChild variant="outline" className="hover:border-accent  bg-transparent">
              <Link to={`/portfolio/${username}`} className="flex items-center gap-2">
                <span>View Portfolio</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
