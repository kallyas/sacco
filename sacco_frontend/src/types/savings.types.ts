export interface SavingsAccount {
  id: number;
  member: number;
  account_number: string;
  account_type: "REGULAR" | "FIXED" | "CHILDREN" | "GROUP";
  balance: number;
  interest_rate: number;
  status: string;
  minimum_balance: number;
  date_opened: string;
  last_interest_date?: string;
}

export interface SavingsTransaction {
  id: number;
  account: number;
  transaction_type: "DEPOSIT" | "WITHDRAWAL" | "INTEREST" | "CHARGE";
  amount: number;
  balance_after: number;
  date: string;
  reference: string;
}

export interface InterestRate {
  id: number;
  account_type: string;
  minimum_balance: number;
  rate: number;
  effective_date: string;
}

export interface OpenAccountRequest {
  member_id: number;
  account_type: "REGULAR" | "FIXED" | "CHILDREN" | "GROUP";
  initial_deposit: number;
}

export interface TransactionRequest {
  account_id: number;
  transaction_type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  payment_method?: string;
}

export interface AccountBalanceResponse {
  account_number: string;
  balance: number;
  available_balance: number;
  currency: string;
  as_of_date: string;
}

export interface AccountStatementRequest {
  account_id: number;
  start_date: string;
  end_date: string;
  format?: "PDF" | "CSV";
}
