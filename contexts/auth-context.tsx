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

interface RegisterData {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        setUser(token)

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
      console.log(response.data);

      const { access_token, userData } = response.data;
      console.log(userData);

      localStorage.setItem("token", access_token);
      setUser(userData);

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });

      router.replace("/dashboard");
    } catch (error: any) {
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
        isAdmin,
        isUser,
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
