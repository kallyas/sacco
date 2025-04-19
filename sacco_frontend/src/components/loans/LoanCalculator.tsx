import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Slider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
} from '@mui/material';
import { loansApi } from '@/api/loans.api';

interface LoanCalculatorProps {
  initialAmount?: number;
  initialTerm?: number;
  initialType?: string;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  initialAmount = 1000000,
  initialTerm = 12,
  initialType = 'PERSONAL',
}) => {
  // State for loan parameters
  const [amount, setAmount] = useState<number>(initialAmount);
  const [term, setTerm] = useState<number>(initialTerm);
  const [loanType, setLoanType] = useState<string>(initialType);
  const [interestRate, setInterestRate] = useState<number>(15); // Default interest rate
  
  // State for calculation results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [repaymentSchedule, setRepaymentSchedule] = useState<Array<{
    payment_number: number;
    payment_date: string;
    payment_amount: number;
    principal: number;
    interest: number;
    balance: number;
  }>>([]);
  
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  
  // Available loan types
  const loanTypes = [
    { value: 'PERSONAL', label: 'Personal Loan', interestRate: 15 },
    { value: 'BUSINESS', label: 'Business Loan', interestRate: 12 },
    { value: 'EDUCATION', label: 'Education Loan', interestRate: 10 },
    { value: 'HOME', label: 'Home Improvement', interestRate: 13 },
    { value: 'EMERGENCY', label: 'Emergency Loan', interestRate: 18 },
  ];
  
  // Update interest rate when loan type changes
  useEffect(() => {
    const selectedType = loanTypes.find(type => type.value === loanType);
    if (selectedType) {
      setInterestRate(selectedType.interestRate);
    }
  }, [loanType]);
  
  // Calculate loan details when parameters change
  useEffect(() => {
    const calculateLoan = async () => {
      if (amount <= 0 || term <= 0) return;
      
      setLoading(true);
      try {
        // Call API to calculate loan details
        const result = await loansApi.calculateLoanRepayment(amount, term, interestRate);
        
        setMonthlyPayment(result.monthly_payment);
        setTotalRepayment(result.total_repayment);
        setTotalInterest(result.total_interest);
        setRepaymentSchedule(result.schedule);
      } catch (error) {
        console.error('Error calculating loan:', error);
        
        // Fallback to simple calculation if API fails
        const monthlyRate = interestRate / 100 / 12;
        const calculatedMonthlyPayment = 
          (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
          (Math.pow(1 + monthlyRate, term) - 1);
          
        setMonthlyPayment(calculatedMonthlyPayment);
        setTotalRepayment(calculatedMonthlyPayment * term);
        setTotalInterest(calculatedMonthlyPayment * term - amount);
        
        // Generate simple schedule
        const simpleSchedule = [];
        let remainingBalance = amount;
        let date = new Date();
        
        for (let i = 1; i <= term; i++) {
          date.setMonth(date.getMonth() + 1);
          const interest = remainingBalance * monthlyRate;
          const principal = calculatedMonthlyPayment - interest;
          remainingBalance -= principal;
          
          simpleSchedule.push({
            payment_number: i,
            payment_date: date.toISOString().split('T')[0],
            payment_amount: calculatedMonthlyPayment,
            principal: principal,
            interest: interest,
            balance: Math.max(0, remainingBalance)
          });
        }
        
        setRepaymentSchedule(simpleSchedule);
      } finally {
        setLoading(false);
      }
    };
    
    calculateLoan();
  }, [amount, term, interestRate]);
  
  // Handle amount change
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    }
  };
  
  // Handle amount slider change
  const handleAmountSliderChange = (_event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
  };
  
  // Handle term change
  const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 60) {
      setTerm(value);
    }
  };
  
  // Handle term slider change
  const handleTermSliderChange = (_event: Event, newValue: number | number[]) => {
    setTerm(newValue as number);
  };
  
  // Handle loan type change
  const handleLoanTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLoanType(event.target.value as string);
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(value);
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
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Loan Calculator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Adjust the sliders to calculate your loan repayment amounts.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={4}>
        {/* Input controls */}
        <Grid item xs={12} md={5}>
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel id="loan-type-label">Loan Type</InputLabel>
              <Select
                labelId="loan-type-label"
                id="loan-type"
                value={loanType}
                label="Loan Type"
                onChange={handleLoanTypeChange}
              >
                {loanTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label} ({type.interestRate}%)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box mb={3}>
            <Typography id="amount-slider" gutterBottom>
              Loan Amount
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  value={amount}
                  onChange={handleAmountSliderChange}
                  min={500000}
                  max={10000000}
                  step={100000}
                  aria-labelledby="amount-slider"
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatCurrency(value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  value={amount}
                  onChange={handleAmountChange}
                  inputProps={{
                    min: 500000,
                    max: 10000000,
                    type: 'number',
                    'aria-labelledby': 'amount-slider',
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                  size="small"
                  sx={{ width: 150 }}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Box mb={3}>
            <Typography id="term-slider" gutterBottom>
              Loan Term (months)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  value={term}
                  onChange={handleTermSliderChange}
                  min={1}
                  max={60}
                  step={1}
                  aria-labelledby="term-slider"
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} months`}
                />
              </Grid>
              <Grid item>
                <TextField
                  value={term}
                  onChange={handleTermChange}
                  inputProps={{
                    min: 1,
                    max: 60,
                    type: 'number',
                    'aria-labelledby': 'term-slider',
                  }}
                  size="small"
                  sx={{ width: 100 }}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Box mb={3}>
            <Typography gutterBottom>
              Interest Rate: {interestRate}% p.a.
            </Typography>
          </Box>
          
          {/* Summary Results */}
          <Paper variant="outlined" sx={{ p: 2, mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Loan Summary
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Monthly Payment:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(monthlyPayment)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Repayment:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(totalRepayment)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Interest:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(totalInterest)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Interest as % of Principal:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {amount > 0 ? ((totalInterest / amount) * 100).toFixed(1) : '0'}%
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        
        {/* Repayment schedule */}
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1" gutterBottom>
            Repayment Schedule
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : repaymentSchedule.length > 0 ? (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Payment</TableCell>
                    <TableCell align="right">Principal</TableCell>
                    <TableCell align="right">Interest</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repaymentSchedule.map((payment) => (
                    <TableRow key={payment.payment_number}>
                      <TableCell>{payment.payment_number}</TableCell>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.payment_amount)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.principal)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.interest)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.balance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No repayment schedule available
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LoanCalculator;