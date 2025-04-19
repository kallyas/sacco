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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth.types";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    gender: undefined,
    date_of_birth: "",
    national_id: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value });

      // Clear error when user types
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: "" });
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.first_name) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name) {
      errors.last_name = "Last name is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      errors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    if (!formData.phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\+[0-9]{1,3}[0-9]{9,15}$/.test(formData.phone_number)) {
      errors.phone_number =
        "Phone number should be in international format (e.g., +256XXXXXXXXX)";
    }

    if (!formData.national_id) {
      errors.national_id = "National ID is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! Redirecting to dashboard...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!formErrors.first_name}
              helperText={formErrors.first_name}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!formErrors.last_name}
              helperText={formErrors.last_name}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="phone_number"
              label="Phone Number"
              name="phone_number"
              autoComplete="tel"
              placeholder="+256XXXXXXXXX"
              value={formData.phone_number}
              onChange={handleChange}
              error={!!formErrors.phone_number}
              helperText={formErrors.phone_number}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender || ""}
                label="Gender"
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
              {formErrors.gender && (
                <FormHelperText>{formErrors.gender}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="date_of_birth"
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={!!formErrors.date_of_birth}
              helperText={formErrors.date_of_birth}
              disabled={isSubmitting}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="national_id"
              label="National ID"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              error={!!formErrors.national_id}
              helperText={formErrors.national_id}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirm_password"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirm_password"
              autoComplete="new-password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={!!formErrors.confirm_password}
              helperText={formErrors.confirm_password}
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
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" variant="body2">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
