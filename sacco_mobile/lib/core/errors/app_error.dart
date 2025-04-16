class AppError implements Exception {
  final String message;
  final String originalError;
  final int statusCode;
  
  AppError({
    required this.message,
    required this.originalError,
    this.statusCode = 0,
  });
  
  @override
  String toString() {
    return 'AppError: $message (Status: $statusCode, Original: $originalError)';
  }
  
  // Determine if the error is a network error
  bool get isNetworkError => statusCode == 0;
  
  // Determine if the error is an authentication error
  bool get isAuthError => statusCode == 401 || statusCode == 403;
  
  // Determine if the error is a server error
  bool get isServerError => statusCode >= 500 && statusCode < 600;
  
  // Determine if the error is a client error
  bool get isClientError => statusCode >= 400 && statusCode < 500;
  
  // Create a user-friendly message
  String get userFriendlyMessage {
    if (isNetworkError) {
      return 'Network error. Please check your connection.';
    } else if (isAuthError) {
      return 'Authentication error. Please login again.';
    } else if (isServerError) {
      return 'Server error. Please try again later.';
    } else {
      return message;
    }
  }
}