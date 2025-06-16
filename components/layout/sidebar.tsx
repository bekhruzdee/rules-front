"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  MessageSquare,
  AlertTriangle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Users", href: "/users", icon: Users, adminOnly: true },
  { name: "Comments", href: "/comments", icon: MessageSquare },
  { name: "Violations", href: "/violations", icon: AlertTriangle, adminOnly: true },
  { name: "Profile", href: "/profile", icon: User },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed: externalCollapsed, onToggle }: SidebarProps = {}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!collapsed)
    } else {
      setInternalCollapsed(!collapsed)
    }
  }

  const filteredNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "ADMIN")

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card/95 backdrop-blur-sm border-r border-border transform transition-all duration-300 ease-in-out will-change-transform lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Toggle */}
          <div
            className={cn(
              "flex items-center justify-between h-16 px-4 border-b border-border",
              collapsed && "justify-center",
            )}
          >
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rules
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 hover:bg-muted transition-colors duration-200"
              onClick={handleToggle}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative transform hover:scale-[1.02] will-change-transform",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-foreground hover:text-foreground hover:bg-muted/80",
                    collapsed && "justify-center",
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                  {!collapsed && <span className="truncate">{item.name}</span>}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
