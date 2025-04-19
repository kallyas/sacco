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
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CreditScore as DisburseIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { loansApi } from '@/api/loans.api';
import { Loan } from '@/types/loan.types';
import { useAuth } from '@/hooks/useAuth';

const LoansList: React.FC = () => {
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
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => navigate(`/loans/${params.row.id}`)}
              size="small"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          
          {isLoanOfficer && params.row.status === 'PENDING' && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  onClick={() => setLoanToApprove(params.row)}
                  size="small"
                  color="success"
                >
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  onClick={() => setLoanToReject(params.row)}
                  size="small"
                  color="error"
                >
                  <RejectIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {isLoanOfficer && params.row.status === 'APPROVED' && (
            <Tooltip title="Disburse">
              <IconButton
                onClick={() => setLoanToDisburse(params.row)}
                size="small"
                color="primary"
              >
                <DisburseIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
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
      color: 'primary.main' 
    },
    { 
      title: 'Pending Applications', 
      value: loans.filter(loan => loan.status === 'PENDING').length, 
      color: 'warning.main' 
    },
    { 
      title: 'Loan Portfolio', 
      value: formatCurrency(
        loans
          .filter(loan => loan.status === 'DISBURSED')
          .reduce((sum, loan) => sum + loan.outstanding_balance, 0)
      ), 
      color: 'success.main' 
    },
  ];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Loans
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={() => navigate('/loans/calculator')}
            sx={{ mr: 2 }}
          >
            Loan Calculator
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/loans/apply')}
          >
            Apply for Loan
          </Button>
        </Box>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {loanSummary.map((item, index) => (
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
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Loans" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Active" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>
      
      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by member ID"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleSearch}
                      variant="contained"
                      size="small"
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          {tabValue === 0 && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-filter-label">Loan Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as string)}
                    label="Loan Status"
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
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="type-filter-label">Loan Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as string)}
                    label="Loan Type"
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
            </>
          )}
        </Grid>
      </Paper>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loans Table */}
      <Paper sx={{ height: 500, width: '100%' }}>
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
          />
        )}
      </Paper>
      
      {/* Approve Dialog */}
      <Dialog open={!!loanToApprove} onClose={() => !approvingLoan && setLoanToApprove(null)}>
        <DialogTitle>Approve Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve loan {loanToApprove?.reference}? Once approved, the loan will be ready for disbursement.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoanToApprove(null)} disabled={approvingLoan}>
            Cancel
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success" 
            variant="contained"
            disabled={approvingLoan}
          >
            {approvingLoan ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={!!loanToReject} onClose={() => !rejectingLoan && setLoanToReject(null)}>
        <DialogTitle>Reject Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoanToReject(null)} disabled={rejectingLoan}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={rejectingLoan || !rejectReason.trim()}
          >
            {rejectingLoan ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Disburse Dialog */}
      <Dialog open={!!loanToDisburse} onClose={() => !disbursingLoan && setLoanToDisburse(null)}>
        <DialogTitle>Disburse Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disburse loan {loanToDisburse?.reference} for {formatCurrency(loanToDisburse?.amount || 0)}?
            This will transfer the funds to the member's account and initiate the repayment schedule.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoanToDisburse(null)} disabled={disbursingLoan}>
            Cancel
          </Button>
          <Button 
            onClick={handleDisburse} 
            color="primary" 
            variant="contained"
            disabled={disbursingLoan}
          >
            {disbursingLoan ? 'Disbursing...' : 'Disburse'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default LoansList;