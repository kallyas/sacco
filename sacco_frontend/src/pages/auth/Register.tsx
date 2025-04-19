import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link as MuiLink,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  CircularProgress
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  VpnKey as VpnKeyIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth.types";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Define validation schema with Yup
  const validationSchema = yup.object({
    first_name: yup
      .string()
      .required('First name is required')
      .max(50, 'First name must be at most 50 characters'),
    
    last_name: yup
      .string()
      .required('Last name is required')
      .max(50, 'Last name must be at most 50 characters'),
    
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    
    phone_number: yup
      .string()
      .required('Phone number is required')
      .matches(/^\+[0-9]{1,3}[0-9]{9,15}$/, 'Phone number should be in international format (e.g., +256XXXXXXXXX)'),
    
    gender: yup
      .string()
      .oneOf(['M', 'F', 'O'], 'Please select a valid gender option'),
    
    date_of_birth: yup
      .date()
      .nullable()
      .transform((curr, orig) => orig === '' ? null : curr)
      .max(new Date(), 'Date of birth cannot be in the future'),
    
    national_id: yup
      .string()
      .required('National ID is required'),
    
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    
    confirm_password: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords do not match')
  });

  // Initialize React Hook Form
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
    },
    resolver: yupResolver(validationSchema)
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data as RegisterRequest);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mt: 2, mb: 3 }}>
        Create Account
      </Typography>

      {authError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {authError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! Redirecting to dashboard...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Divider textAlign="left" sx={{ mb: 2 }}>Personal Information</Divider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoComplete="given-name"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  autoComplete="family-name"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl 
                  fullWidth 
                  error={!!errors.gender}
                >
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    {...field}
                    labelId="gender-label"
                    id="gender"
                    label="Gender"
                    disabled={isSubmitting}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  error={!!errors.date_of_birth}
                  helperText={errors.date_of_birth?.message}
                  disabled={isSubmitting}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Divider textAlign="left" sx={{ mt: 1, mb: 2 }}>Contact Information</Divider>
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  autoComplete="tel"
                  placeholder="+256XXXXXXXXX"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="national_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="national_id"
                  label="National ID"
                  error={!!errors.national_id}
                  helperText={errors.national_id?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>

          {/* Security Information */}
          <Grid item xs={12}>
            <Divider textAlign="left" sx={{ mt: 1, mb: 2 }}>Security Information</Divider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="confirm_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  id="confirm_password"
                  autoComplete="new-password"
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <PersonAddIcon />}
            >
              {isSubmitting ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" variant="body2">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
        
        <Box sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
          <Typography variant="caption">
            By registering, you agree to our{' '}
            <MuiLink component={Link} to="/terms">Terms</MuiLink> and{' '}
            <MuiLink component={Link} to="/privacy">Privacy Policy</MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;