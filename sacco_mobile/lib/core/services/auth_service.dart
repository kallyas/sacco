import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/core/services/secure_storage_service.dart';
import 'package:sacco_mobile/features/auth/models/login_request.dart';
import 'package:sacco_mobile/features/auth/models/user.dart';

class AuthService {
  final ApiClient _apiClient;
  final SecureStorageService _secureStorage;
  
  AuthService(this._apiClient, this._secureStorage);
  
  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _secureStorage.getToken(key: AppConstants.accessTokenKey);
    return token != null && token.isNotEmpty;
  }
  
  // Login user
  Future<User> login(LoginRequest loginRequest) async {
    final response = await _apiClient.post(
      AppConstants.loginEndpoint,
      data: loginRequest.toJson(),
    );
    
    // Save tokens
    await _secureStorage.saveToken(
      key: AppConstants.accessTokenKey,
      value: response['tokens']['access_token'],
    );
    
    await _secureStorage.saveToken(
      key: AppConstants.refreshTokenKey,
      value: response['tokens']['refresh_token'],
    );
    
    // Save user ID
    final user = User.fromJson(response['user']);
    await _secureStorage.saveUserId(user.id.toString());
    
    return user;
  }
  
  // Logout user
  Future<void> logout() async {
    await _secureStorage.deleteAllTokens();
  }
  
  // Register user
  Future<User> register(Map<String, dynamic> registrationData) async {
    final response = await _apiClient.post(
      AppConstants.registerEndpoint,
      data: registrationData,
    );
    
    // Save tokens
    await _secureStorage.saveToken(
      key: AppConstants.accessTokenKey,
      value: response['tokens']['access_token'],
    );
    
    await _secureStorage.saveToken(
      key: AppConstants.refreshTokenKey,
      value: response['tokens']['refresh_token'],
    );
    
    // Save user ID
    final user = User.fromJson(response['user']);
    await _secureStorage.saveUserId(user.id.toString());
    
    return user;
  }
  
  // Get current user ID
  Future<String?> getCurrentUserId() async {
    return await _secureStorage.getUserId();
  }
  
  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.getToken(
        key: AppConstants.refreshTokenKey,
      );
      
      if (refreshToken == null || refreshToken.isEmpty) {
        return false;
      }
      
      final response = await _apiClient.post(
        AppConstants.refreshTokenEndpoint,
        data: {'refresh_token': refreshToken},
      );
      
      // Save new tokens
      await _secureStorage.saveToken(
        key: AppConstants.accessTokenKey,
        value: response['tokens']['access_token'],
      );
      
      await _secureStorage.saveToken(
        key: AppConstants.refreshTokenKey,
        value: response['tokens']['refresh_token'],
      );
      
      return true;
    } catch (e) {
      await _secureStorage.deleteAllTokens();
      return false;
    }
  }
}