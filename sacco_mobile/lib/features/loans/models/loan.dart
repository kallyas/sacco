import 'package:sacco_mobile/shared/models/base_model.dart';

class Loan extends BaseModel {
  final int id;
  final String reference;
  final int memberId;
  final String loanType;
  final double amount;
  final double interestRate;
  final int termMonths;
  final String status;
  final DateTime applicationDate;
  final DateTime? approvalDate;
  final DateTime? disbursementDate;
  final double totalAmountPayable;
  final double totalInterest;
  final double outstandingBalance;
  final DateTime? nextPaymentDate;
  final DateTime? lastPaymentDate;
  final int missedPaymentsCount;
  
  Loan({
    required this.id,
    required this.reference,
    required this.memberId,
    required this.loanType,
    required this.amount,
    required this.interestRate,
    required this.termMonths,
    required this.status,
    required this.applicationDate,
    this.approvalDate,
    this.disbursementDate,
    required this.totalAmountPayable,
    required this.totalInterest,
    required this.outstandingBalance,
    this.nextPaymentDate,
    this.lastPaymentDate,
    required this.missedPaymentsCount,
  });
  
  // Factory method to create a Loan from JSON
  factory Loan.fromJson(Map<String, dynamic> json) {
    return Loan(
      id: json['id'],
      reference: json['reference'],
      memberId: json['member'],
      loanType: json['loan_type'],
      amount: json['amount'].toDouble(),
      interestRate: json['interest_rate'].toDouble(),
      termMonths: json['term_months'],
      status: json['status'],
      applicationDate: DateTime.parse(json['application_date']),
      approvalDate: json['approval_date'] != null 
          ? DateTime.parse(json['approval_date']) 
          : null,
      disbursementDate: json['disbursement_date'] != null 
          ? DateTime.parse(json['disbursement_date']) 
          : null,
      totalAmountPayable: json['total_amount_payable'].toDouble(),
      totalInterest: json['total_interest'].toDouble(),
      outstandingBalance: json['outstanding_balance'].toDouble(),
      nextPaymentDate: json['next_payment_date'] != null 
          ? DateTime.parse(json['next_payment_date']) 
          : null,
      lastPaymentDate: json['last_payment_date'] != null 
          ? DateTime.parse(json['last_payment_date']) 
          : null,
      missedPaymentsCount: json['missed_payments_count'],
    );
  }
  
  // Get loan status display text
  String get statusText {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'DISBURSED':
        return 'Disbursed';
      case 'COMPLETED':
        return 'Completed';
      case 'DEFAULTED':
        return 'Defaulted';
      default:
        return status;
    }
  }
  
  // Is loan active?
  bool get isActive => status == 'DISBURSED';
  
  // Get loan progress percentage
  double get progressPercentage {
    if (outstandingBalance <= 0) return 100;
    if (totalAmountPayable <= 0) return 0;
    
    // Calculate paid amount
    double paidAmount = totalAmountPayable - outstandingBalance;
    double progress = (paidAmount / totalAmountPayable) * 100;
    
    // Ensure progress is between 0 and 100
    return progress.clamp(0, 100);
  }
  
  // Convert Loan to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reference': reference,
      'member': memberId,
      'loan_type': loanType,
      'amount': amount,
      'interest_rate': interestRate,
      'term_months': termMonths,
      'status': status,
      'application_date': applicationDate.toIso8601String(),
      'approval_date': approvalDate?.toIso8601String(),
      'disbursement_date': disbursementDate?.toIso8601String(),
      'total_amount_payable': totalAmountPayable,
      'total_interest': totalInterest,
      'outstanding_balance': outstandingBalance,
      'next_payment_date': nextPaymentDate?.toIso8601String(),
      'last_payment_date': lastPaymentDate?.toIso8601String(),
      'missed_payments_count': missedPaymentsCount,
    };
  }
}