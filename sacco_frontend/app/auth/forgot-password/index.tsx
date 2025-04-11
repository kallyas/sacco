import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building,
  Mail,
  ArrowLeft,
  Shield,
  AlertCircle,
  CheckCircle2,
  Lock,
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
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { authService } from "~/services/auth.service";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) =>
      authService.forgotPassword(data),
    onSuccess: () => {
      setRequestSent(true);
      toast({
        title: "Request sent",
        description:
          "Password reset instructions have been sent to your email.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Request failed",
        description:
          error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  // Security pattern SVG background
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23215799' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!requestSent ? (
              <>
                <Alert className="bg-secondary/50 border-border">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-foreground font-medium">
                    Secure Process
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    For security, we'll send a time-limited link to the email
                    address associated with your account.
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
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

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <div className="py-6 space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Email Sent
                  </h3>
                  <p className="text-muted-foreground">
                    We've sent password reset instructions to your email
                    address. Please check your inbox and follow the
                    instructions.
                  </p>
                </div>

                <Alert className="bg-secondary/50 border-border">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-muted-foreground">
                    The reset link will expire in 30 minutes for security
                    reasons.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="w-full text-foreground"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>

            <div className="w-full flex items-center justify-center space-x-1 pt-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">
                Protected by bank-grade security
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
