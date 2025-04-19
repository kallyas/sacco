import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { 
  CheckCircle as PaidIcon, 
  AccessTime as PendingIcon,
  Warning as OverdueIcon 
} from '@mui/icons-material';
import { LoanRepayment } from '@/types/loan.types';

interface RepaymentScheduleProps {
  repayments: LoanRepayment[];
  loanId: number;
  loading: boolean;
  onMakePayment?: (repaymentId: number) => void;
}

const RepaymentSchedule: React.FC<RepaymentScheduleProps> = ({
  repayments,
  loanId,
  loading,
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
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Check if a repayment is overdue
  const isOverdue = (repayment: LoanRepayment): boolean => {
    return (
      repayment.status === 'PENDING' &&
      new Date(repayment.due_date) < new Date() &&
      (!repayment.payment_date || new Date(repayment.payment_date) > new Date(repayment.due_date))
    );
  };
  
  // Get status color and icon
  const getStatusInfo = (repayment: LoanRepayment) => {
    if (repayment.status === 'COMPLETED') {
      return {
        color: 'success' as const,
        icon: <PaidIcon fontSize="small" />,
        label: 'Paid',
      };
    } else if (isOverdue(repayment)) {
      return {
        color: 'error' as const,
        icon: <OverdueIcon fontSize="small" />,
        label: 'Overdue',
      };
    } else {
      return {
        color: 'warning' as const,
        icon: <PendingIcon fontSize="small" />,
        label: 'Pending',
      };
    }
  };
  
  // Calculate totals
  const totalAmount = repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
  const totalPrincipal = repayments.reduce((sum, repayment) => sum + repayment.principal_component, 0);
  const totalInterest = repayments.reduce((sum, repayment) => sum + repayment.interest_component, 0);
  const totalPenalty = repayments.reduce((sum, repayment) => sum + repayment.penalty_amount, 0);
  const totalPaid = repayments
    .filter(r => r.status === 'COMPLETED')
    .reduce((sum, repayment) => sum + repayment.amount + repayment.penalty_amount, 0);
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Repayment Schedule
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : repayments.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center" py={4}>
          No repayment schedule available
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Principal</TableCell>
                  <TableCell align="right">Interest</TableCell>
                  <TableCell align="right">Penalty</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repayments.map((repayment) => {
                  const statusInfo = getStatusInfo(repayment);
                  return (
                    <TableRow key={repayment.id}>
                      <TableCell>{repayment.reference.split('-')[1]}</TableCell>
                      <TableCell>{formatDate(repayment.due_date)}</TableCell>
                      <TableCell align="right">{formatCurrency(repayment.amount)}</TableCell>
                      <TableCell align="right">{formatCurrency(repayment.principal_component)}</TableCell>
                      <TableCell align="right">{formatCurrency(repayment.interest_component)}</TableCell>
                      <TableCell align="right">{formatCurrency(repayment.penalty_amount)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {repayment.payment_date ? formatDate(repayment.payment_date) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {repayment.status !== 'COMPLETED' && onMakePayment && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onMakePayment(repayment.id)}
                          >
                            Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Summary
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Principal:
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalPrincipal)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Interest:
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalInterest)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Penalties:
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalPenalty)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  Amount Paid:
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalPaid)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="textSecondary">
                  Remaining Balance:
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalAmount + totalPenalty - totalPaid)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default RepaymentSchedule;