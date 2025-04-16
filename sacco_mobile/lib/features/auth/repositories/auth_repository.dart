import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/features/auth/models/login_request.dart';
import 'package:sacco_mobile/features/auth/models/user.dart';

class AuthRepository {
  final ApiClient _apiClient;
  
  AuthRepository(this._apiClient);
  
  // Login user and return user data
  Future<Map<String, dynamic>> login(LoginRequest loginRequest) async {
    final response = await _apiClient.post(
      AppConstants.loginEndpoint,
      data: loginRequest.toJson(),
    );
    
    return response;
  }
  
  // Register user and return user data
  Future<Map<String, dynamic>> register(Map<String, dynamic> registrationData) async {
    final response = await _apiClient.post(
      AppConstants.registerEndpoint,
      data: registrationData,
    );
    
    return response;
  }
  
  // Get user profile
  Future<User> getUserProfile() async {
    final response = await _apiClient.get(
      '${AppConstants.memberEndpoint}/me',
    );
    
    return User.fromJson(response);
  }
  
  // Refresh token
  Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    final response = await _apiClient.post(
      AppConstants.refreshTokenEndpoint,
      data: {'refresh_token': refreshToken},
    );
    
    return response;
  }
}