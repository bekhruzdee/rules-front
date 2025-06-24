// "use client";

// import { useEffect, useState, useRef } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { api } from "@/lib/api";
// import {
//   Plus,
//   Users,
//   Calendar,
//   FileText,
//   FolderOpen,
//   X,
//   Upload,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { useToast } from "@/hooks/use-toast";

// interface Project {
//   id: number;
//   name: string;
//   description: string;
//   status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "IN_PROGRESS";
//   createdAt: string;
//   updatedAt: string;
//   assignedUsers: Array<{
//     id: number;
//     username: string;
//     firstName?: string;
//     lastName?: string;
//     avatar?: string;
//   }>;
//   _count: {
//     tasks: number;
//     comments: number;
//     files: number;
//   };
// }

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const { toast } = useToast();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [imageUrl, setImageUrl] = useState("");

//   const [users] = useState([
//     { id: "1", name: "John Doe", email: "john@example.com" },
//     { id: "2", name: "Jane Smith", email: "jane@example.com" },
//     { id: "3", name: "Mike Johnson", email: "mike@example.com" },
//   ]);

//   const handleCreateProject = (data: any) => {
//     setProjects((prev) => [
//       {
//         id: Date.now(),
//         name: data.name,
//         description: data.description,
//         status: "ACTIVE",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         assignedUsers: data.users.map((u: any) => ({
//           id: +u.id,
//           username: u.name.toLowerCase().replace(" ", ""),
//           firstName: u.name.split(" ")[0],
//           lastName: u.name.split(" ")[1] || "",
//         })),
//         _count: {
//           tasks: 0,
//           comments: 0,
//           files: 0,
//         },
//       },
//       ...prev,
//     ]);
//     setShowForm(false);
//     setImagePreview(null);
//     setImageUrl("");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (token === "demo-token") {
//           const mockProjects: Project[] = [
//             {
//               id: 1,
//               name: "Website Redesign",
//               description:
//                 "Complete overhaul of the company website with modern design and improved user experience",
//               status: "ACTIVE",
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               assignedUsers: [
//                 {
//                   id: 1,
//                   username: "johndoe",
//                   firstName: "John",
//                   lastName: "Doe",
//                 },
//                 {
//                   id: 2,
//                   username: "janedoe",
//                   firstName: "Jane",
//                   lastName: "Doe",
//                 },
//               ],
//               _count: { tasks: 12, comments: 8, files: 5 },
//             },
//           ];
//           setProjects(mockProjects);
//           setLoading(false);
//           return;
//         }
//         const response = await api.get("/projects");
//         const data = response.data;
//         if (Array.isArray(data)) {
//           setProjects(data);
//         } else {
//           setProjects([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//         toast({
//           title: "Demo Mode",
//           description: "Using mock data - connect to your backend API",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, [toast]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "ACTIVE":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       case "COMPLETED":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
//       case "ON_HOLD":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
//     }
//   };

//   return (
//     <DashboardLayout>
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
//           <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Create New Project</CardTitle>
//                 <CardDescription>
//                   Fill in the project details and assign team members
//                 </CardDescription>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowForm(false)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const form = e.target as HTMLFormElement;
//                   const formData = new FormData(form);
//                   const selected = users.filter((u) =>
//                     formData.getAll("users").includes(u.id)
//                   );
//                   handleCreateProject({
//                     name: formData.get("name"),
//                     description: formData.get("description"),
//                     imagePath: imageUrl || imagePreview,
//                     users: selected,
//                   });
//                 }}
//                 className="space-y-6"
//               >
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Project Name *</Label>
//                   <Input
//                     name="name"
//                     required
//                     placeholder="Enter project name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description *</Label>
//                   <textarea
//                     name="description"
//                     required
//                     className="w-full p-2 border rounded min-h-[80px]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="imagePath">Project Image</Label>
//                   <div className="flex flex-col gap-2">
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter image URL or path"
//                         value={imageUrl}
//                         onChange={(e) => setImageUrl(e.target.value)}
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => fileInputRef.current?.click()}
//                       >
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload
//                       </Button>
//                     </div>
//                     <Input
//                       type="file"
//                       ref={fileInputRef}
//                       name="imagePath"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           const reader = new FileReader();
//                           reader.onloadend = () => {
//                             setImagePreview(reader.result as string);
//                           };
//                           reader.readAsDataURL(file);
//                         }
//                       }}
//                     />
//                   </div>
//                   {(imagePreview || imageUrl) && (
//                     <img
//                       src={imageUrl || imagePreview || ""}
//                       alt="preview"
//                       className="mt-2 rounded max-h-40 object-cover"
//                     />
//                   )}
//                 </div>
//                 <div className="space-y-4">
//                   <Label>Assign Team Members</Label>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {users.map((user) => (
//                       <div
//                         key={user.id}
//                         className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
//                       >
//                         <Checkbox
//                           name="users"
//                           value={user.id}
//                           id={`user-${user.id}`}
//                         />
//                         <div className="flex items-center space-x-2 flex-1">
//                           <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                             <User className="h-4 w-4 text-gray-600" />
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium">{user.name}</p>
//                             <p className="text-xs text-gray-500">
//                               {user.email}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-3 pt-6 border-t">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowForm(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit">Create Project</Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Project List */}
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
//             <p className="text-muted-foreground">
//               Manage and track your team's projects
//             </p>
//           </div>
//           <Button onClick={() => setShowForm(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             New Project
//           </Button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {Array.isArray(projects) &&
//             projects.map((project) => (
//               <Card
//                 key={project.id}
//                 className="hover:shadow-lg border border-muted transition-shadow rounded-xl"
//               >
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                       <CardTitle className="text-lg font-semibold">
//                         {project.name}
//                       </CardTitle>
//                       <Badge className={getStatusColor(project.status)}>
//                         {project.status.replace("_", " ")}
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="line-clamp-2 mt-2 text-sm text-muted-foreground">
//                     {project.description}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between text-sm text-muted-foreground">
//                       <div className="flex items-center">
//                         <FileText className="mr-1 h-4 w-4" />
//                         {project._count.tasks} tasks
//                       </div>
//                       <div className="flex items-center">
//                         <Calendar className="mr-1 h-4 w-4" />
//                         {new Date(project.createdAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex items-center mb-2">
//                         <Users className="mr-2 h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm font-medium">Team</span>
//                       </div>
//                       <div className="flex -space-x-2">
//                         {project.assignedUsers.slice(0, 4).map((user) => (
//                           <Avatar
//                             key={user.id}
//                             className="h-8 w-8 border-2 border-background"
//                           >
//                             <AvatarImage
//                               src={user.avatar || "/placeholder.svg"}
//                             />
//                             <AvatarFallback className="text-xs">
//                               {user.firstName?.[0]}
//                               {user.lastName?.[0] ||
//                                 user.username[0].toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                         ))}
//                         {project.assignedUsers.length > 4 && (
//                           <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
//                             +{project.assignedUsers.length - 4}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         asChild
//                         variant="outline"
//                         size="sm"
//                         className="flex-1"
//                       >
//                         <Link href={`/projects/${project.id}`}>
//                           View Details
//                         </Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//           {projects.length === 0 && (
//             <div className="text-center py-12">
//               <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
//               <h3 className="mt-2 text-sm font-semibold text-foreground">
//                 No projects
//               </h3>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Get started by creating a new project.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import { Button } from "@/components/ui/button";
// import { Plus, FolderOpen } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { api } from "@/lib/api";
// import { ProjectForm } from "@/components/project-form";
// import { ProjectList } from "@/components/project-list";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   imagePath: string;
//   status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "IN_PROGRESS";
//   createdAt: string;
//   updatedAt: string;
//   users: User[];
//   tasks: any[];
//   comments: any[];
// }

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const { toast } = useToast();

