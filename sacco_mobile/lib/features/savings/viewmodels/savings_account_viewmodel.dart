import 'package:flutter/material.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';
import 'package:sacco_mobile/features/savings/models/savings_account.dart';
import 'package:sacco_mobile/features/savings/repositories/savings_repository.dart';

enum SavingsAccountState {
  initial,
  loading,
  success,
  error,
}

class SavingsAccountViewModel extends ChangeNotifier {
  final SavingsRepository _savingsRepository;

  SavingsAccountState _state = SavingsAccountState.initial;
  SavingsAccountState get state => _state;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  SavingsAccount? _savingsAccount;
  SavingsAccount? get savingsAccount => _savingsAccount;

  SavingsAccountViewModel(this._savingsRepository);

  // Load savings account data
  Future<void> loadSavingsAccount() async {
    _state = SavingsAccountState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final account = await _savingsRepository.getSavingsAccount();
      _savingsAccount = account;
      _state = SavingsAccountState.success;
      notifyListeners();
    } on AppError catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
    } catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
    }
  }

  // Make a deposit
  Future<bool> makeDeposit({
    required double amount,
    required String paymentMethod,
    String? description,
  }) async {
    if (_savingsAccount == null) {
      _errorMessage = 'No active savings account found';
      notifyListeners();
      return false;
    }

    _state = SavingsAccountState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      await _savingsRepository.makeDeposit(
        accountId: _savingsAccount!.id,
        amount: amount,
        paymentMethod: paymentMethod,
        description: description,
      );

      // Reload account data to update balance
      await loadSavingsAccount();
      return true;
    } on AppError catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
      return false;
    } catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
      return false;
    }
  }

  // Make a withdrawal
  Future<bool> makeWithdrawal({
    required double amount,
    required String paymentMethod,
    String? description,
  }) async {
    if (_savingsAccount == null) {
      _errorMessage = 'No active savings account found';
      notifyListeners();
      return false;
    }

    // Check if amount exceeds available balance
    if (amount > _savingsAccount!.availableBalance) {
      _errorMessage = 'Withdrawal amount exceeds available balance';
      notifyListeners();
      return false;
    }

    _state = SavingsAccountState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      await _savingsRepository.makeWithdrawal(
        accountId: _savingsAccount!.id,
        amount: amount,
        paymentMethod: paymentMethod,
        description: description,
      );

      // Reload account data to update balance
      await loadSavingsAccount();
      return true;
    } on AppError catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
      return false;
    } catch (e) {
      _state = SavingsAccountState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
      return false;
    }
  }

  // Get all savings accounts (for users with multiple accounts)
  Future<List<SavingsAccount>> getAllSavingsAccounts() async {
    try {
      return await _savingsRepository.getAllSavingsAccounts();
    } catch (e) {
      rethrow;
    }
  }
}