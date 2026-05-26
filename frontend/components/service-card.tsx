"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  Wrench, 
  Zap, 
  Hammer, 
  PaintBucket, 
  Home, 
  Settings,
  type LucideIcon 
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Home,
  Settings,
}

interface ServiceCardProps {
  title: string
  description: string
  price: number
  iconName: string
  onAddToCart?: () => void
}

export function ServiceCard({ title, description, price, iconName, onAddToCart }: ServiceCardProps) {
  const Icon = iconMap[iconName] || Wrench
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-card-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <span className="text-xs text-muted-foreground">Starting from</span>
          <p className="text-xl font-bold text-primary">${price}</p>
        </div>
        <Button 
          size="sm" 
          onClick={onAddToCart}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
