// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e5631",        // Rich forest green - traditional SACCO/cooperative color
      light: "#4a7e5a",
      dark: "#0b3116",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d4af37",        // Gold accent - represents financial prosperity
      light: "#ffdf67",
      dark: "#a17f00",
      contrastText: "#000000",
    },
    error: {
      main: "#c62828",        // Deeper red for better visibility
    },
    warning: {
      main: "#e65100",        // Darker orange for warnings
    },
    info: {
      main: "#0277bd",        // Slightly darker blue for info
    },
    success: {
      main: "#2e7d32",        // Keeping the same success green
    },
    background: {
      default: "#f5f7fa",     // Slightly lighter background for better readability
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",     // Darker text for better readability
      secondary: "#546e7a",   // Secondary text color
    },
  },
  typography: {
    fontFamily: ["'Open Sans'", "Poppins", "Roboto", "Arial", "sans-serif"].join(","),
    h1: { 
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: { 
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: { 
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: { 
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: { 
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: { 
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,      // Consistent border radius throughout the app
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          '&:hover': {
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #1e5631 0%, #2a724a 100%)',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        elevation1: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        },
        elevation2: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          backgroundImage: 'linear-gradient(90deg, #1e5631 0%, #2a724a 100%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundImage: 'linear-gradient(180deg, rgba(245, 247, 250, 0.97) 0%, rgba(255, 255, 255, 0.97) 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.15)',
              borderRadius: 6,
            },
            '&:hover fieldset': {
              borderColor: '#1e5631',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1e5631',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#1e5631',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(30, 86, 49, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2c3e50',
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 4,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
  // Custom theme variables for SACCO-specific components
  customShadows: {
    card: "0px 6px 16px rgba(0, 0, 0, 0.08)",
    dropdown: "0px 10px 30px rgba(0, 0, 0, 0.15)",
    dialog: "0px 20px 50px rgba(0, 0, 0, 0.2)",
  },
  customGradients: {
    primary: "linear-gradient(135deg, #1e5631 0%, #2a724a 100%)",
    secondary: "linear-gradient(135deg, #d4af37 0%, #e5c860 100%)",
    success: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  },
  // Spacing constants specific to the application
  spacing: (factor) => `${0.5 * factor}rem`,
});

export default theme;