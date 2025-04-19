import React from "react";
import { Box, CircularProgress } from "@mui/material";
import AppRoutes from "./routes";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { loading } = useAuth();

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

  return <AppRoutes />;
};

export default App;
