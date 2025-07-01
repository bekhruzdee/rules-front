// import { CheckCircle, Clock, AlertCircle, UserIcon } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   imagePath: string;
//   users: { id: string; name: string; email: string }[];
// }

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "TODO" | "IN_PROGRESS" | "DONE";
//   completed: boolean;
//   project: Project;
//   assignedUsers: { id: string; name: string; email: string }[];
// }

// interface TaskListProps {
//   tasks: Task[];
// }

// const statusConfig = {
//   TODO: {
//     icon: AlertCircle,
//     color: "bg-yellow-100 text-yellow-800",
//     label: "To Do",
//   },
//   IN_PROGRESS: {
//     icon: Clock,
//     color: "bg-blue-100 text-blue-800",
//     label: "In Progress",
//   },
//   DONE: {
//     icon: CheckCircle,
//     color: "bg-green-100 text-green-800",
//     label: "Done",
//   },
// };

// export function TaskList({ tasks }: TaskListProps) {
//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => {
//         const StatusIcon = statusConfig[task.status].icon;
//         return (
//           <Card key={task.id} className="hover:shadow-md transition-shadow">
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <CardTitle className="text-lg">{task.title}</CardTitle>
//                   <CardDescription>{task.description}</CardDescription>
//                 </div>
//                 <Badge className={statusConfig[task.status].color}>
//                   <StatusIcon className="w-3 h-3 mr-1" />
//                   {statusConfig[task.status].label}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">

//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">Project:</span>
//                   <Badge variant="outline">{task.project.name}</Badge>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <UserIcon className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm text-gray-600">Assigned to</span>
//                   </div>
//                   <div className="flex -space-x-2">
//                     {task.assignedUsers.slice(0, 3).map((user) => (
//                       <Avatar
//                         key={user.id}
//                         className="w-6 h-6 border-2 border-white"
//                       >
//                         <AvatarFallback className="text-xs">
//                           {user.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                     ))}
//                     {task.assignedUsers.length > 3 && (
//                       <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
//                         <span className="text-xs text-gray-600">
//                           +{task.assignedUsers.length - 3}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {task.completed && (
//                   <div className="flex items-center space-x-2 text-green-600">
//                     <CheckCircle className="h-4 w-4" />
//                     <span className="text-sm">Completed</span>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

// "use client";

// import { CheckCircle, Clock, AlertCircle, UserIcon } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   imagePath: string;
//   users: { id: string; name: string; email: string }[];
// }

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "TODO" | "IN_PROGRESS" | "DONE";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   completed: boolean;
//   project: Project;
//   assignedUsers: { id: string; name: string; email: string }[];
//   dueDate?: string;
// }

// interface TaskListProps {
//   tasks: Task[];
// }

// const statusConfig = {
//   TODO: {
//     icon: AlertCircle,
//     color: "bg-yellow-100 text-yellow-800",
//     label: "To Do",
//   },
//   IN_PROGRESS: {
//     icon: Clock,
//     color: "bg-blue-100 text-blue-800",
//     label: "In Progress",
//   },
//   DONE: {
//     icon: CheckCircle,
//     color: "bg-green-100 text-green-800",
//     label: "Done",
//   },
// };

// export function TaskList({ tasks }: TaskListProps) {
//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => {
//         const StatusIcon = statusConfig[task.status].icon;
//         return (
//           <Card key={task.id} className="hover:shadow-md transition-shadow">
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <CardTitle className="text-lg">{task.title}</CardTitle>
//                   <CardDescription>{task.description}</CardDescription>
//                 </div>
//                 <Badge className={statusConfig[task.status].color}>
//                   <StatusIcon className="w-3 h-3 mr-1" />
//                   {statusConfig[task.status].label}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">Project:</span>
//                   <Badge variant="outline">{task.project.name}</Badge>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <UserIcon className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm text-gray-600">Assigned to</span>
//                   </div>
//                   <div className="flex -space-x-2">
//                     {task.assignedUsers.slice(0, 3).map((user) => (
//                       <Avatar
//                         key={user.id}
//                         className="w-6 h-6 border-2 border-white"
//                       >
//                         <AvatarFallback className="text-xs">
//                           {user.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                     ))}
//                     {task.assignedUsers.length > 3 && (
//                       <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
//                         <span className="text-xs text-gray-600">
//                           +{task.assignedUsers.length - 3}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {task.completed && (
//                   <div className="flex items-center space-x-2 text-green-600">
//                     <CheckCircle className="h-4 w-4" />
//                     <span className="text-sm">Completed</span>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { CheckCircle, Clock, AlertCircle, UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  completed: boolean;
  project: Project;
  assignedUsers: User[];
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
}

const statusConfig = {
  TODO: {
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800",
    label: "To Do",
  },
  IN_PROGRESS: {
    icon: Clock,
    color: "bg-blue-100 text-blue-800",
    label: "In Progress",
  },
  DONE: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Done",
  },
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const StatusIcon = statusConfig[task.status].icon;
        return (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <Badge className={statusConfig[task.status].color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[task.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Project:</span>
                  <Badge variant="outline">{task.project.name}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Assigned to</span>
                  </div>
                  <div className="flex -space-x-2">
                    {task.assignedUsers.slice(0, 3).map((user) => (
                      <Avatar
                        key={user.id}
                        className="w-6 h-6 border-2 border-white"
                      >
                        <AvatarFallback className="text-xs">
                          {(
                            user.firstName?.[0] || user.username[0]
                          ).toUpperCase()}
                          {(user.lastName?.[0] || "").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {task.assignedUsers.length > 3 && (
                      <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{task.assignedUsers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {task.completed && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
