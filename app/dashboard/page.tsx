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
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Clock } from "lucide-react";

// ✅ External cards
import TotalUsersCard from "@/components/cards/TotalUsersCard";
import TotalProjectsCard from "@/components/cards/TotalProjectsCard";
import TotalTasksCard from "@/components/cards/TotalTasksCard";
import TotalViolationsCard from "@/components/cards/TotalViolationsCard";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
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

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

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
        const [tasksCountRes, statsRes, usersRes] = await Promise.all([
          api.get("/tasks/count"),
          api.get("/dashboard/stats"),
          api.get("/users/count"),
        ]);

        const updatedStats: DashboardStats = {
          ...statsRes.data,
          totalUsers: usersRes.data.total,
          totalTasks: tasksCountRes.data.total,
        };

        setStats(updatedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          totalUsers: 0,
          totalProjects: 0,
          totalTasks: 0,
          tasksByStatus: {
            TODO: 0,
            IN_PROGRESS: 0,
            DONE: 0,
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
      </DashboardLayout>
    );
  }

  const taskCompletionRate =
    stats && stats.totalTasks > 0
      ? Math.min(
          100,
          Math.round((stats.tasksByStatus.DONE / stats.totalTasks) * 100)
        )
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
          <TotalUsersCard />
          <TotalProjectsCard />
          <TotalTasksCard />
          <TotalViolationsCard />
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
                    {stats?.tasksByStatus.DONE || 0} / {stats?.totalTasks || 0}{" "}
                    tasks
                  </span>
                </div>
                <Progress value={taskCompletionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Completion rate: {taskCompletionRate}%
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {Object.entries(stats?.tasksByStatus || {}).map(
                  ([status, count]) => {
                    const color =
                      status === "TODO"
                        ? "text-yellow-600"
                        : status === "IN_PROGRESS"
                        ? "text-blue-600"
                        : "text-green-600";
                    const percent = stats?.totalTasks
                      ? Math.round((count / stats.totalTasks) * 100)
                      : 0;
                    return (
                      <div key={status} className="text-center">
                        <div className={`text-2xl font-bold ${color}`}>
                          {count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {status.replace("_", " ")} ({percent}%)
                        </div>
                      </div>
                    );
                  }
                )}
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
                  stats.recentActivity.slice(0, 5).map((activity) => {
                    const color =
                      activity.type === "task_completed"
                        ? "text-green-600"
                        : activity.type === "project_created"
                        ? "text-blue-600"
                        : "text-yellow-600";
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <Clock className={`h-4 w-4 ${color} mt-0.5`} />
                        <div>
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
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

