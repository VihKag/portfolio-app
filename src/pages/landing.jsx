import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/portfolio/hero-section"
import { Header } from "@/components/layout/header"
import { Zap, Upload, Share2, ArrowRight, CheckCircle2, Palette, Globe } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete toolkit to build, manage, and share your creative portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Palette className="w-6 h-6 text-accent" />}
              title="Creative Showcase"
              description="Display images, projects, blog posts, and videos in a beautiful, filterable gallery."
              gradient="from-accent/10 to-accent/5"
            />
            <FeatureCard
              icon={<Upload className="w-6 h-6 text-secondary" />}
              title="Easy Content Upload"
              description="Add and manage your portfolio items with a simple, intuitive dashboard interface."
              gradient="from-secondary/10 to-secondary/5"
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-accent" />}
              title="Shareable Portfolio"
              description="Get a unique public URL to share your portfolio with clients, recruiters, or the world."
              gradient="from-accent/10 to-accent/5"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-secondary" />}
              title="Social Links"
              description="Connect your GitHub, LinkedIn, Twitter, and Instagram to your portfolio page."
              gradient="from-secondary/10 to-secondary/5"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-accent" />}
              title="Contact Form"
              description="Receive messages directly from visitors through a built-in contact form."
              gradient="from-accent/10 to-accent/5"
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-secondary" />}
              title="Always Free"
              description="No hidden fees, no credit card required. Build and share your portfolio completely free."
              gradient="from-secondary/10 to-secondary/5"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Up in 3 Simple Steps</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px bg-linear-to-r from-transparent via-border to-transparent" />
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free in under a minute. No credit card needed." },
              { step: "02", title: "Build Portfolio", desc: "Add your projects, images, blog posts, and social links." },
              { step: "03", title: "Share Your Work", desc: "Get your unique URL and share it with the world." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="text-2xl font-bold text-gradient">{step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/6 text-accent text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Get started today
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">
            Ready to Showcase<br />Your Work?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Create your portfolio in minutes. Share your creativity with the world — completely free.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent font-semibold px-8 h-12">
              <Link to="/auth/signup">
                Create Your Portfolio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border/50 bg-transparent h-12">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">Folio</span>
            <span>— Your creative portfolio platform</span>
          </div>
          <p>Built with ❤️ for creators everywhere</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group p-7 rounded-2xl border border-border/50 bg-card hover:border-accent/35 hover:bg-card/80 transition-all duration-300 relative overflow-hidden">
      <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative">
        <div className="mb-5 p-3 w-fit rounded-xl bg-muted border border-border/50 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2.5 group-hover:text-accent transition-colors duration-200">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
