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
  ListItemAvatar,
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
  MoreVert,
  CreditCard,
  Savings,
  BarChart,
  CalendarMonth,
  Notifications,
  Campaign,
  Download,
  Print,
  FilterList,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";

// Mock data for the dashboard
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
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
  transition: "box-shadow 0.3s ease",
  borderRadius: 12,
  height: "100%",
  "&:hover": {
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  },
  overflow: "hidden",
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const StatCard = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
}));

const HeaderButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2.5),
  textTransform: "none",
  fontWeight: 600,
}));

const CircularProgressWithLabel = (props) => {
  const { value, color, size = 80 } = props;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{
          color: alpha(color, 0.2),
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={4}
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
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight={600}
          fontSize="1rem"
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
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedLoans, setBookmarkedLoans] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleFilterOpen = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleBookmarkToggle = (loanId) => {
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Welcome Header Section */}
      <SectionContainer
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #1e5631 0%, #2a724a 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 3,
          p: { xs: 2, md: 4 },
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back, Sarah
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              Your SACCO account is in good standing. You have{" "}
              {formatCurrency(accountSummary.availableCredit)} available for
              loans.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <HeaderButton
                variant="contained"
                startIcon={<CreditCard />}
                fullWidth={isMobile}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Apply for Loan
              </HeaderButton>
              <HeaderButton
                variant="contained"
                startIcon={<Savings />}
                fullWidth={isMobile}
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                Make Deposit
              </HeaderButton>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={2}
              justifyContent={{ xs: "space-between", md: "flex-end" }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  textAlign: "center",
                  flex: { xs: 1, md: "0 1 auto" },
                  minWidth: { md: 140 },
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {formatCurrency(accountSummary.totalSavings)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Current Savings
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  textAlign: "center",
                  flex: { xs: 1, md: "0 1 auto" },
                  minWidth: { md: 140 },
                }}
              >
                <Typography variant="h5" fontWeight={700} color="#ffd700">
                  {formatCurrency(accountSummary.dividends)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  2024 Dividends
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Quick Stats Section */}
      <SectionContainer>
        <SectionTitle variant="h6">Account Overview</SectionTitle>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} sm={3}>
            <StatCard>
              <Avatar
                sx={{ bgcolor: alpha("#1e5631", 0.1), color: "#1e5631", mr: 2 }}
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
            </StatCard>
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCard>
              <Avatar
                sx={{ bgcolor: alpha("#f9a825", 0.1), color: "#f9a825", mr: 2 }}
              >
                <Group />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Members
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  2,450 Members
                </Typography>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCard>
              <Avatar
                sx={{ bgcolor: alpha("#2196f3", 0.1), color: "#2196f3", mr: 2 }}
              >
                <AccountBalance />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  SACCO Assets
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {formatCurrency(850000000)}
                </Typography>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCard>
              <Avatar
                sx={{ bgcolor: alpha("#4caf50", 0.1), color: "#4caf50", mr: 2 }}
              >
                <CreditCard />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Active Loans
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  1 Active Loan
                </Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Account Summary Section */}
      <SectionContainer>
        <SectionTitle variant="h6">Financial Summary</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Total Savings
                    </Typography>
                    <Chip
                      icon={<ArrowUpward fontSize="small" />}
                      label={`+${accountSummary.savingsIncrease}%`}
                      size="small"
                      sx={{
                        bgcolor: alpha("#4caf50", 0.1),
                        color: "#4caf50",
                        fontWeight: 500,
                      }}
                    />
                  </Stack>

                  <Typography variant="h4" fontWeight={700} color="#1e5631">
                    {formatCurrency(accountSummary.totalSavings)}
                  </Typography>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={0.5}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Annual Savings Target
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(accountSummary.targets.annual)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={savingsTargetProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha("#1e5631", 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#1e5631",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mt={0.5}
                      display="block"
                    >
                      {savingsTargetProgress}% of annual target
                    </Typography>
                  </Box>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      size="small"
                      startIcon={<BarChart />}
                      sx={{ color: "#1e5631" }}
                    >
                      View History
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Savings />}
                      sx={{ color: "#1e5631" }}
                    >
                      Add Funds
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Stack spacing={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Loan Balance
                  </Typography>

                  <Typography variant="h4" fontWeight={700} color="#d32f2f">
                    {formatCurrency(accountSummary.loanBalance)}
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", sm: "flex-start" },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <CircularProgressWithLabel
                        value={loanProgress}
                        color="#d32f2f"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Next payment:
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {accountSummary.nextPaymentDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {loanProgress}% completed
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      size="small"
                      startIcon={<BarChart />}
                      sx={{ color: "#d32f2f" }}
                    >
                      Payment Schedule
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 2 }}
                    >
                      Make Payment
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Transactions and Insights Section */}
      <SectionContainer>
        <SectionTitle variant="h6">Transactions & Insights</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <StyledCard>
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
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={handleFilterOpen}>
                        <FilterList fontSize="small" />
                      </IconButton>
                      <Button
                        endIcon={<ArrowForward />}
                        size="small"
                        sx={{ color: "#1e5631" }}
                      >
                        View All
                      </Button>
                    </Stack>
                  </Stack>
                }
              />

              <Divider />

              <List sx={{ p: 0 }}>
                {recentTransactions.map((transaction, index) => {
                  // Set icon and colors based on transaction type
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
                      color = "#2a724a";
                      bgColor = alpha("#2a724a", 0.1);
                      break;
                    case "interest":
                      icon = <AccountBalance />;
                      color = "#f9a825";
                      bgColor = alpha("#f9a825", 0.1);
                      break;
                    default:
                      icon = <MonetizationOn />;
                      color = "#1e5631";
                      bgColor = alpha("#1e5631", 0.1);
                  }

                  return (
                    <React.Fragment key={transaction.id}>
                      <ListItem
                        sx={{
                          px: 3,
                          py: 2,
                          "&:hover": { bgcolor: alpha("#000", 0.02) },
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            mb: { xs: 1, sm: 0 },
                            alignItems: "center",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: bgColor,
                                color: color,
                              }}
                            >
                              {icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={500}>
                                {transaction.description}
                              </Typography>
                            }
                            secondary={transaction.date}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: { xs: "flex-start", sm: "flex-end" },
                            pl: { xs: 7, sm: 0 },
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color={
                              transaction.type === "withdrawal"
                                ? "#f44336"
                                : "#1e5631"
                            }
                          >
                            {transaction.type === "withdrawal"
                              ? `-${formatCurrency(transaction.amount)}`
                              : `+${formatCurrency(transaction.amount)}`}
                          </Typography>
                          <Chip
                            label={transaction.status}
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: 20,
                              fontSize: "0.625rem",
                              bgcolor:
                                transaction.status === "pending"
                                  ? alpha("#f9a825", 0.1)
                                  : alpha("#4caf50", 0.1),
                              color:
                                transaction.status === "pending"
                                  ? "#f9a825"
                                  : "#4caf50",
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < recentTransactions.length - 1 && (
                        <Divider sx={{ mx: 3 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            </StyledCard>
          </Grid>

          <Grid item xs={12} lg={5}>
            <StyledCard>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${alpha("#000", 0.08)}`,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Financial Insights
                </Typography>
                <Tabs
                  value={tabValue}
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons={isMobile ? "auto" : false}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      minWidth: 0,
                      mr: 4,
                      p: 0,
                      color: "text.secondary",
                    },
                    "& .Mui-selected": {
                      color: "#1e5631",
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1e5631",
                    },
                  }}
                >
                  <Tab label="Savings Trend" />
                  <Tab label="Loan Schedule" />
                  <Tab label="Investment" />
                </Tabs>
              </Box>

              <CardContent>
                {tabValue === 0 && (
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={3}
                      alignItems="center"
                      justifyContent="space-around"
                      mb={3}
                      divider={
                        <Divider
                          orientation={isMobile ? "horizontal" : "vertical"}
                          flexItem
                        />
                      }
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          width: { xs: "100%", sm: "auto" },
                          py: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#1e5631"
                          gutterBottom
                        >
                          {formatCurrency(accountSummary.totalSavings)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current Balance
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: "center",
                          width: { xs: "100%", sm: "auto" },
                          py: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#4caf50"
                          gutterBottom
                        >
                          {formatCurrency(
                            accountSummary.savingsTrend[5].amount -
                              accountSummary.savingsTrend[0].amount
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          6-Month Growth
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: "center",
                          width: { xs: "100%", sm: "auto" },
                          py: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#f9a825"
                          gutterBottom
                        >
                          {formatCurrency(
                            accountSummary.targets.annual -
                              accountSummary.totalSavings
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target Shortfall
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      6-Month Savings Growth
                    </Typography>

                    {/* Chart placeholder */}
                    <Box
                      sx={{
                        height: 180,
                        width: "100%",
                        bgcolor: alpha("#f5f5f5", 0.5),
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Savings chart would appear here
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                      mt={2}
                    >
                      <Button
                        size="small"
                        startIcon={<Download />}
                        sx={{ color: "#1e5631" }}
                      >
                        Export
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Print />}
                        sx={{ color: "#1e5631" }}
                      >
                        Print
                      </Button>
                    </Stack>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body1">
                      Loan payment schedule details would appear here
                    </Typography>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body1">
                      Investment performance details would appear here
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Notifications and Community Section */}
      <SectionContainer>
        <SectionTitle variant="h6">Notifications & Community</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Announcements Card */}
            <StyledCard
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ px: 3, py: 2, bgcolor: alpha("#1e5631", 0.05) }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Announcements
                  </Typography>
                  <IconButton size="small">
                    <Campaign fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <List sx={{ p: 2, flex: 1, overflow: "auto" }}>
                {announcements.map((announcement, index) => (
                  <Box
                    key={announcement.id}
                    sx={{ mb: index < announcements.length - 1 ? 2 : 0 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: alpha("#1e5631", 0.1),
                          color: "#1e5631",
                        }}
                      >
                        <Notifications fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {announcement.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {announcement.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          {announcement.date}
                        </Typography>
                      </Box>
                    </Stack>
                    {index < announcements.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </List>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Meetings Card */}
            <StyledCard
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${alpha("#000", 0.08)}`,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Upcoming Meetings
                  </Typography>
                  <IconButton size="small">
                    <CalendarMonth fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <List sx={{ p: 0, flex: 1, overflow: "auto" }}>
                {upcomingMeetings.map((meeting, index) => (
                  <React.Fragment key={meeting.id}>
                    <ListItem
                      sx={{
                        px: 3,
                        py: 2,
                        "&:hover": { bgcolor: alpha("#000", 0.02) },
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          mb: { xs: 1, sm: 0 },
                          alignItems: "flex-start",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: meeting.important
                                ? alpha("#f44336", 0.1)
                                : alpha("#1e5631", 0.1),
                              color: meeting.important ? "#f44336" : "#1e5631",
                            }}
                          >
                            <EventNote />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              flexWrap="wrap"
                            >
                              <Typography variant="body1" fontWeight={600}>
                                {meeting.title}
                              </Typography>
                              {meeting.important && (
                                <Chip
                                  label="Important"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.625rem",
                                    bgcolor: alpha("#f44336", 0.1),
                                    color: "#f44336",
                                  }}
                                />
                              )}
                            </Stack>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                fontWeight={500}
                              >
                                {meeting.date} • {meeting.time}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                display="block"
                              >
                                {meeting.location}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={handleMenuOpen}
                        sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </ListItem>
                    {index < upcomingMeetings.length - 1 && (
                      <Divider sx={{ mx: 3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: alpha("#1e5631", 0.03),
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#1e5631",
                    color: "#1e5631",
                    "&:hover": {
                      borderColor: "#2a724a",
                      bgcolor: alpha("#1e5631", 0.05),
                    },
                    borderRadius: 4,
                  }}
                >
                  View All Meetings
                </Button>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Advisory Section */}
      <SectionContainer>
        <SectionTitle variant="h6">Financial Advisory</SectionTitle>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.2) 100%)",
            border: `1px solid ${alpha("#ffd700", 0.3)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Need Financial Advice?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={{ xs: 2, md: 0 }}
              >
                Our financial advisors are ready to help you plan your finances
                and investments. Schedule a free consultation to get
                personalized advice on savings, loans, and investment
                opportunities.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background:
                    "linear-gradient(135deg, #ffd700 0%, #e6c300 100%)",
                  color: "#333",
                  "&:hover": {
                    bgcolor: "#e6c300",
                  },
                  borderRadius: 8,
                  p: 1.5,
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                }}
              >
                Schedule Consultation
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </SectionContainer>

      {/* Loan Opportunities Section */}
      <SectionContainer>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <SectionTitle variant="h6" sx={{ mb: 0 }}>
            Available Loan Products
          </SectionTitle>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{
              borderColor: "#1e5631",
              color: "#1e5631",
              borderRadius: 8,
            }}
          >
            View All Loans
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {loanOpportunities.map((loan) => (
            <Grid item xs={12} sm={6} md={4} key={loan.id}>
              <StyledCard>
                <Box
                  sx={{
                    px: 2,
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
                          ? alpha("#1e5631", 0.1)
                          : loan.tag === "high-value"
                          ? alpha("#f9a825", 0.1)
                          : alpha("#2196f3", 0.1),
                      color:
                        loan.tag === "popular"
                          ? "#1e5631"
                          : loan.tag === "high-value"
                          ? "#f9a825"
                          : "#2196f3",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleBookmarkToggle(loan.id)}
                    sx={{
                      color: bookmarkedLoans.includes(loan.id)
                        ? "#1e5631"
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
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {loan.name}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color="#1e5631"
                    >
                      {formatCurrency(loan.maxAmount)}
                    </Typography>
                    <Chip
                      label={`${loan.interestRate}% Interest`}
                      size="small"
                      sx={{
                        bgcolor: alpha("#1e5631", 0.1),
                        color: "#1e5631",
                      }}
                    />
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1} mb={3}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Duration:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {loan.duration}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Eligibility:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {loan.eligibility}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#1e5631",
                      "&:hover": {
                        bgcolor: "#2a724a",
                      },
                      borderRadius: 8,
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>

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
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="Withdrawals Only" />
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <ListItemText primary="Loan Payments" />
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
