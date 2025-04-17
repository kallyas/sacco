import 'package:flutter/material.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';
import 'package:sacco_mobile/features/loans/models/loan.dart';
import 'package:sacco_mobile/features/loans/repositories/loan_repository.dart';

enum LoanRepaymentState {
  initial,
  loading,
  success,
  error,
  processing,
  processed,
}

class LoanRepaymentViewModel extends ChangeNotifier {
  final LoanRepository _loanRepository;

  LoanRepaymentState _state = LoanRepaymentState.initial;
  LoanRepaymentState get state => _state;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  Loan? _selectedLoan;
  Loan? get selectedLoan => _selectedLoan;

  String? _referenceNumber;
  String? get referenceNumber => _referenceNumber;

  LoanRepaymentViewModel(this._loanRepository);

  // Set selected loan
  void setSelectedLoan(Loan loan) {
    _selectedLoan = loan;
    notifyListeners();
  }

  // Make loan repayment
  Future<bool> makeRepayment({
    required int loanId,
    required double amount,
    required String paymentMethod,
    String? description,
  }) async {
    if (_selectedLoan == null) {
      _errorMessage = 'No loan selected';
      notifyListeners();
      return false;
    }

    _state = LoanRepaymentState.processing;
    _errorMessage = null;
    notifyListeners();

    try {
      final repaymentResult = await _loanRepository.makeLoanRepayment(
        loanId: loanId,
        amount: amount,
        paymentMethod: paymentMethod,
        description: description,
      );
      
      // Store reference number from result
      _referenceNumber = repaymentResult['reference'];
      
      // Update the loan with new outstanding balance
      if (_selectedLoan != null) {
        // Calculate new outstanding balance
        final newBalance = _selectedLoan!.outstandingBalance - amount;
        
        // Create a new loan object with updated balance
        // Note: In a real app, you'd fetch the updated loan from the API
        _selectedLoan = Loan(
          id: _selectedLoan!.id,
          reference: _selectedLoan!.reference,
          memberId: _selectedLoan!.memberId,
          loanType: _selectedLoan!.loanType,
          amount: _selectedLoan!.amount,
          interestRate: _selectedLoan!.interestRate,
          termMonths: _selectedLoan!.termMonths,
          status: _selectedLoan!.status,
          applicationDate: _selectedLoan!.applicationDate,
          approvalDate: _selectedLoan!.approvalDate,
          disbursementDate: _selectedLoan!.disbursementDate,
          totalAmountPayable: _selectedLoan!.totalAmountPayable,
          totalInterest: _selectedLoan!.totalInterest,
          outstandingBalance: newBalance,
          nextPaymentDate: _selectedLoan!.nextPaymentDate,
          lastPaymentDate: DateTime.now(), // Update last payment date
          missedPaymentsCount: _selectedLoan!.missedPaymentsCount,
        );
      }
      
      _state = LoanRepaymentState.processed;
      notifyListeners();
      return true;
    } on AppError catch (e) {
      _state = LoanRepaymentState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
      return false;
    } catch (e) {
      _state = LoanRepaymentState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
      return false;
    }
  }

  // Calculate penalty amount (if any)
  double calculatePenalty(Loan loan) {
    // Check if there are any missed payments
    if (loan.missedPaymentsCount > 0) {
      // Example penalty calculation: 5% of outstanding balance per missed payment
      // This is just an example, actual calculations would depend on business rules
      return loan.outstandingBalance * 0.05 * loan.missedPaymentsCount;
    }
    return 0.0;
  }

  // Reset state
  void resetState() {
    _state = LoanRepaymentState.initial;
    _errorMessage = null;
    _referenceNumber = null;
    notifyListeners();
  }
}