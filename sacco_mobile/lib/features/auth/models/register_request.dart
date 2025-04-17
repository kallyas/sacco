// lib/features/auth/models/register_request.dart
import 'package:sacco_mobile/shared/models/base_model.dart';

class RegisterRequest extends BaseModel {
  final String email;
  final String password;
  final String confirmPassword;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String? gender;
  final String? dateOfBirth;
  final String nationalId;

  RegisterRequest({
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    this.gender,
    this.dateOfBirth,
    required this.nationalId,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'confirm_password': confirmPassword,
      'first_name': firstName,
      'last_name': lastName,
      'phone_number': phoneNumber,
      'gender': gender,
      'date_of_birth': dateOfBirth,
      'national_id': nationalId,
    };
  }
}
