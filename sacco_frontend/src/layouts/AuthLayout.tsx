import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  alpha
} from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isRegister?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "SACCO Management",
  subtitle = "Access your cooperative banking platform",
  isRegister = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Features list for the landing side
  const features = [
    "Secure member management and tracking",
    "Streamlined loan application and processing",
    "Integrated savings accounts management",
    "Comprehensive financial reporting",
    "Digital transaction history and statements"
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Left side - Branding and features */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '50%' },
          background: theme.palette.primary.main,
          position: 'relative',
          overflow: 'hidden',
          p: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: 'url("/assets/pattern-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
            zIndex: 0,
          }
        }}
      >
        <Box
          sx={{
            p: { md: 4, lg: 5 },
            px: { md: 5, lg: 6 },
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ mb: 6, mt: 2, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <AccountBalanceIcon sx={{ color: 'white', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={600}>
              SACCO
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight={700}
              lineHeight={1.2}
              sx={{ mb: 3 }}
            >
              Empowering Financial Growth Together
            </Typography>
            
            <Typography 
              variant="body1"
              paragraph
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                fontSize: '1.1rem',
                maxWidth: '90%'
              }}
            >
              Our cooperative banking platform provides members with powerful tools to manage savings, access loans, and build financial stability.
            </Typography>
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.15)', my: 4 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Key Features:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        bgcolor: theme.palette.secondary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        color: theme.palette.getContrastText(theme.palette.secondary.main)
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ pt: 3, pb: 4 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              © {new Date().getFullYear()} SACCO Management System
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          display: 'flex',
          bgcolor: alpha(theme.palette.background.default, 0.95),
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: isRegister ? 550 : 460,
            mx: 'auto',
            px: { xs: 3, sm: 4 },
            py: { xs: 4, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <AccountBalanceIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Typography variant="h5" color="primary" fontWeight={600}>
                SACCO
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              fontWeight={700}
              color="text.primary"
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          </Box>
          
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;