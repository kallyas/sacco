import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/profile/models/member_profile.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/app_text_field.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class EditProfileScreen extends StatefulWidget {
  final MemberProfile profile;

  const EditProfileScreen({
    super.key,
    required this.profile,
  });

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  // Form controllers
  late TextEditingController _occupationController;
  late TextEditingController _monthlyIncomeController;
  late TextEditingController _physicalAddressController;
  late TextEditingController _postalAddressController;
  late TextEditingController _cityController;
  late TextEditingController _districtController;

  // Form values
  String? _selectedMaritalStatus;
  String? _selectedEmploymentStatus;

  @override
  void initState() {
    super.initState();
    // Initialize controllers with existing data
    _occupationController =
        TextEditingController(text: widget.profile.occupation);
    _monthlyIncomeController = TextEditingController(
      text: widget.profile.monthlyIncome.toString(),
    );
    _physicalAddressController = TextEditingController(
      text: widget.profile.physicalAddress,
    );
    _postalAddressController = TextEditingController(
      text: widget.profile.postalAddress,
    );
    _cityController = TextEditingController(text: widget.profile.city);
    _districtController = TextEditingController(text: widget.profile.district);

    // Initialize dropdown values
    _selectedMaritalStatus = widget.profile.maritalStatus;
    _selectedEmploymentStatus = widget.profile.employmentStatus;
  }

  @override
  void dispose() {
    // Dispose controllers
    _occupationController.dispose();
    _monthlyIncomeController.dispose();
    _physicalAddressController.dispose();
    _postalAddressController.dispose();
    _cityController.dispose();
    _districtController.dispose();
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
              title: const Text('Edit Profile'),
              actions: [
                TextButton(
                  onPressed: viewModel.state == ProfileState.loading
                      ? null
                      : _saveProfile,
                  child: const Text('Save'),
                ),
              ],
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
              'Personal Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // Marital Status Dropdown
            _buildDropdownField(
              label: 'Marital Status',
              value: _selectedMaritalStatus,
              items: const [
                {'value': 'SINGLE', 'label': 'Single'},
                {'value': 'MARRIED', 'label': 'Married'},
                {'value': 'DIVORCED', 'label': 'Divorced'},
                {'value': 'WIDOWED', 'label': 'Widowed'},
              ],
              onChanged: (value) {
                setState(() {
                  _selectedMaritalStatus = value;
                });
              },
            ),
            const SizedBox(height: 16),

            // Employment Status Dropdown
            _buildDropdownField(
              label: 'Employment Status',
              value: _selectedEmploymentStatus,
              items: const [
                {'value': 'EMPLOYED', 'label': 'Employed'},
                {'value': 'SELF_EMPLOYED', 'label': 'Self Employed'},
                {'value': 'UNEMPLOYED', 'label': 'Unemployed'},
                {'value': 'RETIRED', 'label': 'Retired'},
                {'value': 'STUDENT', 'label': 'Student'},
                {'value': 'OTHER', 'label': 'Other'},
              ],
              onChanged: (value) {
                setState(() {
                  _selectedEmploymentStatus = value;
                });
              },
            ),
            const SizedBox(height: 16),

            // Occupation Field
            AppTextField(
              controller: _occupationController,
              labelText: 'Occupation',
              hintText: 'Enter your occupation',
              textCapitalization: TextCapitalization.words,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your occupation';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Monthly Income Field
            AppTextField(
              controller: _monthlyIncomeController,
              labelText: 'Monthly Income (UGX)',
              hintText: 'Enter your monthly income',
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your monthly income';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid amount';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),

            const Text(
              'Contact Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // Physical Address Field
            AppTextField(
              controller: _physicalAddressController,
              labelText: 'Physical Address',
              hintText: 'Enter your physical address',
              maxLines: 2,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your physical address';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Postal Address Field
            AppTextField(
              controller: _postalAddressController,
              labelText: 'Postal Address (Optional)',
              hintText: 'Enter your postal address',
            ),
            const SizedBox(height: 16),

            // City Field
            AppTextField(
              controller: _cityController,
              labelText: 'City',
              hintText: 'Enter your city',
              textCapitalization: TextCapitalization.words,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your city';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // District Field
            AppTextField(
              controller: _districtController,
              labelText: 'District',
              hintText: 'Enter your district',
              textCapitalization: TextCapitalization.words,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your district';
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
                text: 'Save Changes',
                onPressed: viewModel.state == ProfileState.loading
                    ? null
                    : _saveProfile,
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
  }) {
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
            border: Border.all(color: Colors.grey[400]!),
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
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Future<void> _saveProfile() async {
    if (_formKey.currentState?.validate() ?? false) {
      // Get form values
      final profileData = {
        'marital_status': _selectedMaritalStatus,
        'employment_status': _selectedEmploymentStatus,
        'occupation': _occupationController.text,
        'monthly_income': double.parse(_monthlyIncomeController.text),
        'physical_address': _physicalAddressController.text,
        'postal_address': _postalAddressController.text,
        'city': _cityController.text,
        'district': _districtController.text,
      };

      // Save profile
      final viewModel = context.read<ProfileViewModel>();
      final success = await viewModel.updateMemberProfile(profileData);

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      }
    }
  }
}
