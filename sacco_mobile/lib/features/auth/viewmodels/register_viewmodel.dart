// lib/features/auth/viewmodels/register_viewmodel.dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/errors/app_error.dart';
import 'package:sacco_mobile/core/services/auth_service.dart';
import 'package:sacco_mobile/features/auth/models/register_request.dart';
import 'package:sacco_mobile/features/auth/models/user.dart';
import 'package:sacco_mobile/features/auth/repositories/auth_repository.dart';

enum RegisterState {
  initial,
  loading,
  success,
  error,
}

class RegisterViewModel extends ChangeNotifier {
  final AuthRepository _authRepository;
  final AuthService _authService;

  RegisterState _state = RegisterState.initial;
  RegisterState get state => _state;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  User? _user;
  User? get user => _user;

  // Form controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController nationalIdController = TextEditingController();

  // Selected values for dropdowns
  String? selectedGender;
  DateTime? selectedDateOfBirth;

  RegisterViewModel(this._authRepository, this._authService);

  // Form validation
  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }

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

  String? validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Confirm password is required';
    }

    if (value != passwordController.text) {
      return 'Passwords do not match';
    }

    return null;
  }

  String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'This field is required';
    }

    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }

    return null;
  }

  String? validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required';
    }

    final RegExp phoneRegex = RegExp(AppConstants.phonePattern);
    if (!phoneRegex.hasMatch(value)) {
      return 'Enter a valid phone number (+256XXXXXXXXX)';
    }

    return null;
  }

  String? validateNationalId(String? value) {
    if (value == null || value.isEmpty) {
      return 'National ID is required';
    }

    return null;
  }

  // Register function
  Future<bool> register() async {
    // Reset state and error message
    _state = RegisterState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final registerRequest = RegisterRequest(
        email: emailController.text.trim(),
        password: passwordController.text,
        confirmPassword: confirmPasswordController.text,
        firstName: firstNameController.text.trim(),
        lastName: lastNameController.text.trim(),
        phoneNumber: phoneNumberController.text.trim(),
        gender: selectedGender,
        dateOfBirth: selectedDateOfBirth != null
            ? DateFormat('yyyy-MM-dd').format(selectedDateOfBirth!)
            : null,
        nationalId: nationalIdController.text.trim(),
      );

      // Use auth service to handle registration and token storage
      _user = await _authService.register(registerRequest.toJson());

      _state = RegisterState.success;
      notifyListeners();
      return true;
    } on AppError catch (e) {
      _state = RegisterState.error;
      _errorMessage = e.userFriendlyMessage;
      notifyListeners();
      return false;
    } catch (e) {
      _state = RegisterState.error;
      _errorMessage = 'An unexpected error occurred. Please try again.';
      notifyListeners();
      return false;
    }
  }

  // Reset state
  void resetState() {
    _state = RegisterState.initial;
    _errorMessage = null;
    notifyListeners();
  }

  // Reset form
  void resetForm() {
    emailController.clear();
    passwordController.clear();
    confirmPasswordController.clear();
    firstNameController.clear();
    lastNameController.clear();
    phoneNumberController.clear();
    nationalIdController.clear();
    selectedGender = null;
    selectedDateOfBirth = null;
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    firstNameController.dispose();
    lastNameController.dispose();
    phoneNumberController.dispose();
    nationalIdController.dispose();
    super.dispose();
  }
}
