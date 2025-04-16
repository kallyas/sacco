import 'package:flutter/material.dart';
import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';
import 'package:sacco_mobile/core/services/auth_service.dart';
import 'package:sacco_mobile/features/auth/models/login_request.dart';
import 'package:sacco_mobile/features/auth/models/user.dart';
import 'package:sacco_mobile/features/auth/repositories/auth_repository.dart';

enum LoginState {
  initial,
  loading,
  success,
  error,
}

class LoginViewModel extends ChangeNotifier {
  final AuthRepository _authRepository;
  final AuthService _authService;

  LoginState _state = LoginState.initial;
  LoginState get state => _state;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  User? _user;
  User? get user => _user;

  LoginViewModel(this._authRepository, this._authService);

  // Form controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  // Form validation
  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }

    // Simple email validation
    final RegExp emailRegex = RegExp(AppConstants.emailPattern);
    if (!emailRegex.hasMatch(value)) {
      return 'Enter a valid email address';
    }

    return null;
  }

  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }

    return null;
  }

  // Login function
  Future<bool> login() async {
    // Reset state and error message
    _state = LoginState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final loginRequest = LoginRequest(
        email: emailController.text.trim(),
        password: passwordController.text,
      );

      // Use auth service to handle login and token storage
      _user = await _authService.login(loginRequest);

      _state = LoginState.success;
      notifyListeners();
      return true;
    } on AppError catch (e) {
      _state = LoginState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
      return false;
    } catch (e) {
      _state = LoginState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
      return false;
    }
  }

  // Reset state
  void resetState() {
    _state = LoginState.initial;
    _errorMessage = null;
    notifyListeners();
  }

  // Reset form
  void resetForm() {
    emailController.clear();
    passwordController.clear();
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
