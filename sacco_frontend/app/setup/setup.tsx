// src/pages/CompanySetupPage.tsx

import { useState } from "react";
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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  Badge,
  Building2,
  Calendar,
  CreditCard,
  PiggyBank,
  RotateCcw,
  Save,
  Settings,
  Shield,
} from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { Alert, AlertDescription } from "~/components/ui/alert";

const companySetupSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxIdentificationNumber: z.string().min(1, "Tax ID is required"),

  // Financial Settings
  financialYearStart: z.string(),
  financialYearEnd: z.string(),
  defaultCurrency: z.string(),
  currencySymbol: z.string(),

  // Loan Settings
  maximumLoanMultiple: z.number().min(1),
  minimumLoanAmount: z.number().min(0),
  maximumLoanAmount: z.number().min(0),
  defaultLoanInterestRate: z.number().min(0),
  defaultLoanTerm: z.number().min(1),
  enableGuarantors: z.boolean(),
  minimumGuarantors: z.number().min(0),

  // Savings Settings
  minimumSavingsAmount: z.number().min(0),
  savingsInterestRate: z.number().min(0),
  compoundingFrequency: z.enum(["daily", "monthly", "quarterly", "annually"]),
  enableAutoDeductions: z.boolean(),

  // System Settings
  requireTwoFactorAuth: z.boolean(),
  sessionTimeout: z.number().min(5),
  passwordExpiryDays: z.number().min(0),
  enableMemberPortal: z.boolean(),
  enableMobileApp: z.boolean(),
  enableSMSNotifications: z.boolean(),
  enableEmailNotifications: z.boolean(),
});

type CompanySetupFormValues = z.infer<typeof companySetupSchema>;

const CompanySetupPage = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [setupProgress, setSetupProgress] = useState(20);
  const { toast } = useToast();

  const form = useForm<CompanySetupFormValues>({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      enableGuarantors: true,
      minimumGuarantors: 2,
      enableAutoDeductions: true,
      requireTwoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiryDays: 90,
      enableMemberPortal: true,
      enableMobileApp: true,
      enableSMSNotifications: true,
      enableEmailNotifications: true,
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: CompanySetupFormValues) => {
      // API call implementation
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved successfully",
        description: "All company settings have been updated.",
      });
    },
  });

  const navigateTab = (tab: string) => {
    setActiveTab(tab);
    // Update progress based on form completion
    const progress = calculateProgress(form.getValues());
    setSetupProgress(progress);
  };

  const calculateProgress = (values: any) => {
    // Calculate completion percentage based on filled fields
    const totalFields = Object.keys(companySetupSchema.shape).length;
    const filledFields = Object.keys(values).filter(
      (key) => !!values[key]
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Company Setup</h1>
              <p className="text-muted-foreground mt-1">
                Configure your SACCO system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Setup Progress</p>
                <p className="text-xs text-muted-foreground">
                  {setupProgress}% completed
                </p>
              </div>
              <Progress value={setupProgress} className="w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <nav className="space-y-2 sticky top-8">
              <Button
                variant={activeTab === "company" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigateTab("company")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Company Information
                {form.formState.errors.companyName && (
                  <Badge className="ml-auto">
                    !
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeTab === "financial" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigateTab("financial")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Financial Settings
              </Button>
              <Button
                variant={activeTab === "loans" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigateTab("loans")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Loan Settings
              </Button>
              <Button
                variant={activeTab === "savings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigateTab("savings")}
              >
                <PiggyBank className="mr-2 h-4 w-4" />
                Savings Settings
              </Button>
              <Button
                variant={activeTab === "system" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigateTab("system")}
              >
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Separator className="my-4" />
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact our support team for assistance with setup
                </p>
                <Button variant="link" className="text-sm px-0 mt-2">
                  View Setup Guide →
                </Button>
              </div>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    setupMutation.mutate(data)
                  )}
                  className="space-y-6"
                >
                  {/* Company Information Section */}
                  {activeTab === "company" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Company Information
                          </h2>
                          <p className="text-muted-foreground">
                            Basic details about your organization
                          </p>
                        </div>
                        <Shield className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="grid gap-6 p-6 border rounded-lg bg-card">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-10"
                                    placeholder="Enter company name"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* ... Other company fields */}
                      </div>
                    </div>
                  )}

                  {/* Financial Settings Section */}
                  {activeTab === "financial" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Financial Settings
                          </h2>
                          <p className="text-muted-foreground">
                            Configure financial year and currencies
                          </p>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="grid gap-6 p-6 border rounded-lg bg-card">
                        <Alert>
                          <AlertDescription>
                            These settings will affect how financial
                            calculations are performed throughout the system.
                          </AlertDescription>
                        </Alert>
                        <div className="grid grid-cols-2 gap-6">
                          {/* Financial year fields */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ... Other tab content sections */}

                  {/* Fixed Bottom Actions */}
                  <div className="fixed bottom-0 right-0 left-0 border-t bg-background p-4">
                    <div className="container mx-auto flex justify-between items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                        disabled={setupMutation.isPending}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Changes
                      </Button>
                      <div className="flex space-x-4">
                        <Button
                          type="submit"
                          disabled={setupMutation.isPending}
                          className="min-w-[140px]"
                        >
                          {setupMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Settings
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetupPage;
