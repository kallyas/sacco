import React from 'react';
import { Box, Container, Paper, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  p: 4,
                }}
              >
                <Typography variant="h3" component="h1" gutterBottom color="primary">
                  SACCO Management System
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  A comprehensive solution for managing Savings and Credit Cooperative Organizations.
                  Easily handle member management, savings accounts, loans, transactions, and more.
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {isMobile && (
                <Box mb={4}>
                  <Typography variant="h4" component="h1" gutterBottom color="primary" align="center">
                    SACCO
                  </Typography>
                </Box>
              )}
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SACCO Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;