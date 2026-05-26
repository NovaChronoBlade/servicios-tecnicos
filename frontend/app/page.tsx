import { TopNavBar } from "@/components/top-nav-bar";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturedServicesSection } from "@/components/featured-services-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar />
      <main className="flex-grow pt-24 pb-xl">
        <HeroSection />
        <HowItWorksSection />
        <FeaturedServicesSection />
      </main>
      <Footer />
    </div>
  );
}
