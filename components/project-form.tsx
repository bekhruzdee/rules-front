"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
}

interface ProjectFormProps {
  users: User[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    description: string;
    imagePath?: string;
    selectedUsers: string[];
  };
}

export function ProjectForm({
  users,
  onSubmit,
  onCancel,
  initialData,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imagePath: initialData?.imagePath || "",
    selectedUsers: initialData?.selectedUsers || [],
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "file" | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imagePath || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        imagePath: initialData.imagePath || "",
        selectedUsers: initialData.selectedUsers,
      });
      setImagePreview(initialData.imagePath || null);
      setPreviewType(initialData.imagePath ? "image" : null);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      users: users.filter((user) => formData.selectedUsers.includes(user.id)),
      file,
    });

    if (!initialData) {
      setFormData({
        name: "",
        description: "",
        imagePath: "",
        selectedUsers: [],
      });
      setFile(null);
      setImagePreview(null);
      setPreviewType(null);
    }
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();

      const reader = new FileReader();
      reader.onloadend = () => {
        if (ext && ["jpg", "jpeg", "png"].includes(ext)) {
          setPreviewType("image");
          setImagePreview(reader.result as string);
        } else {
          setPreviewType("file");
          setImagePreview(selectedFile.name);
        }
        setFormData((prev) => ({ ...prev, imagePath: "" }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {initialData ? "Edit Project" : "Create New Project"}
            </CardTitle>
            <CardDescription>
              {initialData
                ? "Update project details and team members"
                : "Fill in the project details and assign team members"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter project name"
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
                placeholder="Describe the project goals and objectives"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File (jpg, png, pdf, docx...)</Label>
              <div className="flex gap-2">
                <Input
                  id="imagePath"
                  value={formData.imagePath}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      imagePath: e.target.value,
                    }));
                    setFile(null);
                    setImagePreview(e.target.value || null);
                    setPreviewType("image");
                  }}
                  placeholder="Or enter image URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  {previewType === "image" ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded max-h-40 object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.svg")
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{imagePreview}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Assign Team Members</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={formData.selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Selected Members:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedUsers.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return user ? (
                        <Badge key={userId} variant="secondary">
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
                disabled={!formData.name || !formData.description}
              >
                {initialData ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
