// DashboardLayout.tsx
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  Badge,
  Stack,
  Button,
  Tooltip,
  Container
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => setOpen(!open);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  const menuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/dashboard",
      description: "Overview of account activities" 
    },
    { 
      text: "Members", 
      icon: <PersonIcon />, 
      path: "/members",
      description: "Manage cooperative members" 
    },
    { 
      text: "Loans", 
      icon: <MonetizationOnIcon />, 
      path: "/loans",
      description: "Track and manage all loans" 
    },
    { 
      text: "Savings", 
      icon: <AccountBalanceIcon />, 
      path: "/savings",
      description: "Monitor savings accounts" 
    },
    { 
      text: "Transactions", 
      icon: <ReceiptIcon />, 
      path: "/transactions",
      description: "View financial transactions" 
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              SACCO Management System
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Help center">
              <IconButton color="inherit" sx={{ color: "rgba(255,255,255,0.85)" }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ color: "rgba(255,255,255,0.85)" }}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ height: 24, bgcolor: 'rgba(255,255,255,0.15)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
              <Typography sx={{ mr: 1, color: "#fff", fontWeight: 500 }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Avatar
                alt={`${user?.first_name} ${user?.last_name}`}
                src="/static/images/avatar/1.jpg"
                sx={{ 
                  width: 38, 
                  height: 38,
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              />
            </Box>
          </Stack>
          
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            sx={{ 
              '& .MuiPaper-root': { 
                borderRadius: 2,
                minWidth: 200,
                boxShadow: theme.customShadows?.dropdown || '0px 10px 30px rgba(0, 0, 0, 0.15)',
                mt: 1.5
              } 
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigateTo("/profile")}>
              <ListItemIcon>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem onClick={() => navigateTo("/settings")}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Account Settings" />
            </MenuItem>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                Sign Out
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100%", 
            backgroundColor: "white" 
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                component="img"
                src="/logo.png" 
                alt="SACCO Logo"
                sx={{ height: 40, width: 40, mr: 1 }}
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  background: theme.customGradients?.primary || 'linear-gradient(135deg, #1e5631 0%, #2a724a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                SACCO
              </Typography>
            </Box>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
          
          <Divider />
          
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: 'rgba(30, 86, 49, 0.03)', 
              borderRadius: 2,
              mx: 2,
              mt: 2
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                alt={`${user?.first_name} ${user?.last_name}`}
                src="/static/images/avatar/1.jpg"
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Member ID: {user?.id}
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 4, pb: 1 }}>
            MAIN MENU
          </Typography>
          
          <Box sx={{ overflow: "auto", flexGrow: 1, px: 2 }}>
            <List>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={item.description} placement="right" arrow>
                      <ListItemButton
                        selected={isActive}
                        onClick={() => navigateTo(item.path)}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            "& .MuiListItemIcon-root": { color: "#fff" },
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            }
                          },
                          "&:hover": {
                            backgroundColor: isActive 
                              ? theme.palette.primary.dark 
                              : 'rgba(30, 86, 49, 0.08)',
                          },
                        }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            minWidth: 40, 
                            color: isActive ? "inherit" : theme.palette.primary.main 
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {item.text}
                            </Typography>
                          }
                        />
                        {isActive && (
                          <Box 
                            sx={{ 
                              width: 4, 
                              height: 35, 
                              borderRadius: '0 4px 4px 0', 
                              backgroundColor: theme.palette.secondary.main,
                              position: 'absolute',
                              left: 0
                            }} 
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Card 
              sx={{ 
                p: 2, 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                borderRadius: 3,
                boxShadow: 'none',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Need Assistance?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Our support team is ready to help you
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  }
                }}
              >
                Contact Support
              </Button>
            </Card>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;