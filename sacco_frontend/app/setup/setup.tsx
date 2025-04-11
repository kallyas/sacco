// src/pages/CompanySetupPage.tsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  Building2,
  Calendar,
  CreditCard,
  PiggyBank,
  Settings,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Lock,
  Percent,
  DollarSign,
  Clock,
  Mail,
  RefreshCcw,
  HelpCircle,
  Phone,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";

const companySetupSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxIdentificationNumber: z.string().min(1, "Tax ID is required"),
  companyAddress: z.string().min(1, "Address is required"),
  companyPhone: z.string().min(1, "Phone number is required"),
  companyEmail: z.string().email("Please enter a valid email"),
  companyWebsite: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0)),

  // Financial Settings
  financialYearStart: z.string().min(1, "Start date is required"),
  financialYearEnd: z.string().min(1, "End date is required"),
  defaultCurrency: z.string().min(1, "Currency is required"),
  currencySymbol: z.string().min(1, "Symbol is required"),
  baseCurrencyCode: z.string().min(1, "Currency code is required"),
  decimalPlaces: z.number().min(0).max(6),

  // Loan Settings
  maximumLoanMultiple: z.number().min(1, "Multiplier must be at least 1"),
  minimumLoanAmount: z.number().min(0, "Amount cannot be negative"),
  maximumLoanAmount: z.number().min(0, "Amount cannot be negative"),
  defaultLoanInterestRate: z.number().min(0, "Rate cannot be negative"),
  defaultLoanTerm: z.number().min(1, "Term must be at least 1"),
  enableGuarantors: z.boolean(),
  minimumGuarantors: z.number().min(0, "Cannot be negative"),
  loanProcessingFeePercent: z.number().min(0, "Fee cannot be negative"),
  maxLoanDuration: z.number().min(1, "Duration must be at least 1"),
  gracePeriodDays: z.number().min(0, "Cannot be negative"),

  // Savings Settings
  minimumSavingsAmount: z.number().min(0, "Amount cannot be negative"),
  savingsInterestRate: z.number().min(0, "Rate cannot be negative"),
  compoundingFrequency: z.enum(["daily", "monthly", "quarterly", "annually"]),
  enableAutoDeductions: z.boolean(),
  withdrawalNotice: z.number().min(0, "Cannot be negative"),
  minimumBalance: z.number().min(0, "Cannot be negative"),

  // System Settings
  requireTwoFactorAuth: z.boolean(),
  sessionTimeout: z.number().min(5, "Timeout must be at least 5 minutes"),
  passwordExpiryDays: z.number().min(0, "Cannot be negative"),
  enableMemberPortal: z.boolean(),
  enableMobileApp: z.boolean(),
  enableSMSNotifications: z.boolean(),
  enableEmailNotifications: z.boolean(),
  enforcePasswordComplexity: z.boolean(),
  maintenanceMode: z.boolean(),
});

type CompanySetupFormValues = z.infer<typeof companySetupSchema>;

const SETUP_STEPS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "financial", label: "Financial", icon: Calendar },
  { id: "loans", label: "Loans", icon: CreditCard },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "system", label: "System", icon: Settings },
];

