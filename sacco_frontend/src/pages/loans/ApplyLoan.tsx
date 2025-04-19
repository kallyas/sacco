import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LoanApplicationForm from '@/components/loans/LoanApplicationForm';
import LoanTypeSelector from '@/components/loans/LoanTypeSelector';

const ApplyLoan: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('PERSONAL');
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleLoanTypeChange = (typeId: string) => {
    setSelectedLoanType(typeId);
    // Move to application form after selecting loan type
    setActiveTab(1);
  };
  
  const handleSubmitSuccess = (loanId: number) => {
    // Navigate to the loan details page after successful submission
    navigate(`/loans/${loanId}`);
  };
  
  return (
    <Box>
      {/* Header and Breadcrumbs */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apply for a Loan
        </Typography>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link component={RouterLink} to="/dashboard" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/loans" color="inherit">
            Loans
          </Link>
          <Typography color="textPrimary">Apply</Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Loan Application Container */}
      <Paper sx={{ p: 3, mb: 4 }}>
        {/* Information Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete the application form below to apply for a loan. You'll receive a notification once your application has been reviewed.
        </Alert>
        
        {/* Application Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="1. Select Loan Type" />
            <Tab label="2. Application Form" disabled={activeTab < 1} />
            <Tab label="3. Review & Submit" disabled={activeTab < 2} />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <Box py={2}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Loan Type
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Choose the loan type that best fits your needs. Each loan type has different terms, interest rates, and eligibility criteria.
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box mt={3}>
                <LoanTypeSelector 
                  selectedType={selectedLoanType}
                  onChange={handleLoanTypeChange}
                />
              </Box>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Loan Application Form
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Please fill out the following form with accurate information. All fields marked with an asterisk (*) are required.
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box mt={3}>
                <LoanApplicationForm 
                  onSubmitSuccess={handleSubmitSuccess}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ApplyLoan;