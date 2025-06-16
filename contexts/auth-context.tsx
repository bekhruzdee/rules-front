"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface User {
  id: number;
  username: string;
  email?: string;
  role: "ADMIN" | "USER";
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          if (token === "demo-token") {
            // Demo mode - set a demo user
            setUser({
              id: 1,
              username: "demo",
              email: "demo@example.com",
              role: "USER",
              firstName: "Demo",
              lastName: "User",
            });
            setLoading(false);
            return;
          }

          // Try to verify token with backend
          try {
            const response = await api.get("/auth/profile");
            setUser(response.data);
          } catch (error: any) {
            console.log("Backend not available, removing invalid token");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      setUser(userData);

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });

      router.push("/dashboard");
    } catch (error: any) {
      // Check if it's a network error (backend not available)
      if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        !error.response
      ) {
        // Demo login - accept any credentials
        const demoUser = {
          id: 1,
          username: username,
          email: `${username}@example.com`,
          role: (username.toLowerCase() === "admin" ? "ADMIN" : "USER") as
            | "ADMIN"
            | "USER",
          firstName: username.charAt(0).toUpperCase() + username.slice(1),
          lastName: "Demo",
        };

        localStorage.setItem("token", "demo-token");
        setUser(demoUser);

        toast({
          title: "Demo Mode",
          description: `Welcome ${demoUser.firstName}! Backend not available, using demo data.`,
        });

        router.push("/dashboard");
        return;
      }

      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Send only username and password to backend
      const response = await api.post("/auth/register", {
        username: userData.username,
        password: userData.password,
      });

      toast({
        title: "Registration successful",
        description: "Please log in with your credentials",
      });

      router.push("/login");
    } catch (error: any) {
      // Check if it's a network error (backend not available)
      if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        !error.response
      ) {
        toast({
          title: "Demo Mode",
          description: "Backend not available. Please try logging in instead.",
        });
        router.push("/login");
        return;
      }

      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Registration failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
