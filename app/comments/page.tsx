"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { Search, MessageSquare, Calendar, Filter, FolderOpen, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  task?: {
    id: number
    title: string
  }
  project?: {
    id: number
    name: string
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Check if we're in demo mode first
        const token = localStorage.getItem("token")
        if (token === "demo-token") {
          // Use mock data immediately for demo mode
          const mockComments: Comment[] = [
            {
              id: 1,
              content: "Great progress on this task! The design looks really clean and modern.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: {
                id: 2,
                username: "janedoe",
                firstName: "Jane",
                lastName: "Doe",
              },
              task: {
                id: 1,
                title: "Design Homepage Layout",
              },
            },
            {
              id: 2,
              content: "We need to discuss the authentication flow before proceeding with implementation.",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              user: {
                id: 1,
                username: "johndoe",
                firstName: "John",
                lastName: "Doe",
              },
              project: {
                id: 2,
                name: "Mobile App Development",
              },
            },
            {
              id: 3,
              content: "All unit tests are passing. Ready for code review.",
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              user: {
                id: 3,
                username: "mikejohnson",
                firstName: "Mike",
                lastName: "Johnson",
              },
              task: {
                id: 3,
                title: "Write Unit Tests",
              },
            },
          ]
          setComments(mockComments)
          setLoading(false)
          return
        }

        // Try to fetch from backend only if not in demo mode
        const response = await api.get("/comments")
        setComments(response.data)
      } catch (error) {
        console.error("Failed to fetch comments:", error)
        // Fallback to mock data for development
        const mockComments: Comment[] = [
          {
            id: 1,
            content: "Great progress on this task! The design looks really clean and modern.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: 2,
              username: "janedoe",
              firstName: "Jane",
              lastName: "Doe",
            },
            task: {
              id: 1,
              title: "Design Homepage Layout",
            },
          },
          {
            id: 2,
            content: "We need to discuss the authentication flow before proceeding with implementation.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            user: {
              id: 1,
              username: "johndoe",
              firstName: "John",
              lastName: "Doe",
            },
            project: {
              id: 2,
              name: "Mobile App Development",
            },
          },
          {
            id: 3,
            content: "All unit tests are passing. Ready for code review.",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            user: {
              id: 3,
              username: "mikejohnson",
              firstName: "Mike",
              lastName: "Johnson",
            },
            task: {
              id: 3,
              title: "Write Unit Tests",
            },
          },
        ]
        setComments(mockComments)
        toast({
          title: "Demo Mode",
          description: "Using mock data - connect to your backend API",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [toast])

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.task?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.project?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterType === "all" || (filterType === "tasks" && comment.task) || (filterType === "projects" && comment.project)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-3/4" />
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
            <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
            <p className="text-muted-foreground">View all comments across projects and tasks</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="tasks">Task Comments</SelectItem>
              <SelectItem value="projects">Project Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {comment.user.firstName?.[0]}
                        {comment.user.lastName?.[0]} ||
                        {comment.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {comment.user.firstName} {comment.user.lastName} || {comment.user.username}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        {comment.createdAt !== comment.updatedAt && (
                          <>
                            <span>•</span>
                            <span className="text-xs">edited</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {comment.task && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <CheckSquare className="h-3 w-3" />
                        <span>Task</span>
                      </Badge>
                    )}
                    {comment.project && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <FolderOpen className="h-3 w-3" />
                        <span>Project</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{comment.content}</p>

                  {(comment.task || comment.project) && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {comment.task && (
                          <>
                            <CheckSquare className="h-4 w-4" />
                            <span>Task: {comment.task.title}</span>
                          </>
                        )}
                        {comment.project && (
                          <>
                            <FolderOpen className="h-4 w-4" />
                            <span>Project: {comment.project.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {searchTerm || filterType !== "all" ? "No comments found" : "No comments"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No comments have been posted yet"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
