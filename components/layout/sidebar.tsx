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
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  const filteredNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "ADMIN")

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed bg-card inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
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
          "fixed bg-card inset-y-0 left-0 z-50  from-slate-50 to-white border-r border-slate-200/60 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Toggle */}
          <div
            className={cn(
              "flex items-center justify-between h-16 px-4 border-b border-slate-200/60",
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
              className="hidden lg:flex h-8 w-8 hover:bg-slate-100"
              onClick={() => setCollapsed(!collapsed)}
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
                    "flex  items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
                    collapsed && "justify-center",
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 text-card-foreground", !collapsed && "mr-3")} />
                  {!collapsed && <span className="truncate text-card-foreground">{item.name}</span>}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute  left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
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
