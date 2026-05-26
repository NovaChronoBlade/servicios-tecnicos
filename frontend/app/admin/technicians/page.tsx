"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Phone,
  Mail,
  Star,
  MapPin
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialTechnicians = [
  { id: 1, name: "Mike Johnson", email: "mike@techpro.com", phone: "+1 555-0101", specialty: "Plumbing", location: "San Francisco, CA", rating: 4.9, jobs: 156, status: "Active" },
  { id: 2, name: "Sarah Williams", email: "sarah@techpro.com", phone: "+1 555-0102", specialty: "Electrical", location: "San Francisco, CA", rating: 4.8, jobs: 142, status: "Active" },
  { id: 3, name: "Tom Brown", email: "tom@techpro.com", phone: "+1 555-0103", specialty: "Carpentry", location: "Oakland, CA", rating: 4.9, jobs: 128, status: "Active" },
  { id: 4, name: "Lisa Davis", email: "lisa@techpro.com", phone: "+1 555-0104", specialty: "Painting", location: "San Jose, CA", rating: 4.7, jobs: 98, status: "Active" },
  { id: 5, name: "James Wilson", email: "james@techpro.com", phone: "+1 555-0105", specialty: "HVAC", location: "San Francisco, CA", rating: 4.6, jobs: 87, status: "On Leave" },
  { id: 6, name: "Emily Chen", email: "emily@techpro.com", phone: "+1 555-0106", specialty: "Electrical", location: "Berkeley, CA", rating: 4.8, jobs: 76, status: "Active" },
  { id: 7, name: "Robert Martinez", email: "robert@techpro.com", phone: "+1 555-0107", specialty: "Plumbing", location: "Oakland, CA", rating: 4.5, jobs: 65, status: "Inactive" },
]

const specialties = ["Plumbing", "Electrical", "Carpentry", "Painting", "HVAC", "General"]
const statuses = ["Active", "On Leave", "Inactive"]

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState(initialTechnicians)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTechnician, setEditingTechnician] = useState<typeof initialTechnicians[0] | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    status: "Active",
  })

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (technician?: typeof initialTechnicians[0]) => {
    if (technician) {
      setEditingTechnician(technician)
      setFormData({
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        specialty: technician.specialty,
        location: technician.location,
        status: technician.status,
      })
    } else {
      setEditingTechnician(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        location: "",
        status: "Active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTechnician) {
      setTechnicians((prev) =>
        prev.map((t) =>
          t.id === editingTechnician.id
            ? { ...t, ...formData }
            : t
        )
      )
    } else {
      const newTechnician = {
        id: Math.max(...technicians.map((t) => t.id)) + 1,
        ...formData,
        rating: 0,
        jobs: 0,
      }
      setTechnicians((prev) => [...prev, newTechnician])
    }
    
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id))
  }

  const statusColors: Record<string, string> = {
    "Active": "bg-success/10 text-success border-success/20",
    "On Leave": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    "Inactive": "bg-muted text-muted-foreground border-border",
  }

  return (
    <AdminLayout title="Manage Technicians" currentPath="/admin/technicians">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4" />
              Add Technician
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingTechnician ? "Edit Technician" : "Add New Technician"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-foreground">Specialty</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec} className="text-foreground">
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-foreground">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-foreground">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-input border-border text-foreground"
                  placeholder="City, State"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-border text-foreground"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {editingTechnician ? "Update" : "Add"} Technician
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Technicians</p>
            <p className="text-2xl font-bold text-foreground">{technicians.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{technicians.filter(t => t.status === "Active").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On Leave</p>
            <p className="text-2xl font-bold text-chart-4">{technicians.filter(t => t.status === "On Leave").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Rating</p>
            <p className="text-2xl font-bold text-foreground">
              {(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTechnicians.map((tech) => (
          <Card key={tech.id} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {tech.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.specialty}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[tech.status]}>
                  {tech.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{tech.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{tech.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{tech.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-chart-4 fill-chart-4" />
                    <span className="text-sm font-medium text-foreground">{tech.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{tech.jobs} jobs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleOpenDialog(tech)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(tech.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No technicians found matching your criteria.</p>
        </div>
      )}
    </AdminLayout>
  )
}
