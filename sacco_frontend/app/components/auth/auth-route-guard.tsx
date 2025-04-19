// app/components/auth/auth-route-guard.tsx
import type { ReactNode, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "~/providers/auth-provider";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * A route guard that protects routes from unauthenticated users
 * Redirects to login if not authenticated
 */
export function RequireAuth({ children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the current path for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

/**
 * A route guard that prevents authenticated users from accessing
 * routes like login, register, etc.
 */
export function PublicOnlyRoute({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <AuthLoadingScreen />;
  }
  
  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

/**
 * A route guard that checks if the user has the required role
 */
export function RoleGuard({ 
  children, 
  allowedRoles 
}: AuthGuardProps & { allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <AuthLoadingScreen />;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
}

/**
 * A loading screen component to show when checking authentication
 */
export function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Verifying your credentials...</p>
    </div>
  );
}

/**
 * Unauthorized access page
 */
export function UnauthorizedPage() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Unauthorized Access</h1>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Current role: {user?.role}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Attempted to access: {location.state?.from || "unknown page"}
          </p>
        </div>
      </div>
    </div>
  );
}