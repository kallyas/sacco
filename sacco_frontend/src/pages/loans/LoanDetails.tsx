import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { loansApi } from '@/api/loans.api';
import { Loan, LoanRepayment } from '@/types/loan.types';
import LoanDetailsComponent from '@/components/loans/LoanDetails';
import RepaymentSchedule from '@/components/loans/RepaymentSchedule';
import LoanPaymentForm from '@/components/loans/LoanPaymentForm';

const LoanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [repayments, setRepayments] = useState<LoanRepayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // Action loading states
  const [approvingLoan, setApprovingLoan] = useState(false);
  const [rejectingLoan, setRejectingLoan] = useState(false);
  const [disbursingLoan, setDisbursingLoan] = useState(false);
  
  // Fetch loan details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const loanData = await loansApi.getLoan(parseInt(id));
        setLoan(loanData);
        
        // Fetch repayments if loan is disbursed
        if (loanData.status === 'DISBURSED' || loanData.status === 'COMPLETED') {
          const repaymentsData = await loansApi.getLoanRepayments(loanData.id);
          setRepayments(repaymentsData);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
        setError('Failed to load loan details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoanDetails();
  }, [id]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle loan approval
  const handleApprove = async () => {
    if (!id) return;
    
    setApprovingLoan(true);
    try {
      const updatedLoan = await loansApi.approveLoan(parseInt(id));
      setLoan(updatedLoan);
      setApproveDialogOpen(false);
    } catch (error) {
      console.error('Error approving loan:', error);
      setError('Failed to approve loan. Please try again.');
    } finally {
      setApprovingLoan(false);
    }
  };
  
  // Handle loan rejection
  const handleReject = async () => {
    if (!id) return;
    
    setRejectingLoan(true);
    try {
      const updatedLoan = await loansApi.rejectLoan(parseInt(id), rejectReason);
      setLoan(updatedLoan);
      setRejectDialogOpen(false);
    } catch (error) {
      console.error('Error rejecting loan:', error);
      setError('Failed to reject loan. Please try again.');
    } finally {
      setRejectingLoan(false);
    }
  };
  
  // Handle loan disbursement
  const handleDisburse = async () => {
    if (!id) return;
    
    setDisbursingLoan(true);
    try {
      const updatedLoan = await loansApi.disburseLoan(parseInt(id));
      setLoan(updatedLoan);
      
      // Fetch repayments after disbursement
      const repaymentsData = await loansApi.getLoanRepayments(parseInt(id));
      setRepayments(repaymentsData);
    } catch (error) {
      console.error('Error disbursing loan:', error);
      setError('Failed to disburse loan. Please try again.');
    } finally {
      setDisbursingLoan(false);
    }
  };
  
  // Handle loan payment
  const handlePaymentSuccess = async () => {
    setPaymentDialogOpen(false);
    
    // Refresh loan and repayments data
    if (!id) return;
    
    try {
      const loanData = await loansApi.getLoan(parseInt(id));
      setLoan(loanData);
      
      const repaymentsData = await loansApi.getLoanRepayments(parseInt(id));
      setRepayments(repaymentsData);
    } catch (error) {
      console.error('Error refreshing loan data:', error);
    }
  };
  
  // Handle making payment for a specific repayment
  const handleMakePaymentForRepayment = (repaymentId: number) => {
    // Find the repayment
    const repayment = repayments.find(r => r.id === repaymentId);
    if (repayment) {
      // Open payment dialog with pre-filled amount
      setPaymentDialogOpen(true);
    }
  };
  
  return (
    <Box>
      {/* Header and Breadcrumbs */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Loan Details
          </Typography>
          
          {loan && (
            <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate(`/loans/${id}/statement`)}
            >
              View Statement
            </Button>
          )}
        </Box>
        
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link component={RouterLink} to="/dashboard" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/loans" color="inherit">
            Loans
          </Link>
          <Typography color="textPrimary">
            {loan ? `Loan ${loan.reference}` : 'Loading...'}
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : !loan ? (
        <Alert severity="error">Loan not found</Alert>
      ) : (
        <>
          {/* Loan Details */}
          <Box mb={4}>
            <LoanDetailsComponent
              loan={loan}
              onApprove={() => setApproveDialogOpen(true)}
              onReject={() => setRejectDialogOpen(true)}
              onDisburse={handleDisburse}
              onMakePayment={() => setPaymentDialogOpen(true)}
            />
          </Box>
          
          {/* Tabs for Additional Information */}
          {(loan.status === 'DISBURSED' || loan.status === 'COMPLETED') && (
            <Paper sx={{ mb: 4 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Repayment Schedule" />
                  <Tab label="Transaction History" />
                  <Tab label="Documents" />
                </Tabs>
              </Box>
              
              <Box p={3}>
                {activeTab === 0 && (
                  <RepaymentSchedule
                    repayments={repayments}
                    loanId={loan.id}
                    loading={loading}
                    onMakePayment={handleMakePaymentForRepayment}
                  />
                )}
                
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Transaction History
                    </Typography>
                    {/* Transaction history component would go here */}
                    <Typography variant="body2" color="textSecondary">
                      No transactions found for this loan.
                    </Typography>
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Loan Documents
                    </Typography>
                    {/* Documents component would go here */}
                    <Typography variant="body2" color="textSecondary">
                      No documents available for this loan.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )}
        </>
      )}
      
      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => !approvingLoan && setApproveDialogOpen(false)}>
        <DialogTitle>Approve Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this loan application? This action will move the loan to the approved state.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApproveDialogOpen(false)} 
            disabled={approvingLoan}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApprove} 
            color="primary" 
            variant="contained"
            disabled={approvingLoan}
          >
            {approvingLoan ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => !rejectingLoan && setRejectDialogOpen(false)}>
        <DialogTitle>Reject Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this loan application.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
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
          <Button 
            onClick={() => setRejectDialogOpen(false)} 
            disabled={rejectingLoan}
          >
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
      
      {/* Payment Dialog */}
      {loan && (
        <LoanPaymentForm
          loanId={loan.id}
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onSuccess={handlePaymentSuccess}
          maxAmount={loan.outstanding_balance}
          defaultAmount={loan.next_payment_amount || 0}
        />
      )}
    </Box>
  );
};

export default LoanDetailsPage;