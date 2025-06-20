"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function TotalProjectsCard() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotalProjects = async () => {
      try {
        const res = await api.get("/projects/count");
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error("Failed to fetch project count:", error);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProjects();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Projects</CardTitle>
        <FolderOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : total}</div>
        <p className="text-xs text-muted-foreground">Active projects</p>
      </CardContent>
    </Card>
  );
}
