"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Wrench, 
  Zap, 
  Hammer, 
  PaintBucket,
  Home,
  Settings,
  Search,
  Filter,
  ShoppingCart,
  X,
  Plus,
  Minus,
  type LucideIcon
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Home,
  Settings,
}

const allServices = [
  { id: 1, title: "Plumbing Repair", description: "Expert plumbing solutions for leaks, installations, and repairs.", price: 75, iconName: "Wrench", category: "Plumbing" },
  { id: 2, title: "Pipe Installation", description: "Professional pipe installation for new construction or renovations.", price: 120, iconName: "Wrench", category: "Plumbing" },
  { id: 3, title: "Drain Cleaning", description: "Clear clogged drains quickly and efficiently.", price: 85, iconName: "Wrench", category: "Plumbing" },
  { id: 4, title: "Electrical Wiring", description: "Licensed electricians for wiring and electrical panel upgrades.", price: 85, iconName: "Zap", category: "Electrical" },
  { id: 5, title: "Lighting Installation", description: "Indoor and outdoor lighting installation.", price: 65, iconName: "Zap", category: "Electrical" },
  { id: 6, title: "Panel Upgrades", description: "Upgrade your electrical panel to handle modern power demands.", price: 350, iconName: "Zap", category: "Electrical" },
  { id: 7, title: "Custom Carpentry", description: "Custom woodwork, furniture assembly, and repairs.", price: 65, iconName: "Hammer", category: "Carpentry" },
  { id: 8, title: "Cabinet Installation", description: "Professional cabinet installation for all spaces.", price: 150, iconName: "Hammer", category: "Carpentry" },
  { id: 9, title: "Interior Painting", description: "Interior painting with premium materials.", price: 55, iconName: "PaintBucket", category: "Painting" },
  { id: 10, title: "Exterior Painting", description: "Weather-resistant exterior painting.", price: 75, iconName: "PaintBucket", category: "Painting" },
  { id: 11, title: "General Repairs", description: "General maintenance and repair services.", price: 50, iconName: "Home", category: "Home Repairs" },
  { id: 12, title: "HVAC Maintenance", description: "HVAC system maintenance and repairs.", price: 90, iconName: "Settings", category: "Technical" },
]

const categories = ["All", "Plumbing", "Electrical", "Carpentry", "Painting", "Home Repairs", "Technical"]

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
}

export default function DashboardServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DashboardLayout title="Browse Services" currentPath="/dashboard/services">
      {/* Header with Cart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          Select services to add to your cart and proceed to checkout.
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground relative gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartCount})
              {cartTotal > 0 && (
                <span className="ml-1">${cartTotal}</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card border-border w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-foreground">Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-border"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-border"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">${cartTotal}</span>
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const Icon = iconMap[service.iconName] || Wrench
          return (
          <Card key={service.id} className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{service.title}</h3>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-lg font-bold text-primary">${service.price}</span>
              <Button 
                size="sm"
                onClick={() => addToCart(service)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </CardFooter>
          </Card>
        )})}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
