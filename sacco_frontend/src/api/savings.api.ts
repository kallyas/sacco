import axiosInstance from './axios';
import { 
  SavingsAccount,
  SavingsTransaction,
  InterestRate,
  OpenAccountRequest,
  TransactionRequest,
  AccountBalanceResponse,
  AccountStatementRequest
} from '@/types/savings.types';

export const savingsApi = {
  // Get all savings accounts
  getAccounts: async (params?: { 
    page?: number; 
    member?: number;
    account_type?: string;
  }): Promise<{ results: SavingsAccount[]; count: number }> => {
    const response = await axiosInstance.get('/savings/', { params });
    return response.data;
  },
  
  // Get a single account by ID
  getAccount: async (id: number): Promise<SavingsAccount> => {
    const response = await axiosInstance.get(`/savings/${id}/`);
    return response.data;
  },
  
  // Open a new savings account
  openAccount: async (data: OpenAccountRequest): Promise<SavingsAccount> => {
    const response = await axiosInstance.post('/savings/', data);
    return response.data;
  },
  
  // Get transactions for a specific account
  getTransactions: async (accountId: number, params?: {
    page?: number;
    start_date?: string;
    end_date?: string;
    transaction_type?: string;
  }): Promise<{ results: SavingsTransaction[]; count: number }> => {
    const response = await axiosInstance.get(`/savings/${accountId}/transactions/`, { params });
    return response.data;
  },
  
  // Make a deposit
  makeDeposit: async (accountId: number, amount: number): Promise<SavingsTransaction> => {
    const response = await axiosInstance.post(`/savings/${accountId}/deposit/`, { amount });
    return response.data;
  },
  
  // Make a withdrawal
  makeWithdrawal: async (accountId: number, amount: number): Promise<SavingsTransaction> => {
    const response = await axiosInstance.post(`/savings/${accountId}/withdraw/`, { amount });
    return response.data;
  },
  
  // Process a transaction (generic transaction processor)
  processTransaction: async (data: TransactionRequest): Promise<SavingsTransaction> => {
    const response = await axiosInstance.post('/savings/transactions/', data);
    return response.data;
  },
  
  // Get account balance
  getBalance: async (accountId: number): Promise<AccountBalanceResponse> => {
    const response = await axiosInstance.get(`/savings/${accountId}/balance/`);
    return response.data;
  },
  
  // Get interest rates
  getInterestRates: async (): Promise<InterestRate[]> => {
    const response = await axiosInstance.get('/savings/interest-rates/');
    return response.data.results;
  },
  
  // Generate account statement
  generateStatement: async (data: AccountStatementRequest): Promise<{ 
    file_url: string; 
    generated_at: string;
  }> => {
    const response = await axiosInstance.post('/savings/generate-statement/', data);
    return response.data;
  },
  
  // Close account
  closeAccount: async (accountId: number, reason: string): Promise<{ 
    success: boolean; 
    message: string;
  }> => {
    const response = await axiosInstance.post(`/savings/${accountId}/close/`, { reason });
    return response.data;
  },
  
  // Change account type
  changeAccountType: async (accountId: number, newType: string): Promise<SavingsAccount> => {
    const response = await axiosInstance.post(`/savings/${accountId}/change-type/`, { 
      account_type: newType 
    });
    return response.data;
  }
};

export default savingsApi;