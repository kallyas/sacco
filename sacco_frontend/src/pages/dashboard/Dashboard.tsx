import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Button,
  alpha,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  styled,
  Menu,
  MenuItem,
  CardHeader,
  CircularProgress,
  Container,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalance,
  MonetizationOn,
  Person,
  Group,
  ArrowForward,
  EventNote,
  CreditCard,
  Savings,
  BarChart,
  CalendarMonth,
  Campaign,
  FilterList,
  BookmarkBorder,
  Bookmark,
  TrendingUp,
  Schedule,
  ArrowRightAlt,
  Add,
  NotificationsActive,
  ChevronRight,
} from "@mui/icons-material";

// Mock data (same as original file)
const accountSummary = {
  totalSavings: 4250000,
  savingsIncrease: 8.2,
  loanBalance: 1500000,
  availableCredit: 2750000,
  contributionProgress: 75,
  nextPaymentDate: "May 15, 2025",
  shareValue: 10500,
  dividends: 320000,
  targets: {
    annual: 5000000,
    current: 4250000,
  },
  savingsTrend: [
    { month: "Nov", amount: 3800000 },
    { month: "Dec", amount: 3920000 },
    { month: "Jan", amount: 4000000 },
    { month: "Feb", amount: 4080000 },
    { month: "Mar", amount: 4160000 },
    { month: "Apr", amount: 4250000 },
  ],
};

const recentTransactions = [
  {
    id: "tr1",
    type: "deposit",
    amount: 50000,
    date: "Apr 26, 2025",
    description: "Monthly contribution",
    status: "completed",
  },
  {
    id: "tr2",
    type: "loan_payment",
    amount: 120000,
    date: "Apr 20, 2025",
    description: "Loan repayment",
    status: "completed",
  },
  {
    id: "tr3",
    type: "withdrawal",
    amount: 35000,
    date: "Apr 15, 2025",
    description: "ATM withdrawal",
    status: "completed",
  },
  {
    id: "tr4",
    type: "interest",
    amount: 5800,
    date: "Apr 10, 2025",
    description: "Savings interest",
    status: "pending",
  },
];

const upcomingMeetings = [
  {
    id: "m1",
    title: "Annual General Meeting",
    date: "May 30, 2025",
    time: "10:00 AM",
    location: "SACCO Main Hall",
    important: true,
  },
  {
    id: "m2",
    title: "Financial Literacy Workshop",
    date: "May 15, 2025",
    time: "2:00 PM",
    location: "Training Center",
    important: false,
  },
  {
    id: "m3",
    title: "Committee Elections",
    date: "Jun 10, 2025",
    time: "9:00 AM",
    location: "SACCO Main Hall",
    important: true,
  },
];

const loanOpportunities = [
  {
    id: "l1",
    name: "Education Loan",
    interestRate: 8,
    maxAmount: 1000000,
    duration: "12 months",
    eligibility: "6+ months membership",
    tag: "popular",
  },
  {
    id: "l2",
    name: "Business Expansion",
    interestRate: 12,
    maxAmount: 5000000,
    duration: "48 months",
    eligibility: "12+ months membership",
    tag: "high-value",
  },
  {
    id: "l3",
    name: "Emergency Loan",
    interestRate: 6,
    maxAmount: 500000,
    duration: "6 months",
    eligibility: "3+ months membership",
    tag: "quick-approval",
  },
  {
    id: "l4",
    name: "Home Improvement",
    interestRate: 10,
    maxAmount: 3000000,
    duration: "24 months",
    eligibility: "6+ months membership",
    tag: "popular",
  },
  {
    id: "l5",
    name: "Vehicle Loan",
    interestRate: 9,
    maxAmount: 2000000,
    duration: "36 months",
    eligibility: "12+ months membership",
    tag: "high-value",
  },
];

