"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Edit3,
  Save,
  X,
  Calendar,
  User,
  CheckCircle,
  Clock,
  FolderOpen,
  MessageSquare,
  Award,
  TrendingUp,
  Shield,
} from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
  })

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
      setLoading(false)
    }
  }, [user])

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log("Saving user data:", editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
    }
    setIsEditing(false)
  }

  // Mock data for demonstration
  const stats = {
    tasksCompleted: 24,
    totalTasks: 30,
    activeProjects: 3,
    totalProjects: 8,
    commentsPosted: 45,
    completionRate: 80,
  }

  const recentActivity = [
    { action: "Completed task", item: "Update user interface", time: "2 hours ago" },
    { action: "Created project", item: "Mobile App Redesign", time: "1 day ago" },
    { action: "Posted comment", item: "Design Review Meeting", time: "2 days ago" },
    { action: "Updated task", item: "API Integration", time: "3 days ago" },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-muted-foreground">Manage your account settings and view your activity</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Information Card */}
          <Card className="md:col-span-2 lg:col-span-2 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-gray-800 shadow-xl">
                      <AvatarImage
                        src={user?.avatar || "/placeholder-user.jpg"}
                        alt={user?.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold shadow-inner">
                        {user?.firstName?.[0] && user?.lastName?.[0]
                          ? `${user.firstName[0]}${user.lastName[0]}`
                          : user?.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-800 shadow-lg flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {user?.username}
                      <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"} className="ml-2">
                        <Shield className="h-3 w-3 mr-1" />
                        {user?.role}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm">Online</span>
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={editedUser.firstName}
                          onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={editedUser.lastName}
                          onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">@{user?.username}</span>
                    </div>
                    {user?.firstName && user?.lastName && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined December 2023</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Task Completion</span>
                  <span className="font-bold">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-3" />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Tasks</span>
                  <span className="font-medium text-green-600">
                    {stats.tasksCompleted}/{stats.totalTasks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-medium text-blue-600">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Comments</span>
                  <span className="font-medium text-purple-600">{stats.commentsPosted}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">Total projects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.commentsPosted}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        <span className="text-blue-600">{activity.action}</span>{" "}
                        <span className="text-muted-foreground">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badge */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Award className="h-5 w-5" />
                Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Top Performer</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                {stats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
