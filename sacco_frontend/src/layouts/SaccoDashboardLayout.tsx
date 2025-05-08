// ImprovedSaccoDashboardLayout.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
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
  MenuItem as MuiMenuItem,
  Badge,
  Stack,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
  Container,
  styled,
  CssBaseline,
  Fade,
  Chip,
  DrawerProps,
} from "@mui/material";

// Icons import
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ExpandMore,
  ExpandLess,
  Analytics as AnalyticsIcon,
  Handshake as HandshakeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  CreditCard as CreditCardIcon,
  DarkMode,
  LightMode,
  Search as SearchIcon,
} from "@mui/icons-material";

// Configurable constants
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 68;
const DRAWER_BREAKPOINT = "lg";

// Types
interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface NotificationType {
  id: string;
  message: string;
  time: string;
  status: "new" | "read" | "urgent";
  type: "loan" | "savings" | "meeting" | "system";
  link: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: (user: UserType | null) => boolean;
  badge?: number;
  description?: string;
}

// Styled components with improved styling
interface CustomDrawerProps extends DrawerProps {
  collapsedwidth?: number;
  drawerwidth?: number;
  iscollapsed?: boolean;
}

const ModernDrawer = styled(Drawer, {
  shouldForwardProp: (prop) =>
    !["open", "collapsedwidth", "drawerwidth", "iscollapsed"].includes(
      String(prop)
    ),
})<CustomDrawerProps>(({ theme, open, collapsedwidth, drawerwidth, iscollapsed }) => ({
  width: iscollapsed ? collapsedwidth : drawerwidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflowX: "hidden",
  "& .MuiDrawer-paper": {
    width: iscollapsed ? collapsedwidth : drawerwidth,
    transition: theme.transitions.create(["width"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.sharp,
    }),
    background: `linear-gradient(145deg, #1e5631, #2a724a)`,
    color: "#ffffff",
    overflowX: "hidden",
    borderRight: 0,
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shortest,
  }),
  background: "#ffffff",
  color: "#333333",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "flex-end",
  borderBottom: `1px solid ${alpha("#ffffff", 0.1)}`,
  minHeight: 64,
}));

const StyledListItem = styled(ListItemButton)<{ depth?: number; active?: number; iscollapsed?: number }>(
  ({ theme, depth = 0, active, iscollapsed }) => ({
    margin: theme.spacing(0.5, iscollapsed ? 0.5 : 1),
    padding: theme.spacing(
      1.2,
      iscollapsed ? 0.75 : 2,
      1.2,
      iscollapsed ? 0.75 : depth * 1.5 + 2
    ),
    borderRadius: 8,
    color: "#ffffff",
    backgroundColor: active ? alpha("#ffffff", 0.15) : "transparent",
    "&:hover": {
      backgroundColor: active ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08),
    },
    "& .MuiListItemIcon-root": {
      color: "#ffffff",
      minWidth: iscollapsed ? 36 : 40,
      marginRight: iscollapsed ? 0 : theme.spacing(1),
    },
    "& .MuiListItemText-primary": {
      fontSize: "0.875rem",
      fontWeight: active ? 600 : 400,
      color: "#ffffff",
    },
    "& .MuiSvgIcon-root": {
      color: "#ffffff",
    },
    position: "relative", // For active indicator
    transition: theme.transitions.create(["background-color", "padding"], {
      duration: theme.transitions.duration.standard,
    }),
  })
);

const UserSection = styled(Box)<{ iscollapsed: boolean }>(({ theme, iscollapsed }) => ({
  margin: iscollapsed ? theme.spacing(1, 0.5) : theme.spacing(1.5, 1),
  padding: iscollapsed ? theme.spacing(1) : theme.spacing(1.5),
  borderRadius: 8,
  backgroundColor: alpha("#ffffff", 0.07),
  display: "flex",
  alignItems: "center",
  justifyContent: iscollapsed ? "center" : "flex-start",
  gap: theme.spacing(1.5),
  color: "#ffffff",
  cursor: "pointer",
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: alpha("#ffffff", 0.12),
  },
}));

const UserButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  borderRadius: 24,
  padding: theme.spacing(0.5, 2),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.short,
  }),
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: "#ffffff",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const ActiveIndicator = styled(Box)(({ theme }) => ({
  width: 3,
  height: 24,
  borderRadius: "0 4px 4px 0",
  backgroundColor: "#ffd700",
  position: "absolute",
  left: 0,
}));

const SupportCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha("#ffd700", 0.1),
  borderRadius: 8,
  border: `1px solid ${alpha("#ffd700", 0.3)}`,
  margin: theme.spacing(2, 1),
}));

const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha("#f5f5f5", 0.9),
  borderRadius: 24,
  width: "100%",
  maxWidth: 500,
  marginRight: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.text.primary, 0.54),
}));

const StyledInputBase = styled("input")(({ theme }) => ({
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
  height: 40,
  fontSize: "0.9rem",
  "&:focus": {
    outline: "none",
  },
}));

// Mock data - replace with your actual data fetching logic
const mockUser: UserType = {
  id: "M12345",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@example.com",
  role: "Member",
};

const mockNotifications: NotificationType[] = [
  {
    id: "1",
    message: "Your loan application has been approved",
    time: "5 minutes ago",
    status: "new",
    type: "loan",
    link: "/loans/details/123",
  },
  {
    id: "2",
    message: "Upcoming quarterly meeting on Friday, 10:00 AM",
    time: "2 hours ago",
    status: "new",
    type: "meeting",
    link: "/events",
  },
  {
    id: "3",
    message: "Your savings account has earned interest",
    time: "Yesterday",
    status: "read",
    type: "savings",
    link: "/savings",
  },
];

// Menu items configuration
const getMenuItems = (user: UserType | null): MenuItem[] => [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    description: "Overview and key metrics",
  },
  {
    id: "members",
    name: "Members",
    icon: <GroupIcon />,
    path: "/members",
    badge: 2,
    description: "Manage SACCO members",
  },
  {
    id: "financials",
    name: "Financials",
    icon: <MonetizationOnIcon />,
    children: [
      {
        id: "loans",
        name: "Loans",
        icon: <CreditCardIcon />,
        path: "/loans",
        description: "Manage loan applications",
      },
      {
        id: "savings",
        name: "Savings",
        icon: <AccountBalanceIcon />,
        path: "/savings",
        description: "Track savings accounts",
      },
      {
        id: "transactions",
        name: "Transactions",
        icon: <ReceiptIcon />,
        path: "/transactions",
        description: "View all transactions",
      },
    ],
    description: "Financial management tools",
  },
  {
    id: "reports",
    name: "Reports",
    icon: <AnalyticsIcon />,
    path: "/reports",
    description: "Generate financial reports",
  },
  {
    id: "meetings",
    name: "Meetings",
    icon: <EventIcon />,
    path: "/meetings",
    description: "Schedule and manage meetings",
  },
  {
    id: "documents",
    name: "Documents",
    icon: <DescriptionIcon />,
    path: "/documents",
    description: "Manage SACCO documents",
  },
  {
    id: "partners",
    name: "Partners",
    icon: <HandshakeIcon />,
    path: "/partners",
    description: "View partnership programs",
  },
];

// Filter menu items based on user permissions
const filterMenuItems = (
  items: MenuItem[],
  user: UserType | null
): MenuItem[] => {
  if (!items) return [];

  return items
    .filter((item) => {
      // Check if user has permission
      if (item.permission && typeof item.permission === "function") {
        if (!item.permission(user)) return false;
      }
      return true;
    })
    .map((item) => {
      // Process children recursively
      const processedItem = { ...item };
      if (item.children) {
        processedItem.children = filterMenuItems(item.children, user);
      }
      return processedItem;
    })
    .filter((item) => {
      // Remove parent items with no visible children
      if (item.children && item.children.length === 0 && !item.path) {
        return false;
      }
      return true;
    });
};

