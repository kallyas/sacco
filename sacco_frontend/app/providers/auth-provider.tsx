// app/providers/auth-provider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { authService } from "~/services/auth.service";
import { useToast } from "~/hooks/use-toast";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthTokens,
} from "~/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Routes configuration
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const AUTH_ONLY_ROUTES = ["/dashboard", "/loans", "/savings", "/settings"];
const HOME_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";

// Token management utilities
const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 14; // 14 minutes
const TOKEN_EXPIRY_THRESHOLD = 1000 * 60; // 1 minute before expiry

const getTokens = (): AuthTokens | null => {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  if (!access_token || !refresh_token) return null;

  return { access_token, refresh_token };
};

const setTokens = (tokens: AuthTokens): void => {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
};

const clearTokens = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + TOKEN_EXPIRY_THRESHOLD / 1000;
  } catch (error) {
    return true;
  }
};

// Main Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);

  // User data query
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const tokens = getTokens();
      if (!tokens) {
        setAuthChecked(true);
        return null;
      }

      try {
        const response = await authService.getCurrentUser();
        setAuthChecked(true);
        return response.data;
      } catch (error) {
        // Clear invalid tokens
        clearTokens();
        setAuthChecked(true);
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setTokens(data.tokens);
      queryClient.setQueryData(["auth-user"], data.user);

      // Redirect to the original intended route or dashboard
      const intendedPath = location.state?.from || HOME_ROUTE;
      navigate(intendedPath, { replace: true });

      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${data.user.first_name} ${data.user.last_name}.`,
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await authService.register(data);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setTokens(data.tokens);
      queryClient.setQueryData(["auth-user"], data.user);
      navigate(HOME_ROUTE);

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const tokens = getTokens();
      if (tokens?.refresh_token) {
        try {
          await authService.logout();
        } catch (error) {
          // Continue with logout even if the API call fails
          console.error("Error during logout:", error);
        }
      }

      clearTokens();
      queryClient.clear();
    },
    onSuccess: () => {
      navigate(LOGIN_ROUTE);
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
    onSuccess: (updatedUser: User) => {
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

    const refreshToken = async () => {
      const tokens = getTokens();
      if (!tokens) return;

      // Check if access token is expired or close to expiry
      if (isTokenExpired(tokens.access_token)) {
        try {
          const response = await authService.refreshToken();
          if (response.data.tokens) {
            setTokens(response.data.tokens);
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
          await logoutMutation.mutateAsync();
        }
      }
    };

    // Initial token refresh to ensure we have a valid token
    refreshToken();

    // Set up interval for token refresh
    const intervalId = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [userData]);

  // Route protection effect for redirecting based on auth state
  useEffect(() => {
    if (!authChecked || isUserLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    const isProtectedRoute = AUTH_ONLY_ROUTES.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    // Redirect authenticated users away from auth pages
    if (userData && isPublicRoute) {
      navigate(HOME_ROUTE, { replace: true });
    }

    // Redirect unauthenticated users away from protected pages
    if (!userData && isProtectedRoute) {
      navigate(LOGIN_ROUTE, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [userData, authChecked, isUserLoading, location.pathname, navigate]);

  // Create context value
  const value: AuthContextType = {
    user: userData || null,
    isLoading: isUserLoading || !authChecked,
    isAuthenticated: !!userData,
    login: (credentials: LoginCredentials) =>
      loginMutation.mutateAsync(credentials),
    logout: () => logoutMutation.mutateAsync(),
    register: (data: RegisterData) => registerMutation.mutateAsync(data),
    updateProfile: (data: Partial<User>) =>
      updateProfileMutation.mutateAsync(data),
  };

  // Don't render anything until we've checked authentication
  if (!authChecked && isUserLoading) {
    return null; // Or return a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
