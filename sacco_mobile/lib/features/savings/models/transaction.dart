import 'package:sacco_mobile/shared/models/base_model.dart';

class Transaction extends BaseModel {
  final int id;
  final String transactionRef;
  final int memberId;
  final String transactionType;
  final double amount;
  final String paymentMethod;
  final String status;
  final String? sourceAccount;
  final String? destinationAccount;
  final String? externalReference;
  final String? providerReference;
  final String? description;
  final DateTime createdAt;
  final DateTime? processedDate;

  Transaction({
    required this.id,
    required this.transactionRef,
    required this.memberId,
    required this.transactionType,
    required this.amount,
    required this.paymentMethod,
    required this.status,
    this.sourceAccount,
    this.destinationAccount,
    this.externalReference,
    this.providerReference,
    this.description,
    required this.createdAt,
    this.processedDate,
  });

  // Factory method to create a Transaction from JSON
  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      transactionRef: json['transaction_ref'],
      memberId: json['member'],
      transactionType: json['transaction_type'],
      amount: json['amount'].toDouble(),
      paymentMethod: json['payment_method'],
      status: json['status'],
      sourceAccount: json['source_account'],
      destinationAccount: json['destination_account'],
      externalReference: json['external_reference'],
      providerReference: json['provider_reference'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
      processedDate: json['processed_date'] != null
          ? DateTime.parse(json['processed_date'])
          : null,
    );
  }

  // Get transaction type display text
  String get transactionTypeText {
    switch (transactionType) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'LOAN_DISBURSEMENT':
        return 'Loan Disbursement';
      case 'LOAN_REPAYMENT':
        return 'Loan Repayment';
      case 'TRANSFER':
        return 'Transfer';
      case 'INTEREST':
        return 'Interest Credit';
      case 'FEE':
        return 'Service Fee';
      default:
        return transactionType;
    }
  }

  // Get payment method display text
  String get paymentMethodText {
    switch (paymentMethod) {
      case 'CASH':
        return 'Cash';
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'CHEQUE':
        return 'Cheque';
      case 'INTERNAL':
        return 'Internal Transfer';
      default:
        return paymentMethod;
    }
  }

  // Get status display text
  String get statusText {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      case 'REVERSED':
        return 'Reversed';
      default:
        return status;
    }
  }

  // Is transaction completed?
  bool get isCompleted => status == 'COMPLETED';

  // Is transaction pending?
  bool get isPending => status == 'PENDING';

  // Is transaction a deposit (credit)?
  bool get isDeposit =>
      transactionType == 'DEPOSIT' ||
      transactionType == 'LOAN_DISBURSEMENT' ||
      transactionType == 'INTEREST';

  // Is transaction a withdrawal (debit)?
  bool get isWithdrawal =>
      transactionType == 'WITHDRAWAL' ||
      transactionType == 'LOAN_REPAYMENT' ||
      transactionType == 'FEE';

  // Get amount with sign (positive for credits, negative for debits)
  double get signedAmount => isDeposit ? amount : -amount;

  // Convert Transaction to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'transaction_ref': transactionRef,
      'member': memberId,
      'transaction_type': transactionType,
      'amount': amount,
      'payment_method': paymentMethod,
      'status': status,
      'source_account': sourceAccount,
      'destination_account': destinationAccount,
      'external_reference': externalReference,
      'provider_reference': providerReference,
      'description': description,
      'created_at': createdAt.toIso8601String(),
      'processed_date': processedDate?.toIso8601String(),
    };
  }
}
