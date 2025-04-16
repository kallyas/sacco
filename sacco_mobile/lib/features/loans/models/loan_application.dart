import 'package:sacco_mobile/shared/models/base_model.dart';

class LoanApplication extends BaseModel {
  final int id;
  final int memberId;
  final String loanType;
  final double amountRequested;
  final String purpose;
  final String? collateralDetails;
  final String employmentDetails;
  final double monthlyIncome;
  final int? creditScore;
  final String status;
  final DateTime submittedDate;
  final int? reviewedById;
  final DateTime? reviewDate;
  final String? reviewNotes;
  
  LoanApplication({
    required this.id,
    required this.memberId,
    required this.loanType,
    required this.amountRequested,
    required this.purpose,
    this.collateralDetails,
    required this.employmentDetails,
    required this.monthlyIncome,
    this.creditScore,
    required this.status,
    required this.submittedDate,
    this.reviewedById,
    this.reviewDate,
    this.reviewNotes,
  });
  
  // Factory method to create a LoanApplication from JSON
  factory LoanApplication.fromJson(Map<String, dynamic> json) {
    return LoanApplication(
      id: json['id'],
      memberId: json['member'],
      loanType: json['loan_type'],
      amountRequested: json['amount_requested'].toDouble(),
      purpose: json['purpose'],
      collateralDetails: json['collateral_details'],
      employmentDetails: json['employment_details'],
      monthlyIncome: json['monthly_income'].toDouble(),
      creditScore: json['credit_score'],
      status: json['status'],
      submittedDate: DateTime.parse(json['submitted_date']),
      reviewedById: json['reviewed_by'],
      reviewDate: json['review_date'] != null 
          ? DateTime.parse(json['review_date']) 
          : null,
      reviewNotes: json['review_notes'],
    );
  }
  
  // Get status display text
  String get statusText {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_REVIEW':
        return 'In Review';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  }
  
  // Is application pending review?
  bool get isPending => status == 'PENDING';
  
  // Is application in review?
  bool get isInReview => status == 'IN_REVIEW';
  
  // Is application approved?
  bool get isApproved => status == 'APPROVED';
  
  // Is application rejected?
  bool get isRejected => status == 'REJECTED';
  
  // Convert LoanApplication to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member': memberId,
      'loan_type': loanType,
      'amount_requested': amountRequested,
      'purpose': purpose,
      'collateral_details': collateralDetails,
      'employment_details': employmentDetails,
      'monthly_income': monthlyIncome,
      'credit_score': creditScore,
      'status': status,
      'submitted_date': submittedDate.toIso8601String(),
      'reviewed_by': reviewedById,
      'review_date': reviewDate?.toIso8601String(),
      'review_notes': reviewNotes,
    };
  }
}