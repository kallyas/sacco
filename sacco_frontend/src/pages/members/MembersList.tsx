import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  InputAdornment,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Badge,
  Avatar,
  useTheme,
  alpha,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { membersApi } from "@/api/members.api";
import { Member } from "@/types/member.types";

// Helper function to generate initials from name
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Helper function to generate a consistent color based on a string
const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const MembersList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [actionsMenuAnchor, setActionsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [actionsMemberId, setActionsMemberId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("registration_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchMembers = async (page: number = 0, search: string = "") => {
    setLoading(true);
    try {
      const response = await membersApi.getMembers({
        page: page + 1, // API uses 1-indexed pages
        search: search,
        status: statusFilter !== "all" ? statusFilter : undefined,
        ordering: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
      });
      setMembers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page, searchQuery);
  }, [page, pageSize, statusFilter, sortField, sortDirection]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Debounce search requests
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setPage(0); // Reset to first page on search
      fetchMembers(0, query);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setFilterMenuAnchor(null);
    setPage(0); // Reset to first page when changing filters
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleActionsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    event.stopPropagation();
    setActionsMenuAnchor(event.currentTarget);
    setActionsMemberId(id);
  };

  const handleActionsClose = () => {
    setActionsMenuAnchor(null);
    setActionsMemberId(null);
  };

  const handleDeleteClick = (id: number) => {
    // In a real app, show a confirmation dialog before deleting
    console.log(`Delete member with id: ${id}`);
    handleActionsClose();
  };

  const handleRefresh = () => {
    fetchMembers(page, searchQuery);
  };

  const columns: GridColDef[] = [
    {
      field: "member_number",
      headerName: "Member ID",
      width: 150,
      valueGetter: (params) => params.row.member_number,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.primary.main }}
        >
          {params.row.member_number}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Member",
      width: 240,
      renderCell: (params: GridRenderCellParams) => {
        const firstName = params.row.user.first_name;
        const lastName = params.row.user.last_name;
        const fullName = `${firstName} ${lastName}`;
        const initials = getInitials(firstName, lastName);
        const avatarColor = stringToColor(fullName);

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: alpha(avatarColor, 0.8),
                width: 40,
                height: 40,
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.user.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "phone_number",
      headerName: "Phone",
      width: 150,
      valueGetter: (params) => params.row.user.phone_number,
    },
    {
      field: "registration_date",
      headerName: "Join Date",
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params.row.registration_date);
        return date.toLocaleDateString();
      },
    },
    {
      field: "membership_status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.row.membership_status;
        let color;
        let backgroundColor;

        switch (status) {
          case "ACTIVE":
            color = theme.palette.success.main;
            backgroundColor = alpha(theme.palette.success.main, 0.1);
            break;
          case "INACTIVE":
            color = theme.palette.error.main;
            backgroundColor = alpha(theme.palette.error.main, 0.1);
            break;
          case "PENDING":
            color = theme.palette.warning.main;
            backgroundColor = alpha(theme.palette.warning.main, 0.1);
            break;
          default:
            color = theme.palette.info.main;
            backgroundColor = alpha(theme.palette.info.main, 0.1);
        }

        return (
          <Chip
            label={status}
            sx={{
              backgroundColor: backgroundColor,
              color: color,
              fontWeight: 600,
              borderRadius: "4px",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "is_verified",
      headerName: "Verified",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {params.row.is_verified ? (
            <>
              <VerifiedIcon
                sx={{
                  color: theme.palette.success.main,
                  mr: 0.5,
                  fontSize: 18,
                }}
              />
              <Typography variant="body2" color="success.main" fontWeight={500}>
                Verified
              </Typography>
            </>
          ) : (
            <>
              <UnverifiedIcon
                sx={{
                  color: theme.palette.warning.main,
                  mr: 0.5,
                  fontSize: 18,
                }}
              />
              <Typography variant="body2" color="warning.main" fontWeight={500}>
                Pending
              </Typography>
            </>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="More Actions">
            <IconButton
              onClick={(event) => handleActionsClick(event, params.row.id)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when changing page size
  };

  // Get summary stats for different member categories
  const activeMembersCount = members.filter(
    (m) => m.membership_status === "ACTIVE"
  ).length;
  const unverifiedMembersCount = members.filter((m) => !m.is_verified).length;
  const inactiveMembersCount = members.filter(
    (m) => m.membership_status === "INACTIVE"
  ).length;

  // Member statistics cards
  const memberStats = [
    {
      title: "Total Members",
      value: totalCount,
      icon: <GroupsIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      title: "Active Members",
      value: activeMembersCount,
      icon: <PersonIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      title: "Inactive Members",
      value: inactiveMembersCount,
      icon: <PersonIcon />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
    {
      title: "Unverified Members",
      value: unverifiedMembersCount,
      icon: <HistoryIcon />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
    },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Members Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            View, manage and monitor all SACCO members
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={() => console.log("Export members")}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/members/add")}
              sx={{
                px: 3,
                background:
                  theme.customGradients?.primary ||
                  "linear-gradient(135deg, #1e5631 0%, #2a724a 100%)",
              }}
            >
              Add Member
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {memberStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: alpha(stat.color, 0.2),
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ mt: 1, color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different member views */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, value) => handleFilterChange(value)}
          indicatorColor="primary"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            "& .MuiTab-root": {
              py: 2,
              fontWeight: 600,
            },
          }}
        >
          <Tab label="All Members" value="all" />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Active
                <Chip
                  label={activeMembersCount}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: "success.main",
                  }}
                />
              </Box>
            }
            value="ACTIVE"
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Inactive
                <Chip
                  label={inactiveMembersCount}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: "error.main",
                  }}
                />
              </Box>
            }
            value="INACTIVE"
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Unverified
                <Chip
                  label={unverifiedMembersCount}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: "warning.main",
                  }}
                />
              </Box>
            }
            value="unverified"
          />
        </Tabs>
      </Paper>

      {/* Search & Action Bar */}
      <Box
        sx={{
          display: "flex",
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name, member number, phone or ID"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.6),
              },
            },
          }}
          sx={{ flexGrow: 1 }}
        />

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
          >
            Filters
          </Button>
          <IconButton
            onClick={handleRefresh}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              borderRadius: 2,
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterClose}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={() => handleSortChange("registration_date")}>
            <ListItemIcon>
              {sortField === "registration_date" &&
                (sortDirection === "desc" ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <ArrowUpwardIcon fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText>Sort by Join Date</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("user__first_name")}>
            <ListItemIcon>
              {sortField === "user__first_name" &&
                (sortDirection === "desc" ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <ArrowUpwardIcon fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText>Sort by Name</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("member_number")}>
            <ListItemIcon>
              {sortField === "member_number" &&
                (sortDirection === "desc" ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <ArrowUpwardIcon fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText>Sort by Member ID</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleFilterChange("all")}>
            <ListItemText>All Members</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange("ACTIVE")}>
            <ListItemText>Active Only</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange("INACTIVE")}>
            <ListItemText>Inactive Only</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange("unverified")}>
            <ListItemText>Unverified Only</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* Members Table */}
      <Paper
        sx={{
          height: 600,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            paddingTop: 2,
            paddingBottom: 2,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={members}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={{ pageSize, page }}
            paginationMode="server"
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            rowCount={totalCount}
            disableRowSelectionOnClick
            disableColumnMenu
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "" : "even-row"
            }
            sx={{
              "& .even-row": {
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              },
            }}
          />
        )}
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={handleActionsClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (actionsMemberId) navigate(`/members/${actionsMemberId}`);
            handleActionsClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionsMemberId) navigate(`/members/${actionsMemberId}/edit`);
            handleActionsClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Edit Member</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => actionsMemberId && handleDeleteClick(actionsMemberId)}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MembersList;
