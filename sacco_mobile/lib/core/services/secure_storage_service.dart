import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:sacco_mobile/app/app_constants.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  // Save a token to secure storage
  Future<void> saveToken({required String key, required String value}) async {
    await _storage.write(key: key, value: value);
  }
  
  // Get a token from secure storage
  Future<String?> getToken({required String key}) async {
    return await _storage.read(key: key);
  }
  
  // Delete a specific token
  Future<void> deleteToken({required String key}) async {
    await _storage.delete(key: key);
  }
  
  // Delete all tokens (logout)
  Future<void> deleteAllTokens() async {
    await _storage.delete(key: AppConstants.accessTokenKey);
    await _storage.delete(key: AppConstants.refreshTokenKey);
    await _storage.delete(key: AppConstants.userIdKey);
  }
  
  // Save user info
  Future<void> saveUserId(String userId) async {
    await _storage.write(key: AppConstants.userIdKey, value: userId);
  }
  
  // Get user ID
  Future<String?> getUserId() async {
    return await _storage.read(key: AppConstants.userIdKey);
  }
}