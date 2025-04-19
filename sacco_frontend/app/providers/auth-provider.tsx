import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/auth.service";
import { useToast } from "~/hooks/use-toast";
import { AxiosError } from "axios";
import type { User, LoginCredentials, RegisterData } from "~/types/auth";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
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
const AUTH_RESTRICTED_ROUTES = [
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
      try {
        const response = await authService.getCurrentUser();
        return response.data;
      } catch (error) {
        // If 401, it means token is invalid/expired and not refreshable
        if ((error as AxiosError).response?.status === 401) {
          // Will be handled by API interceptor
          return null;
        }
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    enabled: authChecked, // Don't fetch until initial auth check is done
  });

  // Check for existing tokens on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken && !refreshToken) {
        // No tokens at all
        setAuthChecked(true);
        return;
      }

      // We have tokens, set authChecked to true to enable the user query
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem("access_token", data.tokens.access_token);
      localStorage.setItem("refresh_token", data.tokens.refresh_token);

      // Update user data in query cache
      queryClient.setQueryData(["auth-user"], data.user);

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
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.tokens.access_token);
      localStorage.setItem("refresh_token", data.tokens.refresh_token);
      queryClient.setQueryData(["auth-user"], data.user);
      navigate("/dashboard");
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error.response?.data?.message || "Unable to create account",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        // Proceed with local logout even if API call fails
        console.error("Error during logout:", error);
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
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
  });

  // Route protection effect for redirecting authenticated users away from auth pages
  useEffect(() => {
    if (isLoading || !authChecked) return;

    const isAuthRestrictedRoute = AUTH_RESTRICTED_ROUTES.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    if (userData && isAuthRestrictedRoute) {
      // Redirect authenticated users away from auth pages
      navigate("/dashboard", { replace: true });
    }
  }, [userData, authChecked, isLoading, location.pathname, navigate]);

  const value: AuthContextType = {
    user: userData,
    isLoading: isLoading || !authChecked,
    isAuthenticated: !!userData,
    login: (credentials: LoginCredentials) =>
      loginMutation.mutateAsync(credentials),
    logout: () => logoutMutation.mutateAsync(),
    register: (data: RegisterData) => registerMutation.mutateAsync(data),
    updateProfile: (data: Partial<User>) =>
      updateProfileMutation.mutateAsync(data),
  };

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
