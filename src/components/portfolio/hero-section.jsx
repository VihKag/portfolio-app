import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-[480px] h-[480px] bg-accent/7 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-secondary/6 rounded-full blur-3xl animate-pulse-glow animation-delay-700" />
        <div className="absolute -bottom-20 left-1/3 w-[360px] h-[360px] bg-accent/5 rounded-full blur-3xl animate-pulse-glow animation-delay-300" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(220 15% 92%) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-linear-to-b from-background/0 via-transparent to-background/80 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/8 text-accent text-sm font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Free Portfolio Builder — No Credit Card Needed
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6 animate-slide-up animation-delay-100">
          Showcase Your
          <br />
          <span className="text-gradient">Creative Work</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-200">
          Build a stunning portfolio to display your projects, artwork, blog posts & videos.
          Get a custom URL and share your work with the world — for free.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16 animate-slide-up animation-delay-300">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent font-semibold px-8 h-12 text-base"
          >
            <Link to="/auth/signup">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border/60 hover:border-accent/60 hover:text-accent bg-transparent h-12 text-base"
          >
            <Link to="/auth/login">Sign In</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 justify-center animate-fade-in animation-delay-500">
          {[
            { value: "100%", label: "Free Forever" },
            { value: "4", label: "Content Types" },
            { value: "Custom", label: "Portfolio URL" },
            { value: "∞", label: "Items to Upload" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
