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
