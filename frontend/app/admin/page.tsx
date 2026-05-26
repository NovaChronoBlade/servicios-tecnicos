"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Users, 
  UserCog, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

const stats = [
  { 
    label: "Total Revenue", 
    value: "$24,580", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign 
  },
  { 
    label: "Active Services", 
    value: "12", 
    change: "+2", 
    trend: "up",
    icon: Package 
  },
  { 
    label: "Technicians", 
    value: "48", 
    change: "+5", 
    trend: "up",
    icon: UserCog 
  },
  { 
    label: "Total Users", 
    value: "1,284", 
    change: "+8.2%", 
    trend: "up",
    icon: Users 
  },
]

const recentOrders = [
  { id: "ORD-001", user: "John Doe", service: "Plumbing Repair", status: "In Progress", amount: 150 },
  { id: "ORD-002", user: "Sarah Smith", service: "Electrical Wiring", status: "Scheduled", amount: 200 },
  { id: "ORD-003", user: "Mike Johnson", service: "Cabinet Install", status: "Completed", amount: 350 },
  { id: "ORD-004", user: "Emily Brown", service: "Interior Painting", status: "Completed", amount: 280 },
  { id: "ORD-005", user: "David Wilson", service: "HVAC Maintenance", status: "Pending", amount: 120 },
]

const statusColors: Record<string, string> = {
  "In Progress": "bg-chart-2/10 text-chart-2",
  "Scheduled": "bg-chart-4/10 text-chart-4",
  "Completed": "bg-success/10 text-success",
  "Pending": "bg-muted text-muted-foreground",
}

const topTechnicians = [
  { name: "Mike Johnson", jobs: 28, rating: 4.9 },
  { name: "Sarah Williams", jobs: 24, rating: 4.8 },
  { name: "Tom Brown", jobs: 22, rating: 4.9 },
  { name: "Lisa Davis", jobs: 20, rating: 4.7 },
]

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard Overview" currentPath="/admin">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-success" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 text-sm font-medium text-foreground">{order.id}</td>
                      <td className="py-3 px-2 text-sm text-foreground">{order.user}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{order.service}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-foreground text-right">${order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Technicians */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTechnicians.map((tech, index) => (
                <div key={tech.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.jobs} jobs completed</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">{tech.rating}</span>
                    <span className="text-chart-4">★</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-foreground">23</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed This Week</p>
              <p className="text-2xl font-bold text-foreground">87</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <p className="text-2xl font-bold text-foreground">+15.3%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
