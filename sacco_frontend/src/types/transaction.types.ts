export interface Transaction {
  id: number;
  transaction_ref: string;
  member: number;
  transaction_type:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "LOAN_DISBURSEMENT"
    | "LOAN_REPAYMENT"
    | "TRANSFER"
    | "INTEREST"
    | "FEE";
  amount: number;
  payment_method:
    | "CASH"
    | "MOBILE_MONEY"
    | "BANK_TRANSFER"
    | "CHEQUE"
    | "INTERNAL";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  source_account?: string;
  destination_account?: string;
  external_reference?: string;
  provider_reference?: string;
  description?: string;
  processed_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export interface TransactionFee {
  id: number;
  transaction_type: string;
  payment_method: string;
  fixed_amount: number;
  percentage: number;
  min_amount: number;
  max_amount?: number;
}

export interface TransactionLimit {
  id: number;
  transaction_type: string;
  limit_type: "DAILY" | "SINGLE" | "MONTHLY";
  amount: number;
  member_type: string;
}

export interface CreateTransactionRequest {
  member_id: number;
  transaction_type:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "LOAN_DISBURSEMENT"
    | "LOAN_REPAYMENT"
    | "TRANSFER"
    | "INTEREST"
    | "FEE";
  amount: number;
  payment_method:
    | "CASH"
    | "MOBILE_MONEY"
    | "BANK_TRANSFER"
    | "CHEQUE"
    | "INTERNAL";
  source_account?: string;
  destination_account?: string;
  external_reference?: string;
  description?: string;
}

export interface TransactionHistoryRequest {
  member_id?: number;
  start_date?: string;
  end_date?: string;
  transaction_type?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface TransactionReceiptRequest {
  transaction_id: number;
  format?: "PDF" | "HTML";
}