// MenuItem Component
const MenuItem: React.FC<{
  item: MenuItem;
  isCollapsed: boolean;
  depth?: number;
  activeRoute: string;
  onItemClick?: () => void;
}> = ({ item, isCollapsed, depth = 0, activeRoute, onItemClick }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isActive = activeRoute === item.path;
  const hasChildren = (item.children ?? []).length > 0;

  // Check if any child is active
  const isChildActive = useCallback(
    (children: MenuItem[]): boolean => {
      return children.some(
        (child) =>
          child.path === activeRoute ||
          (child.children && isChildActive(child.children))
      );
    },
    [activeRoute]
  );

  // Expand parent menu if a child is active
  useEffect(() => {
    if (hasChildren) {
      const hasActiveChild = isChildActive(item.children as MenuItem[]);
      if (hasActiveChild) {
        setOpen(true);
      }
    }
  }, [activeRoute, hasChildren, item.children, isChildActive]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
      if (onItemClick) onItemClick();
    }
  };

  const menuItem = (
    <StyledListItem
      onClick={handleClick}
      depth={depth}
      active={isActive ? 1 : 0}
      iscollapsed={Number(isCollapsed)}
    >
      {isActive && <ActiveIndicator />}

      {item.icon && (
        <ListItemIcon>
          {isCollapsed ? (
            <Tooltip title={item.name} placement="right">
              <Badge
                color="error"
                badgeContent={item.badge}
                max={99}
                invisible={!item.badge}
              >
                {item.icon}
              </Badge>
            </Tooltip>
          ) : (
            <Badge
              color="error"
              badgeContent={item.badge}
              max={99}
              invisible={!item.badge}
            >
              {item.icon}
            </Badge>
          )}
        </ListItemIcon>
      )}

      {!isCollapsed && (
        <>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: isActive ? 600 : 400,
            }}
          />
          {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
        </>
      )}
    </StyledListItem>
  );

  if (!hasChildren) {
    return menuItem;
  }

  return (
    <>
      {menuItem}
      {!isCollapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child, index) => (
              <MenuItem
                key={`${child.id}-${index}`}
                item={child}
                isCollapsed={isCollapsed}
                depth={depth + 1}
                activeRoute={activeRoute}
                onItemClick={onItemClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// Main Dashboard Layout Component
const ImprovedSaccoDashboardLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up(DRAWER_BREAKPOINT));

  // State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage if available, otherwise false
    const savedState = localStorage.getItem("saccoSidebarCollapsed");
    return savedState ? savedState === "true" : false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(mockUser); // Replace with your auth hook
  const [notifications, setNotifications] =
    useState<NotificationType[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(
    mockNotifications.filter((n) => n.status !== "read").length
  );

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<null | HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeRoute = location.pathname;

  // Get filtered menu items
  const filteredMenuItems = React.useMemo(() => {
    const items = getMenuItems(user);
    return filterMenuItems(items, user);
  }, [user]);

  // Fixed: Drawer toggle handler - properly handles the transition
  const handleDrawerToggle = useCallback(() => {
    if (isDesktop) {
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      localStorage.setItem(
        "saccoSidebarCollapsed",
        newCollapsedState.toString()
      );
    } else {
      setMobileOpen(!mobileOpen);
    }
  }, [isDesktop, isCollapsed, mobileOpen]);

  // Menu handlers
  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    []
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleNotificationsOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) =>
      setNotificationsAnchor(event.currentTarget),
    []
  );
  const handleNotificationsClose = useCallback(
    () => setNotificationsAnchor(null),
    []
  );

  // User action handlers
  const handleLogout = useCallback(() => {
    // Your logout logic
    handleMenuClose();
    navigate("/login");
  }, [handleMenuClose, navigate]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    handleMenuClose();
  }, [handleMenuClose]);

  const handleProfileClick = useCallback(() => {
    navigate("/profile");
    if (!isDesktop) setMobileOpen(false);
  }, [navigate, isDesktop]);

  // Notification handlers
  const handleNotificationClick = useCallback(
    (notification: NotificationType) => {
      // Mark as read logic
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, status: "read" } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      handleNotificationsClose();
      navigate(notification.link);
    },
    [navigate, handleNotificationsClose]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
    setUnreadCount(0);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Close mobile drawer when changing routes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  // Fixed: Properly handle AppBar styling based on drawer state
  const getAppBarStyles = useCallback(
    () => ({
      width: {
        xs: "100%",
        [DRAWER_BREAKPOINT]: `calc(100% - ${
          isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH
        }px)`,
      },
      ml: {
        xs: 0,
        [DRAWER_BREAKPOINT]: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
      },
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
      }),
    }),
    [isCollapsed, theme.transitions]
  );

  // Drawer content
  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="subtitle1"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: 700,
            color: "#ffffff",
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s ease",
            ml: 2,
          }}
        >
          SACCO System
        </Typography>

        {isDesktop && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "inherit",
              mr: 1,
            }}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </DrawerHeader>

      {/* User profile section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: isCollapsed ? "center" : "flex-start",
        }}
      >
        <Tooltip
          title={isCollapsed ? `${user?.firstName} ${user?.lastName}` : ""}
        >
          <UserSection
            iscollapsed={isCollapsed}
            onClick={handleProfileClick}
          >
            <Avatar
              src={user?.profileImage}
              alt={`${user?.firstName} ${user?.lastName}`}
              sx={{
                width: 40,
                height: 40,
                bgcolor: alpha("#ffffff", 0.9),
                color: "#1e5631",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </Avatar>

            {!isCollapsed && (
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                  Member ID: {user?.id || "ID12345"}
                </Typography>
              </Box>
            )}
          </UserSection>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: alpha("#ffffff", 0.1), my: 1 }} />

      {/* Main menu items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {!isCollapsed && (
          <Typography
            variant="caption"
            color="inherit"
            sx={{
              opacity: 0.6,
              px: 3,
              py: 1,
              display: "block",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            MAIN MENU
          </Typography>
        )}

        <List
          sx={{
            pt: isCollapsed ? 1 : 0.5,
            px: isCollapsed ? 0.5 : 1,
          }}
        >
          {filteredMenuItems.map((item, index) => (
            <MenuItem
              key={`${item.id}-${index}`}
              item={item}
              isCollapsed={isCollapsed}
              activeRoute={activeRoute}
              onItemClick={() => !isDesktop && setMobileOpen(false)}
            />
          ))}
        </List>
      </Box>

      {/* Support card */}
      {!isCollapsed && (
        <SupportCard>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Need Assistance?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Our support team is ready to help
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="small"
            sx={{
              bgcolor: "rgba(255, 215, 0, 0.8)",
              color: "#333",
              "&:hover": {
                bgcolor: "rgba(255, 215, 0, 1)",
              },
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Contact Support
          </Button>
        </SupportCard>
      )}

      {/* Bottom section with help and logout */}
      <Box sx={{ mt: "auto", mb: 2, mx: isCollapsed ? 0.5 : 1 }}>
        <List sx={{ p: 0 }}>
          {isCollapsed ? (
            <>
              <ListItem disablePadding>
                <Tooltip title="Help Center">
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      justifyContent: "center",
                      py: 1,
                    }}
                    onClick={() => navigate("/help")}
                  >
                    <HelpIcon fontSize="small" />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <ListItem disablePadding>
                <Tooltip title="Logout">
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      justifyContent: "center",
                      py: 1,
                    }}
                    onClick={handleLogout}
                  >
                    <LogoutIcon fontSize="small" />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    py: 1,
                  }}
                  onClick={() => navigate("/help")}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <HelpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Help Center" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    py: 1,
                  }}
                  onClick={handleLogout}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </>
  );

  // Fixed: Get current page title dynamically
  const getCurrentPageTitle = () => {
    switch (activeRoute) {
      case "/dashboard":
        return "Dashboard";
      case "/members":
        return "Member Management";
      case "/loans":
        return "Loan Management";
      case "/savings":
        return "Savings Accounts";
      case "/transactions":
        return "Transactions";
      case "/reports":
        return "Reports";
      case "/meetings":
        return "Meetings";
      case "/documents":
        return "Documents";
      case "/partners":
        return "Partners";
      case "/profile":
        return "My Profile";
      case "/settings":
        return "Settings";
      default:
        return "SACCO Management System";
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* AppBar */}
      <StyledAppBar position="fixed" sx={getAppBarStyles()}>
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: "#1e5631",
              display: { xs: "flex", [DRAWER_BREAKPOINT]: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: "#1e5631",
              display: { xs: "none", sm: "block" },
              mr: 3,
            }}
          >
            {getCurrentPageTitle()}
          </Typography>

          {/* Search Bar */}
          <SearchBar>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchBar>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right section with notifications and user menu */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                onClick={handleNotificationsOpen}
                sx={{ color: "#1e5631" }}
              >
                <NotificationBadge badgeContent={unreadCount} max={9}>
                  <NotificationsIcon />
                </NotificationBadge>
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={handleThemeToggle}
              sx={{
                color: "#1e5631",
                display: { xs: "flex", sm: "none" },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <UserButton
              onClick={handleMenuOpen}
              endIcon={
                <Avatar
                  src={user?.profileImage}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#1e5631",
                    color: "#ffffff",
                  }}
                >
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </Avatar>
              }
              sx={{
                display: { xs: "none", sm: "flex" },
                ml: 1,
                color: "#1e5631",
              }}
            >
              <Stack alignItems="flex-start" spacing={-0.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role || "Member"}
                </Typography>
              </Stack>
            </UserButton>
          </Stack>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer - Mobile (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", [DRAWER_BREAKPOINT]: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            background: `linear-gradient(145deg, #1e5631, #2a724a)`,
            color: "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer - Desktop (persistent) */}
      <ModernDrawer
        variant="permanent"
        open={true}
        drawerwidth={DRAWER_WIDTH}
        collapsedwidth={COLLAPSED_WIDTH}
        iscollapsed={isCollapsed}
        sx={{
          display: { xs: "none", [DRAWER_BREAKPOINT]: "block" },
        }}
      >
        {drawerContent}
      </ModernDrawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          width: {
            xs: "100%",
            [DRAWER_BREAKPOINT]: `calc(100% - ${
              isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH
            }px)`,
          },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "#f8f9fa",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} /> {/* Spacer for fixed header */}
        <Container
          maxWidth="xl"
          sx={{
            py: 3,
            px: { xs: 2, sm: 3 },
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Fade in={true} style={{ transitionDelay: "100ms" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Outlet /> {/* This will render child routes */}
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 2,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.10))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || "user@example.com"}
          </Typography>
          <Chip
            size="small"
            label={user?.role || "Member"}
            sx={{
              mt: 1,
              backgroundColor: alpha("#1e5631", 0.1),
              color: "#1e5631",
              fontWeight: 500,
            }}
          />
        </Box>
        <Divider />
        <MuiMenuItem
          onClick={() => {
            navigate("/profile");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: "#1e5631" }} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => {
            navigate("/settings");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: "#1e5631" }} />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem onClick={handleThemeToggle}>
          <ListItemIcon>
            {isDarkMode ? (
              <LightMode fontSize="small" sx={{ color: "#1e5631" }} />
            ) : (
              <DarkMode fontSize="small" sx={{ color: "#1e5631" }} />
            )}
          </ListItemIcon>
          <ListItemText>{isDarkMode ? "Light Mode" : "Dark Mode"}</ListItemText>
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "error" }}
          />
        </MuiMenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            maxWidth: { xs: "calc(100vw - 32px)", sm: 380 },
            minWidth: { xs: "calc(100vw - 32px)", sm: 340 },
            borderRadius: 2,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.10))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="text"
                sx={{ color: "#1e5631", fontSize: "0.75rem" }}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </Stack>
        </Box>
        <Divider />

        {notifications.length > 0 ? (
          <List sx={{ p: 0, maxHeight: 350, overflow: "auto" }}>
            {notifications.map((notification) => {
              // Choose icon based on notification type
              let icon;
              let iconColor;

              switch (notification.type) {
                case "loan":
                  icon = <MonetizationOnIcon fontSize="small" />;
                  iconColor = "#1e5631";
                  break;
                case "savings":
                  icon = <AccountBalanceIcon fontSize="small" />;
                  iconColor = "#2a724a";
                  break;
                case "meeting":
                  icon = <EventIcon fontSize="small" />;
                  iconColor = "#ffd700";
                  break;
                default:
                  icon = <NotificationsIcon fontSize="small" />;
                  iconColor = "#1e5631";
              }

              return (
                <ListItem key={notification.id} disablePadding>
                  <ListItemButton
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor:
                        notification.status === "read"
                          ? "transparent"
                          : alpha("#1e5631", 0.05),
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: iconColor }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              notification.status !== "read" ? 600 : 400,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {notification.time}
                          </Typography>

                          {notification.status !== "read" && (
                            <Chip
                              size="small"
                              label={notification.status}
                              sx={{
                                height: 20,
                                fontSize: "0.625rem",
                                ml: 1,
                                bgcolor:
                                  notification.status === "urgent"
                                    ? alpha("#f44336", 0.1)
                                    : alpha("#1e5631", 0.1),
                                color:
                                  notification.status === "urgent"
                                    ? "#f44336"
                                    : "#1e5631",
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <NotificationsIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="body1" fontWeight={500}>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We'll notify you when something arrives
            </Typography>
          </Box>
        )}

        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            sx={{ color: "#1e5631", borderRadius: 2 }}
            onClick={() => {
              navigate("/notifications");
              handleNotificationsClose();
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default ImprovedSaccoDashboardLayout;
