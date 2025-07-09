"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export default function TotalViolationsCard() {
  const [totalViolations, setTotalViolations] = useState<number>(0);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("Token not found. Cannot fetch violations.");
          return;
        }

        const res = await api.get("/violations/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTotalViolations(res.data.total);
      } catch (error) {
        console.error("Failed to fetch violations count:", error);
        setTotalViolations(0); // fallback for UI
      }
    };

    fetchViolations();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Violations</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalViolations}</div>
        <p className="text-xs text-muted-foreground">This month</p>
      </CardContent>
    </Card>
  );
}
