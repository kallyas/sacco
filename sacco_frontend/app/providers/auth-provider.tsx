import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/auth.service";
import { useToast } from "~/hooks/use-toast";
import type { AxiosResponse } from "axios";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AxiosResponse<AuthResponse>>;
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Define the routes that authenticated users should not access
const AUTH_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch current user data
  const {
    data: userData,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setAuthChecked(true);
        return null;
      }

      try {
        const response = await authService.getCurrentUser();
        setAuthChecked(true);
        return response;
      } catch (error) {
        // Clear invalid tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAuthChecked(true);
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (response) => {
      localStorage.setItem("access_token", response.data.tokens.access_token);
      localStorage.setItem("refresh_token", response.data.tokens.refresh_token);
      queryClient.setQueryData(["auth-user"], response.data.user);

      // Redirect to the original intended route or dashboard
      const intendedPath = location.state?.from || "/dashboard";
      navigate(intendedPath, { replace: true });

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await authService.register(data);
      return response;
    },
    onSuccess: (response) => {
      localStorage.setItem("access_token", response.data.tokens.access_token);
      localStorage.setItem("refresh_token", response.data.tokens.refresh_token);
      queryClient.setQueryData(["auth-user"], response.data.user);
      navigate("/dashboard");
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error.response?.data?.message || "Unable to create account",
      });
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          await authService.logout();
        } catch (error) {
          // Continue with logout even if the API call fails
          console.error("Error during logout:", error);
        }
      }

      // Always clear local storage and query cache
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
    },
    onSuccess: () => {
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await authService.updateProfile(data);
      return response;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
  });

  // Token refresh effect
  useEffect(() => {
    if (!userData) return;

    const REFRESH_INTERVAL = 1000 * 60 * 14; // 14 minutes
    const EXPIRY_THRESHOLD = 1000 * 60; // 1 minute before expiry

    const refreshToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return;

      try {
        const response = await authService.refreshToken();
        if (response.data.tokens) {
          localStorage.setItem(
            "access_token",
            response.data.tokens.access_token
          );
          localStorage.setItem(
            "refresh_token",
            response.data.tokens.refresh_token
          );
        }
      } catch (error) {
        // Silent failure - will be handled during the next API call that requires auth
        console.error("Failed to refresh token:", error);

        // If token refresh fails, logout the user
        await logoutMutation.mutateAsync();
      }
    };

    // Initial token refresh to ensure we have a valid token
    refreshToken();

    // Set up interval for token refresh
    const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [userData]);

  // Route protection effect for redirecting authenticated users away from auth pages
  useEffect(() => {
    if (!authChecked || isLoading) return;

    const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    if (userData && isAuthOnlyRoute) {
      // Redirect authenticated users away from auth pages
      navigate("/dashboard", { replace: true });
    }
  }, [userData, authChecked, isLoading, location.pathname, navigate]);

  const value: AuthContextType = {
    user: userData,
    isLoading: isLoading || !authChecked,
    isAuthenticated: !!userData,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    register: (data: RegisterData) => registerMutation.mutateAsync(data),
    updateProfile: (data: Partial<User>) =>
      updateProfileMutation.mutateAsync(data),
  };

  // Don't render anything until we've checked authentication
  if (!authChecked && isLoading) {
    return null; // Or return a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Route guard component for protected routes
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return loading state while checking authentication
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

// Route guard component for public-only routes (prevents authenticated users from accessing)
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Return loading state while checking authentication
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (user) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
