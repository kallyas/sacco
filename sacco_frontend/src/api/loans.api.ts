import axiosInstance from "./axios";
import {
  Loan,
  LoanApplication,
  LoanRepayment,
  LoanApplicationRequest,
  LoanRepaymentRequest,
  LoanEligibilityResponse,
} from "@/types/loan.types";

export const loansApi = {
  // Get all loans with optional filtering
  getLoans: async (params?: {
    page?: number;
    status?: string;
    member?: number;
  }): Promise<{ results: Loan[]; count: number }> => {
    const response = await axiosInstance.get("/loans/", { params });
    return response.data;
  },

  // Get a single loan by ID
  getLoan: async (id: number): Promise<Loan> => {
    const response = await axiosInstance.get(`/loans/${id}/`);
    return response.data;
  },

  // Apply for a loan
  applyForLoan: async (
    data: LoanApplicationRequest
  ): Promise<LoanApplication> => {
    const response = await axiosInstance.post("/loan_applications/", data);
    return response.data;
  },

  // Get loan applications
  getLoanApplications: async (params?: {
    page?: number;
    status?: string;
    member?: number;
  }): Promise<{ results: LoanApplication[]; count: number }> => {
    const response = await axiosInstance.get("/loan_applications/", { params });
    return response.data;
  },

  // Get a single loan application
  getLoanApplication: async (id: number): Promise<LoanApplication> => {
    const response = await axiosInstance.get(`/loan_applications/${id}/`);
    return response.data;
  },

  // Get loan repayments for a loan
  getLoanRepayments: async (loanId: number): Promise<LoanRepayment[]> => {
    const response = await axiosInstance.get(
      `/loan_repayments/?loan=${loanId}`
    );
    return response.data.results;
  },

  // Make a loan repayment
  makeRepayment: async (data: LoanRepaymentRequest): Promise<LoanRepayment> => {
    const response = await axiosInstance.post("/loan_repayments/", data);
    return response.data;
  },

  // Approve a loan (staff/admin only)
  approveLoan: async (id: number): Promise<Loan> => {
    const response = await axiosInstance.post(`/loans/${id}/approve/`);
    return response.data;
  },

  // Reject a loan (staff/admin only)
  rejectLoan: async (id: number, reason: string): Promise<Loan> => {
    const response = await axiosInstance.post(`/loans/${id}/reject/`, {
      reason,
    });
    return response.data;
  },

  // Disburse a loan (staff/admin only)
  disburseLoan: async (id: number): Promise<Loan> => {
    const response = await axiosInstance.post(`/loans/${id}/disburse/`);
    return response.data;
  },

  // Check loan eligibility
  checkEligibility: async (
    memberId: number
  ): Promise<LoanEligibilityResponse> => {
    const response = await axiosInstance.get(
      `/loans/check_eligibility/?member=${memberId}`
    );
    return response.data;
  },

  // Get repayment schedule for a loan
  getRepaymentSchedule: async (loanId: number): Promise<LoanRepayment[]> => {
    const response = await axiosInstance.get(
      `/loans/${loanId}/repayment_schedule/`
    );
    return response.data;
  },

  // Calculate loan repayment estimate (pre-application)
  calculateLoanRepayment: async (
    amount: number,
    term: number,
    interestRate?: number
  ): Promise<{
    monthly_payment: number;
    total_repayment: number;
    total_interest: number;
    schedule: Array<{
      payment_number: number;
      payment_date: string;
      payment_amount: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  }> => {
    const response = await axiosInstance.get("/loans/calculate/", {
      params: { amount, term, interest_rate: interestRate },
    });
    return response.data;
  },
};

export default loansApi;
