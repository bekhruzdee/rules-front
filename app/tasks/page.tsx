"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api"
import { Plus, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface Task {
  id: number
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: string
  assignedUser?: {
    id: number
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  project: {
    id: number
    name: string
  }
}

const statusColumns = {
  TODO: { title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  IN_PROGRESS: { title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  DONE: { title: "Done", color: "bg-green-100 dark:bg-green-900" },
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Check if we're in demo mode first
        const token = localStorage.getItem("token")
        if (token === "demo-token") {
          // Use mock data immediately for demo mode
          const mockTasks: Task[] = [
            {
              id: 1,
              title: "Design Homepage Layout",
              description: "Create wireframes and mockups for the new homepage design",
              status: "TODO",
              priority: "HIGH",
              dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
              assignedUser: {
                id: 1,
                username: "johndoe",
                firstName: "John",
                lastName: "Doe",
              },
              project: {
                id: 1,
                name: "Website Redesign",
              },
            },
            {
              id: 2,
              title: "Implement User Authentication",
              description: "Set up JWT-based authentication system",
              status: "IN_PROGRESS",
              priority: "HIGH",
              assignedUser: {
                id: 2,
                username: "janedoe",
                firstName: "Jane",
                lastName: "Doe",
              },
              project: {
                id: 2,
                name: "Mobile App Development",
              },
            },
            {
              id: 3,
              title: "Write Unit Tests",
              description: "Create comprehensive test suite for core functionality",
              status: "DONE",
              priority: "MEDIUM",
              assignedUser: {
                id: 3,
                username: "mikejohnson",
                firstName: "Mike",
                lastName: "Johnson",
              },
              project: {
                id: 1,
                name: "Website Redesign",
              },
            },
          ]
          setTasks(mockTasks)
          setLoading(false)
          return
        }

        // Try to fetch from backend only if not in demo mode
        const response = await api.get("/tasks")
        setTasks(response.data)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
        // Fallback to mock data
        const mockTasks: Task[] = [
          {
            id: 1,
            title: "Design Homepage Layout",
            description: "Create wireframes and mockups for the new homepage design",
            status: "TODO",
            priority: "HIGH",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
            assignedUser: {
              id: 1,
              username: "johndoe",
              firstName: "John",
              lastName: "Doe",
            },
            project: {
              id: 1,
              name: "Website Redesign",
            },
          },
          {
            id: 2,
            title: "Implement User Authentication",
            description: "Set up JWT-based authentication system",
            status: "IN_PROGRESS",
            priority: "HIGH",
            assignedUser: {
              id: 2,
              username: "janedoe",
              firstName: "Jane",
              lastName: "Doe",
            },
            project: {
              id: 2,
              name: "Mobile App Development",
            },
          },
          {
            id: 3,
            title: "Write Unit Tests",
            description: "Create comprehensive test suite for core functionality",
            status: "DONE",
            priority: "MEDIUM",
            assignedUser: {
              id: 3,
              username: "mikejohnson",
              firstName: "Mike",
              lastName: "Johnson",
            },
            project: {
              id: 1,
              name: "Website Redesign",
            },
          },
        ]
        setTasks(mockTasks)
        toast({
          title: "Demo Mode",
          description: "Using mock data - connect to your backend API",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const taskId = Number.parseInt(draggableId)
    const newStatus = destination.droppableId as "TODO" | "IN_PROGRESS" | "DONE"

    // Optimistically update the UI
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus })
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully",
      })
    } catch (error) {
      // Revert the change if the API call fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: tasks.find((t) => t.id === taskId)?.status || "TODO" } : task,
        ),
      )
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTasksByStatus = (status: keyof typeof statusColumns) => {
    return tasks.filter((task) => task.status === status)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(statusColumns).map((status) => (
              <Card key={status} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded" />
                    ))}
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
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your tasks with a Kanban board</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(statusColumns).map(([status, config]) => (
              <Card key={status} className={config.color}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {config.title}
                    <Badge variant="secondary">{getTasksByStatus(status as keyof typeof statusColumns).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] ${
                          snapshot.isDraggingOver ? "bg-muted/50 rounded-lg p-2" : ""
                        }`}
                      >
                        {getTasksByStatus(status as keyof typeof statusColumns).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-move ${snapshot.isDragging ? "shadow-lg rotate-3" : ""}`}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                                      <Badge className={getPriorityColor(task.priority)} size="sm">
                                        {task.priority}
                                      </Badge>
                                    </div>

                                    {task.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span className="font-medium">{task.project.name}</span>
                                      {task.dueDate && (
                                        <div className="flex items-center">
                                          <Calendar className="mr-1 h-3 w-3" />
                                          {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>

                                    {task.assignedUser && (
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={task.assignedUser.avatar || "/placeholder.svg"} />
                                          <AvatarFallback className="text-xs">
                                            {task.assignedUser.firstName?.[0]}
                                            {task.assignedUser.lastName?.[0]} ||
                                            {task.assignedUser.username[0].toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">
                                          {task.assignedUser.firstName} {task.assignedUser.lastName} ||
                                          {task.assignedUser.username}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-foreground">No tasks</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new task.</p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
