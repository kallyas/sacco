import 'package:flutter/material.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';
import 'package:sacco_mobile/core/services/auth_service.dart';
import 'package:sacco_mobile/features/loans/models/loan.dart';
import 'package:sacco_mobile/features/loans/repositories/loan_repository.dart';
import 'package:sacco_mobile/features/savings/models/savings_account.dart';
import 'package:sacco_mobile/features/savings/repositories/savings_repository.dart';

enum DashboardLoadState {
  initial,
  loading,
  success,
  error,
}

class DashboardViewModel extends ChangeNotifier {
  final AuthService _authService;
  final SavingsRepository _savingsRepository;
  final LoanRepository _loanRepository;
  
  DashboardLoadState _state = DashboardLoadState.initial;
  DashboardLoadState get state => _state;
  
  String? _errorMessage;
  String? get errorMessage => _errorMessage;
  
  SavingsAccount? _savingsAccount;
  SavingsAccount? get savingsAccount => _savingsAccount;
  
  List<Loan> _activeLoans = [];
  List<Loan> get activeLoans => _activeLoans;
  
  DashboardViewModel(
    this._authService,
    this._savingsRepository,
    this._loanRepository,
  );
  
  // Load dashboard data
  Future<void> loadDashboardData() async {
    _state = DashboardLoadState.loading;
    _errorMessage = null;
    notifyListeners();
    
    try {
      // Get user ID
      final userId = await _authService.getCurrentUserId();
      
      if (userId == null) {
        throw AppError(
          message: 'User ID not found',
          originalError: 'User ID not found in secure storage',
        );
      }
      
      // Load savings account
      final savingsAccount = await _savingsRepository.getSavingsAccount();
      
      // Load active loans
      final activeLoans = await _loanRepository.getActiveLoans();
      
      // Update state
      _savingsAccount = savingsAccount;
      _activeLoans = activeLoans;
      _state = DashboardLoadState.success;
      notifyListeners();
    } on AppError catch (e) {
      _state = DashboardLoadState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
    } catch (e) {
      _state = DashboardLoadState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
    }
  }
  
  // Logout
  Future<void> logout() async {
    await _authService.logout();
  }
  
  // Refresh data
  Future<void> refreshData() async {
    await loadDashboardData();
  }
}