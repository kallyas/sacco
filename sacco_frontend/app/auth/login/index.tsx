import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Building,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Clock,
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
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { authService } from "~/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => authService.login(data),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to your account.",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error.response?.data?.message || "Please check your credentials.",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Security pattern SVG background
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23215799' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  return (
    <div
      className="min-h-screen flex items-stretch bg-background"
      style={patternStyle}
    >
      {/* Left Side - Brand/Feature Showcase */}
      <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden">
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">
              ModernSACCO
            </span>
          </div>

          <div className="max-w-md space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-primary-foreground">
                  Secure Online Banking
                </h2>
                <p className="text-primary-foreground/80 text-xl">
                  Your trusted partner in financial growth
                </p>
              </div>

              <div className="space-y-4 text-primary-foreground/90">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mt-0.5 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Bank-grade security</h3>
                    <p>
                      Enterprise-level encryption protects your personal and
                      financial information
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mt-0.5 shrink-0">
                    <Clock className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">24/7 account access</h3>
                    <p>Manage your finances anytime, anywhere on any device</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <blockquote className="border-l-4 border-accent pl-6 py-4 bg-white/10 rounded-r-md">
                <p className="italic text-primary-foreground">
                  "ModernSACCO has transformed how our community saves and
                  accesses loans. The platform is intuitive and reliable."
                </p>
                <footer className="mt-2 text-primary-foreground/80">
                  <strong>Sarah K.</strong>, Member since 2022
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="text-primary-foreground/70 text-sm">
            © 2025 ModernSACCO. All rights reserved.
          </div>
        </div>

        {/* Left panel decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full transform translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-xl border-border">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Auth notice */}
            <div className="p-3 bg-secondary/50 rounded-md border border-border flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">
                For your security, please ensure you're on{" "}
                <strong>modernsacco.com</strong> before entering your
                credentials
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            className="pl-10 bg-background border-input"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground">
                          Password
                        </FormLabel>
                        <Button
                          variant="link"
                          className="px-0 h-auto py-0 text-xs font-medium text-primary"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            className="pl-10 pr-10 bg-background border-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-primary border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Stay signed in for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      Sign in securely
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-input text-foreground hover:bg-secondary/50"
              onClick={() => navigate("/register")}
            >
              Create a new account
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center pt-0">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-xs text-muted-foreground">
                Protected by industry-standard security protocols
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
