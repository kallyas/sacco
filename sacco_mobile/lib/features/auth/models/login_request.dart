import 'package:sacco_mobile/shared/models/base_model.dart';

class LoginRequest extends BaseModel {
  final String email;
  final String password;
  
  LoginRequest({
    required this.email,
    required this.password,
  });
  
  @override
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}