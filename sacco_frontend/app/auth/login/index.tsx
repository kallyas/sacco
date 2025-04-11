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
  PiggyBank,
  Lock,
  Mail,
  Github,
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background to-muted">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            className="pl-10"
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
                        <FormLabel>Password</FormLabel>
                        <Button
                          variant="link"
                          className="px-0 h-auto py-0 text-xs font-normal"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            className="pl-10 pr-10"
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
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember me for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/register")}
              >
                Create a free account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Brand/Feature Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-primary-foreground">
        <div className="max-w-md space-y-8">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <PiggyBank className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">ModernSACCO</h2>
              <p className="text-muted-foreground text-lg">
                Your trusted partner in financial growth
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                </div>
                <div>
                  <h3 className="font-medium">Secure transactions</h3>
                  <p className="text-sm">
                    Bank-grade encryption keeps your money and data safe
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                </div>
                <div>
                  <h3 className="font-medium">24/7 account access</h3>
                  <p className="text-sm">
                    Manage your finances anytime, anywhere on any device
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                </div>
                <div>
                  <h3 className="font-medium">Real-time notifications</h3>
                  <p className="text-sm">
                    Stay informed about your account activity as it happens
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <blockquote className="border-l-4 border-primary pl-4 italic">
                "ModernSACCO has transformed how our community saves and
                accesses loans. The platform is intuitive and reliable."
                <footer className="mt-2 text-sm font-medium">
                  — Sarah K., Member since 2022
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
