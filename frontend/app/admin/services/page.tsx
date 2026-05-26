"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Home,
  Settings
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
import { Textarea } from "@/components/ui/textarea"

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Home,
  Settings,
}

const initialServices = [
  { id: 1, title: "Plumbing Repair", description: "Expert plumbing solutions for leaks and repairs.", price: 75, category: "Plumbing", icon: "Wrench", active: true },
  { id: 2, title: "Pipe Installation", description: "Professional pipe installation services.", price: 120, category: "Plumbing", icon: "Wrench", active: true },
  { id: 3, title: "Electrical Wiring", description: "Licensed electricians for all wiring needs.", price: 85, category: "Electrical", icon: "Zap", active: true },
  { id: 4, title: "Lighting Installation", description: "Indoor and outdoor lighting installation.", price: 65, category: "Electrical", icon: "Zap", active: true },
  { id: 5, title: "Custom Carpentry", description: "Custom woodwork and furniture assembly.", price: 65, category: "Carpentry", icon: "Hammer", active: true },
  { id: 6, title: "Cabinet Installation", description: "Professional cabinet installation.", price: 150, category: "Carpentry", icon: "Hammer", active: true },
  { id: 7, title: "Interior Painting", description: "Interior painting with premium materials.", price: 55, category: "Painting", icon: "PaintBucket", active: true },
  { id: 8, title: "Exterior Painting", description: "Weather-resistant exterior painting.", price: 75, category: "Painting", icon: "PaintBucket", active: false },
  { id: 9, title: "General Repairs", description: "General maintenance and repair services.", price: 50, category: "Home Repairs", icon: "Home", active: true },
  { id: 10, title: "HVAC Maintenance", description: "HVAC system maintenance and repairs.", price: 90, category: "Technical", icon: "Settings", active: true },
]

const categories = ["Plumbing", "Electrical", "Carpentry", "Painting", "Home Repairs", "Technical"]

export default function AdminServicesPage() {
  const [services, setServices] = useState(initialServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<typeof initialServices[0] | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    icon: "Wrench",
  })

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (service?: typeof initialServices[0]) => {
    if (service) {
      setEditingService(service)
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        icon: service.icon,
      })
    } else {
      setEditingService(null)
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        icon: "Wrench",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...formData, price: Number(formData.price) }
            : s
        )
      )
    } else {
      const newService = {
        id: Math.max(...services.map((s) => s.id)) + 1,
        ...formData,
        price: Number(formData.price),
        active: true,
      }
      setServices((prev) => [...prev, newService])
    }
    
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const toggleActive = (id: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
  }

  return (
    <AdminLayout title="Manage Services" currentPath="/admin/services">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
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
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Service Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-input border-border text-foreground resize-none"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-foreground">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-foreground">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-foreground">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {Object.keys(iconMap).map((iconName) => {
                      const IconComponent = iconMap[iconName]
                      return (
                        <SelectItem key={iconName} value={iconName} className="text-foreground">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {iconName}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
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
                  {editingService ? "Update" : "Create"} Service
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Service</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const IconComponent = iconMap[service.icon] || Wrench
                  return (
                    <tr key={service.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{service.title}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block max-w-[200px] truncate">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">
                        {service.category}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-foreground">
                        ${service.price}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => toggleActive(service.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            service.active
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {service.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenDialog(service)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
