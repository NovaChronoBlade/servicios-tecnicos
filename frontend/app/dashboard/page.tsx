"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Wrench,
  Zap,
  Hammer
} from "lucide-react"

const stats = [
  { label: "Active Orders", value: "3", icon: Clock, color: "text-chart-2" },
  { label: "Completed", value: "12", icon: CheckCircle2, color: "text-success" },
  { label: "Pending", value: "1", icon: AlertCircle, color: "text-chart-4" },
]

const recentOrders = [
  { 
    id: "ORD-001", 
    service: "Plumbing Repair", 
    status: "In Progress", 
    date: "May 20, 2026", 
    price: 150,
    icon: Wrench
  },
  { 
    id: "ORD-002", 
    service: "Electrical Wiring", 
    status: "Scheduled", 
    date: "May 22, 2026", 
    price: 200,
    icon: Zap
  },
  { 
    id: "ORD-003", 
    service: "Cabinet Installation", 
    status: "Completed", 
    date: "May 18, 2026", 
    price: 350,
    icon: Hammer
  },
]

const statusColors: Record<string, string> = {
  "In Progress": "bg-chart-2/10 text-chart-2",
  "Scheduled": "bg-chart-4/10 text-chart-4",
  "Completed": "bg-success/10 text-success",
  "Cancelled": "bg-destructive/10 text-destructive",
}

export default function ClientDashboard() {
  return (
    <DashboardLayout title="Dashboard" currentPath="/dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/services">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <ShoppingCart className="w-4 h-4" />
                Browse Services
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="border-border text-foreground gap-2">
                <Clock className="w-4 h-4" />
                View All Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Orders</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <order.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.service}</p>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-foreground">${order.price}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
