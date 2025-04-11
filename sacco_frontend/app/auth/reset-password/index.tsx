import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Info,
  Loader2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert";
import { Progress } from "~/components/ui/progress";
import { authService } from "~/services/auth.service";

const passwordStrengthLevels = [
  { label: "Weak", color: "bg-destructive", threshold: 30 },
  { label: "Fair", color: "bg-warning", threshold: 60 },
  { label: "Good", color: "bg-success/70", threshold: 80 },
  { label: "Strong", color: "bg-success", threshold: 100 },
];

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [resetComplete, setResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the password field to calculate strength
  const watchPassword = form.watch("password");

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidatingToken(false);
        setTokenValid(false);
        setTokenError("Reset token is missing");
        return;
      }
      
      try {
        // Call API to validate the token
        // const result = await authService.validateResetToken({ token });
        setTokenValid(true);
      } catch (error: any) {
        setTokenValid(false);
        setTokenError(
          error.response?.data?.message || 
          "Invalid or expired token. Please request a new password reset link."
        );
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
  }, [token]);

  // Calculate password strength
  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (watchPassword.length >= 8) strength += 25;
    
    // Complexity checks
    if (/[A-Z]/.test(watchPassword)) strength += 25;
    if (/[a-z]/.test(watchPassword)) strength += 25;
    if (/[0-9]/.test(watchPassword)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(watchPassword)) strength += 12.5;
    
    setPasswordStrength(Math.min(100, strength));
  }, [watchPassword]);

  const getStrengthLevel = () => {
    for (let i = passwordStrengthLevels.length - 1; i >= 0; i--) {
      if (passwordStrength >= passwordStrengthLevels[i].threshold) {
        return passwordStrengthLevels[i];
      }
    }
    return passwordStrengthLevels[0];
  };

  const strengthLevel = getStrengthLevel();

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) => authService.resetPassword(data.token, data.password, data.confirmPassword),
    onSuccess: () => {
      setResetComplete(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description:
          error.response?.data?.message || "Unable to reset your password. Please try again.",
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(data);
  };

  // Security pattern SVG background
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23215799' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  // Content to render based on state
  const renderContent = () => {
    if (validatingToken) {
      return (
        <div className="py-8 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying your reset link...</p>
        </div>
      );
    }
    
    if (!tokenValid) {
      return (
        <div className="py-6 space-y-6">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Invalid Reset Link</h3>
            <p className="text-muted-foreground">{tokenError}</p>
          </div>
          
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Reset Link
          </Button>
        </div>
      );
    }
    
    if (resetComplete) {
      return (
        <div className="py-6 space-y-6">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Password Reset Complete</h3>
            <p className="text-muted-foreground">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
          </div>
          
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/login")}
          >
            Go to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <Alert className="bg-secondary/50 border-border">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground font-medium">Create a strong password</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("token")} />
            
            {/* New Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        className="pl-10 pr-10 bg-background border-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  
                  {/* Password Strength Indicator */}
                  {watchPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Password Strength:</span>
                        <span className={`text-xs font-medium ${strengthLevel.color.replace('bg-', 'text-')}`}>
                          {strengthLevel.label}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-1.5 ${strengthLevel.color}`}
                      />
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        className="pl-10 pr-10 bg-background border-input"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </>
    );
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
      style={patternStyle}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ModernSACCO</span>
          </div>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {renderContent()}
          </CardContent>

          {(!resetComplete && !validatingToken) && (
            <CardFooter className="flex flex-col pt-2">
              <div className="w-full flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">
                  Protected by bank-grade encryption
                </span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;