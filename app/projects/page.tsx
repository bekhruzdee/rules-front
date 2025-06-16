"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api/auth"
import { Plus, Users, Calendar, FileText, FolderOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: number
  name: string
  description: string
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "IN_PROGRESS"
  createdAt: string
  updatedAt: string
  assignedUsers: Array<{
    id: number
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }>
  _count: {
    tasks: number
    comments: number
    files: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check if we're in demo mode first
        const token = localStorage.getItem("token")
        if (token === "demo-token") {
          // Use mock data immediately for demo mode
          const mockProjects: Project[] = [
            {
              id: 1,
              name: "Website Redesign",
              description: "Complete overhaul of the company website with modern design and improved user experience",
              status: "ACTIVE",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              assignedUsers: [
                {
                  id: 1,
                  username: "johndoe",
                  firstName: "John",
                  lastName: "Doe",
                },
                {
                  id: 2,
                  username: "janedoe",
                  firstName: "Jane",
                  lastName: "Doe",
                },
              ],
              _count: {
                tasks: 12,
                comments: 8,
                files: 5,
              },
            },
            {
              id: 2,
              name: "Mobile App Development",
              description: "Native mobile application for iOS and Android platforms",
              status: "IN_PROGRESS",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date().toISOString(),
              assignedUsers: [
                {
                  id: 3,
                  username: "mikejohnson",
                  firstName: "Mike",
                  lastName: "Johnson",
                },
              ],
              _count: {
                tasks: 8,
                comments: 4,
                files: 3,
              },
            },
          ]
          setProjects(mockProjects)
          setLoading(false)
          return
        }

        // Try to fetch from backend only if not in demo mode
        const response = await api.get("/projects")
        setProjects(response.data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        // Fallback to mock data
        const mockProjects: Project[] = [
          {
            id: 1,
            name: "Website Redesign",
            description: "Complete overhaul of the company website with modern design and improved user experience",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignedUsers: [
              {
                id: 1,
                username: "johndoe",
                firstName: "John",
                lastName: "Doe",
              },
              {
                id: 2,
                username: "janedoe",
                firstName: "Jane",
                lastName: "Doe",
              },
            ],
            _count: {
              tasks: 12,
              comments: 8,
              files: 5,
            },
          },
          {
            id: 2,
            name: "Mobile App Development",
            description: "Native mobile application for iOS and Android platforms",
            status: "IN_PROGRESS",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            assignedUsers: [
              {
                id: 3,
                username: "mikejohnson",
                firstName: "Mike",
                lastName: "Johnson",
              },
            ],
            _count: {
              tasks: 8,
              comments: 4,
              files: 3,
            },
          },
        ]
        setProjects(mockProjects)
        toast({
          title: "Demo Mode",
          description: "Using mock data - connect to your backend API",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage and track your team's projects</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FileText className="mr-1 h-4 w-4" />
                      {project._count.tasks} tasks
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Assigned Users */}
                  <div>
                    <div className="flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Team</span>
                    </div>
                    <div className="flex -space-x-2">
                      {project.assignedUsers.slice(0, 4).map((user) => (
                        <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]} || {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.assignedUsers.length > 4 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
                          +{project.assignedUsers.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No projects</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new project.</p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
