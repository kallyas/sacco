import 'package:sacco_mobile/shared/models/base_model.dart';

class User extends BaseModel {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String? gender;
  final DateTime? dateOfBirth;
  final String nationalId;
  final bool isVerified;
  final int? roleId;
  final String? roleName;
  
  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    this.gender,
    this.dateOfBirth,
    required this.nationalId,
    required this.isVerified,
    this.roleId,
    this.roleName,
  });
  
  // Get full name
  String get fullName => '$firstName $lastName';
  
  // Factory method to create a User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      phoneNumber: json['phone_number'],
      gender: json['gender'],
      dateOfBirth: json['date_of_birth'] != null 
        ? DateTime.parse(json['date_of_birth']) 
        : null,
      nationalId: json['national_id'],
      isVerified: json['is_verified'] ?? false,
      roleId: json['role']?['id'],
      roleName: json['role']?['name'],
    );
  }
  
  // Convert User to JSON
  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'phone_number': phoneNumber,
      'gender': gender,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'national_id': nationalId,
      'is_verified': isVerified,
      'role': roleId != null 
        ? {
            'id': roleId,
            'name': roleName,
          } 
        : null,
    };
  }
  
  // Create a copy of the User with updated fields
  User copyWith({
    int? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? gender,
    DateTime? dateOfBirth,
    String? nationalId,
    bool? isVerified,
    int? roleId,
    String? roleName,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      gender: gender ?? this.gender,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      nationalId: nationalId ?? this.nationalId,
      isVerified: isVerified ?? this.isVerified,
      roleId: roleId ?? this.roleId,
      roleName: roleName ?? this.roleName,
    );
  }
}