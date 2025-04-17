// lib/features/auth/views/register_screen.dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/features/auth/viewmodels/register_viewmodel.dart';
import 'package:sacco_mobile/features/dashboard/views/dashboard_screen.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/app_text_field.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();

  int _currentPage = 0;
  final int _totalPages = 3;

  @override
  void initState() {
    super.initState();
    // Reset login state when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RegisterViewModel>().resetState();
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final viewModel = context.watch<RegisterViewModel>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (_currentPage > 0) {
              _pageController.previousPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              );
            } else {
              Navigator.of(context).pop();
            }
          },
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress indicator
            LinearProgressIndicator(
              value: (_currentPage + 1) / _totalPages,
              backgroundColor: Colors.grey[200],
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
            ),

            // Page indicators
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_totalPages, (index) {
                  return Container(
                    width: 10,
                    height: 10,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: index == _currentPage
                          ? AppTheme.primaryColor
                          : Colors.grey[300],
                    ),
                  );
                }),
              ),
            ),

            // Form pages
            Expanded(
              child: Form(
                key: _formKey,
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (page) {
                    setState(() {
                      _currentPage = page;
                    });
                  },
                  children: [
                    _buildAccountInfoPage(viewModel),
                    _buildPersonalInfoPage(viewModel),
                    _buildConfirmationPage(viewModel),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountInfoPage(RegisterViewModel viewModel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Account Information',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Please enter your account details',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),

          // Email field
          AppTextField(
            controller: viewModel.emailController,
            labelText: 'Email',
            hintText: 'Enter your email address',
            prefixIcon: const Icon(Icons.email_outlined),
            keyboardType: TextInputType.emailAddress,
            validator: viewModel.validateEmail,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Password field
          AppTextField(
            controller: viewModel.passwordController,
            labelText: 'Password',
            hintText: 'Enter your password',
            prefixIcon: const Icon(Icons.lock_outline),
            obscureText: true,
            validator: viewModel.validatePassword,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Confirm password field
          AppTextField(
            controller: viewModel.confirmPasswordController,
            labelText: 'Confirm Password',
            hintText: 'Confirm your password',
            prefixIcon: const Icon(Icons.lock_outline),
            obscureText: true,
            validator: viewModel.validateConfirmPassword,
            textInputAction: TextInputAction.done,
          ),

          const SizedBox(height: 32),

          // Next button
          SizedBox(
            width: double.infinity,
            child: AppButton(
              text: 'Next',
              onPressed: _validateAndProceed,
              iconData: Icons.arrow_forward,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalInfoPage(RegisterViewModel viewModel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Personal Information',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Please enter your personal details',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),

          // First name field
          AppTextField(
            controller: viewModel.firstNameController,
            labelText: 'First Name',
            hintText: 'Enter your first name',
            prefixIcon: const Icon(Icons.person_outline),
            textCapitalization: TextCapitalization.words,
            validator: viewModel.validateName,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Last name field
          AppTextField(
            controller: viewModel.lastNameController,
            labelText: 'Last Name',
            hintText: 'Enter your last name',
            prefixIcon: const Icon(Icons.person_outline),
            textCapitalization: TextCapitalization.words,
            validator: viewModel.validateName,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Phone number field
          AppTextField(
            controller: viewModel.phoneNumberController,
            labelText: 'Phone Number',
            hintText: 'Format: +256XXXXXXXXX',
            prefixIcon: const Icon(Icons.phone_outlined),
            keyboardType: TextInputType.phone,
            validator: viewModel.validatePhoneNumber,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // National ID field
          AppTextField(
            controller: viewModel.nationalIdController,
            labelText: 'National ID',
            hintText: 'Enter your national ID number',
            prefixIcon: const Icon(Icons.badge_outlined),
            validator: viewModel.validateNationalId,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Gender dropdown
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Gender',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[400]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: DropdownButtonFormField<String>(
                  value: viewModel.selectedGender,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                  ),
                  hint: const Text('Select gender'),
                  items: const [
                    DropdownMenuItem(value: 'M', child: Text('Male')),
                    DropdownMenuItem(value: 'F', child: Text('Female')),
                    DropdownMenuItem(value: 'O', child: Text('Other')),
                  ],
                  onChanged: (value) {
                    viewModel.selectedGender = value;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Date of birth field
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Date of Birth',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate:
                        viewModel.selectedDateOfBirth ?? DateTime(2000),
                    firstDate: DateTime(1940),
                    lastDate: DateTime.now(),
                  );
                  if (date != null) {
                    setState(() {
                      viewModel.selectedDateOfBirth = date;
                    });
                  }
                },
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[400]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        viewModel.selectedDateOfBirth != null
                            ? DateFormat('dd MMM, yyyy')
                                .format(viewModel.selectedDateOfBirth!)
                            : 'Select date of birth',
                        style: TextStyle(
                          color: viewModel.selectedDateOfBirth != null
                              ? Colors.black
                              : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 32),

          // Button row
          Row(
            children: [
              Expanded(
                child: AppButton(
                  text: 'Back',
                  onPressed: () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  },
                  buttonType: ButtonType.outline,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: AppButton(
                  text: 'Next',
                  onPressed: _validatePersonalInfoAndProceed,
                  iconData: Icons.arrow_forward,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmationPage(RegisterViewModel viewModel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Confirm Your Details',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Please review and confirm your information',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),

          // Account info summary
          const Text(
            'Account Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildInfoRow('Email', viewModel.emailController.text),

          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 16),

          // Personal info summary
          const Text(
            'Personal Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildInfoRow('First Name', viewModel.firstNameController.text),
          _buildInfoRow('Last Name', viewModel.lastNameController.text),
          _buildInfoRow('Phone Number', viewModel.phoneNumberController.text),
          _buildInfoRow('National ID', viewModel.nationalIdController.text),
          if (viewModel.selectedGender != null)
            _buildInfoRow('Gender', _getGenderText(viewModel.selectedGender!)),
          if (viewModel.selectedDateOfBirth != null)
            _buildInfoRow(
              'Date of Birth',
              DateFormat('dd MMM, yyyy').format(viewModel.selectedDateOfBirth!),
            ),

          // Error message
          if (viewModel.errorMessage != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red[200]!),
              ),
              child: Text(
                viewModel.errorMessage!,
                style: TextStyle(
                  color: Colors.red[800],
                ),
              ),
            ),
          ],

          const SizedBox(height: 32),

          // Button row
          Row(
            children: [
              Expanded(
                child: AppButton(
                  text: 'Back',
                  onPressed: () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  },
                  buttonType: ButtonType.outline,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: AppButton(
                  text: 'Register',
                  onPressed: viewModel.state == RegisterState.loading
                      ? null
                      : _submitRegistration,
                  isLoading: viewModel.state == RegisterState.loading,
                ),
              ),
            ],
          ),

          // Terms and conditions text
          const SizedBox(height: 16),
          const Text(
            'By registering, you agree to our Terms of Service and Privacy Policy.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getGenderText(String genderCode) {
    switch (genderCode) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'O':
        return 'Other';
      default:
        return genderCode;
    }
  }

  void _validateAndProceed() {
    // Validate account information fields
    final viewModel = context.read<RegisterViewModel>();
    if (viewModel.validateEmail(viewModel.emailController.text) == null &&
        viewModel.validatePassword(viewModel.passwordController.text) == null &&
        viewModel.validateConfirmPassword(
                viewModel.confirmPasswordController.text) ==
            null) {
      // Go to next page
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      // Manually trigger form validation to show errors
      _formKey.currentState?.validate();
    }
  }

  void _validatePersonalInfoAndProceed() {
    // Validate personal information fields
    final viewModel = context.read<RegisterViewModel>();
    if (viewModel.validateName(viewModel.firstNameController.text) == null &&
        viewModel.validateName(viewModel.lastNameController.text) == null &&
        viewModel.validatePhoneNumber(viewModel.phoneNumberController.text) ==
            null &&
        viewModel.validateNationalId(viewModel.nationalIdController.text) ==
            null) {
      // Go to next page
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      // Manually trigger form validation to show errors
      _formKey.currentState?.validate();
    }
  }

  Future<void> _submitRegistration() async {
    final viewModel = context.read<RegisterViewModel>();

    // Hide keyboard
    FocusScope.of(context).unfocus();

    final success = await viewModel.register();

    if (success && mounted) {
      // Show success dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: const Text('Registration Successful'),
          content: const Text(
              'Your account has been created successfully. You can now use the app.'),
          actions: [
            TextButton(
              onPressed: () {
                // Navigate to dashboard
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                      builder: (context) => const DashboardScreen()),
                  (route) => false,
                );
              },
              child: const Text('Continue'),
            ),
          ],
        ),
      );
    }
  }
}
