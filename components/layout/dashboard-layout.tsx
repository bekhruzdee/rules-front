"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "USER"
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
