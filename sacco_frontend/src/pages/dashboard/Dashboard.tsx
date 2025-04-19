import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  MonetizationOn as LoanIcon,
  PeopleAlt as MemberIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// In a real application, these would come from API calls
const mockData = {
  totalMembers: 1245,
  activeLoanCount: 320,
  totalSavingsBalance: 458790000, // in UGX
  totalLoanOutstanding: 289450000, // in UGX
  recentTransactions: [
    {
      id: 1,
      date: "2025-04-15",
      type: "DEPOSIT",
      amount: 500000,
      member: "John Doe",
    },
    {
      id: 2,
      date: "2025-04-14",
      type: "WITHDRAWAL",
      amount: 250000,
      member: "Jane Smith",
    },
    {
      id: 3,
      date: "2025-04-14",
      type: "LOAN_REPAYMENT",
      amount: 300000,
      member: "Robert Johnson",
    },
    {
      id: 4,
      date: "2025-04-13",
      type: "DEPOSIT",
      amount: 1000000,
      member: "Mary Williams",
    },
    {
      id: 5,
      date: "2025-04-12",
      type: "LOAN_DISBURSEMENT",
      amount: 5000000,
      member: "James Brown",
    },
  ],
  pendingApplications: [
    {
      id: 101,
      date: "2025-04-15",
      type: "LOAN",
      amount: 3000000,
      member: "Alice Cooper",
    },
    {
      id: 102,
      date: "2025-04-14",
      type: "MEMBERSHIP",
      amount: 0,
      member: "Bob Dylan",
    },
    {
      id: 103,
      date: "2025-04-13",
      type: "LOAN",
      amount: 2000000,
      member: "Charlie Parker",
    },
  ],
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockData);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionTypeColor = (type: string): string => {
    switch (type) {
      case "DEPOSIT":
        return theme.palette.success.main;
      case "WITHDRAWAL":
        return theme.palette.error.main;
      case "LOAN_REPAYMENT":
        return theme.palette.info.main;
      case "LOAN_DISBURSEMENT":
        return theme.palette.warning.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {user?.first_name} {user?.last_name}
        </Typography>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Total Members
                      </Typography>
                      <Typography variant="h5" component="div">
                        {dashboardData.totalMembers.toLocaleString()}
                      </Typography>
                    </Box>
                    <MemberIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.light,
                        backgroundColor: theme.palette.primary.light + "20",
                        padding: 1,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Active Loans
                      </Typography>
                      <Typography variant="h5" component="div">
                        {dashboardData.activeLoanCount.toLocaleString()}
                      </Typography>
                    </Box>
                    <LoanIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.warning.light,
                        backgroundColor: theme.palette.warning.light + "20",
                        padding: 1,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Total Savings
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatCurrency(dashboardData.totalSavingsBalance)}
                      </Typography>
                    </Box>
                    <WalletIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.success.light,
                        backgroundColor: theme.palette.success.light + "20",
                        padding: 1,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Loan Portfolio
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatCurrency(dashboardData.totalLoanOutstanding)}
                      </Typography>
                    </Box>
                    <PaymentIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.info.light,
                        backgroundColor: theme.palette.info.light + "20",
                        padding: 1,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Transactions and Pending Applications */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">Recent Transactions</Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate("/transactions")}
                  >
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {dashboardData.recentTransactions.map((transaction) => (
                  <Box key={transaction.id} mb={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.member}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(transaction.date)} •{" "}
                          {transaction.type.replace("_", " ")}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color={getTransactionTypeColor(transaction.type)}
                      >
                        {transaction.type === "DEPOSIT" ||
                        transaction.type === "LOAN_REPAYMENT"
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </Box>
                    {transaction.id !==
                      dashboardData.recentTransactions[
                        dashboardData.recentTransactions.length - 1
                      ].id && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">Pending Applications</Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate("/applications")}
                  >
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {dashboardData.pendingApplications.length > 0 ? (
                  dashboardData.pendingApplications.map((application) => (
                    <Box key={application.id} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {application.member}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(application.date)} • {application.type}{" "}
                            Application
                          </Typography>
                        </Box>
                        {application.type === "LOAN" && (
                          <Typography variant="body2" fontWeight={500}>
                            {formatCurrency(application.amount)}
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`/applications/${application.id}`)
                          }
                        >
                          Review
                        </Button>
                      </Box>
                      {application.id !==
                        dashboardData.pendingApplications[
                          dashboardData.pendingApplications.length - 1
                        ].id && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    No pending applications
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MemberIcon />}
                      onClick={() => navigate("/members/add")}
                      sx={{ py: 1.5 }}
                    >
                      Add Member
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<WalletIcon />}
                      onClick={() => navigate("/savings/new")}
                      sx={{ py: 1.5 }}
                    >
                      New Account
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LoanIcon />}
                      onClick={() => navigate("/loans/apply")}
                      sx={{ py: 1.5 }}
                    >
                      Apply for Loan
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PaymentIcon />}
                      onClick={() => navigate("/transactions/new")}
                      sx={{ py: 1.5 }}
                    >
                      New Transaction
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
