import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/features/profile/models/member_profile.dart';
import 'dart:io';

class ProfileRepository {
  final ApiClient _apiClient;
  
  ProfileRepository(this._apiClient);
  
  // Get member profile
  Future<MemberProfile> getMemberProfile() async {
    final response = await _apiClient.get(
      '${AppConstants.memberEndpoint}/me',
    );
    
    return MemberProfile.fromJson(response);
  }
  
  // Update member profile
  Future<MemberProfile> updateMemberProfile(Map<String, dynamic> profileData) async {
    final response = await _apiClient.put(
      '${AppConstants.memberEndpoint}/me',
      data: profileData,
    );
    
    return MemberProfile.fromJson(response);
  }
  
  // Upload profile photo
  Future<String> uploadProfilePhoto(File photoFile) async {
    // Create form data
    final formData = {
      'file': await photoFile.readAsBytes(),
      'filename': photoFile.path.split('/').last,
    };
    
    final response = await _apiClient.post(
      '${AppConstants.memberEndpoint}/me/upload-photo',
      data: formData,
    );
    
    return response['photo_url'];
  }
  
  // Upload ID document
  Future<String> uploadIdDocument(File documentFile) async {
    // Create form data
    final formData = {
      'file': await documentFile.readAsBytes(),
      'filename': documentFile.path.split('/').last,
    };
    
    final response = await _apiClient.post(
      '${AppConstants.memberEndpoint}/me/upload-document',
      data: formData,
    );
    
    return response['document_url'];
  }
  
  // Get member next of kin
  Future<List<Map<String, dynamic>>> getMemberNextOfKin() async {
    final response = await _apiClient.get(
      '${AppConstants.memberEndpoint}/me/next-of-kin',
    );
    
    List<Map<String, dynamic>> nextOfKin = [];
    for (var item in response) {
      nextOfKin.add(item);
    }
    
    return nextOfKin;
  }
  
  // Add next of kin
  Future<Map<String, dynamic>> addNextOfKin(Map<String, dynamic> nextOfKinData) async {
    final response = await _apiClient.post(
      '${AppConstants.memberEndpoint}/me/next-of-kin',
      data: nextOfKinData,
    );
    
    return response;
  }
  
  // Update next of kin
  Future<Map<String, dynamic>> updateNextOfKin(
    int nextOfKinId,
    Map<String, dynamic> nextOfKinData,
  ) async {
    final response = await _apiClient.put(
      '${AppConstants.memberEndpoint}/me/next-of-kin/$nextOfKinId',
      data: nextOfKinData,
    );
    
    return response;
  }
  
  // Delete next of kin
  Future<void> deleteNextOfKin(int nextOfKinId) async {
    await _apiClient.delete(
      '${AppConstants.memberEndpoint}/me/next-of-kin/$nextOfKinId',
    );
  }
}