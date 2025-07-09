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
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   filePath?: string; // image, pdf, word, txt hammasini qamrab oladi
//   users: User[];
//   createdAt?: string;
// }

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editProject, setEditProject] = useState<Project | null>(null);
//   const { toast } = useToast();

//   const fetchUsers = async () => {
//     try {
//       const res = await api.get("/users/all");
//       const data = res.data.data;
//       setUsers(
//         data.map((u: any) => ({
//           id: u.id.toString(),
//           name: u.username,
//         }))
//       );
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to fetch users",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const response = await api.get("/projects");
//       const data = response.data.data;
//       if (Array.isArray(data)) {
//         setProjects(
//           data.map((project: any) => ({
//             id: project.id.toString(),
//             name: project.name,
//             description: project.description || "",
//             filePath: project.imagePath
//               ? `${process.env.NEXT_PUBLIC_API_URL}${project.imagePath}`
//               : "",
//             users: project.users.map((u: any) => ({
//               id: u.id.toString(),
//               name: u.username,
//             })),
//             createdAt: project.created_at,
//           }))
//         );
//       } else {
//         setProjects([]);
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to fetch projects",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = async (data: any) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("description", data.description);
//       formData.append(
//         "userIds",
//         JSON.stringify(data.users.map((u: User) => parseInt(u.id, 10)))
//       );
//       if (data.file) {
//         formData.append("file", data.file);
//       }

//       const response = await api.post("/projects", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       await fetchProjects();
//       setShowForm(false);
//       toast({ title: "Success", description: response.data.message });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to create project",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdateProject = async (data: any) => {
//     if (!editProject) return;
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("description", data.description);
//       formData.append(
//         "userIds",
//         JSON.stringify(data.users.map((u: User) => parseInt(u.id, 10)))
//       );
//       if (data.file) {
//         formData.append("file", data.file);
//       }

//       const response = await api.patch(
//         `/projects/${editProject.id}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       await fetchProjects();
//       setEditProject(null);
//       setShowForm(false);
//       toast({ title: "Success", description: response.data.message });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to update project",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteProject = async (id: string) => {
//     try {
//       const response = await api.delete(`/projects/${id}`);
//       await fetchProjects();
//       toast({ title: "Success", description: response.data.message });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to delete project",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchProjects();
//   }, []);

//   return (
//     <DashboardLayout>
//       {showForm && (
//         <ProjectForm
//           users={users}
//           onSubmit={editProject ? handleUpdateProject : handleCreateProject}
//           onCancel={() => {
//             setShowForm(false);
//             setEditProject(null);
//           }}
//           initialData={
//             editProject
//               ? {
//                   name: editProject.name,
//                   description: editProject.description,
//                   imagePath: editProject.filePath || "",
//                   selectedUsers: editProject.users.map((u) => u.id),
//                 }
//               : undefined
//           }
//         />
//       )}

//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
//             <p className="text-muted-foreground">
//               Manage and track your team’s projects
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
//           <ProjectList
//             projects={projects}
//             onEdit={(project) => {
//               setEditProject(project);
//               setShowForm(true);
//             }}
//             onDelete={handleDeleteProject}
//           />
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
}

interface Project {
  id: string;
  name: string;
  description: string;
  filePath?: string;
  users: User[];
  createdAt?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/all");
      const data = res.data.data;
      setUsers(
        data.map((u: any) => ({
          id: u.id.toString(),
          name: u.username,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      const data = response.data.data;
      if (Array.isArray(data)) {
        setProjects(
          data.map((project: any) => ({
            id: project.id.toString(),
            name: project.name,
            description: project.description || "",
            filePath: project.imagePath
              ? `${process.env.NEXT_PUBLIC_API_URL}${project.imagePath}`
              : "",
            users: project.users.map((u: any) => ({
              id: u.id.toString(),
              name: u.username,
            })),
            createdAt: project.created_at,
          }))
        );
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append(
        "userIds",
        JSON.stringify(data.users.map((u: User) => parseInt(u.id, 10)))
      );
      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await api.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchProjects();
      setShowForm(false);
      toast({ title: "Success", description: response.data.message });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (data: any) => {
    if (!editProject) return;
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append(
        "userIds",
        JSON.stringify(data.users.map((u: User) => parseInt(u.id, 10)))
      );
      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await api.patch(
        `/projects/${editProject.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await fetchProjects();
      setEditProject(null);
      setShowForm(false);
      toast({ title: "Success", description: response.data.message });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      await fetchProjects();
      toast({ title: "Success", description: response.data.message });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  return (
    <DashboardLayout>
      {showForm && (
        <ProjectForm
          users={users}
          onSubmit={editProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowForm(false);
            setEditProject(null);
          }}
          initialData={
            editProject
              ? {
                  name: editProject.name,
                  description: editProject.description,
                  imagePath: editProject.filePath || "",
                  selectedUsers: editProject.users.map((u) => u.id),
                }
              : undefined
          }
        />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your team’s projects
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
          <ProjectList
            projects={projects}
            onEdit={(project) => {
              setEditProject(project);
              setShowForm(true);
            }}
            onDelete={handleDeleteProject}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
