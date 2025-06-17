"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* You can add breadcrumbs or page title here */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Enhanced User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/20 focus:ring-primary/30 transition-all duration-300 ease-in-out hover:scale-105 focus:scale-105"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 shadow-lg ring-2 ring-background/50 hover:ring-primary/20 transition-all duration-300">
                    <AvatarImage
                      src={user?.avatar || "/placeholder-user.jpg"}
                      alt={user?.username || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-inner">
                      {user?.firstName?.[0] && user?.lastName?.[0]
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background shadow-sm animate-pulse"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-2 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm"
              sideOffset={8}
            >
              {/* User Info Header */}
              <div className="px-3 py-2 mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                      {user?.firstName?.[0] && user?.lastName?.[0]
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      {user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {user?.role?.toLowerCase()} account
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* User Profile */}
              <DropdownMenuItem
                className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 focus:bg-accent/50"
                onClick={handleProfileClick}
              >
                <User className="mr-3 h-4 w-4" />
                User Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <LogOut className="mr-3 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
