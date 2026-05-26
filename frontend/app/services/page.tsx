"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search,
  Filter,
  ShoppingCart,
  X
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const allServices = [
  {
    id: 1,
    title: "Plumbing",
    description: "Expert plumbing solutions for leaks, installations, and repairs. Available 24/7 for emergencies.",
    price: 75,
    iconName: "Wrench",
    category: "Plumbing",
  },
  {
    id: 2,
    title: "Pipe Installation",
    description: "Professional pipe installation for new construction or renovations. Quality materials guaranteed.",
    price: 120,
    iconName: "Wrench",
    category: "Plumbing",
  },
  {
    id: 3,
    title: "Drain Cleaning",
    description: "Clear clogged drains quickly and efficiently with our professional drain cleaning service.",
    price: 85,
    iconName: "Wrench",
    category: "Plumbing",
  },
  {
    id: 4,
    title: "Electrical Wiring",
    description: "Licensed electricians for wiring, outlets, lighting, and electrical panel upgrades.",
    price: 85,
    iconName: "Zap",
    category: "Electrical",
  },
  {
    id: 5,
    title: "Lighting Installation",
    description: "Indoor and outdoor lighting installation, including smart lighting systems.",
    price: 65,
    iconName: "Zap",
    category: "Electrical",
  },
  {
    id: 6,
    title: "Panel Upgrades",
    description: "Upgrade your electrical panel to handle modern power demands safely.",
    price: 350,
    iconName: "Zap",
    category: "Electrical",
  },
  {
    id: 7,
    title: "Custom Carpentry",
    description: "Custom woodwork, furniture assembly, repairs, and home improvement projects.",
    price: 65,
    iconName: "Hammer",
    category: "Carpentry",
  },
  {
    id: 8,
    title: "Cabinet Installation",
    description: "Professional cabinet installation for kitchens, bathrooms, and storage spaces.",
    price: 150,
    iconName: "Hammer",
    category: "Carpentry",
  },
  {
    id: 9,
    title: "Interior Painting",
    description: "Interior painting services with premium materials and expert finish.",
    price: 55,
    iconName: "PaintBucket",
    category: "Painting",
  },
  {
    id: 10,
    title: "Exterior Painting",
    description: "Weather-resistant exterior painting that protects and beautifies your property.",
    price: 75,
    iconName: "PaintBucket",
    category: "Painting",
  },
  {
    id: 11,
    title: "General Repairs",
    description: "General maintenance and repair services for all your household needs.",
    price: 50,
    iconName: "Home",
    category: "Home Repairs",
  },
  {
    id: 12,
    title: "HVAC Maintenance",
    description: "HVAC system maintenance, repairs, and seasonal tune-ups for optimal comfort.",
    price: 90,
    iconName: "Settings",
    category: "Technical",
  },
]

const categories = ["All", "Plumbing", "Electrical", "Carpentry", "Painting", "Home Repairs", "Technical"]

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (service: typeof allServices[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id)
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: service.id, title: service.title, price: service.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Our Services
              </h1>
              <p className="text-muted-foreground">
                Browse our professional technical services and add them to your cart.
              </p>
            </div>

            {/* Cart Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-border text-foreground relative gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price} x {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-foreground">Total</span>
                          <span className="text-xl font-bold text-primary">${cartTotal}</span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          Proceed to Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-primary text-primary-foreground" 
                    : "border-border text-muted-foreground hover:text-foreground"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                iconName={service.iconName}
                onAddToCart={() => addToCart(service)}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
