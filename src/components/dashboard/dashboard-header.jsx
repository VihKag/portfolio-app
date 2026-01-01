"use client"
import { Button } from "@/components/ui/button"

export function DashboardHeader({ user, onLogout }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Sign Out
        </Button>
      </div>
    </header>
  )
}
