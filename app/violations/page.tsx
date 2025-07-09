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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Violation {
  id: number;
  type: string;
  description: string;
  points: number;
  salaryDeduction: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await api.get("/violations");
        setViolations(response.data);
      } catch (error) {
        console.error("Failed to fetch violations:", error);
        toast({
          title: "Error",
          description: "Failed to fetch violations from server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [toast]);

  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      violation.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || violation.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const getSeverityColor = (points: number) => {
    if (points >= 10)
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    if (points >= 5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  };

  const getSeverityLabel = (points: number) => {
    if (points >= 10) return "High";
    if (points >= 5) return "Medium";
    return "Low";
  };

  const uniqueTypes = [...new Set(violations.map((v) => v.type))];

  if (loading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Violations</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Violation
            </Button>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-muted rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-32" />
                        <div className="h-3 bg-muted rounded w-24" />
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Violations</h1>
            <p className="text-muted-foreground">
              Track and manage disciplinary violations
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Violation
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search violations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredViolations.map((violation) => (
            <Card
              key={violation.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={violation.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {violation.user.firstName?.[0] ||
                          violation.user.username[0]}
                        {violation.user.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {violation.user.firstName} {violation.user.lastName} ||{" "}
                        {violation.user.username}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{violation.type}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(violation.createdAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(violation.points)}>
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      {getSeverityLabel(violation.points)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {violation.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">
                          {violation.points} points
                        </span>
                      </div>
                      {violation.salaryDeduction > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-600">
                            -${violation.salaryDeduction}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredViolations.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {searchTerm || filterType !== "all"
                ? "No violations found"
                : "No violations"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No violations have been recorded yet"}
            </p>
            {!searchTerm && filterType === "all" && (
              <div className="mt-6">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Violation
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
