import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow animation-delay-700" />
      </div>

      <div className="relative text-center animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-8xl sm:text-9xl font-bold text-gradient mb-4 leading-none">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-10 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          asChild
          className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent-sm font-semibold"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
