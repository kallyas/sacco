import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  restricted = false,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If authenticated and page is restricted (like login page)
  // redirect to dashboard or the page user was trying to access
  if (isAuthenticated && restricted) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
