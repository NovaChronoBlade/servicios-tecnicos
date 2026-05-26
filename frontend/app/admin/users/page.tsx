"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MoreVertical,
  Mail,
  Calendar
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Client", orders: 5, totalSpent: 725, joinDate: "Jan 15, 2026", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Client", orders: 8, totalSpent: 1240, joinDate: "Feb 3, 2026", status: "Active" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Client", orders: 3, totalSpent: 320, joinDate: "Mar 12, 2026", status: "Active" },
  { id: 4, name: "Emily Johnson", email: "emily@example.com", role: "Client", orders: 12, totalSpent: 2150, joinDate: "Dec 8, 2025", status: "Active" },
  { id: 5, name: "David Wilson", email: "david@example.com", role: "Client", orders: 2, totalSpent: 180, joinDate: "Apr 20, 2026", status: "Inactive" },
  { id: 6, name: "Jennifer Davis", email: "jennifer@example.com", role: "Client", orders: 7, totalSpent: 890, joinDate: "Jan 28, 2026", status: "Active" },
  { id: 7, name: "Robert Miller", email: "robert@example.com", role: "Client", orders: 4, totalSpent: 560, joinDate: "Feb 15, 2026", status: "Suspended" },
  { id: 8, name: "Admin User", email: "admin@techpro.com", role: "Admin", orders: 0, totalSpent: 0, joinDate: "Nov 1, 2025", status: "Active" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStatusChange = (id: number, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    )
  }

  const statusColors: Record<string, string> = {
    "Active": "bg-success/10 text-success border-success/20",
    "Inactive": "bg-muted text-muted-foreground border-border",
    "Suspended": "bg-destructive/10 text-destructive border-destructive/20",
  }

  const roleColors: Record<string, string> = {
    "Admin": "bg-primary/10 text-primary border-primary/20",
    "Client": "bg-secondary text-secondary-foreground border-border",
  }

  return (
    <AdminLayout title="Manage Users" currentPath="/admin/users">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{users.filter(u => u.status === "Active").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">
              ${users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold text-primary">{users.filter(u => u.role === "Admin").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Orders</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Spent</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground">
                      {user.orders}
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-foreground hidden sm:table-cell">
                      ${user.totalSpent}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={statusColors[user.status]}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem 
                              className="text-foreground cursor-pointer"
                              onClick={() => handleStatusChange(user.id, "Active")}
                            >
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-foreground cursor-pointer"
                              onClick={() => handleStatusChange(user.id, "Inactive")}
                            >
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer"
                              onClick={() => handleStatusChange(user.id, "Suspended")}
                            >
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
