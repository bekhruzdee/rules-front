// "use client";

// import type React from "react";
// import { useState } from "react";
// import { X, UserIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
// }

// export interface TaskFormData {
//   id?: number;
//   title: string;
//   description: string;
//   status: "TODO" | "IN_PROGRESS" | "DONE";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   completed: boolean;
//   projectId: string;
//   assignedUsers: { id: string }[];
//   dueDate?: string;
// }

// interface TaskFormProps {
//   users: User[];
//   projects: Project[];
//   onSubmit: (data: TaskFormData) => void;
//   onCancel: () => void;
//   initialData?: TaskFormData;
// }

// const statusOptions = [
//   { value: "TODO", label: "To Do" },
//   { value: "IN_PROGRESS", label: "In Progress" },
//   { value: "DONE", label: "Done" },
// ];

// const priorityOptions = [
//   { value: "LOW", label: "Low" },
//   { value: "MEDIUM", label: "Medium" },
//   { value: "HIGH", label: "High" },
// ];

// export function TaskForm({
//   users,
//   projects,
//   onSubmit,
//   onCancel,
//   initialData,
// }: TaskFormProps) {
//   const [formData, setFormData] = useState<TaskFormData>(
//     initialData || {
//       title: "",
//       description: "",
//       status: "TODO",
//       priority: "MEDIUM",
//       completed: false,
//       projectId: "",
//       assignedUsers: [],
//       dueDate: "",
//     }
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleUserToggle = (userId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       assignedUsers: prev.assignedUsers.some((u) => u.id === userId)
//         ? prev.assignedUsers.filter((u) => u.id !== userId)
//         : [...prev.assignedUsers, { id: userId }],
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>
//               {initialData ? "Edit Task" : "Create New Task"}
//             </CardTitle>
//             <CardDescription>
//               {initialData
//                 ? "Update task details"
//                 : "Add a new task and assign it to team members"}
//             </CardDescription>
//           </div>
//           <Button variant="ghost" size="sm" onClick={onCancel}>
//             <X className="h-4 w-4" />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="title">Task Title *</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 placeholder="Enter task title"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 placeholder="Describe what needs to be done"
//                 rows={3}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Project *</Label>
//               <Select
//                 value={formData.projectId}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, projectId: value }))
//                 }
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={
//                       projects.length > 0
//                         ? "Select a project"
//                         : "No projects available"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.length > 0 ? (
//                     projects.map((project) => (
//                       <SelectItem key={project.id} value={project.id}>
//                         <div>
//                           <p className="font-medium">{project.name}</p>
//                           <p className="text-sm text-gray-500 truncate">
//                             {project.description}
//                           </p>
//                         </div>
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <p className="p-2 text-sm text-muted-foreground">
//                       No projects to select.
//                     </p>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     status: value as typeof formData.status,
//                   }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statusOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Priority</Label>
//               <Select
//                 value={formData.priority}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     priority: value as typeof formData.priority,
//                   }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {priorityOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="dueDate">Due Date</Label>
//               <Input
//                 id="dueDate"
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
//                 }
//                 className="w-full"
//               />
//             </div>

//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="completed"
//                 checked={formData.completed}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, completed: !!checked }))
//                 }
//               />
//               <Label htmlFor="completed">Mark as completed</Label>
//             </div>

//             <div className="space-y-4">
//               <Label>Assign to Team Members</Label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {users.length > 0 ? (
//                   users.map((user) => (
//                     <div
//                       key={user.id}
//                       className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
//                     >
//                       <Checkbox
//                         id={`task-user-${user.id}`}
//                         checked={formData.assignedUsers.some(
//                           (u) => u.id === user.id
//                         )}
//                         onCheckedChange={() => handleUserToggle(user.id)}
//                       />
//                       <div className="flex items-center space-x-2 flex-1">
//                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                           <UserIcon className="h-4 w-4 text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium">{user.name}</p>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-muted-foreground col-span-full">
//                     No users available.
//                   </p>
//                 )}
//               </div>

//               {formData.assignedUsers.length > 0 && (
//                 <div className="space-y-2">
//                   <Label className="text-sm">Assigned to:</Label>
//                   <div className="flex flex-wrap gap-2">
//                     {formData.assignedUsers.map((userObj) => {
//                       const user = users.find((u) => u.id === userObj.id);
//                       return user ? (
//                         <Badge key={user.id} variant="secondary">
//                           {user.name}
//                         </Badge>
//                       ) : null;
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-3 pt-6 border-t">
//               <Button type="button" variant="outline" onClick={onCancel}>
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={
//                   !formData.title ||
//                   !formData.description ||
//                   !formData.projectId
//                 }
//               >
//                 {initialData ? "Update Task" : "Create Task"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState } from "react";
import { X, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

export interface TaskFormData {
  id?: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  completed: boolean;
  projectId: string;
  assignedUsers: { id: string }[];
  dueDate?: string;
}

interface TaskFormProps {
  users: User[];
  projects: Project[];
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
}

const statusOptions = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export function TaskForm({
  users,
  projects,
  onSubmit,
  onCancel,
  initialData,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(
    initialData || {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      completed: false,
      projectId: "",
      assignedUsers: [],
      dueDate: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.some((u) => u.id === userId)
        ? prev.assignedUsers.filter((u) => u.id !== userId)
        : [...prev.assignedUsers, { id: userId }],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {initialData ? "Edit Task" : "Create New Task"}
            </CardTitle>
            <CardDescription>
              {initialData
                ? "Update task details"
                : "Add a new task and assign it to team members"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what needs to be done"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, projectId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      projects.length > 0
                        ? "Select a project"
                        : "No projects available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {project.description}
                          </p>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <p className="p-2 text-sm text-muted-foreground">
                      No projects to select.
                    </p>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as typeof formData.status,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value as typeof formData.priority,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, completed: !!checked }))
                }
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>

            <div className="space-y-4">
              <Label>Assign to Team Members</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`task-user-${user.id}`}
                        checked={formData.assignedUsers.some(
                          (u) => u.id === user.id
                        )}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full">
                    No users available.
                  </p>
                )}
              </div>

              {formData.assignedUsers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Assigned to:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.assignedUsers.map((userObj) => {
                      const user = users.find((u) => u.id === userObj.id);
                      return user ? (
                        <Badge key={user.id} variant="secondary">
                          {user.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !formData.title ||
                  !formData.description ||
                  !formData.projectId
                }
              >
                {initialData ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
