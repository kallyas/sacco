// lib/core/api/interceptors/logging_interceptor.dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (kDebugMode) {
      print('REQUEST[${options.method}] => PATH: ${options.path}');
      print('Headers:');
      options.headers.forEach((key, value) {
        print('$key: $value');
      });
      
      if (options.data != null) {
        print('Request Body: ${options.data}');
      }
    }
    return super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (kDebugMode) {
      print('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
      print('Response Body: ${response.data}');
    }
    return super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (kDebugMode) {
      print('ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
      print('Error Message: ${err.message}');
      if (err.response != null) {
        print('Error Response: ${err.response?.data}');
      }
    }
    return super.onError(err, handler);
  }
}