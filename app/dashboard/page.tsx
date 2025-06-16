"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import {
  Users,
  FolderOpen,
  CheckSquare,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  totalViolations: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        let baseStats: DashboardStats = {
          totalUsers: 0,
          totalProjects: 8,
          totalTasks: 24,
          totalViolations: 3,
          tasksByStatus: {
            TODO: 8,
            IN_PROGRESS: 10,
            DONE: 6,
          },
          recentActivity: [
            {
              id: 1,
              type: "task_completed",
              description: "Task 'Update user interface' was completed",
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              type: "project_created",
              description: "New project 'Mobile App' was created",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: 3,
              type: "user_assigned",
              description: "John Doe was assigned to 'Website Redesign'",
              createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
          ],
        };

        if (token === "demo-token") {
          const res = await api.get("/users/count");
          baseStats.totalUsers = res.data.total;
          setStats(baseStats);
          setLoading(false);
          return;
        }

        const [statsRes, usersRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/users/count"),
        ]);

        const updatedStats: DashboardStats = {
          ...statsRes.data,
          totalUsers: usersRes.data.total,
        };

        setStats(updatedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          totalUsers: 12,
          totalProjects: 8,
          totalTasks: 24,
          totalViolations: 3,
          tasksByStatus: {
            TODO: 8,
            IN_PROGRESS: 10,
            DONE: 6,
          },
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const taskCompletionRate = stats
    ? Math.round((stats.tasksByStatus.DONE / (stats.totalTasks || 1)) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalProjects || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
              <p className="text-xs text-muted-foreground">
                {taskCompletionRate}% completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalViolations || 0}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
              <CardDescription>
                Overview of task completion across all projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.tasksByStatus.DONE || 0} tasks
                  </span>
                </div>
                <Progress value={taskCompletionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.tasksByStatus.TODO || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">To Do</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.tasksByStatus.IN_PROGRESS || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    In Progress
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.tasksByStatus.DONE || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity?.length ? (
                  stats.recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
