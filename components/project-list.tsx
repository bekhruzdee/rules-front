// import { Users } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
//   users: User[];
//   tasks: any[];
//   comments: any[];
// }

// interface ProjectListProps {
//   projects: Project[];
// }

// export function ProjectList({ projects }: ProjectListProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {projects.map((project) => (
//         <Card key={project.id} className="hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
//               <img
//                 src={project.imagePath || "/placeholder.svg"}
//                 alt={project.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <CardTitle className="text-lg">{project.name}</CardTitle>
//             <CardDescription className="line-clamp-2">
//               {project.description}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {/* Team Members */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Users className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">Team</span>
//                 </div>
//                 <div className="flex -space-x-2">
//                   {project.users.slice(0, 3).map((user) => (
//                     <Avatar
//                       key={user.id}
//                       className="w-6 h-6 border-2 border-white"
//                     >
//                       <AvatarFallback className="text-xs">
//                         {user.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                   ))}
//                   {project.users.length > 3 && (
//                     <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
//                       <span className="text-xs text-gray-600">
//                         +{project.users.length - 3}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>{project.tasks.length} tasks</span>
//                 <span>{project.comments.length} comments</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }
import { Users, Edit, Trash2 } from "lucide-react";
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={project.imagePath || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
            </div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Team</span>
                </div>
                <div className="flex -space-x-2">
                  {project.users.slice(0, 3).map((user) => (
                    <Avatar
                      key={user.id}
                      className="w-6 h-6 border-2 border-white"
                    >
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.users.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{project.users.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                >
                  <Edit className="h-4 w-4 mr-2" />
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
