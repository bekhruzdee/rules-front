"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Plus, Search, Mail, Calendar, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserInterface {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: "ADMIN" | "USER"
  avatar?: string
  createdAt: string
  _count: {
    assignedTasks: number
    assignedProjects: number
    comments: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if we're in demo mode first
        const token = localStorage.getItem("token")
        if (token === "demo-token") {
          // Use mock data immediately for demo mode
          const mockUsers: UserInterface[] = [
            {
              id: 1,
              username: "johndoe",
              email: "john@example.com",
              firstName: "John",
              lastName: "Doe",
              role: "USER",
              createdAt: new Date().toISOString(),
              _count: {
                assignedTasks: 5,
                assignedProjects: 2,
                comments: 12,
              },
            },
            {
              id: 2,
              username: "janedoe",
              email: "jane@example.com",
              firstName: "Jane",
              lastName: "Doe",
              role: "ADMIN",
              createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
              _count: {
                assignedTasks: 8,
                assignedProjects: 3,
                comments: 24,
              },
            },
            {
              id: 3,
              username: "mikejohnson",
              email: "mike@example.com",
              firstName: "Mike",
              lastName: "Johnson",
              role: "USER",
              createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
              _count: {
                assignedTasks: 3,
                assignedProjects: 1,
                comments: 8,
              },
            },
          ]
          setUsers(mockUsers)
          setLoading(false)
          return
        }

        // Try to fetch from backend only if not in demo mode
        const response = await api.get("/users")
        setUsers(response.data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        // Fallback to mock data for development
        const mockUsers: UserInterface[] = [
          {
            id: 1,
            username: "johndoe",
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "USER",
            createdAt: new Date().toISOString(),
            _count: {
              assignedTasks: 5,
              assignedProjects: 2,
              comments: 12,
            },
          },
          {
            id: 2,
            username: "janedoe",
            email: "jane@example.com",
            firstName: "Jane",
            lastName: "Doe",
            role: "ADMIN",
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            _count: {
              assignedTasks: 8,
              assignedProjects: 3,
              comments: 24,
            },
          },
          {
            id: 3,
            username: "mikejohnson",
            email: "mike@example.com",
            firstName: "Mike",
            lastName: "Johnson",
            role: "USER",
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            _count: {
              assignedTasks: 3,
              assignedProjects: 1,
              comments: 8,
            },
          },
        ]
        setUsers(mockUsers)
        toast({
          title: "Demo Mode",
          description: "Using mock data - connect to your backend API",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  }

  if (loading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage team members and their permissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]} || {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {user.firstName} {user.lastName} || {user.username}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.role)}>
                        <Shield className="mr-1 h-3 w-3" />
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {user.email}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{user._count.assignedTasks}</div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{user._count.assignedProjects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{user._count.comments}</div>
                      <div className="text-xs text-muted-foreground">Comments</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">{searchTerm ? "No users found" : "No users"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding team members"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
