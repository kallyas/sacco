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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CreditScore as DisburseIcon,
  Calculate as CalculateIcon,
  FilterList as FilterIcon,
  MonetizationOn as LoanIcon,
  Receipt as PendingIcon,
  AccountBalance as PortfolioIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { loansApi } from '@/api/loans.api';
import { Loan } from '@/types/loan.types';
import { useAuth } from '@/hooks/useAuth';

const LoansList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Dialog states
  const [loanToApprove, setLoanToApprove] = useState<Loan | null>(null);
  const [loanToReject, setLoanToReject] = useState<Loan | null>(null);
  const [loanToDisburse, setLoanToDisburse] = useState<Loan | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  
  // Action loading states
  const [approvingLoan, setApprovingLoan] = useState<boolean>(false);
  const [rejectingLoan, setRejectingLoan] = useState<boolean>(false);
  const [disbursingLoan, setDisbursingLoan] = useState<boolean>(false);
  
  // Check if user is a loan officer or admin
  const isLoanOfficer = user?.role?.name === 'LOAN_OFFICER' || user?.role?.name === 'ADMIN';
  
  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = tabValue === 0 ? statusFilter :
                    tabValue === 1 ? 'PENDING' : 
                    tabValue === 2 ? 'APPROVED' : 
                    tabValue === 3 ? 'DISBURSED' : 
                    tabValue === 4 ? 'COMPLETED' : statusFilter;
      
      const response = await loansApi.getLoans({
        page: page + 1, // API uses 1-indexed pages
        status: status,
        type: typeFilter || undefined,
        member: searchQuery && !isNaN(Number(searchQuery)) ? Number(searchQuery) : undefined,
      });
      
      setLoans(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLoans();
  }, [page, pageSize, statusFilter, typeFilter, tabValue]);
  
  const handleSearch = () => {
    setPage(0); // Reset to first page
    fetchLoans();
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0); // Reset to first page
    // Status filter is handled in fetchLoans()
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'info';
      case 'REJECTED':
        return 'error';
      case 'DISBURSED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'DEFAULTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const columns: GridColDef[] = [
    {
      field: 'reference',
      headerName: 'Loan ID',
      width: 150,
    },
    {
      field: 'member_name',
      headerName: 'Member',
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        // In a real app, we would have member details in the loan object
        return params.row.member_name || `Member #${params.row.member}`;
      },
    },
    {
      field: 'loan_type',
      headerName: 'Loan Type',
      width: 150,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: 'interest_rate',
      headerName: 'Interest',
      width: 100,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: 'term_months',
      headerName: 'Term',
      width: 100,
      valueFormatter: (params) => `${params.value} months`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ 
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 24,
            borderRadius: 1
          }}
        />
      ),
    },
    {
      field: 'application_date',
      headerName: 'Application Date',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => {
        const date = new Date(params.row.application_date);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => navigate(`/loans/${params.row.id}`)}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <ViewIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Tooltip>
          
          {isLoanOfficer && params.row.status === 'PENDING' && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  onClick={() => setLoanToApprove(params.row)}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.success.main, 0.2),
                    }
                  }}
                >
                  <ApproveIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  onClick={() => setLoanToReject(params.row)}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                    }
                  }}
                >
                  <RejectIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {isLoanOfficer && params.row.status === 'APPROVED' && (
            <Tooltip title="Disburse">
              <IconButton
                onClick={() => setLoanToDisburse(params.row)}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                  }
                }}
              >
                <DisburseIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];
  
  const handleApprove = async () => {
    if (!loanToApprove) return;
    
    setApprovingLoan(true);
    try {
      await loansApi.approveLoan(loanToApprove.id);
      // Refresh loans after approval
      fetchLoans();
    } catch (error) {
      console.error('Error approving loan:', error);
      setError('Failed to approve loan. Please try again.');
    } finally {
      setApprovingLoan(false);
      setLoanToApprove(null);
    }
  };
  
  const handleReject = async () => {
    if (!loanToReject) return;
    
    setRejectingLoan(true);
    try {
      await loansApi.rejectLoan(loanToReject.id, rejectReason);
      // Refresh loans after rejection
      fetchLoans();
    } catch (error) {
      console.error('Error rejecting loan:', error);
      setError('Failed to reject loan. Please try again.');
    } finally {
      setRejectingLoan(false);
      setLoanToReject(null);
      setRejectReason('');
    }
  };
  
  const handleDisburse = async () => {
    if (!loanToDisburse) return;
    
    setDisbursingLoan(true);
    try {
      await loansApi.disburseLoan(loanToDisburse.id);
      // Refresh loans after disbursement
      fetchLoans();
    } catch (error) {
      console.error('Error disbursing loan:', error);
      setError('Failed to disburse loan. Please try again.');
    } finally {
      setDisbursingLoan(false);
      setLoanToDisburse(null);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when changing page size
  };
  
  // Summary cards for quick stats
  const loanSummary = [
    { 
      title: 'Total Active Loans', 
      value: loans.filter(loan => loan.status === 'DISBURSED').length,
      change: +2.5,
      icon: <LoanIcon />,
      color: theme.palette.primary.main
    },
    { 
      title: 'Pending Applications', 
      value: loans.filter(loan => loan.status === 'PENDING').length,
      change: -3.2,
      icon: <PendingIcon />,
      color: theme.palette.warning.main
    },
    { 
      title: 'Loan Portfolio', 
      value: formatCurrency(
        loans
          .filter(loan => loan.status === 'DISBURSED')
          .reduce((sum, loan) => sum + loan.outstanding_balance, 0)
      ),
      change: +4.7,
      icon: <PortfolioIcon />,
      color: theme.palette.success.main
    },
  ];
  
  return (
    <Box>
      {/* Header Area */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              Loans Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage loan applications, approvals, and disbursements.
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<CalculateIcon />}
                onClick={() => navigate('/loans/calculator')}
                sx={{ 
                  borderRadius: 1, 
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Loan Calculator
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/loans/apply')}
                sx={{ 
                  borderRadius: 1, 
                  px: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: theme.shadows[2]
                }}
              >
                Apply for Loan
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loanSummary.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card 
              sx={{ 
                borderRadius: 1,
                boxShadow: theme.shadows[1],
                height: '100%',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 3, pt: 2.5 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {item.title}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: item.change >= 0 ? 'success.main' : 'error.main',
                      bgcolor: alpha(item.change >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                      borderRadius: 5,
                      py: 0.25,
                      px: 0.75,
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {item.change >= 0 ? <TrendingUpIcon fontSize="inherit" /> : <TrendingDownIcon fontSize="inherit" />}
                    <Box component="span" ml={0.5}>
                      {Math.abs(item.change)}%
                    </Box>
                  </Box>
                </Box>
                <Typography variant="h4" component="div" fontWeight={600} mb={1}>
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: alpha(item.color, 0.1),
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: {
                      fontSize: 22,
                      color: item.color,
                    }
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Tabs and Filters */}
      <Paper 
        sx={{ 
          borderRadius: 1,
          boxShadow: theme.shadows[1],
          mb: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 48,
              },
              '& .Mui-selected': {
                fontWeight: 600,
              }
            }}
          >
            <Tab label="All Loans" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Active" />
            <Tab label="Completed" />
          </Tabs>
        </Box>
        
        {/* Search & Filters */}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by member ID"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </Grid>
            
            <Grid item>
              <Button 
                onClick={handleSearch}
                variant="contained"
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  px: 3
                }}
              >
                Search
              </Button>
            </Grid>
            
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
          
          {showFilters && (
            <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="status-filter-label">Loan Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as string)}
                    label="Loan Status"
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                    <MenuItem value="DISBURSED">Disbursed</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="DEFAULTED">Defaulted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="type-filter-label">Loan Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as string)}
                    label="Loan Type"
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="PERSONAL">Personal</MenuItem>
                    <MenuItem value="BUSINESS">Business</MenuItem>
                    <MenuItem value="EDUCATION">Education</MenuItem>
                    <MenuItem value="HOME">Home Improvement</MenuItem>
                    <MenuItem value="EMERGENCY">Emergency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 1
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Loans Table */}
      <Paper 
        sx={{ 
          height: 550, 
          width: '100%', 
          borderRadius: 1,
          boxShadow: theme.shadows[1],
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={loans}
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
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderRadius: 0
              },
              '& .MuiDataGrid-cell': {
                py: 1.5
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600
              }
            }}
          />
        )}
      </Paper>
      
      {/* Approve Dialog */}
      <Dialog 
        open={!!loanToApprove} 
        onClose={() => !approvingLoan && setLoanToApprove(null)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: '100%',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Approve Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve loan {loanToApprove?.reference}? Once approved, the loan will be ready for disbursement.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setLoanToApprove(null)} 
            disabled={approvingLoan}
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success" 
            variant="contained"
            disabled={approvingLoan}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              px: 3
            }}
          >
            {approvingLoan ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog 
        open={!!loanToReject} 
        onClose={() => !rejectingLoan && setLoanToReject(null)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: '100%',
            maxWidth: 500
          }
        }}  
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Reject Loan</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting loan {loanToReject?.reference}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reject-reason"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            disabled={rejectingLoan}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setLoanToReject(null)} 
            disabled={rejectingLoan}
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={rejectingLoan || !rejectReason.trim()}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              px: 3
            }}
          >
            {rejectingLoan ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Disburse Dialog */}
      <Dialog 
        open={!!loanToDisburse} 
        onClose={() => !disbursingLoan && setLoanToDisburse(null)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: '100%',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Disburse Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disburse loan {loanToDisburse?.reference} for {formatCurrency(loanToDisburse?.amount || 0)}?
            This will transfer the funds to the member's account and initiate the repayment schedule.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setLoanToDisburse(null)} 
            disabled={disbursingLoan}
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDisburse} 
            color="primary" 
            variant="contained"
            disabled={disbursingLoan}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              px: 3
            }}
          >
            {disbursingLoan ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Disburse'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansList;