import { Users, Edit, Trash2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  imagePath?: string;
  users: User[];
  createdAt?: string;
}

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const isImage = (path?: string) => {
    if (!path) return false;
    const ext = path.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const previewUrl = project.imagePath || "/placeholder.svg";
        const previewFileName = project.imagePath?.split("/").pop();

        return (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {isImage(project.imagePath) ? (
                  <img
                    src={previewUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                ) : project.imagePath ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <FileText className="w-6 h-6 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-600 break-all">
                      {previewFileName}
                    </span>
                  </div>
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardTitle className="text-lg font-semibold">
                {project.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Team</span>
                </div>
                <div className="flex -space-x-2">
                  {project.users.slice(0, 3).map((user) => (
                    <Avatar
                      key={user.id}
                      className="w-6 h-6 border-2 border-white text-xs"
                    >
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.users.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +{project.users.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this project?")
                    ) {
                      onDelete(project.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
