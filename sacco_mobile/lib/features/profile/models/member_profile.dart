import 'package:sacco_mobile/shared/models/base_model.dart';

class MemberProfile extends BaseModel {
  final int id;
  final int userId;
  final String memberNumber;
  final DateTime dateOfBirth;
  final String? maritalStatus;
  final String? employmentStatus;
  final String? occupation;
  final double monthlyIncome;
  final String physicalAddress;
  final String? postalAddress;
  final String city;
  final String district;
  final String nationalId;
  final String? passportPhotoUrl;
  final String? idDocumentUrl;
  final bool isVerified;
  final DateTime registrationDate;
  final String membershipStatus;
  final String membershipNumber;
  final String membershipType;
  
  MemberProfile({
    required this.id,
    required this.userId,
    required this.memberNumber,
    required this.dateOfBirth,
    this.maritalStatus,
    this.employmentStatus,
    this.occupation,
    required this.monthlyIncome,
    required this.physicalAddress,
    this.postalAddress,
    required this.city,
    required this.district,
    required this.nationalId,
    this.passportPhotoUrl,
    this.idDocumentUrl,
    required this.isVerified,
    required this.registrationDate,
    required this.membershipStatus,
    required this.membershipNumber,
    required this.membershipType,
  });
  
  // Factory method to create a MemberProfile from JSON
  factory MemberProfile.fromJson(Map<String, dynamic> json) {
    return MemberProfile(
      id: json['id'],
      userId: json['user'],
      memberNumber: json['member_number'],
      dateOfBirth: DateTime.parse(json['date_of_birth']),
      maritalStatus: json['marital_status'],
      employmentStatus: json['employment_status'],
      occupation: json['occupation'],
      monthlyIncome: json['monthly_income'].toDouble(),
      physicalAddress: json['physical_address'],
      postalAddress: json['postal_address'],
      city: json['city'],
      district: json['district'],
      nationalId: json['national_id'],
      passportPhotoUrl: json['passport_photo'],
      idDocumentUrl: json['id_document'],
      isVerified: json['is_verified'] ?? false,
      registrationDate: DateTime.parse(json['registration_date']),
      membershipStatus: json['membership_status'],
      membershipNumber: json['membership_number'],
      membershipType: json['membership_type'],
    );
  }
  
  // Get marital status display text
  String get maritalStatusText {
    switch (maritalStatus) {
      case 'SINGLE':
        return 'Single';
      case 'MARRIED':
        return 'Married';
      case 'DIVORCED':
        return 'Divorced';
      case 'WIDOWED':
        return 'Widowed';
      default:
        return maritalStatus ?? 'Not specified';
    }
  }
  
  // Get employment status display text
  String get employmentStatusText {
    switch (employmentStatus) {
      case 'EMPLOYED':
        return 'Employed';
      case 'SELF_EMPLOYED':
        return 'Self Employed';
      case 'UNEMPLOYED':
        return 'Unemployed';
      case 'RETIRED':
        return 'Retired';
      case 'STUDENT':
        return 'Student';
      case 'OTHER':
        return 'Other';
      default:
        return employmentStatus ?? 'Not specified';
    }
  }
  
  // Get membership status display text
  String get membershipStatusText {
    switch (membershipStatus) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      case 'TERMINATED':
        return 'Terminated';
      default:
        return membershipStatus;
    }
  }
  
  // Get membership type display text
  String get membershipTypeText {
    switch (membershipType) {
      case 'INDIVIDUAL':
        return 'Individual';
      case 'JOINT':
        return 'Joint';
      case 'CORPORATE':
        return 'Corporate';
      default:
        return membershipType;
    }
  }
  
  // Is member active?
  bool get isActive => membershipStatus == 'ACTIVE';
  
  // Convert MemberProfile to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user': userId,
      'member_number': memberNumber,
      'date_of_birth': dateOfBirth.toIso8601String(),
      'marital_status': maritalStatus,
      'employment_status': employmentStatus,
      'occupation': occupation,
      'monthly_income': monthlyIncome,
      'physical_address': physicalAddress,
      'postal_address': postalAddress,
      'city': city,
      'district': district,
      'national_id': nationalId,
      'passport_photo': passportPhotoUrl,
      'id_document': idDocumentUrl,
      'is_verified': isVerified,
      'registration_date': registrationDate.toIso8601String(),
      'membership_status': membershipStatus,
      'membership_number': membershipNumber,
      'membership_type': membershipType,
    };
  }
}