"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "USER"
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
