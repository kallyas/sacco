import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  useTheme,
} from "@mui/material";
import {
  Person as PersonalIcon,
  Business as BusinessIcon,
  School as EducationIcon,
  Home as HomeIcon,
  LocalHospital as EmergencyIcon,
} from "@mui/icons-material";

interface LoanType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  interestRate: number;
  maxTerm: number;
  color: string;
}

interface LoanTypeSelectorProps {
  selectedType: string;
  onChange: (typeId: string) => void;
}

const LoanTypeSelector: React.FC<LoanTypeSelectorProps> = ({
  selectedType,
  onChange,
}) => {
  const theme = useTheme();

  const loanTypes: LoanType[] = [
    {
      id: "PERSONAL",
      name: "Personal Loan",
      description:
        "For personal expenses like medical bills, education, or travel",
      icon: <PersonalIcon fontSize="large" />,
      interestRate: 15,
      maxTerm: 24,
      color: theme.palette.primary.main,
    },
    {
      id: "BUSINESS",
      name: "Business Loan",
      description: "For business expansion, inventory, or working capital",
      icon: <BusinessIcon fontSize="large" />,
      interestRate: 12,
      maxTerm: 36,
      color: theme.palette.success.main,
    },
    {
      id: "EDUCATION",
      name: "Education Loan",
      description: "For tuition fees, books, and educational expenses",
      icon: <EducationIcon fontSize="large" />,
      interestRate: 10,
      maxTerm: 48,
      color: theme.palette.info.main,
    },
    {
      id: "HOME",
      name: "Home Improvement",
      description: "For home repairs, renovations, or improvements",
      icon: <HomeIcon fontSize="large" />,
      interestRate: 13,
      maxTerm: 36,
      color: theme.palette.secondary.main,
    },
    {
      id: "EMERGENCY",
      name: "Emergency Loan",
      description: "For urgent and unexpected financial needs",
      icon: <EmergencyIcon fontSize="large" />,
      interestRate: 18,
      maxTerm: 6,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Grid container spacing={2}>
      {loanTypes.map((type) => (
        <Grid item xs={12} sm={6} md={4} key={type.id}>
          <Card
            sx={{
              height: "100%",
              borderColor:
                selectedType === type.id ? type.color : "transparent",
              borderWidth: 2,
              borderStyle: "solid",
              boxShadow:
                selectedType === type.id ? `0 0 8px ${type.color}` : undefined,
            }}
          >
            <CardActionArea
              sx={{ height: "100%" }}
              onClick={() => onChange(type.id)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      color: "white",
                      bgcolor: type.color,
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    {type.icon}
                  </Box>
                  <Typography variant="h6" align="center" gutterBottom>
                    {type.name}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {type.description}
                </Typography>

                <Box sx={{ mt: "auto" }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Interest Rate:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {type.interestRate}% p.a.
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Max Term:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {type.maxTerm} months
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoanTypeSelector;
