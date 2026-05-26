"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Zap, 
  Hammer, 
  PaintBucket,
  Home,
  Settings,
  Calendar,
  MapPin,
  X
} from "lucide-react"

const orders = [
  { 
    id: "ORD-001", 
    service: "Plumbing Repair", 
    description: "Fix leaking pipe under kitchen sink",
    status: "In Progress", 
    date: "May 20, 2026",
    time: "10:00 AM",
    location: "123 Main St, Apt 4B",
    technician: "Mike Johnson",
    price: 150,
    icon: Wrench
  },
  { 
    id: "ORD-002", 
    service: "Electrical Wiring", 
    description: "Install new outlet in home office",
    status: "Scheduled", 
    date: "May 22, 2026",
    time: "2:00 PM",
    location: "123 Main St, Apt 4B",
    technician: "Sarah Williams",
    price: 200,
    icon: Zap
  },
  { 
    id: "ORD-003", 
    service: "Cabinet Installation", 
    description: "Install kitchen cabinets - 6 units",
    status: "Completed", 
    date: "May 18, 2026",
    time: "9:00 AM",
    location: "123 Main St, Apt 4B",
    technician: "Tom Brown",
    price: 350,
    icon: Hammer
  },
  { 
    id: "ORD-004", 
    service: "Interior Painting", 
    description: "Paint living room and dining area",
    status: "Completed", 
    date: "May 15, 2026",
    time: "8:00 AM",
    location: "123 Main St, Apt 4B",
    technician: "Lisa Davis",
    price: 280,
    icon: PaintBucket
  },
  { 
    id: "ORD-005", 
    service: "General Repairs", 
    description: "Fix squeaky door hinges throughout apartment",
    status: "Cancelled", 
    date: "May 12, 2026",
    time: "11:00 AM",
    location: "123 Main St, Apt 4B",
    technician: "Unassigned",
    price: 75,
    icon: Home
  },
  { 
    id: "ORD-006", 
    service: "HVAC Maintenance", 
    description: "Annual AC maintenance and filter replacement",
    status: "Pending", 
    date: "May 25, 2026",
    time: "3:00 PM",
    location: "123 Main St, Apt 4B",
    technician: "Pending Assignment",
    price: 120,
    icon: Settings
  },
]

const statusColors: Record<string, string> = {
  "In Progress": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Scheduled": "bg-chart-4/10 text-chart-4 border-chart-4/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Cancelled": "bg-destructive/10 text-destructive border-destructive/20",
  "Pending": "bg-muted text-muted-foreground border-border",
}

export default function OrdersPage() {
  const handleCancelOrder = (orderId: string) => {
    console.log("[v0] Cancelling order:", orderId)
    // In a real app, this would call an API
  }

  return (
    <DashboardLayout title="My Orders" currentPath="/dashboard/orders">
      {/* Order Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "In Progress", value: orders.filter(o => o.status === "In Progress").length },
          { label: "Completed", value: orders.filter(o => o.status === "Completed").length },
          { label: "Scheduled", value: orders.filter(o => o.status === "Scheduled").length },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <order.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{order.service}</h3>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{order.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date} at {order.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.location}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Technician: <span className="text-foreground">{order.technician}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-4 lg:min-w-[180px]">
                    <span className="text-xl font-bold text-foreground">${order.price}</span>
                    {(order.status === "Scheduled" || order.status === "Pending") && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
