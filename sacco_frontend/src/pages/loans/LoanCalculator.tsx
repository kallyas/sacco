import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LoanCalculator from '@/components/loans/LoanCalculator';

const LoanCalculatorPage: React.FC = () => {
  return (
    <Box>
      {/* Header and Breadcrumbs */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loan Calculator
        </Typography>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link component={RouterLink} to="/dashboard" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/loans" color="inherit">
            Loans
          </Link>
          <Typography color="textPrimary">Calculator</Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Information and Disclaimer */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Estimate Your Loan Payments
        </Typography>
        <Typography variant="body2" paragraph>
          Use this calculator to estimate your monthly payments and view a detailed repayment schedule for different loan types.
          Adjust the loan amount, term, and type to see how it affects your repayment.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Alert severity="info">
          This calculator provides an estimate only. Actual loan terms and conditions may vary based on your personal circumstances,
          credit score, and our loan committee's assessment. Interest rates shown are indicative and subject to change.
        </Alert>
      </Paper>
      
      {/* Loan Calculator Component */}
      <LoanCalculator />
      
      {/* Additional Information */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Understanding Your Loan Options
        </Typography>
        <Typography variant="body2" paragraph>
          Our SACCO offers several loan types to meet your financial needs:
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Personal Loans
        </Typography>
        <Typography variant="body2" paragraph>
          Designed for personal expenses such as medical bills, education, or travel.
          Interest rate: 15% per annum, maximum term of 24 months.
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Business Loans
        </Typography>
        <Typography variant="body2" paragraph>
          For business expansion, inventory purchase, or working capital needs.
          Interest rate: 12% per annum, maximum term of 36 months.
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Education Loans
        </Typography>
        <Typography variant="body2" paragraph>
          Specifically for tuition fees, books, and other educational expenses.
          Interest rate: 10% per annum, maximum term of 48 months.
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Home Improvement Loans
        </Typography>
        <Typography variant="body2" paragraph>
          For home repairs, renovations, or improvements.
          Interest rate: 13% per annum, maximum term of 36 months.
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Emergency Loans
        </Typography>
        <Typography variant="body2" paragraph>
          Quick access to funds for urgent and unexpected financial needs.
          Interest rate: 18% per annum, maximum term of 6 months.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" paragraph>
          To apply for a loan, you need to be a registered member with our SACCO for at least 3 months,
          have regular savings deposits, and meet our eligibility criteria. For more information about our loan products,
          please contact our loan officers or visit our office.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoanCalculatorPage;