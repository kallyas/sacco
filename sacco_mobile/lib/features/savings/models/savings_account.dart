import 'package:sacco_mobile/shared/models/base_model.dart';

class SavingsAccount extends BaseModel {
  final int id;
  final int memberId;
  final String accountNumber;
  final String accountType;
  final double balance;
  final double interestRate;
  final String status;
  final double minimumBalance;
  final DateTime dateOpened;
  final DateTime? lastInterestDate;
  
  SavingsAccount({
    required this.id,
    required this.memberId,
    required this.accountNumber,
    required this.accountType,
    required this.balance,
    required this.interestRate,
    required this.status,
    required this.minimumBalance,
    required this.dateOpened,
    this.lastInterestDate,
  });
  
  // Factory method to create a SavingsAccount from JSON
  factory SavingsAccount.fromJson(Map<String, dynamic> json) {
    return SavingsAccount(
      id: json['id'],
      memberId: json['member'],
      accountNumber: json['account_number'],
      accountType: json['account_type'],
      balance: json['balance'].toDouble(),
      interestRate: json['interest_rate'].toDouble(),
      status: json['status'],
      minimumBalance: json['minimum_balance'].toDouble(),
      dateOpened: DateTime.parse(json['date_opened']),
      lastInterestDate: json['last_interest_date'] != null 
          ? DateTime.parse(json['last_interest_date']) 
          : null,
    );
  }
  
  // Get account type display text
  String get accountTypeText {
    switch (accountType) {
      case 'REGULAR':
        return 'Regular Savings';
      case 'FIXED':
        return 'Fixed Deposit';
      case 'CHILDREN':
        return 'Children Savings';
      case 'GROUP':
        return 'Group Savings';
      default:
        return accountType;
    }
  }
  
  // Get account status display text
  String get statusText {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'CLOSED':
        return 'Closed';
      default:
        return status;
    }
  }
  
  // Is account active?
  bool get isActive => status == 'ACTIVE';
  
  // Available balance (balance - minimum balance)
  double get availableBalance => balance - minimumBalance;
  
  // Convert SavingsAccount to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member': memberId,
      'account_number': accountNumber,
      'account_type': accountType,
      'balance': balance,
      'interest_rate': interestRate,
      'status': status,
      'minimum_balance': minimumBalance,
      'date_opened': dateOpened.toIso8601String(),
      'last_interest_date': lastInterestDate?.toIso8601String(),
    };
  }
}