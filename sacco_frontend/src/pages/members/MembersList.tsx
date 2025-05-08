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
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { membersApi } from "@/api/members.api";
import { Member } from "@/types/member.types";

// Helper functions (moved outside component for clarity)
const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

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

  // State variables
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("registration_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionsMemberId, setActionsMemberId] = useState<number | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  // API Fetching Function
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await membersApi.getMembers({
        page: page + 1,
        search: searchQuery,
        status: statusFilter === "all" ? undefined : statusFilter,
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

  // useEffect for initial data fetching and dependency management
  useEffect(() => {
    fetchMembers();
  }, [page, pageSize, searchQuery, statusFilter, sortField, sortDirection]); // Dependencies

  // Event Handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);  // Reset page to 0 on search
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(0);
    handleFilterClose();
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(0); // Reset page on sort change
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
    // Implement delete logic here (e.g., show confirmation dialog)
    console.log(`Delete member with id: ${id}`);
    handleActionsClose();
  };

  const handleRefresh = () => {
    fetchMembers();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  // Columns Configuration
  const columns: GridColDef[] = [
    { field: "member_number", headerName: "Member ID", width: 120 },
    {
      field: "name",
      headerName: "Member",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const firstName = params.row.user?.first_name || "";
        const lastName = params.row.user?.last_name || "";
        const fullName = `${firstName} ${lastName}`;
        const initials = getInitials(firstName, lastName);
        const avatarColor = stringToColor(fullName);

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: avatarColor, width: 32, height: 32 }}>
              {initials}
            </Avatar>
            <Typography>{fullName}</Typography>
          </Box>
        );
      },
    },
    { field: "user.phone_number", headerName: "Phone", width: 120, valueGetter: (params) => params.row.user?.phone_number},
    {
      field: "registration_date",
      headerName: "Join Date",
      width: 120,
      valueGetter: (params) => {
        const date = new Date(params.row.registration_date);
        return date.toLocaleDateString();
      },
    },
    {
      field: "membership_status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.row.membership_status;
        let color = theme.palette.text.secondary;
        switch (status) {
          case "ACTIVE":
            color = theme.palette.success.main;
            break;
          case "INACTIVE":
            color = theme.palette.error.main;
            break;
          case "PENDING":
            color = theme.palette.warning.main;
            break;
          default:
            break;
        }
        return <Chip label={status} size="small" sx={{ color: color }} />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="More Actions">
          <IconButton
            onClick={(event) => handleActionsClick(event, params.row.id)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const activeMembersCount = members.filter(
    (m) => m.membership_status === "ACTIVE"
  ).length;
  const inactiveMembersCount = members.filter(
    (m) => m.membership_status === "INACTIVE"
  ).length;

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
  ];

  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Members Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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

      {/* Search and Filter Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <TextField
          fullWidth
          label="Search Members"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Data Grid */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={400}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={members}
            columns={columns}
            rowCount={totalCount}
            loading={loading}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(newModel) => {
              setPage(newModel.page);
              setPageSize(newModel.pageSize);
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{ border: 0 }}
          />
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={handleActionsClose}
      >
        <MenuItem
          onClick={() => {
            if (actionsMemberId) navigate(`/members/${actionsMemberId}`);
            handleActionsClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionsMemberId) navigate(`/members/${actionsMemberId}/edit`);
            handleActionsClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => actionsMemberId && handleDeleteClick(actionsMemberId)}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
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
          <ListItemText>All</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("ACTIVE")}>
          <ListItemText>Active</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("INACTIVE")}>
          <ListItemText>Inactive</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("PENDING")}>
          <ListItemText>Pending</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MembersList;