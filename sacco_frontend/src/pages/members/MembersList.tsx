import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef,  } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { membersApi } from '@/api/members.api';
import { Member } from '@/types/member.types';

const MembersList: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const fetchMembers = async (page: number = 0, search: string = '') => {
    setLoading(true);
    try {
      const response = await membersApi.getMembers({
        page: page + 1, // API uses 1-indexed pages
        search: search,
      });
      setMembers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMembers(page, searchQuery);
  }, [page, pageSize]);
  
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
  
  const columns: GridColDef[] = [
    {
      field: 'member_number',
      headerName: 'Member ID',
      width: 150,
      valueGetter: (params) => params.row.member_number,
    },
    {
      field: 'name',
      headerName: 'Full Name',
      width: 200,
      valueGetter: (params) => 
        `${params.row.user.first_name} ${params.row.user.last_name}`,
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      width: 150,
      valueGetter: (params) => params.row.user.phone_number,
    },
    {
      field: 'registration_date',
      headerName: 'Join Date',
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params.row.registration_date);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'membership_status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.row.membership_status}
          color={params.row.membership_status === 'ACTIVE' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'is_verified',
      headerName: 'Verified',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {params.row.is_verified ? (
            <VerifiedIcon color="success" />
          ) : (
            <UnverifiedIcon color="error" />
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              onClick={() => navigate(`/members/${params.row.id}`)}
              size="small"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => navigate(`/members/${params.row.id}/edit`)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteClick(params.row.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
  
  const handleDeleteClick = (id: number) => {
    // In a real app, show a confirmation dialog before deleting
    console.log(`Delete member with id: ${id}`);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when changing page size
  };
  
  // Summary cards for quick stats
  const memberSummary = [
    { title: 'Total Members', value: totalCount, color: 'primary.main' },
    { title: 'Active Members', value: members.filter(m => m.membership_status === 'ACTIVE').length, color: 'success.main' },
    { title: 'Unverified Members', value: members.filter(m => !m.is_verified).length, color: 'warning.main' },
  ];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/members/add')}
        >
          Add Member
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {memberSummary.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h4" sx={{ color: item.color }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, member number, phone or ID"
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
      </Paper>
      
      {/* Members Table */}
      <Paper sx={{ height: 500, width: '100%' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={members}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 25, 50]}
            pageSize={pageSize}
            page={page}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize, page },
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default MembersList;