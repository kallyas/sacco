import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/api/interceptors/auth_interceptor.dart';
import 'package:sacco_mobile/core/api/interceptors/logging_interceptor.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';

class ApiClient {
  late final Dio _dio;
  
  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.apiBaseUrl,
        connectTimeout: Duration(seconds: AppConstants.requestTimeoutSeconds),
        receiveTimeout: Duration(seconds: AppConstants.requestTimeoutSeconds),
        contentType: 'application/json',
        responseType: ResponseType.json,
      ),
    );
    
    // Add interceptors
    _dio.interceptors.add(AuthInterceptor());
    _dio.interceptors.add(LoggingInterceptor());
  }
  
  Future<dynamic> get(String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      throw AppError(
        message: AppConstants.genericErrorMessage,
        originalError: e.toString(),
      );
    }
  }
  
  Future<dynamic> post(String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      throw AppError(
        message: AppConstants.genericErrorMessage,
        originalError: e.toString(),
      );
    }
  }
  
  Future<dynamic> put(String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      throw AppError(
        message: AppConstants.genericErrorMessage,
        originalError: e.toString(),
      );
    }
  }
  
  Future<dynamic> delete(String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      throw AppError(
        message: AppConstants.genericErrorMessage,
        originalError: e.toString(),
      );
    }
  }
  
  AppError _handleError(DioException error) {
    if (error.error is SocketException) {
      return AppError(
        message: AppConstants.networkErrorMessage,
        originalError: error.toString(),
        statusCode: 0,
      );
    }
    
    int statusCode = error.response?.statusCode ?? 0;
    String message = '';
    
    try {
      // Try to parse error message from response
      if (error.response?.data != null) {
        final responseData = error.response?.data;
        if (responseData is Map<String, dynamic> && responseData.containsKey('error')) {
          message = responseData['error'];
        } else if (responseData is String) {
          // Try to parse JSON string
          final Map<String, dynamic> jsonData = json.decode(responseData);
          if (jsonData.containsKey('error')) {
            message = jsonData['error'];
          }
        }
      }
    } catch (_) {
      // If can't parse error message, use default
      message = error.message ?? AppConstants.genericErrorMessage;
    }
    
    // Handle specific status codes
    switch (statusCode) {
      case 401:
        return AppError(
          message: 'Unauthorized. Please login again.',
          originalError: error.toString(),
          statusCode: statusCode,
        );
      case 403:
        return AppError(
          message: 'You do not have permission to access this resource.',
          originalError: error.toString(),
          statusCode: statusCode,
        );
      case 404:
        return AppError(
          message: 'Resource not found.',
          originalError: error.toString(),
          statusCode: statusCode,
        );
      case 500:
        return AppError(
          message: 'Server error. Please try again later.',
          originalError: error.toString(),
          statusCode: statusCode,
        );
      default:
        return AppError(
          message: message.isNotEmpty ? message : AppConstants.genericErrorMessage,
          originalError: error.toString(),
          statusCode: statusCode,
        );
    }
  }
}