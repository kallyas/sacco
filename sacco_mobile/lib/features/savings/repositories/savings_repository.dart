import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/features/savings/models/savings_account.dart';
import 'package:sacco_mobile/features/savings/models/transaction.dart';

class SavingsRepository {
  final ApiClient _apiClient;
  
  SavingsRepository(this._apiClient);
  
  // Get savings account for the current user
  Future<SavingsAccount> getSavingsAccount() async {
    final response = await _apiClient.get(AppConstants.savingsEndpoint);
    // Assuming the API returns the primary savings account or first in list
    if (response is List && response.isNotEmpty) {
      return SavingsAccount.fromJson(response[0]);
    } else if (response is Map<String, dynamic>) {
      return SavingsAccount.fromJson(response);
    } else {
      throw Exception('Unexpected response format from API');
    }
  }
  
  // Get all savings accounts for the current user
  Future<List<SavingsAccount>> getAllSavingsAccounts() async {
    final response = await _apiClient.get(AppConstants.savingsEndpoint);
    
    List<SavingsAccount> accounts = [];
    for (var item in response) {
      accounts.add(SavingsAccount.fromJson(item));
    }
    
    return accounts;
  }
  
  // Get transactions for a savings account
  Future<List<Transaction>> getTransactions({
    int? accountId,
    String? startDate,
    String? endDate,
    int? limit,
    int? offset,
  }) async {
    final Map<String, dynamic> queryParams = {};
    
    if (accountId != null) queryParams['account'] = accountId.toString();
    if (startDate != null) queryParams['start_date'] = startDate;
    if (endDate != null) queryParams['end_date'] = endDate;
    if (limit != null) queryParams['limit'] = limit.toString();
    if (offset != null) queryParams['offset'] = offset.toString();
    
    final response = await _apiClient.get(
      AppConstants.transactionsEndpoint,
      queryParameters: queryParams,
    );
    
    List<Transaction> transactions = [];
    for (var item in response) {
      transactions.add(Transaction.fromJson(item));
    }
    
    return transactions;
  }
  
  // Make a deposit
  Future<Transaction> makeDeposit({
    required int accountId,
    required double amount,
    required String paymentMethod,
    String? description,
  }) async {
    final response = await _apiClient.post(
      AppConstants.transactionsEndpoint,
      data: {
        'account': accountId,
        'transaction_type': 'DEPOSIT',
        'amount': amount,
        'payment_method': paymentMethod,
        'description': description ?? 'Deposit via mobile app',
      },
    );
    
    return Transaction.fromJson(response);
  }
  
  // Make a withdrawal
  Future<Transaction> makeWithdrawal({
    required int accountId,
    required double amount,
    required String paymentMethod,
    String? description,
  }) async {
    final response = await _apiClient.post(
      AppConstants.transactionsEndpoint,
      data: {
        'account': accountId,
        'transaction_type': 'WITHDRAWAL',
        'amount': amount,
        'payment_method': paymentMethod,
        'description': description ?? 'Withdrawal via mobile app',
      },
    );
    
    return Transaction.fromJson(response);
  }
}