const announcements = [
  {
    id: "a1",
    title: "New Mobile Banking App",
    content:
      "Download our new mobile banking app for easier access to your SACCO account.",
    date: "Apr 25, 2025",
    category: "digital",
  },
  {
    id: "a2",
    title: "Interest Rate Update",
    content: "Savings interest rates will increase by 0.5% starting June 1st.",
    date: "Apr 22, 2025",
    category: "financial",
  },
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Styled components
const ModernCard = styled(Card)(() => ({
  boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.08)",
  borderRadius: 16,
  height: "100%",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  overflow: "hidden",
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-3px)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  "&::before": {
    content: '""',
    width: 4,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    display: "inline-block",
    marginRight: theme.spacing(1.5),
    borderRadius: 2,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2.5),
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
  },
  height: "100%",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.2, 3),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
}));

const CircularProgressWithLabel = ({
  value,
  color,
  size = 80,
}: {
  value: number;
  color: string;
  size?: number;
}) => {

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={5}
        sx={{
          color: alpha(color, 0.15),
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={5}
        sx={{
          color,
          position: "absolute",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight={700}
          fontSize="1.1rem"
          color={color}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

// Dashboard component
const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedLoans, setBookmarkedLoans] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);


  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleBookmarkToggle = (loanId: string) => {
    setBookmarkedLoans((prev) =>
      prev.includes(loanId)
        ? prev.filter((id) => id !== loanId)
        : [...prev, loanId]
    );
  };

  // Calculate savings target progress
  const savingsTargetProgress = Math.round(
    (accountSummary.targets.current / accountSummary.targets.annual) * 100
  );

  // Calculate loan payment progress
  const loanProgress = accountSummary.contributionProgress;


  return (
    <Box sx={{ bgcolor: "#f8f9fc", minHeight: "100vh" }}>
      {/* Main Content Container */}
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Section with Financial Summary */}
        <Box
          sx={{
            mb: 3,
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}
          <Box
            sx={{
              position: "absolute",
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: alpha("#fff", 0.05),
              top: -30,
              right: -30,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: alpha("#fff", 0.05),
              bottom: -20,
              left: "45%",
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                  Welcome back, Sarah
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, opacity: 0.9, fontWeight: 500 }}
                >
                  Your financial summary is looking good. You have{" "}
                  <Typography
                    component="span"
                    fontWeight={700}
                    sx={{ color: "#fff" }}
                  >
                    {formatCurrency(accountSummary.availableCredit)}
                  </Typography>{" "}
                  available for loans.
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <ActionButton
                  variant="contained"
                  color="secondary"
                  startIcon={<CreditCard />}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: alpha("#fff", 0.18),
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.25),
                    },
                  }}
                >
                  Apply for Loan
                </ActionButton>
                <ActionButton
                  variant="contained"
                  startIcon={<Savings />}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: alpha("#fff", 0.1),
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.15),
                    },
                  }}
                >
                  Make Deposit
                </ActionButton>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      bgcolor: alpha("#fff", 0.1),
                      borderRadius: 3,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ opacity: 0.9, mb: 0.5 }}
                    >
                      Total Savings
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ArrowUpward sx={{ color: "#4caf50", fontSize: 16 }} />
                      <Typography variant="h5" fontWeight={700}>
                        {formatCurrency(accountSummary.totalSavings)}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      +{accountSummary.savingsIncrease}% from last month
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      bgcolor: alpha("#fff", 0.1),
                      borderRadius: 3,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ opacity: 0.9, mb: 0.5 }}
                    >
                      2024 Dividends
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#ffd700">
                      {formatCurrency(accountSummary.dividends)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 0.5 }}
                    >
                      <TrendingUp sx={{ fontSize: 14 }} />
                      <Typography variant="caption">
                        12% increase from 2023
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Financial Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Account Balance Card */}
          <Grid item xs={12} md={8} lg={9}>
            <ModernCard>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Account Overview
                    </Typography>
                    <Tabs
                      value={tabValue}
                      onChange={(e, newValue) => setTabValue(newValue)}
                      sx={{
                        minHeight: 40,
                        "& .MuiTabs-indicator": {
                          backgroundColor: theme.palette.primary.main,
                          height: 3,
                          borderRadius: 1.5,
                        },
                        "& .MuiTab-root": {
                          textTransform: "none",
                          fontWeight: 600,
                          minHeight: 40,
                          minWidth: 100,
                          px: 2,
                        },
                      }}
                    >
                      <Tab label="Savings" />
                      <Tab label="Loans" />
                      {/* Consider removing if not actively used/populated */}
                      {/* <Tab label="Investments" /> */}
                    </Tabs>
                  </Stack>

                  {tabValue === 0 && (
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1.5}>
                            <Typography variant="body2" color="text.secondary">
                              Current Balance
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="primary"
                            >
                              {formatCurrency(accountSummary.totalSavings)}
                            </Typography>
                            <Chip
                              icon={<ArrowUpward fontSize="small" />}
                              label={`+${accountSummary.savingsIncrease}% increase`}
                              size="small"
                              sx={{
                                bgcolor: alpha("#4caf50", 0.1),
                                color: "#4caf50",
                                fontWeight: 600,
                                borderRadius: 1.5,
                                width: "fit-content",
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 2 }}
                            >
                              Your savings are growing steadily. Consider
                              setting a higher annual target to maximize your
                              returns.
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  height: 200,
                                  width: "100%",
                                  bgcolor: alpha("#f5f5f5", 0.5),
                                  borderRadius: 3,
                                  p: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Savings growth chart would appear here
                                </Typography>
                              </Box>
                            </Box>

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                              <Grid item xs={6}>
                                <StatCard>
                                  <Stack spacing={1} width="100%">
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 38,
                                          height: 38,
                                          bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                          ),
                                          color: theme.palette.primary.main,
                                        }}
                                      >
                                        <TrendingUp />
                                      </Avatar>
                                      <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                      >
                                        Annual Target
                                      </Typography>
                                    </Stack>
                                    <Box>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Typography
                                          variant="subtitle1"
                                          fontWeight={700}
                                        >
                                          {formatCurrency(
                                            accountSummary.targets.annual
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight={600}
                                          color="primary"
                                        >
                                          {savingsTargetProgress}%
                                        </Typography>
                                      </Stack>
                                      <LinearProgress
                                        variant="determinate"
                                        value={savingsTargetProgress}
                                        sx={{
                                          height: 8,
                                          borderRadius: 4,
                                          mt: 1,
                                          mb: 0.5,
                                          bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                          ),
                                          "& .MuiLinearProgress-bar": {
                                            bgcolor: theme.palette.primary.main,
                                          },
                                        }}
                                      />
                                    </Box>
                                  </Stack>
                                </StatCard>
                              </Grid>
                              <Grid item xs={6}>
                                <StatCard>
                                  <Stack spacing={1} width="100%">
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 38,
                                          height: 38,
                                          bgcolor: alpha("#f9a825", 0.1),
                                          color: "#f9a825",
                                        }}
                                      >
                                        <MonetizationOn />
                                      </Avatar>
                                      <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                      >
                                        Share Value
                                      </Typography>
                                    </Stack>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      {formatCurrency(
                                        accountSummary.shareValue
                                      )}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label="Per Share"
                                      sx={{
                                        bgcolor: alpha("#f9a825", 0.1),
                                        color: "#f9a825",
                                        fontWeight: 500,
                                        width: "fit-content",
                                      }}
                                    />
                                  </Stack>
                                </StatCard>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                      >
                        <Button
                          startIcon={<BarChart />}
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          View History
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 30,
                            px: 3,
                          }}
                        >
                          Add Funds
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                          <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                              Current Loan Balance
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="error.main"
                            >
                              {formatCurrency(accountSummary.loanBalance)}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <CircularProgressWithLabel
                                value={loanProgress}
                                color={theme.palette.error.main}
                                size={75}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Loan Repayment Progress
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="text.primary"
                                >
                                  {loanProgress}% completed
                                </Typography>
                              </Box>
                            </Box>
                            <Paper
                              sx={{
                                p: 1.5,
                                bgcolor: alpha(theme.palette.info.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(
                                  theme.palette.info.main,
                                  0.2
                                )}`,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Schedule fontSize="small" color="info" />
                              <Box>
                                <Typography
                                  variant="caption"
                                  fontWeight={600}
                                  color="info.main"
                                >
                                  Next Payment Due
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {accountSummary.nextPaymentDate}
                                </Typography>
                              </Box>
                            </Paper>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <Box
                            sx={{
                              p: 2.5,
                              bgcolor: alpha("#f8f9fc", 0.7),
                              borderRadius: 3,
                              height: "100%",
                              border: `1px solid ${alpha("#000", 0.06)}`,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{ mb: 2 }}
                            >
                              Loan Payment Schedule
                            </Typography>
                            <Box
                              sx={{
                                height: 180,
                                width: "100%",
                                bgcolor: alpha("#f5f5f5", 0.5),
                                borderRadius: 3,
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Loan payment schedule chart would appear here
                              </Typography>
                            </Box>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Stack spacing={0.5}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Available Credit
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  color="primary"
                                >
                                  {formatCurrency(
                                    accountSummary.availableCredit
                                  )}
                                </Typography>
                              </Stack>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 600,
                                  borderRadius: 30,
                                }}
                              >
                                Make Payment
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Investment tab:  Removed or kept based on data availability and user needs */}
                  {/* {tabValue === 2 && (
                    <Box sx={{ p: 2, textAlign: 'center', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1">
                        Investment performance details would appear here
                      </Typography>
                    </Box>
                  )} */}
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Quick Stats Cards */}
          <Grid item xs={12} md={4} lg={3}>
            <Grid
              container
              spacing={3}
              direction={{ xs: "row", md: "column" }}
              height="100%"
            >
              <Grid item xs={12}>
                <ModernCard>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      Member Statistics
                    </Typography>
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Member Since
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            June 2020
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha("#f9a825", 0.1),
                            color: "#f9a825",
                          }}
                        >
                          <Group />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            SACCO Members
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            2,450 Members
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </ModernCard>
              </Grid>

              <Grid item xs={12}>
                <ModernCard sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      Quick Actions
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CreditCard />}
                        sx={{
                          justifyContent: "flex-start",
                          p: 1.5,
                          fontWeight: 500,
                          textTransform: "none",
                          borderRadius: 2,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }}
                      >
                        Apply for Loan
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Savings />}
                        sx={{
                          justifyContent: "flex-start",
                          p: 1.5,
                          fontWeight: 500,
                          textTransform: "none",
                          borderRadius: 2,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }}
                      >
                        Make Deposit
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CalendarMonth />}
                        sx={{
                          justifyContent: "flex-start",
                          p: 1.5,
                          fontWeight: 500,
                          textTransform: "none",
                          borderRadius: 2,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }}
                      >
                        Schedule Meeting
                      </Button>
                    </Stack>
                  </CardContent>
                </ModernCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Transactions Section */}
        <SectionTitle variant="h6" sx={{ mt: 4 }}>
          Recent Activities
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ModernCard>
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Recent Transactions
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton
                        size="small"
                        onClick={handleFilterOpen}
                        sx={{ bgcolor: alpha("#000", 0.04) }}
                      >
                        <FilterList fontSize="small" />
                      </IconButton>
                      <Button
                        endIcon={<ArrowRightAlt />}
                        size="small"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        View All
                      </Button>
                    </Stack>
                  </Stack>
                }
                sx={{ px: 3, pt: 2, pb: 1 }}
              />

              <Box sx={{ px: 1 }}>
                <List sx={{ p: 0 }}>
                  {recentTransactions.map((transaction, index) => {
                    let icon;
                    let color;
                    let bgColor;

                    switch (transaction.type) {
                      case "deposit":
                        icon = <ArrowUpward />;
                        color = "#4caf50";
                        bgColor = alpha("#4caf50", 0.1);
                        break;
                      case "withdrawal":
                        icon = <ArrowDownward />;
                        color = "#f44336";
                        bgColor = alpha("#f44336", 0.1);
                        break;
                      case "loan_payment":
                        icon = <MonetizationOn />;
                        color = theme.palette.primary.main;
                        bgColor = alpha(theme.palette.primary.main, 0.1);
                        break;
                      case "interest":
                        icon = <AccountBalance />;
                        color = "#f9a825";
                        bgColor = alpha("#f9a825", 0.1);
                        break;
                      default:
                        icon = <MonetizationOn />;
                        color = theme.palette.primary.main;
                        bgColor = alpha(theme.palette.primary.main, 0.1);
                    }

                    return (
                      <React.Fragment key={transaction.id}>
                        <ListItem
                          sx={{
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: alpha("#000", 0.02) },
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              mb: { xs: 1.5, sm: 0 },
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: bgColor,
                                color: color,
                                mr: 2,
                                width: 44,
                                height: 44,
                              }}
                            >
                              {icon}
                            </Avatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {transaction.description}
                                </Typography>
                              }
                              secondary={transaction.date}
                              secondaryTypographyProps={{ variant: "caption" }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: { xs: "flex-start", sm: "flex-end" },
                              ml: { xs: 7, sm: 0 },
                              mt: { xs: 0.5, sm: 0 },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              color={
                                transaction.type === "withdrawal"
                                  ? "#f44336"
                                  : color
                              }
                            >
                              {transaction.type === "withdrawal"
                                ? `-${formatCurrency(transaction.amount)}`
                                : `+${formatCurrency(transaction.amount)}`}
                            </Typography>
                            <Chip
                              label={
                                transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)
                              }
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 22,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                bgcolor:
                                  transaction.status === "pending"
                                    ? alpha("#f9a825", 0.1)
                                    : alpha("#4caf50", 0.1),
                                color:
                                  transaction.status === "pending"
                                    ? "#f9a825"
                                    : "#4caf50",
                                borderRadius: 1.5,
                              }}
                            />
                          </Box>
                        </ListItem>
                        {index < recentTransactions.length - 1 && (
                          <Divider variant="inset" sx={{ ml: 9 }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </List>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ModernCard>
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Upcoming Meetings
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: alpha("#000", 0.04) }}
                    >
                      <CalendarMonth fontSize="small" />
                    </IconButton>
                  </Stack>
                }
                sx={{ px: 2.5, pt: 2, pb: 1 }}
              />

              <List sx={{ p: 0.5 }}>
                {upcomingMeetings.map((meeting) => (
                  <React.Fragment key={meeting.id}>
                    <ListItem
                      sx={{
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        transition: "background-color 0.2s, transform 0.2s",
                        "&:hover": {
                          bgcolor: alpha("#000", 0.02),
                          transform: "translateX(5px)",
                        },
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        width="100%"
                        mb={1}
                      >
                        <Avatar
                          sx={{
                            bgcolor: meeting.important
                              ? alpha("#f44336", 0.1)
                              : alpha(theme.palette.primary.main, 0.1),
                            color: meeting.important
                              ? "#f44336"
                              : theme.palette.primary.main,
                          }}
                        >
                          <EventNote />
                        </Avatar>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {meeting.title}
                          </Typography>
                          <IconButton size="small">
                            <ChevronRight fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          ml: 7,
                          p: 1,
                          bgcolor: alpha("#f8f9fc", 0.7),
                          borderRadius: 1.5,
                          width: "calc(100% - 56px)",
                        }}
                      >
                        <Stack sx={{ minWidth: 80 }}>
                          <Typography variant="caption" color="text.secondary">
                            Date & Time
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {meeting.date}, {meeting.time}
                          </Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack>
                          <Typography variant="caption" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {meeting.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      {meeting.important && (
                        <Chip
                          icon={<NotificationsActive fontSize="small" />}
                          label="Important Meeting"
                          size="small"
                          sx={{
                            ml: 7,
                            mt: 1,
                            bgcolor: alpha("#f44336", 0.1),
                            color: "#f44336",
                            fontWeight: 600,
                            borderRadius: 1.5,
                          }}
                        />
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>

              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    borderRadius: 30,
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  View All Meetings
                </Button>
              </Box>
            </ModernCard>
          </Grid>
        </Grid>

        {/* Loan Opportunities Section */}
        <SectionTitle variant="h6" sx={{ mt: 4 }}>
          Loan Opportunities
        </SectionTitle>

        <Grid container spacing={3}>
          {loanOpportunities.map((loan) => (
            <Grid item xs={12} sm={6} md={4} key={loan.id}>
              <ModernCard>
                <Box
                  sx={{
                    p: 2.5,
                    pb: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Chip
                      label={
                        loan.tag === "popular"
                          ? "Popular"
                          : loan.tag === "high-value"
                          ? "High Value"
                          : "Quick Approval"
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          loan.tag === "popular"
                            ? alpha(theme.palette.primary.main, 0.1)
                            : loan.tag === "high-value"
                            ? alpha("#f9a825", 0.1)
                            : alpha("#2196f3", 0.1),
                        color:
                          loan.tag === "popular"
                            ? theme.palette.primary.main
                            : loan.tag === "high-value"
                            ? "#f9a825"
                            : "#2196f3",
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    />
                    <Typography variant="h6" fontWeight={700}>
                      {loan.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleBookmarkToggle(loan.id)}
                    sx={{
                      color: bookmarkedLoans.includes(loan.id)
                        ? theme.palette.primary.main
                        : "text.secondary",
                    }}
                  >
                    {bookmarkedLoans.includes(loan.id) ? (
                      <Bookmark fontSize="small" />
                    ) : (
                      <BookmarkBorder fontSize="small" />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ pt: 2 }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    gutterBottom
                  >
                    {formatCurrency(loan.maxAmount)}
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Interest Rate</Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="primary.dark"
                      >
                        {loan.interestRate}% p.a.
                      </Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Max Duration:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {loan.duration}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Eligibility:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {loan.eligibility}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 8,
                      py: 1.2,
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </ModernCard>
            </Grid>
          ))}
        </Grid>

        {/* Announcements Section */}
        <SectionTitle variant="h6" sx={{ mt: 4 }}>
          Latest Announcements
        </SectionTitle>

        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} md={6} key={announcement.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: `1px solid ${alpha("#000", 0.08)}`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Campaign />
                  </Avatar>
                  <Box>
                    <Chip
                      label={announcement.category.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: alpha(
                          announcement.category === "digital"
                            ? "#2196f3"
                            : theme.palette.primary.main,
                          0.1
                        ),
                        color:
                          announcement.category === "digital"
                            ? "#2196f3"
                            : theme.palette.primary.main,
                        fontWeight: 600,
                        mb: 1,
                        height: 22,
                        fontSize: "0.65rem",
                      }}
                    />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {announcement.content}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {announcement.date}
                      </Typography>
                      <Button
                        endIcon={<ArrowForward />}
                        size="small"
                        sx={{
                          color: theme.palette.primary.main,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Read More
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Financial Advisory CTA */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(
                "#ffd700",
                0.15
              )} 0%, ${alpha("#ffd700", 0.25)} 100%)`,
              border: `1px solid ${alpha("#ffd700", 0.3)}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                backgroundColor: alpha("#ffd700", 0.2),
                top: -40,
                right: -20,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: alpha("#ffd700", 0.15),
                bottom: -30,
                left: "30%",
              }}
            />

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  mb={1}
                  color="#332800"
                >
                  Need Financial Advice?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  mb={{ xs: 2, md: 0 }}
                >
                  Our financial advisors are ready to help you plan your
                  finances and investments. Schedule a free consultation to get
                  personalized advice on savings, loans, and investment
                  opportunities.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffd700 0%, #e6c300 100%)",
                    color: "#333",
                    "&:hover": {
                      bgcolor: "#e6c300",
                    },
                    borderRadius: 30,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  Schedule Consultation
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>

      {/* Menus */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemText primary="Add to Calendar" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemText primary="Set Reminder" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemText primary="Share Meeting" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="All Transactions" />
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="Deposits Only" />
          <ListItemText primary="Deposits Only" />
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="Withdrawals Only" />
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="Loan Payments" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard;
