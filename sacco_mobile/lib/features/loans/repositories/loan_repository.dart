import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/features/loans/models/loan.dart';
import 'package:sacco_mobile/features/loans/models/loan_application.dart';

class LoanRepository {
  final ApiClient _apiClient;
  
  LoanRepository(this._apiClient);
  
  // Get all loans for the current user
  Future<List<Loan>> getLoans() async {
    final response = await _apiClient.get(AppConstants.loansEndpoint);
    
    List<Loan> loans = [];
    for (var item in response) {
      loans.add(Loan.fromJson(item));
    }
    
    return loans;
  }
  
  // Get loan by ID
  Future<Loan> getLoanById(int loanId) async {
    final response = await _apiClient.get('${AppConstants.loansEndpoint}/$loanId');
    return Loan.fromJson(response);
  }
  
  // Get active loans for the current user
  Future<List<Loan>> getActiveLoans() async {
    final response = await _apiClient.get(
      AppConstants.loansEndpoint,
      queryParameters: {'status': 'DISBURSED'},
    );
    
    List<Loan> loans = [];
    for (var item in response) {
      loans.add(Loan.fromJson(item));
    }
    
    return loans;
  }
  
  // Apply for a loan
  Future<LoanApplication> applyForLoan(Map<String, dynamic> applicationData) async {
    final response = await _apiClient.post(
      AppConstants.loanApplicationsEndpoint,
      data: applicationData,
    );
    
    return LoanApplication.fromJson(response);
  }
  
  // Get loan applications for the current user
  Future<List<LoanApplication>> getLoanApplications() async {
    final response = await _apiClient.get(AppConstants.loanApplicationsEndpoint);
    
    List<LoanApplication> applications = [];
    for (var item in response) {
      applications.add(LoanApplication.fromJson(item));
    }
    
    return applications;
  }
  
  // Get loan application by ID
  Future<LoanApplication> getLoanApplicationById(int applicationId) async {
    final response = await _apiClient.get(
      '${AppConstants.loanApplicationsEndpoint}/$applicationId'
    );
    
    return LoanApplication.fromJson(response);
  }
}