import axiosInstance from './axios';
import { 
  Transaction,
  TransactionFee,
  CreateTransactionRequest,
  TransactionHistoryRequest,
  TransactionReceiptRequest
} from '@/types/transaction.types';

export const transactionsApi = {
  // Get all transactions with optional filtering
  getTransactions: async (params?: TransactionHistoryRequest): Promise<{
    results: Transaction[];
    count: number;
  }> => {
    const response = await axiosInstance.get('/transactions/', { params });
    return response.data;
  },
  
  // Get a single transaction by ID
  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await axiosInstance.get(`/transactions/${id}/`);
    return response.data;
  },
  
  // Create a new transaction
  createTransaction: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await axiosInstance.post('/transactions/', data);
    return response.data;
  },
  
  // Get transaction fees
  getTransactionFees: async (transactionType: string, paymentMethod: string): Promise<TransactionFee> => {
    const response = await axiosInstance.get('/transactions/fees/', {
      params: { transaction_type: transactionType, payment_method: paymentMethod }
    });
    return response.data;
  },
  
  // Calculate transaction fee for a specific amount
  calculateFee: async (
    transactionType: string,
    paymentMethod: string,
    amount: number
  ): Promise<{ fee: number; total: number }> => {
    const response = await axiosInstance.get('/transactions/calculate-fee/', {
      params: { transaction_type: transactionType, payment_method: paymentMethod, amount }
    });
    return response.data;
  },
  
  // Get transaction receipt
  getReceipt: async (data: TransactionReceiptRequest): Promise<{ 
    file_url: string; 
    generated_at: string;
  }> => {
    const response = await axiosInstance.post('/transactions/receipt/', data);
    return response.data;
  },
  
  // Reverse a transaction (admin only)
  reverseTransaction: async (id: number, reason: string): Promise<Transaction> => {
    const response = await axiosInstance.post(`/transactions/${id}/reverse/`, { reason });
    return response.data;
  },
  
  // Get member transaction history
  getMemberTransactionHistory: async (memberId: number, params?: {
    start_date?: string;
    end_date?: string;
    transaction_type?: string;
    page?: number;
  }): Promise<{
    results: Transaction[];
    count: number;
  }> => {
    const queryParams = { member_id: memberId, ...params };
    const response = await axiosInstance.get('/transactions/member-history/', { params: queryParams });
    return response.data;
  },
  
  // Verify a transaction (e.g., mobile money callback)
  verifyTransaction: async (referenceNumber: string): Promise<{
    verified: boolean;
    transaction?: Transaction;
    message: string;
  }> => {
    const response = await axiosInstance.get(`/transactions/verify/${referenceNumber}/`);
    return response.data;
  },
  
  // Process a mobile money payment
  processMobileMoneyPayment: async (
    phoneNumber: string, 
    amount: number, 
    purpose: string
  ): Promise<{
    status: string;
    reference: string;
    message: string;
  }> => {
    const response = await axiosInstance.post('/transactions/mobile-money/', {
      phone_number: phoneNumber,
      amount,
      purpose
    });
    return response.data;
  }
};

export default transactionsApi;