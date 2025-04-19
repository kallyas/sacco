import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon,
  SyncAlt as TransferIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Loan } from '@/types/loan.types';

interface LoanDetailsProps {
  loan: Loan;
  onApprove?: () => void;
  onReject?: () => void;
  onDisburse?: () => void;
  onMakePayment?: () => void;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({
  loan,
  onApprove,
  onReject,
  onDisburse,
  onMakePayment,
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get loan status color
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
  
  // Calculate repayment progress
  const calculateProgress = (): number => {
    if (loan.status !== 'DISBURSED' && loan.status !== 'COMPLETED') {
      return 0;
    }
    
    const totalLoanAmount = loan.total_amount_payable;
    const amountPaid = totalLoanAmount - loan.outstanding_balance;
    return Math.round((amountPaid / totalLoanAmount) * 100);
  };
  
  const progress = calculateProgress();
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5" component="h2">
            Loan {loan.reference}
          </Typography>
          <Chip
            label={loan.status}
            color={getStatusColor(loan.status)}
            size="medium"
          />
        </Box>
        
        <Grid container spacing={3}>
          {/* Loan amount and basic details */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loan Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Loan Type:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {loan.loan_type}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Principal Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(loan.amount)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Interest Rate:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {loan.interest_rate}% p.a.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Term:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {loan.term_months} months
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Payable:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(loan.total_amount_payable)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Interest:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(loan.total_interest)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Member and dates */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Member & Dates
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Member:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {loan.member_name || `Member #${loan.member}`}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                      <Typography variant="body1">
                        {formatDate(loan.application_date)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Approval Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {formatDate(loan.approval_date)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Disbursement Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {formatDate(loan.disbursement_date)}
                    </Typography>
                  </Grid>
                  
                  {loan.approved_by && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Approved By:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          {loan.approved_by.name}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Repayment Status */}
          {(loan.status === 'DISBURSED' || loan.status === 'COMPLETED') && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Repayment Status
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        Repayment Progress ({progress}%)
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(loan.total_amount_payable - loan.outstanding_balance)} of {formatCurrency(loan.total_amount_payable)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 10, borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                          <Typography variant="body2" color="textSecondary">
                            Outstanding Balance
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {formatCurrency(loan.outstanding_balance)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
                          <Typography variant="body2" color="textSecondary">
                            Next Payment Date
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {formatDate(loan.next_payment_date)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <MoneyIcon sx={{ mr: 1, color: 'info.main' }} />
                          <Typography variant="body2" color="textSecondary">
                            Next Payment Amount
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {formatCurrency(loan.next_payment_amount || 0)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <TransferIcon sx={{ mr: 1, color: loan.missed_payments_count > 0 ? 'error.main' : 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            Missed Payments
                          </Typography>
                        </Box>
                        <Typography variant="h6" color={loan.missed_payments_count > 0 ? 'error.main' : 'text.primary'}>
                          {loan.missed_payments_count}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {loan.status === 'DISBURSED' && onMakePayment && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onMakePayment}
                        startIcon={<MoneyIcon />}
                      >
                        Make Payment
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Action Buttons */}
          {(loan.status === 'PENDING' || loan.status === 'APPROVED') && (
            <Grid item xs={12}>
              <Box mt={2}>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  {loan.status === 'PENDING' && onReject && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={onReject}
                    >
                      Reject Loan
                    </Button>
                  )}
                  
                  {loan.status === 'PENDING' && onApprove && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={onApprove}
                    >
                      Approve Loan
                    </Button>
                  )}
                  
                  {loan.status === 'APPROVED' && onDisburse && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onDisburse}
                    >
                      Disburse Loan
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LoanDetails;