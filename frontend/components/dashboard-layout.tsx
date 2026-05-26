"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Wrench, 
  LayoutDashboard, 
  ShoppingCart, 
  History, 
  User,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingCart, label: "Browse Services", href: "/dashboard/services" },
  { icon: History, label: "My Orders", href: "/dashboard/orders" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

export function DashboardSidebar({ 
  currentPath,
  isMobileOpen,
  onMobileClose 
}: { 
  currentPath: string
  isMobileOpen: boolean
  onMobileClose: () => void
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">TechPro</span>
            </Link>
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1 text-sidebar-foreground hover:bg-sidebar-accent rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = currentPath === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
              </div>
            </div>
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="w-full mt-2 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export function DashboardHeader({ 
  title, 
  onMenuClick 
}: { 
  title: string
  onMenuClick: () => void 
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
      </div>
    </header>
  )
}

export function DashboardLayout({ 
  children, 
  title,
  currentPath
}: { 
  children: React.ReactNode
  title: string
  currentPath: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        currentPath={currentPath}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="lg:ml-64">
        <DashboardHeader 
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
