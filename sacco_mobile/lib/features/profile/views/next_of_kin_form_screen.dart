import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_constants.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/app_text_field.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class NextOfKinFormScreen extends StatefulWidget {
  final Map<String, dynamic>? nextOfKin;

  const NextOfKinFormScreen({
    super.key,
    this.nextOfKin,
  });

  @override
  State<NextOfKinFormScreen> createState() => _NextOfKinFormScreenState();
}

class _NextOfKinFormScreenState extends State<NextOfKinFormScreen> {
  final _formKey = GlobalKey<FormState>();

  // Form controllers
  late TextEditingController _fullNameController;
  late TextEditingController _phoneNumberController;
  late TextEditingController _emailController;
  late TextEditingController _physicalAddressController;
  late TextEditingController _nationalIdController;
  late TextEditingController _percentageShareController;

  // Form values
  String? _selectedRelationship;

  // Edit mode flag
  bool get _isEditMode => widget.nextOfKin != null;

  @override
  void initState() {
    super.initState();
    // Initialize controllers with existing data or empty values
    _fullNameController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['full_name'] : '',
    );
    _phoneNumberController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['phone_number'] : '',
    );
    _emailController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['email'] ?? '' : '',
    );
    _physicalAddressController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['physical_address'] : '',
    );
    _nationalIdController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['national_id'] : '',
    );
    _percentageShareController = TextEditingController(
      text: _isEditMode ? widget.nextOfKin!['percentage_share'].toString() : '',
    );

    // Initialize dropdown values
    _selectedRelationship =
        _isEditMode ? widget.nextOfKin!['relationship'] : null;
  }

  @override
  void dispose() {
    // Dispose controllers
    _fullNameController.dispose();
    _phoneNumberController.dispose();
    _emailController.dispose();
    _physicalAddressController.dispose();
    _nationalIdController.dispose();
    _percentageShareController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => getIt<ProfileViewModel>(),
      child: Consumer<ProfileViewModel>(
        builder: (context, viewModel, child) {
          return Scaffold(
            appBar: AppBar(
              title: Text(_isEditMode ? 'Edit Next of Kin' : 'Add Next of Kin'),
            ),
            body: _buildBody(viewModel),
          );
        },
      ),
    );
  }

  Widget _buildBody(ProfileViewModel viewModel) {
    if (viewModel.state == ProfileState.loading) {
      return const Center(
        child: LoadingIndicator(
          message: 'Saving...',
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Next of Kin Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // Full Name Field
            AppTextField(
              controller: _fullNameController,
              labelText: 'Full Name',
              hintText: 'Enter full name',
              textCapitalization: TextCapitalization.words,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter full name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Relationship Dropdown
            _buildDropdownField(
              label: 'Relationship',
              value: _selectedRelationship,
              items: const [
                {'value': 'SPOUSE', 'label': 'Spouse'},
                {'value': 'CHILD', 'label': 'Child'},
                {'value': 'PARENT', 'label': 'Parent'},
                {'value': 'SIBLING', 'label': 'Sibling'},
                {'value': 'OTHER', 'label': 'Other'},
              ],
              onChanged: (value) {
                setState(() {
                  _selectedRelationship = value;
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select relationship';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Phone Number Field
            AppTextField(
              controller: _phoneNumberController,
              labelText: 'Phone Number',
              hintText: 'Format: +256XXXXXXXXX',
              keyboardType: TextInputType.phone,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter phone number';
                }

                // Simple phone number validation for Uganda
                final RegExp phoneRegex = RegExp(AppConstants.phonePattern);
                if (!phoneRegex.hasMatch(value)) {
                  return 'Enter valid phone number (+256XXXXXXXXX)';
                }

                return null;
              },
            ),
            const SizedBox(height: 16),

            // Email Field (Optional)
            AppTextField(
              controller: _emailController,
              labelText: 'Email (Optional)',
              hintText: 'Enter email address',
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  // Simple email validation
                  final RegExp emailRegex = RegExp(AppConstants.emailPattern);
                  if (!emailRegex.hasMatch(value)) {
                    return 'Enter a valid email address';
                  }
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Physical Address Field
            AppTextField(
              controller: _physicalAddressController,
              labelText: 'Physical Address',
              hintText: 'Enter physical address',
              maxLines: 2,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter physical address';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // National ID Field
            AppTextField(
              controller: _nationalIdController,
              labelText: 'National ID',
              hintText: 'Enter national ID number',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter national ID';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Percentage Share Field
            AppTextField(
              controller: _percentageShareController,
              labelText: 'Percentage Share',
              hintText: 'Enter percentage (0-100)',
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter percentage share';
                }

                final percentage = double.tryParse(value);
                if (percentage == null) {
                  return 'Please enter a valid number';
                }

                if (percentage < 0 || percentage > 100) {
                  return 'Percentage must be between 0 and 100';
                }

                return null;
              },
            ),
            const SizedBox(height: 24),

            // Error message
            if (viewModel.errorMessage != null)
              Container(
                padding: const EdgeInsets.all(8),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, color: Colors.red[700]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        viewModel.errorMessage!,
                        style: TextStyle(color: Colors.red[700]),
                      ),
                    ),
                  ],
                ),
              ),

            // Save Button
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: _isEditMode ? 'Update Next of Kin' : 'Add Next of Kin',
                onPressed: viewModel.state == ProfileState.loading
                    ? null
                    : _saveNextOfKin,
                isLoading: viewModel.state == ProfileState.loading,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String? value,
    required List<Map<String, String>> items,
    required Function(String?) onChanged,
    String? Function(String?)? validator,
  }) {
    return FormField<String>(
      initialValue: value,
      validator: validator,
      builder: (FormFieldState<String> state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(
                  color: state.hasError ? Colors.red[300]! : Colors.grey[400]!,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: DropdownButton<String>(
                value: value,
                isExpanded: true,
                underline: const SizedBox(),
                hint: Text('Select $label'),
                items: items.map((item) {
                  return DropdownMenuItem<String>(
                    value: item['value'],
                    child: Text(item['label']!),
                  );
                }).toList(),
                onChanged: (newValue) {
                  onChanged(newValue);
                  state.didChange(newValue);
                },
              ),
            ),
            if (state.hasError)
              Padding(
                padding: const EdgeInsets.only(top: 8.0, left: 12.0),
                child: Text(
                  state.errorText!,
                  style: TextStyle(color: Colors.red[700], fontSize: 12),
                ),
              ),
          ],
        );
      },
    );
  }

  Future<void> _saveNextOfKin() async {
    if (_formKey.currentState?.validate() ?? false) {
      // Get form values
      final nextOfKinData = {
        'full_name': _fullNameController.text,
        'relationship': _selectedRelationship,
        'phone_number': _phoneNumberController.text,
        'email': _emailController.text.isEmpty ? null : _emailController.text,
        'physical_address': _physicalAddressController.text,
        'national_id': _nationalIdController.text,
        'percentage_share': double.parse(_percentageShareController.text),
      };

      // Save next of kin
      final viewModel = context.read<ProfileViewModel>();
      bool success;

      if (_isEditMode) {
        // Update existing next of kin
        success = await viewModel.updateNextOfKin(
          widget.nextOfKin!['id'],
          nextOfKinData,
        );
      } else {
        // Add new next of kin
        success = await viewModel.addNextOfKin(nextOfKinData);
      }

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEditMode
                  ? 'Next of kin updated successfully'
                  : 'Next of kin added successfully',
            ),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      }
    }
  }
}
