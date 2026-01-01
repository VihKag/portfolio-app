import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/portfolio/hero-section"
import { Header } from "@/components/layout/header"
import { Zap, Upload, Share2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to showcase your creativity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="Creative Showcase"
              description="Display your projects, artwork, and creations in a beautiful, customizable portfolio"
            />
            <FeatureCard
              icon={<Upload className="w-8 h-8 text-accent" />}
              title="Easy Upload"
              description="Upload images, videos, blog posts, and projects with a simple, intuitive interface"
            />
            <FeatureCard
              icon={<Share2 className="w-8 h-8 text-accent" />}
              title="Public Portfolio"
              description="Share your unique portfolio URL with anyone to showcase your work"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 border-t border-border">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to showcase your work?</h2>
            <p className="text-muted-foreground text-lg">
              Create your portfolio in minutes and start sharing your creativity with the world
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent">
              <Link to="/auth/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hover:border-accent hover:text-accent bg-transparent"
            >
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group p-8 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-card/80 transition-all duration-300">
      <div className="mb-6 p-3 w-fit rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
