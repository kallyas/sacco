import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loansApi } from "@/api/loans.api";
import { membersApi } from "@/api/members.api";
import { Member } from "@/types/member.types";
import {
  LoanApplicationRequest,
  LoanEligibilityResponse,
} from "@/types/loan.types";
import { useAuth } from "@/hooks/useAuth";

interface LoanApplicationFormProps {
  onSubmitSuccess?: (loanId: number) => void;
}

const LOAN_TYPES = [
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "BUSINESS", label: "Business Loan" },
  { value: "EMERGENCY", label: "Emergency Loan" },
  { value: "EDUCATION", label: "Education Loan" },
  { value: "HOME", label: "Home Improvement Loan" },
];

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onSubmitSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [eligibility, setEligibility] =
    useState<LoanEligibilityResponse | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const [member, setMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<LoanApplicationRequest>({
    member: 0,
    loan_type: "PERSONAL",
    amount_requested: 1000000,
    purpose: "",
    employment_details: "",
    monthly_income: 0,
    collateral_details: "",
  });

  const [loanCalculation, setLoanCalculation] = useState<{
    monthly_payment: number;
    total_repayment: number;
    total_interest: number;
    schedule: Array<{
      payment_number: number;
      payment_date: string;
      payment_amount: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get current member info on load
  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (user) {
          // For direct user applications
          const memberData = await membersApi.getCurrentMember();
          setMember(memberData);
          setFormData((prev) => ({
            ...prev,
            member: memberData.id,
            monthly_income: memberData.monthly_income,
            employment_details:
              memberData.employment_status === "SELF_EMPLOYED"
                ? `Self-employed as ${memberData.occupation}`
                : memberData.employment_status === "EMPLOYED"
                ? `Employed as ${memberData.occupation}`
                : memberData.employment_status,
          }));

          // Check eligibility
          checkEligibility(memberData.id);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Failed to load member data. Please try again.");
      }
    };

    fetchMember();
  }, [user]);

  // Check loan eligibility
  const checkEligibility = async (memberId: number) => {
    setCheckingEligibility(true);
    try {
      const eligibilityData = await loansApi.checkEligibility(memberId);
      setEligibility(eligibilityData);

      // If eligible, update max amount
      if (eligibilityData.eligible && eligibilityData.max_amount) {
        setFormData((prev) => ({
          ...prev,
          amount_requested: Math.min(
            prev.amount_requested,
            eligibilityData.max_amount || 0
          ),
        }));
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      setError("Failed to check loan eligibility. Please try again.");
    } finally {
      setCheckingEligibility(false);
    }
  };

  // Calculate loan repayment details
  useEffect(() => {
    const calculateLoan = async () => {
      if (formData.amount_requested > 0 && formData.loan_type) {
        try {
          // Determine interest rate based on loan type
          // In a real application, this would come from the backend
          let interestRate;
          switch (formData.loan_type) {
            case "PERSONAL":
              interestRate = 15;
              break;
            case "BUSINESS":
              interestRate = 12;
              break;
            case "EMERGENCY":
              interestRate = 18;
              break;
            case "EDUCATION":
              interestRate = 10;
              break;
            case "HOME":
              interestRate = 13;
              break;
            default:
              interestRate = 15;
          }

          const calculation = await loansApi.calculateLoanRepayment(
            formData.amount_requested,
            formData.loan_type === "EMERGENCY" ? 6 : 12, // Default term
            interestRate
          );

          setLoanCalculation(calculation);
        } catch (error) {
          console.error("Error calculating loan:", error);
        }
      }
    };

    calculateLoan();
  }, [formData.amount_requested, formData.loan_type]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear any existing error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle amount slider change
  const handleAmountChange = (event: Event, newValue: number | number[]) => {
    const amount = newValue as number;
    setFormData((prev) => ({ ...prev, amount_requested: amount }));
  };

  // Validate form fields
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.loan_type) {
      errors.loan_type = "Loan type is required";
    }

    if (!formData.amount_requested || formData.amount_requested <= 0) {
      errors.amount_requested = "Amount must be greater than zero";
    } else if (
      eligibility?.max_amount &&
      formData.amount_requested > eligibility.max_amount
    ) {
      errors.amount_requested = `Amount exceeds maximum eligible amount of ${formatCurrency(
        eligibility.max_amount
      )}`;
    }

    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required";
    }

    if (!formData.employment_details.trim()) {
      errors.employment_details = "Employment details are required";
    }

    if (!formData.monthly_income || formData.monthly_income <= 0) {
      errors.monthly_income = "Monthly income must be greater than zero";
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
      const response = await loansApi.applyForLoan(formData);
      setSuccess(true);

      // Notify parent component if callback provided
      if (onSubmitSuccess) {
        onSubmitSuccess(response.id);
      } else {
        // Navigate to loan details after successful application
        setTimeout(() => {
          navigate(`/loans/${response.id}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Loan application error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to submit loan application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Steps in loan application process
  const steps = ["Eligibility Check", "Loan Details", "Review & Submit"];

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Loan Eligibility
              </Typography>

              {checkingEligibility ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : eligibility ? (
                <Box>
                  {eligibility.eligible ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      You are eligible for a loan up to{" "}
                      {formatCurrency(eligibility.max_amount || 0)}
                    </Alert>
                  ) : (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {eligibility.message}
                    </Alert>
                  )}

                  {eligibility.eligible && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Eligibility Summary
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                              Maximum Amount:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(eligibility.max_amount || 0)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                              Maximum Term:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="medium">
                              {eligibility.max_term || 12} months
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  Unable to check eligibility. Please continue with your
                  application.
                </Alert>
              )}
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.loan_type}>
                <InputLabel id="loan-type-label">Loan Type</InputLabel>
                <Select
                  labelId="loan-type-label"
                  id="loan_type"
                  name="loan_type"
                  value={formData.loan_type}
                  label="Loan Type"
                  onChange={handleChange}
                >
                  {LOAN_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.loan_type && (
                  <FormHelperText>{formErrors.loan_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="monthly_income"
                name="monthly_income"
                label="Monthly Income"
                type="number"
                value={formData.monthly_income}
                onChange={handleChange}
                error={!!formErrors.monthly_income}
                helperText={formErrors.monthly_income}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography id="amount-slider" gutterBottom>
                Loan Amount: {formatCurrency(formData.amount_requested)}
              </Typography>
              <Slider
                aria-labelledby="amount-slider"
                value={formData.amount_requested}
                onChange={handleAmountChange}
                min={500000}
                max={eligibility?.max_amount || 10000000}
                step={100000}
                marks={[
                  { value: 500000, label: "500K" },
                  {
                    value: eligibility?.max_amount || 10000000,
                    label: formatCurrency(eligibility?.max_amount || 10000000),
                  },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatCurrency(value)}
              />
              {formErrors.amount_requested && (
                <FormHelperText error>
                  {formErrors.amount_requested}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="purpose"
                name="purpose"
                label="Loan Purpose"
                multiline
                rows={3}
                value={formData.purpose}
                onChange={handleChange}
                error={!!formErrors.purpose}
                helperText={formErrors.purpose}
                placeholder="Explain how you plan to use this loan"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="employment_details"
                name="employment_details"
                label="Employment Details"
                multiline
                rows={2}
                value={formData.employment_details}
                onChange={handleChange}
                error={!!formErrors.employment_details}
                helperText={formErrors.employment_details}
                placeholder="Your current employment status and details"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="collateral_details"
                name="collateral_details"
                label="Collateral Details (if any)"
                multiline
                rows={2}
                value={formData.collateral_details || ""}
                onChange={handleChange}
                error={!!formErrors.collateral_details}
                helperText={formErrors.collateral_details}
                placeholder="Any assets you can provide as collateral"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Loan Type:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {LOAN_TYPES.find(
                        (type) => type.value === formData.loan_type
                      )?.label || formData.loan_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Loan Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(formData.amount_requested)}
                    </Typography>
                  </Grid>

                  {loanCalculation && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Monthly Payment:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(loanCalculation.monthly_payment)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Total Repayment:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(loanCalculation.total_repayment)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Total Interest:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(loanCalculation.total_interest)}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Purpose:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">{formData.purpose}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {loanCalculation && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Repayment Schedule
                  </Typography>
                  <Paper sx={{ p: 2, overflowX: "auto" }}>
                    <Box sx={{ minWidth: 500 }}>
                      <Grid
                        container
                        spacing={1}
                        sx={{ mb: 1, fontWeight: "bold" }}
                      >
                        <Grid item xs={1}>
                          <Typography variant="body2">#</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2">Date</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">Payment</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">Principal</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">Interest</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">Balance</Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      {loanCalculation.schedule.map((payment) => (
                        <Box key={payment.payment_number}>
                          <Grid container spacing={1} sx={{ py: 1 }}>
                            <Grid item xs={1}>
                              <Typography variant="body2">
                                {payment.payment_number}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="body2">
                                {new Date(
                                  payment.payment_date
                                ).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="body2">
                                {formatCurrency(payment.payment_amount)}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="body2">
                                {formatCurrency(payment.principal)}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="body2">
                                {formatCurrency(payment.interest)}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="body2">
                                {formatCurrency(payment.balance)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Divider />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  Terms & Conditions
                </Typography>
                <Typography variant="body2" paragraph>
                  By submitting this loan application, I confirm that all the
                  information provided is true and accurate. I understand that
                  providing false information may result in my application being
                  rejected or legal action.
                </Typography>
                <Typography variant="body2" paragraph>
                  I agree to the terms and conditions of the loan and authorize
                  the SACCO to verify my information.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Loan application submitted successfully!
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
              Back
            </Button>
            <Box>
              <Button
                variant="contained"
                disabled={
                  (activeStep === 0 &&
                    (!eligibility || !eligibility.eligible)) ||
                  loading ||
                  success
                }
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext
                }
                sx={{ ml: 1 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  "Submit Application"
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanApplicationForm;