const CompanySetupPage = () => {
  const [currentStep, setCurrentStep] = useState("company");
  const [setupProgress, setSetupProgress] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const form = useForm<CompanySetupFormValues>({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      taxIdentificationNumber: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      companyWebsite: "",

      financialYearStart: "",
      financialYearEnd: "",
      defaultCurrency: "USD",
      currencySymbol: "$",
      baseCurrencyCode: "USD",
      decimalPlaces: 2,

      maximumLoanMultiple: 3,
      minimumLoanAmount: 1000,
      maximumLoanAmount: 50000,
      defaultLoanInterestRate: 12,
      defaultLoanTerm: 12,
      enableGuarantors: true,
      minimumGuarantors: 2,
      loanProcessingFeePercent: 1,
      maxLoanDuration: 36,
      gracePeriodDays: 14,

      minimumSavingsAmount: 500,
      savingsInterestRate: 4.5,
      compoundingFrequency: "monthly",
      enableAutoDeductions: true,
      withdrawalNotice: 3,
      minimumBalance: 100,

      requireTwoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiryDays: 90,
      enableMemberPortal: true,
      enableMobileApp: true,
      enableSMSNotifications: true,
      enableEmailNotifications: true,
      enforcePasswordComplexity: true,
      maintenanceMode: false,
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: CompanySetupFormValues) => {
      // Simulate API call
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return data;
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setSetupComplete(true);
      toast({
        title: "Setup completed successfully",
        description: "Your SACCO has been configured and is ready to use.",
        variant: "success",
      });
    },
    onError: () => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Setup failed",
        description:
          "An error occurred while saving your settings. Please try again.",
      });
    },
  });

  // Calculate completion progress
  useEffect(() => {
    const calculateProgress = () => {
      const values = form.getValues();
      const allFields = Object.keys(companySetupSchema.shape);
      const requiredFields = allFields.filter((field) => {
        // Only count fields that are required (not booleans since they have defaults)
        const type = typeof values[field as keyof CompanySetupFormValues];
        return type !== "boolean" && type !== "undefined";
      });

      const filledFields = requiredFields.filter((field) => {
        const value = values[field as keyof CompanySetupFormValues];
        return value !== undefined && value !== "" && value !== 0;
      });

      return Math.floor((filledFields.length / requiredFields.length) * 100);
    };

    setSetupProgress(calculateProgress());
  }, [form, currentStep]);

  const navigateToStep = (step: string) => {
    // Save current step data
    form.trigger();
    setCurrentStep(step);
  };

  const handleNext = async () => {
    const currentIndex = SETUP_STEPS.findIndex(
      (step) => step.id === currentStep
    );
    if (currentIndex < SETUP_STEPS.length - 1) {
      // Validate current step before proceeding
      const isValid = await form.trigger();
      if (isValid) {
        navigateToStep(SETUP_STEPS[currentIndex + 1].id);
      }
    } else {
      // On last step, submit the form
      form.handleSubmit((data) => setupMutation.mutate(data))();
    }
  };

  const handlePrevious = () => {
    const currentIndex = SETUP_STEPS.findIndex(
      (step) => step.id === currentStep
    );
    if (currentIndex > 0) {
      navigateToStep(SETUP_STEPS[currentIndex - 1].id);
    }
  };

  // Find whether the current step has errors
  const currentStepHasErrors = () => {
    const errors = form.formState.errors;

    if (currentStep === "company") {
      return !!(
        errors.companyName ||
        errors.registrationNumber ||
        errors.taxIdentificationNumber ||
        errors.companyAddress ||
        errors.companyPhone ||
        errors.companyEmail ||
        errors.companyWebsite
      );
    } else if (currentStep === "financial") {
      return !!(
        errors.financialYearStart ||
        errors.financialYearEnd ||
        errors.defaultCurrency ||
        errors.currencySymbol ||
        errors.baseCurrencyCode ||
        errors.decimalPlaces
      );
    } else if (currentStep === "loans") {
      return !!(
        errors.maximumLoanMultiple ||
        errors.minimumLoanAmount ||
        errors.maximumLoanAmount ||
        errors.defaultLoanInterestRate ||
        errors.defaultLoanTerm ||
        errors.minimumGuarantors ||
        errors.loanProcessingFeePercent ||
        errors.maxLoanDuration ||
        errors.gracePeriodDays
      );
    } else if (currentStep === "savings") {
      return !!(
        errors.minimumSavingsAmount ||
        errors.savingsInterestRate ||
        errors.compoundingFrequency ||
        errors.withdrawalNotice ||
        errors.minimumBalance
      );
    } else if (currentStep === "system") {
      return !!(errors.sessionTimeout || errors.passwordExpiryDays);
    }

    return false;
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg border-border">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Your SACCO is now configured and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-lg border p-4 bg-secondary/20">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Company Information</p>
                    <p className="text-sm text-muted-foreground">
                      {form.getValues().companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Financial Settings</p>
                    <p className="text-sm text-muted-foreground">
                      {form.getValues().defaultCurrency} (
                      {form.getValues().currencySymbol})
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">System Security</p>
                    <p className="text-sm text-muted-foreground">
                      {form.getValues().requireTwoFactorAuth
                        ? "2FA Enabled"
                        : "Standard Authentication"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                Proceed to the dashboard to start managing your SACCO
                operations.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  SACCO Setup Wizard
                </h1>
                <p className="text-muted-foreground">
                  Configure your financial institution
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Setup Progress</p>
                <p className="text-xs text-muted-foreground">
                  {setupProgress}% completed
                </p>
              </div>
              <Progress
                value={setupProgress}
                className={`w-40 ${
                  setupProgress < 30
                    ? "bg-destructive"
                    : setupProgress < 70
                    ? "bg-warning"
                    : "bg-success"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation - Steps Indicator */}
          <div className="col-span-12 md:col-span-3">
            <Card className="sticky top-8 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Setup Steps</CardTitle>
                <CardDescription>Complete all sections</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <nav className="space-y-1.5">
                  {SETUP_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted =
                      form.formState.dirtyFields[
                        step.id as keyof CompanySetupFormValues
                      ];
                    const hasErrors =
                      form.formState.errors[
                        step.id as keyof CompanySetupFormValues
                      ];

                    return (
                      <button
                        key={step.id}
                        className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary"
                          }
                        `}
                        onClick={() => navigateToStep(step.id)}
                      >
                        <div
                          className={`flex items-center justify-center h-6 w-6 rounded-full mr-3
                          ${
                            isActive
                              ? "bg-primary-foreground/20"
                              : isCompleted
                              ? "bg-success/20"
                              : "bg-secondary"
                          }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <span
                              className={`text-xs ${
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <Icon
                          className={`h-4 w-4 mr-2 
                          ${
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        />

                        <span>{step.label}</span>

                        {hasErrors && (
                          <Badge variant="destructive" className="ml-auto">
                            !
                          </Badge>
                        )}

                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-auto text-primary-foreground" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="rounded-lg border border-border bg-secondary/20 p-4 w-full mt-4">
                  <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">
                        Need assistance?
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our support team is available to help with your setup
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">+1 (800) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            support@modernsacco.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9">
            <Card className="border-border">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {
                        SETUP_STEPS.find((step) => step.id === currentStep)
                          ?.label
                      }{" "}
                      Information
                    </CardTitle>
                    <CardDescription>
                      {currentStep === "company" &&
                        "Enter your organization's basic information"}
                      {currentStep === "financial" &&
                        "Set up financial year and currency preferences"}
                      {currentStep === "loans" &&
                        "Configure loan products and conditions"}
                      {currentStep === "savings" &&
                        "Set up savings products and interest rates"}
                      {currentStep === "system" &&
                        "Configure system security and notifications"}
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {currentStep === "company" && (
                      <Building2 className="h-5 w-5 text-primary" />
                    )}
                    {currentStep === "financial" && (
                      <Calendar className="h-5 w-5 text-primary" />
                    )}
                    {currentStep === "loans" && (
                      <CreditCard className="h-5 w-5 text-primary" />
                    )}
                    {currentStep === "savings" && (
                      <PiggyBank className="h-5 w-5 text-primary" />
                    )}
                    {currentStep === "system" && (
                      <Settings className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    setupMutation.mutate(data)
                  )}
                >
                  <CardContent className="p-6">
                    <ScrollArea className="h-[calc(100vh-22rem)]">
                      <div className="space-y-8 pr-4">
                        {/* Company Information Section */}
                        {currentStep === "company" && (
                          <>
                            {currentStepHasErrors() && (
                              <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Validation Error</AlertTitle>
                                <AlertDescription>
                                  Please correct the errors in the form to
                                  proceed.
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          placeholder="Enter company name"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Official registered name of your SACCO
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="registrationNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Registration Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter registration number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Business registration or license number
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="taxIdentificationNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tax ID Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter tax ID number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Government-issued tax identification
                                      number
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Email</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="email"
                                          placeholder="company@example.com"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Primary contact email for your
                                      organization
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="companyPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Phone</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          placeholder="+1 (123) 456-7890"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Main business contact number
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="companyWebsite"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Website</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://example.com"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Official website URL (optional)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="companyAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter full business address"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Physical location or registered address
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        {/* Financial Settings Section */}
                        {currentStep === "financial" && (
                          <>
                            <Alert className="bg-primary/5 border-primary/10 mb-6">
                              <Info className="h-4 w-4 text-primary" />
                              <AlertDescription>
                                These settings determine how financial
                                calculations and reporting are handled
                                throughout the system.
                              </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="financialYearStart"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Financial Year Start</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="date"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      First day of your financial year
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="financialYearEnd"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Financial Year End</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="date"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Last day of your financial year
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="defaultCurrency"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Default Currency</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="USD">
                                          US Dollar (USD)
                                        </SelectItem>
                                        <SelectItem value="EUR">
                                          Euro (EUR)
                                        </SelectItem>
                                        <SelectItem value="GBP">
                                          British Pound (GBP)
                                        </SelectItem>
                                        <SelectItem value="KES">
                                          Kenyan Shilling (KES)
                                        </SelectItem>
                                        <SelectItem value="NGN">
                                          Nigerian Naira (NGN)
                                        </SelectItem>
                                        <SelectItem value="ZAR">
                                          South African Rand (ZAR)
                                        </SelectItem>
                                        <SelectItem value="UGX">
                                          Ugandan Shilling (UGX)
                                        </SelectItem>
                                        <SelectItem value="TZS">
                                          Tanzanian Shilling (TZS)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Primary currency for transactions
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="currencySymbol"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Currency Symbol</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          placeholder="$"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Symbol used to display currency values
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="baseCurrencyCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Currency Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="USD" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Three-letter ISO currency code
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="decimalPlaces"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Decimal Places</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={6}
                                        placeholder="2"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Number of decimal places for monetary
                                      values
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </>
                        )}

                        {/* Loan Settings Section */}
                        {currentStep === "loans" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="minimumLoanAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Minimum Loan Amount</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <FormControl>
                                            <div className="relative">
                                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                              <Input
                                                className="pl-10"
                                                type="number"
                                                min={0}
                                                placeholder="1000"
                                                {...field}
                                                onChange={(e) =>
                                                  field.onChange(
                                                    Number(e.target.value)
                                                  )
                                                }
                                              />
                                            </div>
                                          </FormControl>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Smallest loan amount a member can
                                            request
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="maximumLoanAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Maximum Loan Amount</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          placeholder="50000"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="defaultLoanInterestRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Default Interest Rate (%)
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          step={0.1}
                                          placeholder="12"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Annual interest rate for standard loans
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="defaultLoanTerm"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Default Loan Term (months)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        placeholder="12"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="maximumLoanMultiple"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Maximum Loan Multiple</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        placeholder="3"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Multiple of member's savings they can
                                      borrow
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="loanProcessingFeePercent"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Processing Fee (%)</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          step={0.1}
                                          placeholder="1"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">
                                Guarantor Requirements
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="enableGuarantors"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Require Guarantors
                                        </FormLabel>
                                        <FormDescription>
                                          Members must provide guarantors for
                                          loans
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                {form.watch("enableGuarantors") && (
                                  <FormField
                                    control={form.control}
                                    name="minimumGuarantors"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Minimum Guarantors
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            placeholder="2"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                Number(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Minimum number of guarantors required
                                          per loan
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Savings Settings Section */}
                        {currentStep === "savings" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="minimumSavingsAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Minimum Savings Amount
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          placeholder="500"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Minimum amount required for new savings
                                      accounts
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="savingsInterestRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Savings Interest Rate (%)
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          step={0.1}
                                          placeholder="4.5"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Annual interest rate paid on savings
                                      accounts
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="compoundingFrequency"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Compounding Frequency</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="daily">
                                          Daily
                                        </SelectItem>
                                        <SelectItem value="monthly">
                                          Monthly
                                        </SelectItem>
                                        <SelectItem value="quarterly">
                                          Quarterly
                                        </SelectItem>
                                        <SelectItem value="annually">
                                          Annually
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      How often interest is calculated and added
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="minimumBalance"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Minimum Balance</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          className="pl-10"
                                          type="number"
                                          min={0}
                                          placeholder="100"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Minimum amount to be maintained in
                                      accounts
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">
                                Additional Settings
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="enableAutoDeductions"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Enable Auto-Deductions
                                        </FormLabel>
                                        <FormDescription>
                                          Automatically deduct savings from
                                          member salaries
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="withdrawalNotice"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Withdrawal Notice (days)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={0}
                                          placeholder="3"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Notice period required for large
                                        withdrawals
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* System Settings Section */}
                        {currentStep === "system" && (
                          <>
                            <Alert className="bg-primary/5 border-primary/10 mb-6">
                              <Lock className="h-4 w-4 text-primary" />
                              <AlertTitle>Security Settings</AlertTitle>
                              <AlertDescription>
                                Configure system security and access settings
                                for your SACCO platform.
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="requireTwoFactorAuth"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Require Two-Factor Authentication
                                        </FormLabel>
                                        <FormDescription>
                                          Enhanced security for all user
                                          accounts
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="enforcePasswordComplexity"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Enforce Password Complexity
                                        </FormLabel>
                                        <FormDescription>
                                          Require strong passwords with special
                                          characters
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="sessionTimeout"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Session Timeout (minutes)
                                      </FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            className="pl-10"
                                            type="number"
                                            min={5}
                                            placeholder="30"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                Number(e.target.value)
                                              )
                                            }
                                          />
                                        </div>
                                      </FormControl>
                                      <FormDescription>
                                        Automatically log out inactive users
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="passwordExpiryDays"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Password Expiry (days)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={0}
                                          placeholder="90"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Force password change after this period
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <Separator className="my-6" />

                              <h3 className="text-lg font-medium">
                                Access & Notifications
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="enableMemberPortal"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Enable Member Portal
                                        </FormLabel>
                                        <FormDescription>
                                          Allow members to access their accounts
                                          online
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="enableMobileApp"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Enable Mobile App
                                        </FormLabel>
                                        <FormDescription>
                                          Allow members to access via mobile
                                          applications
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="enableEmailNotifications"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          Email Notifications
                                        </FormLabel>
                                        <FormDescription>
                                          Send transaction and account
                                          notifications via email
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="enableSMSNotifications"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                          SMS Notifications
                                        </FormLabel>
                                        <FormDescription>
                                          Send transaction alerts via SMS
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="mt-6">
                                <FormField
                                  control={form.control}
                                  name="maintenanceMode"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-destructive/20 p-4 bg-destructive/5">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base text-destructive">
                                          Maintenance Mode
                                        </FormLabel>
                                        <FormDescription>
                                          Temporarily disable member access
                                          during setup
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="data-[state=checked]:bg-destructive"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  <CardFooter className="border-t border-border flex justify-between py-4">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={
                          currentStep === SETUP_STEPS[0].id || isSubmitting
                        }
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                        disabled={isSubmitting}
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting || currentStepHasErrors()}
                      >
                        {currentStep ===
                        SETUP_STEPS[SETUP_STEPS.length - 1].id ? (
                          isSubmitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              Completing Setup...
                            </>
                          ) : (
                            <>
                              Complete Setup
                              <Check className="h-4 w-4 ml-2" />
                            </>
                          )
                        ) : (
                          <>
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetupPage;
