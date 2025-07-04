// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, Plus } from "lucide-react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   type DropResult,
// } from "@hello-pangea/dnd";
// import { TaskForm } from "@/components/task-form";
// import { api } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { format, parseISO, isValid } from "date-fns";

// interface User {
//   id: number;
//   username: string;
//   firstName?: string;
//   lastName?: string;
//   avatar?: string;
// }

// interface Project {
//   id: number;
//   name: string;
// }

// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   status: "TODO" | "IN_PROGRESS" | "DONE";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   dueDate?: string;
//   assignedUser?: User;
//   project: Project;
// }

// interface TaskFormData {
//   title: string;
//   description: string;
//   status: "TODO" | "IN_PROGRESS" | "DONE";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   dueDate?: string;
//   completed: boolean;
//   project: { id: string; name: string };
//   assignedUsers?: { id: string }[];
// }

// const statusColumns = {
//   TODO: { title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
//   IN_PROGRESS: { title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
//   DONE: { title: "Done", color: "bg-green-100 dark:bg-green-900" },
// };

// const MOCK_USERS: User[] = [
//   {
//     id: 1,
//     username: "johndoe",
//     firstName: "John",
//     lastName: "Doe",
//     avatar: "/placeholder.svg",
//   },
//   {
//     id: 2,
//     username: "janedoe",
//     firstName: "Jane",
//     lastName: "Doe",
//     avatar: "/placeholder.svg",
//   },
//   {
//     id: 3,
//     username: "mikejohnson",
//     firstName: "Mike",
//     lastName: "Johnson",
//     avatar: "/placeholder.svg",
//   },
// ];

// const MOCK_PROJECTS: Project[] = [
//   { id: 1, name: "Website Redesign" },
//   { id: 2, name: "Mobile App Development" },
// ];

// const MOCK_TASKS: Task[] = [
//   {
//     id: 1,
//     title: "Design Homepage Layout",
//     description: "Create wireframes and mockups for the new homepage design",
//     status: "TODO",
//     priority: "HIGH",
//     dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
//     assignedUser: MOCK_USERS[0],
//     project: MOCK_PROJECTS[0],
//   },
//   {
//     id: 2,
//     title: "Implement User Authentication",
//     description: "Set up JWT-based authentication system",
//     status: "IN_PROGRESS",
//     priority: "HIGH",
//     assignedUser: MOCK_USERS[1],
//     project: MOCK_PROJECTS[1],
//   },
//   {
//     id: 3,
//     title: "Write Unit Tests",
//     description: "Create comprehensive test suite for core functionality",
//     status: "DONE",
//     priority: "MEDIUM",
//     assignedUser: MOCK_USERS[2],
//     project: MOCK_PROJECTS[0],
//   },
// ];

// export default function TasksPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const { toast } = useToast();

//   const fetchInitialData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token || token === "demo-token") {
//         setTasks(MOCK_TASKS);
//         setProjects(MOCK_PROJECTS);
//         setUsers(MOCK_USERS);
//         toast({ title: "Demo Mode", description: "Using sample data" });
//         return;
//       }

//       const [tasksRes, projectsRes, usersRes] = await Promise.all([
//         api.get("/tasks").catch(() => ({ data: [] })),
//         api.get("/projects").catch(() => ({ data: [] })),
//         api.get("/users").catch(() => ({ data: [] })),
//       ]);

//       const tasksData = Array.isArray(tasksRes.data) ? tasksRes.data : [];
//       const projectsData = Array.isArray(projectsRes.data)
//         ? projectsRes.data
//         : [];
//       const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];

//       setTasks(tasksData);
//       setProjects(projectsData);
//       setUsers(usersData);

//       if (!tasksData.length || !projectsData.length || !usersData.length) {
//         toast({
//           title: "Some data missing",
//           description: `${!tasksData.length ? "Tasks, " : ""}${
//             !projectsData.length ? "Projects, " : ""
//           }${!usersData.length ? "Users" : ""} not found.`,
//           variant: "default",
//         });
//       }
//     } catch (err: any) {
//       toast({
//         title: "Error loading data",
//         description: err.message || "Failed to fetch tasks, projects, or users",
//         variant: "destructive",
//         action: (
//           <Button variant="outline" size="sm" onClick={fetchInitialData}>
//             Retry
//           </Button>
//         ),
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, [toast]);

