"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { api } from "@/lib/api";

export default function TotalTasksCard() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks/count");
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error("Failed to fetch tasks count:", error);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        <CheckSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : total}</div>
        <p className="text-xs text-muted-foreground">All Tasks</p>
      </CardContent>
    </Card>
  );
}
