import React, { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/auth.service";
import { useToast } from "~/hooks/use-toast";
import type { AxiosResponse } from "axios";

interface AuthContextType {
  user: Pick<AuthResponse, "user"> | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<AuthResponse, any>>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AxiosResponse<AuthResponse, any>>;
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
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

  // Fetch current user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return null;
      try {
        const response = await authService.getCurrentUser();
        return response;
      } catch (error) {
        localStorage.removeItem("token");
        return null;
      }
    },
    retry: false,
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
      await authService.logout();
      localStorage.removeItem("token");
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

  // Route protection effect
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    const token = localStorage.getItem("token");

    // Handle route protection logic
    if (!user && !isPublicRoute && token) {
      // Token exists but user data fetch failed
      localStorage.removeItem("token");
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    } else if (!user && !isPublicRoute && !token) {
      // No token and trying to access protected route
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    } else if (user && isPublicRoute) {
      // User is authenticated but trying to access public route
      navigate("/dashboard");
    }
  }, [user, isLoading, location.pathname, navigate]);

  // Token refresh effect
  useEffect(() => {
    if (!user) return;

    const REFRESH_INTERVAL = 1000 * 60 * 14; // 14 minutes

    const refreshToken = async () => {
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
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please login again to continue.",
        });
      }
    };

    const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    register: (data: RegisterData) => registerMutation.mutateAsync(data),
    updateProfile: (data: Partial<User>) =>
      updateProfileMutation.mutateAsync(data),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