//   const mappedUsers = useMemo(
//     () =>
//       users.map((u) => ({
//         id: String(u.id),
//         name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
//         email: `${u.username}@example.com`,
//       })),
//     [users]
//   );

//   const mappedProjects = useMemo(
//     () =>
//       projects.map((p) => ({
//         id: String(p.id),
//         name: p.name,
//         description: "No description",
//         imagePath: "/placeholder.svg",
//         users: mappedUsers,
//       })),
//     [projects, mappedUsers]
//   );

//   const handleCreateTask = async (data: TaskFormData) => {
//     try {
//       const res = await api.post("/tasks", {
//         title: data.title,
//         description: data.description,
//         status: data.status,
//         priority: data.priority,
//         dueDate: data.dueDate,
//         completed: data.completed,
//         projectId: Number(data.project.id),
//         assignedUserId: data.assignedUsers?.[0]?.id
//           ? Number(data.assignedUsers[0].id)
//           : undefined,
//       });
//       setTasks((prev) => [...prev, res.data]);
//       setShowTaskForm(false);
//       toast({ title: "Task created successfully" });
//     } catch (err: any) {
//       toast({
//         title: "Failed to create task",
//         description: err.message || "Unable to create task",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;
//     const taskId = Number(draggableId);
//     const newStatus = destination.droppableId as Task["status"];

//     const updatedTasks = tasks.map((task) =>
//       task.id === taskId ? { ...task, status: newStatus } : task
//     );
//     setTasks(updatedTasks);

//     try {
//       await api.patch(`/tasks/${taskId}`, { status: newStatus });
//       toast({ title: "Task status updated" });
//     } catch (err: any) {
//       setTasks(tasks);
//       toast({
//         title: "Error updating task",
//         description: err.message || "Failed to update task status",
//         variant: "destructive",
//         action: (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleDragEnd(result)}
//           >
//             Retry
//           </Button>
//         ),
//       });
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//       case "MEDIUM":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//       case "LOW":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
//     }
//   };

//   const getTasksByStatus = (status: keyof typeof statusColumns) =>
//     tasks.filter((task) => task.status === status);

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="space-y-6 p-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
//             <Button disabled>
//               <Plus className="mr-2 h-4 w-4" /> New Task
//             </Button>
//           </div>
//           <p className="text-muted-foreground">Loading tasks...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6 p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
//             <p className="text-muted-foreground">Manage your tasks visually</p>
//           </div>
//           <Button
//             onClick={() => setShowTaskForm(true)}
//             className="transition-all hover:scale-105"
//           >
//             <Plus className="mr-2 h-4 w-4" /> New Task
//           </Button>
//         </div>

//         {showTaskForm && (
//           <TaskForm
//             users={mappedUsers}
//             projects={mappedProjects}
//             onSubmit={handleCreateTask}
//             onCancel={() => setShowTaskForm(false)}
//           />
//         )}

