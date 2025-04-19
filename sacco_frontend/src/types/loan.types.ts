export interface Loan {
  id: number;
  reference: string;
  member: number;
  member_name?: string; // Added for displaying member name
  member_number?: string; // Added for displaying member number
  loan_type: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "DISBURSED"
    | "COMPLETED"
    | "DEFAULTED";
  application_date: string;
  approval_date?: string;
  disbursement_date?: string;
  total_amount_payable: number;
  total_interest: number;
  outstanding_balance: number;
  next_payment_date?: string;
  last_payment_date?: string;
  missed_payments_count: number;
  disbursement_transaction?: number;
}

export interface LoanApplication {
  id: number;
  member: number;
  loan_type: string;
  amount_requested: number;
  purpose: string;
  collateral_details?: string;
  employment_details: string;
  monthly_income: number;
  credit_score?: number;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  submitted_date: string;
  reviewed_by?: number;
  review_date?: string;
  review_notes?: string;
}

export interface LoanRepayment {
  id: number;
  loan: number;
  reference: string;
  due_date: string;
  amount: number;
  principal_component: number;
  interest_component: number;
  penalty_amount: number;
  payment_date?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  payment_method?: string;
  receipt_number?: string;
  remarks?: string;
  transaction?: number;
}

export interface LoanApplicationRequest {
  member: number;
  loan_type: string;
  amount_requested: number;
  purpose: string;
  collateral_details?: string;
  employment_details: string;
  monthly_income: number;
}

export interface LoanRepaymentRequest {
  loan: number;
  amount: number;
  payment_method: string;
}

export interface LoanEligibilityResponse {
  eligible: boolean;
  message: string;
  max_amount?: number;
  max_term?: number;
}
