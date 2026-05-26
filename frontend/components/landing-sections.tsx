import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Star } from "lucide-react"
import { ServiceCard } from "@/components/service-card"

const services = [
  {
    title: "Plumbing",
    description: "Expert plumbing solutions for leaks, installations, and repairs. Available 24/7 for emergencies.",
    price: 75,
    iconName: "Wrench",
  },
  {
    title: "Electrical",
    description: "Licensed electricians for wiring, outlets, lighting, and electrical panel upgrades.",
    price: 85,
    iconName: "Zap",
  },
  {
    title: "Carpentry",
    description: "Custom woodwork, furniture assembly, repairs, and home improvement projects.",
    price: 65,
    iconName: "Hammer",
  },
  {
    title: "Painting",
    description: "Interior and exterior painting services with premium materials and expert finish.",
    price: 55,
    iconName: "PaintBucket",
  },
  {
    title: "Home Repairs",
    description: "General maintenance and repair services for all your household needs.",
    price: 50,
    iconName: "Home",
  },
  {
    title: "Technical Maintenance",
    description: "HVAC, appliance maintenance, and technical equipment servicing.",
    price: 90,
    iconName: "Settings",
  },
]

const steps = [
  {
    step: "01",
    title: "Browse Services",
    description: "Explore our wide range of professional technical services tailored to your needs.",
  },
  {
    step: "02",
    title: "Book a Technician",
    description: "Select your preferred service and schedule a convenient appointment time.",
  },
  {
    step: "03",
    title: "Get it Done",
    description: "Our verified experts arrive on time and complete the job to your satisfaction.",
  },
]

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner",
    content: "TechPro made finding a reliable electrician so easy. The technician was professional, on time, and the work was excellent.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Business Owner",
    content: "We use TechPro for all our office maintenance needs. Their service is consistently top-notch and very professional.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    content: "Managing multiple properties is easier with TechPro. Quick response times and quality work every time.",
    rating: 5,
  },
]

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <CheckCircle2 className="w-4 h-4" />
            Trusted by 10,000+ customers
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight text-balance">
            Professional Technical Services at Your Fingertips
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect with verified experts for plumbing, electrical, carpentry, and more. Quality service, guaranteed satisfaction.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
                Browse Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-2 px-8">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Verified Experts" },
              { value: "50+", label: "Service Types" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From plumbing to electrical work, we have verified professionals ready to help with all your technical needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary gap-2">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting professional help has never been easier. Three simple steps to quality service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}
              
              <div className="relative bg-background rounded-xl p-8 border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TechPro for their service needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 text-sm leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary rounded-2xl p-12 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of satisfied customers. Book your first service today and experience the TechPro difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8">
                  Create Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
