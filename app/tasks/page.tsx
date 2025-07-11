"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  TaskForm,
  type TaskFormData as TaskFormSubmissionData,
} from "@/components/task-form";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";

interface BackendUser {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
}

interface BackendProject {
  id: number;
  name: string;
  description?: string;
  imagePath?: string;
}

interface MappedUser {
  id: string;
  name: string;
  email: string;
}

interface MappedProject {
  id: string;
  name: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  completed: boolean;
  assignedUser?: BackendUser;
  project: BackendProject;
}

const statusColumns = {
  TODO: { title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  IN_PROGRESS: { title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  DONE: { title: "Done", color: "bg-green-100 dark:bg-green-900" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const { toast } = useToast();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get("/tasks").catch((error) => {
          console.error("Error fetching tasks:", error);
          return { data: [] };
        }),
        api.get("/projects").catch((error) => {
          console.error("Error fetching projects:", error);
          return { data: [] };
        }),
        api.get("/users").catch((error) => {
          console.error("Error fetching users:", error);
          return { data: [] };
        }),
      ]);

      const tasksData: Task[] = Array.isArray(tasksRes.data)
        ? tasksRes.data
        : [];
      const projectsData: BackendProject[] = Array.isArray(projectsRes.data)
        ? projectsRes.data
        : [];
      const usersData: BackendUser[] = Array.isArray(usersRes.data)
        ? usersRes.data
        : [];

      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);

      console.log("Fetched Projects (Raw from API):", projectsData);
      console.log("Fetched Users (Raw from API):", usersData);

      if (!projectsData.length) {
        toast({
          title: "No Projects Loaded",
          description:
            "Could not load any projects from the backend. The 'Project' dropdown might be empty.",
          variant: "default",
        });
      }
      if (!usersData.length) {
        toast({
          title: "No Users Loaded",
          description:
            "Could not load any users from the backend. 'Assigned to' section might be empty.",
          variant: "default",
        });
      }
      if (!tasksData.length) {
        toast({
          title: "No Tasks Loaded",
          description: "No tasks were found. Start by creating a new one!",
          variant: "default",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error loading data",
        description:
          err.message ||
          "Failed to fetch essential data (tasks, projects, users) from backend. Please check your network connection and API server.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={fetchInitialData}>
            Retry
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const mappedUsers: MappedUser[] = useMemo(
    () =>
      users
        .filter((u) => u.id != null && u.id !== 0 && typeof u.id === "number")
        .map((u) => ({
          id: String(u.id),
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
          email: u.email || `${u.username}@example.com`,
        })),
    [users]
  );

  const mappedProjects: MappedProject[] = useMemo(() => {
    console.log("Projects being mapped for TaskForm:", projects);
    return projects
      .filter((p) => p.id != null && p.id !== 0 && typeof p.id === "number")
      .map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description || "No description provided",
      }));
  }, [projects]);

  const handleCreateTask = async (data: TaskFormSubmissionData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
        completed: data.completed,
        projectId: Number(data.projectId),
        assignedUserId:
          data.assignedUsers.length > 0
            ? Number(data.assignedUsers[0].id)
            : undefined,
      };

      const res = await api.post("/tasks", payload);

      const newTask: Task = {
        id: res.data.id,
        title: res.data.title,
        description: res.data.description,
        status: res.data.status,
        priority: res.data.priority,
        dueDate: res.data.dueDate,
        completed: res.data.completed,
        project: res.data.project,
        assignedUser: res.data.assignedUser,
      };

      setTasks((prev) => [...prev, newTask]);
      setShowTaskForm(false);
      toast({
        title: "Task created successfully",
        description: `Task "${newTask.title}" added.`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to create task",
        description:
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while creating the task.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Task["status"];

    const originalTasks = tasks;
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast({
        title: "Task status updated",
        description: `Task moved to ${newStatus}.`,
      });
    } catch (err: any) {
      setTasks(originalTasks);
      toast({
        title: "Error updating task status",
        description:
          err.message || "Failed to update task status on the server.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDragEnd(result)}
          >
            Retry
          </Button>
        ),
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTasksByStatus = (status: keyof typeof statusColumns) =>
    tasks.filter((task) => task.status === status);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading your data...
          </p>
          <p className="text-sm text-muted-foreground">
            Please ensure your backend server is running and accessible.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your tasks visually</p>
          </div>
          <Button
            onClick={() => setShowTaskForm(true)}
            className="transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        {showTaskForm && (
          <TaskForm
            users={mappedUsers}
            projects={mappedProjects}
            onSubmit={handleCreateTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(statusColumns).map(([status, config]) => (
              <Card key={status} className={config.color}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {config.title}
                    <Badge variant="secondary">
                      {getTasksByStatus(status as Task["status"]).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] ${
                          snapshot.isDraggingOver
                            ? "bg-muted/50 p-2 rounded-lg"
                            : ""
                        }`}
                      >
                        {getTasksByStatus(status as Task["status"]).map(
                          (task, index) => (
                            <Draggable
                              key={String(task.id)}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`cursor-move transition-all ${
                                    snapshot.isDragging
                                      ? "shadow-lg rotate-3"
                                      : ""
                                  }`}
                                >
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between">
                                      <h3 className="font-medium text-sm">
                                        {task.title}
                                      </h3>
                                      <Badge
                                        className={getPriorityColor(
                                          task.priority
                                        )}
                                      >
                                        {task.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {task.description}
                                    </p>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span className="font-medium">
                                        {task.project.name}
                                      </span>
                                      {task.dueDate &&
                                        isValid(parseISO(task.dueDate)) && (
                                          <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            <span>
                                              {format(
                                                parseISO(task.dueDate),
                                                "MMM d,yyyy"
                                              )}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                    {task.assignedUser && (
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              task.assignedUser.avatar ||
                                              "/placeholder.svg"
                                            }
                                          />
                                          <AvatarFallback>
                                            {(
                                              task.assignedUser
                                                .firstName?.[0] ||
                                              task.assignedUser.username[0]
                                            ).toUpperCase()}
                                            {(
                                              task.assignedUser.lastName?.[0] ||
                                              ""
                                            ).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs">
                                          {task.assignedUser.firstName ||
                                          task.assignedUser.lastName
                                            ? `${
                                                task.assignedUser.firstName ||
                                                ""
                                              } ${
                                                task.assignedUser.lastName || ""
                                              }`.trim()
                                            : task.assignedUser.username}
                                        </span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>
      </div>
    </DashboardLayout>
  );
}