//         <DragDropContext onDragEnd={handleDragEnd}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {Object.entries(statusColumns).map(([status, config]) => (
//               <Card key={status} className={config.color}>
//                 <CardHeader>
//                   <CardTitle className="flex justify-between">
//                     {config.title}
//                     <Badge variant="secondary">
//                       {getTasksByStatus(status as Task["status"]).length}
//                     </Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Droppable droppableId={status}>
//                     {(provided, snapshot) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         className={`space-y-3 min-h-[200px] ${
//                           snapshot.isDraggingOver
//                             ? "bg-muted/50 p-2 rounded-lg"
//                             : ""
//                         }`}
//                       >
//                         {getTasksByStatus(status as Task["status"]).map(
//                           (task, index) => (
//                             <Draggable
//                               key={task.id}
//                               draggableId={task.id.toString()}
//                               index={index}
//                             >
//                               {(provided, snapshot) => (
//                                 <Card
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   className={`cursor-move transition-all ${
//                                     snapshot.isDragging
//                                       ? "shadow-lg rotate-3"
//                                       : ""
//                                   }`}
//                                 >
//                                   <CardContent className="p-4 space-y-2">
//                                     <div className="flex justify-between">
//                                       <h3 className="font-medium text-sm">
//                                         {task.title}
//                                       </h3>
//                                       <Badge
//                                         className={getPriorityColor(
//                                           task.priority
//                                         )}
//                                       >
//                                         {task.priority}
//                                       </Badge>
//                                     </div>
//                                     <p className="text-xs text-muted-foreground line-clamp-2">
//                                       {task.description}
//                                     </p>
//                                     <div className="flex justify-between text-xs text-muted-foreground">
//                                       <span className="font-medium">
//                                         {task.project.name}
//                                       </span>
//                                       {task.dueDate &&
//                                         isValid(parseISO(task.dueDate)) && (
//                                           <div className="flex items-center">
//                                             <Calendar className="mr-1 h-3 w-3" />
//                                             <span>
//                                               {format(
//                                                 parseISO(task.dueDate),
//                                                 "MMM d, yyyy"
//                                               )}
//                                             </span>
//                                           </div>
//                                         )}
//                                     </div>
//                                     {task.assignedUser && (
//                                       <div className="flex items-center space-x-2">
//                                         <Avatar className="h-6 w-6">
//                                           <AvatarImage
//                                             src={
//                                               task.assignedUser.avatar ||
//                                               "/placeholder.svg"
//                                             }
//                                           />
//                                           <AvatarFallback>
//                                             {(
//                                               task.assignedUser
//                                                 .firstName?.[0] ||
//                                               task.assignedUser.username[0]
//                                             ).toUpperCase()}
//                                             {(
//                                               task.assignedUser.lastName?.[0] ||
//                                               ""
//                                             ).toUpperCase()}
//                                           </AvatarFallback>
//                                         </Avatar>
//                                         <span className="text-xs">
//                                           {task.assignedUser.firstName ||
//                                           task.assignedUser.lastName
//                                             ? `${
//                                                 task.assignedUser.firstName ||
//                                                 ""
//                                               } ${
//                                                 task.assignedUser.lastName || ""
//                                               }`.trim()
//                                             : task.assignedUser.username}
//                                         </span>
//                                       </div>
//                                     )}
//                                   </CardContent>
//                                 </Card>
//                               )}
//                             </Draggable>
//                           )
//                         )}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </DragDropContext>
//       </div>
//     </DashboardLayout>
//   );
// }
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
        api.get("/tasks").catch(() => ({ data: [] })),
        api.get("/projects").catch(() => ({ data: [] })),
        api.get("/users").catch(() => ({ data: [] })),
      ]);

      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

      if (!projectsRes.data.length) {
        toast({
          title: "No Projects Loaded",
          description: "Project dropdown might be empty.",
        });
      }
      if (!usersRes.data.length) {
        toast({
          title: "No Users Loaded",
          description: "Assigned to section might be empty.",
        });
      }
      if (!tasksRes.data.length) {
        toast({
          title: "No Tasks Loaded",
          description: "No tasks were found. Create one!",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error loading data",
        description: err.message || "Failed to fetch data.",
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
        .filter((u) => u.id)
        .map((u) => ({
          id: String(u.id),
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
          email: u.email || `${u.username}@example.com`,
        })),
    [users]
  );

  const mappedProjects: MappedProject[] = useMemo(
    () =>
      projects
        .filter((p) => p.id)
        .map((p) => ({
          id: String(p.id),
          name: p.name,
          description: p.description || "No description provided",
        })),
    [projects]
  );

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
        assignedUserId: data.assignedUsers[0]?.id
          ? Number(data.assignedUsers[0].id)
          : undefined,
      };
      const res = await api.post("/tasks", payload);
      setTasks((prev) => [...prev, res.data]);
      setShowTaskForm(false);
      toast({
        title: "Task created successfully",
        description: `Task \"${res.data.title}\" added.`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to create task",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId as Task["status"];
    const originalTasks = JSON.parse(JSON.stringify(tasks));
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
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
        description: err.message,
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
    const colors: Record<string, string> = {
      HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      MEDIUM:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return (
      colors[priority] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const getTasksByStatus = (status: keyof typeof statusColumns) =>
    tasks.filter((task) => task.status === status);

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          Loading...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage your tasks visually</p>
          </div>
          <Button onClick={() => setShowTaskForm(true)}>
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
                    {config.title}{" "}
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
                                      <span>
                                        {task.project?.name || "No project"}
                                      </span>
                                      {task.dueDate &&
                                        isValid(parseISO(task.dueDate)) && (
                                          <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            <span>
                                              {format(
                                                parseISO(task.dueDate),
                                                "MMM d, yyyy"
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