//   const users: User[] = [
//     { id: "1", name: "John Doe", email: "john@example.com" },
//     { id: "2", name: "Jane Smith", email: "jane@example.com" },
//     { id: "3", name: "Mike Johnson", email: "mike@example.com" },
//   ];

//   const handleCreateProject = (data: any) => {
//     const newProject: Project = {
//       id: Date.now().toString(),
//       name: data.name,
//       description: data.description,
//       imagePath: data.imagePath || "",
//       status: "ACTIVE",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       users: data.users,
//       tasks: [],
//       comments: [],
//     };
//     setProjects((prev) => [newProject, ...prev]);
//     setShowForm(false);
//     toast({
//       title: "Success",
//       description: "Project created successfully!",
//     });
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (token === "demo-token") {
//           const mockProjects: Project[] = [
//             {
//               id: "1",
//               name: "Website Redesign",
//               description:
//                 "Complete overhaul of the company website with modern design and improved user experience",
//               imagePath: "",
//               status: "ACTIVE",
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               users: [
//                 { id: "1", name: "John Doe", email: "john@example.com" },
//                 { id: "2", name: "Jane Smith", email: "jane@example.com" },
//               ],
//               tasks: Array(12).fill({}),
//               comments: Array(8).fill({}),
//             },
//           ];
//           setProjects(mockProjects);
//           setLoading(false);
//           return;
//         }
//         const response = await api.get("/projects");
//         const data = response.data;
//         if (Array.isArray(data)) {
//           setProjects(
//             data.map((project: any) => ({
//               id: project.id.toString(),
//               name: project.name,
//               description: project.description,
//               imagePath: project.imagePath || "",
//               status: project.status,
//               createdAt: project.createdAt,
//               updatedAt: project.updatedAt,
//               users: project.assignedUsers.map((u: any) => ({
//                 id: u.id.toString(),
//                 name: `${u.firstName} ${u.lastName || ""}`.trim(),
//                 email: u.email || `${u.username}@example.com`,
//               })),
//               tasks: project._count.tasks
//                 ? Array(project._count.tasks).fill({})
//                 : [],
//               comments: project._count.comments
//                 ? Array(project._count.comments).fill({})
//                 : [],
//             }))
//           );
//         } else {
//           setProjects([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//         toast({
//           title: "Demo Mode",
//           description: "Using mock data - connect to your backend API",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, [toast]);

//   return (
//     <DashboardLayout>
//       {showForm && (
//         <ProjectForm
//           users={users}
//           onSubmit={handleCreateProject}
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
//             <p className="text-muted-foreground">
//               Manage and track your team's projects
//             </p>
//           </div>
//           <Button onClick={() => setShowForm(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             New Project
//           </Button>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">Loading...</div>
//         ) : projects.length === 0 ? (
//           <div className="text-center py-12">
//             <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
//             <h3 className="mt-2 text-sm font-semibold text-foreground">
//               No projects
//             </h3>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Get started by creating a new project.
//             </p>
//           </div>
//         ) : (
//           <ProjectList projects={projects} />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ProjectForm } from "@/components/project-form";
import { ProjectList } from "@/components/project-list";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "IN_PROGRESS";
  createdAt: string;
  updatedAt: string;
  users: User[];
  tasks: any[];
  comments: any[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const users: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  ];

  const handleCreateProject = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append(
        "userIds",
        JSON.stringify(data.users.map((u: User) => u.id))
      );
      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await api.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newProject: Project = {
        id: response.data.data.id.toString(),
        name: response.data.data.name,
        description: response.data.data.description,
        imagePath: response.data.data.imagePath || "",
        status: "ACTIVE",
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.createdAt,
        users: response.data.data.users.map((u: any) => ({
          id: u.id.toString(),
          name: u.username,
          email: `${u.username}@example.com`,
        })),
        tasks: [],
        comments: [],
      };

      setProjects((prev) => [newProject, ...prev]);
      setShowForm(false);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        const data = response.data;
        if (Array.isArray(data)) {
          setProjects(
            data.map((project: any) => ({
              id: project.id.toString(),
              name: project.name,
              description: project.description || "",
              imagePath: project.imagePath || "",
              status: project.status || "ACTIVE",
              createdAt: project.created_at,
              updatedAt: project.updated_at || project.created_at,
              users: project.users.map((u: any) => ({
                id: u.id.toString(),
                name: u.username,
                email: `${u.username}@example.com`,
              })),
              tasks: project.tasks ? Array(project.tasks.length).fill({}) : [],
              comments: project.comments
                ? Array(project.comments.length).fill({})
                : [],
            }))
          );
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast({
          title: "Error",
          description: "Failed to fetch projects. Using demo data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  return (
    <DashboardLayout>
      {showForm && (
        <ProjectForm
          users={users}
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your team's projects
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              No projects
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new project.
            </p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </DashboardLayout>
  );
}
