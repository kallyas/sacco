import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from '@mui/material';
import { loansApi } from '@/api/loans.api';
import { LoanRepaymentRequest } from '@/types/loan.types';

interface LoanPaymentFormProps {
  loanId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultAmount?: number;
  maxAmount?: number;
}

const LoanPaymentForm: React.FC<LoanPaymentFormProps> = ({
  loanId,
  open,
  onClose,
  onSuccess,
  defaultAmount = 0,
  maxAmount,
}) => {
  const [formData, setFormData] = useState<LoanRepaymentRequest>({
    loan: loanId,
    amount: defaultAmount,
    payment_method: 'CASH',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'specific' | 'full'>('specific');
  
  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Payment methods
  const paymentMethods = [
    { value: 'CASH', label: 'Cash' },
    { value: 'MOBILE_MONEY', label: 'Mobile Money' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'INTERNAL', label: 'Internal Transfer' },
  ];
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Handle payment type change
  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'specific' | 'full';
    setPaymentType(value);
    
    // If full payment, set amount to maximum
    if (value === 'full' && maxAmount) {
      setFormData((prev) => ({ ...prev, amount: maxAmount }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Amount must be greater than zero';
    } else if (maxAmount && formData.amount > maxAmount) {
      errors.amount = `Amount cannot exceed ${formatCurrency(maxAmount)}`;
    }
    
    if (!formData.payment_method) {
      errors.payment_method = 'Payment method is required';
    }
    
    // Additional validation for specific payment methods
    if (formData.payment_method === 'MOBILE_MONEY' && !formData.phone_number) {
      errors.phone_number = 'Phone number is required for Mobile Money payments';
    }
    
    if (formData.payment_method === 'BANK_TRANSFER' && !formData.reference_number) {
      errors.reference_number = 'Reference number is required for Bank Transfers';
    }
    
    if (formData.payment_method === 'CHEQUE' && !formData.cheque_number) {
      errors.cheque_number = 'Cheque number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await loansApi.makeRepayment(formData);
      onSuccess();
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.response?.data?.error || "Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Make Loan Payment</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" color="textSecondary" paragraph>
            Please enter the payment details below. Payments will be applied to the oldest outstanding installments first.
          </Typography>
          
          {maxAmount && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Payment Type
              </Typography>
              <RadioGroup
                row
                value={paymentType}
                onChange={handlePaymentTypeChange}
              >
                <FormControlLabel value="specific" control={<Radio />} label="Specific Amount" />
                <FormControlLabel 
                  value="full" 
                  control={<Radio />} 
                  label={`Full Payment (${formatCurrency(maxAmount)})`} 
                />
              </RadioGroup>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                disabled={paymentType === 'full' || loading}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.payment_method}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  label="Payment Method"
                  onChange={handleChange}
                  disabled={loading}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.payment_method && (
                  <FormHelperText>{formErrors.payment_method}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Conditional fields based on payment method */}
            {formData.payment_method === 'MOBILE_MONEY' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!formErrors.phone_number}
                  helperText={formErrors.phone_number}
                  placeholder="+256XXXXXXXXX"
                />
              </Grid>
            )}
            
            {formData.payment_method === 'BANK_TRANSFER' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Reference Number"
                  name="reference_number"
                  value={formData.reference_number || ''}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!formErrors.reference_number}
                  helperText={formErrors.reference_number}
                />
              </Grid>
            )}
            
            {formData.payment_method === 'CHEQUE' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Cheque Number"
                  name="cheque_number"
                  value={formData.cheque_number || ''}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!formErrors.cheque_number}
                  helperText={formErrors.cheque_number}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks (Optional)"
                name="remarks"
                multiline
                rows={2}
                value={formData.remarks || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Processing...' : 'Make Payment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanPaymentForm;