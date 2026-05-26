import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  HeroSection,
  ServicesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
} from "@/components/landing-sections"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
