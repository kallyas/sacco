import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/error_widget.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    
    // Load profile data when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProfileViewModel>().loadMemberProfile();
    });
  }
  
  @override
  void dispose() {
    _tabController.dispose();
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
              title: const Text('My Profile'),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: viewModel.state == ProfileState.loading
                      ? null
                      : () => viewModel.refreshProfile(),
                ),
              ],
              bottom: TabBar(
                controller: _tabController,
                tabs: const [
                  Tab(text: 'Personal'),
                  Tab(text: 'Membership'),
                  Tab(text: 'Next of Kin'),
                ],
              ),
            ),
            body: _buildBody(viewModel),
          );
        },
      ),
    );
  }
  
  Widget _buildBody(ProfileViewModel viewModel) {
    switch (viewModel.state) {
      case ProfileState.loading:
        return const Center(
          child: LoadingIndicator(
            message: 'Loading profile...',
          ),
        );
      case ProfileState.success:
        if (viewModel.memberProfile == null) {
          return const AppErrorWidget(
            message: 'Profile data not found',
            icon: Icons.person_off,
          );
        }
        
        return TabBarView(
          controller: _tabController,
          children: [
            _buildPersonalInfoTab(viewModel),
            _buildMembershipTab(viewModel),
            _buildNextOfKinTab(viewModel),
          ],
        );
      case ProfileState.error:
        return AppErrorWidget(
          message: viewModel.errorMessage ?? 'Failed to load profile data',
          onRetry: () => viewModel.refreshProfile(),
        );
      case ProfileState.initial:
        return const Center(
          child: LoadingIndicator(message: 'Initializing...'),
        );
    }
  }
  
  Widget _buildPersonalInfoTab(ProfileViewModel viewModel) {
    final profile = viewModel.memberProfile!;
    final dateFormat = DateFormat('dd MMM, yyyy');
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile picture and basic info
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 60,
                  backgroundColor: Colors.grey[300],
                  backgroundImage: profile.passportPhotoUrl != null
                      ? NetworkImage(profile.passportPhotoUrl!)
                      : null,
                  child: profile.passportPhotoUrl == null
                      ? const Icon(
                          Icons.person,
                          size: 60,
                          color: Colors.white,
                        )
                      : null,
                ),
                const SizedBox(height: 16),
                Text(
                  '${profile.maritalStatusText} • ${profile.employmentStatusText}',
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AppButton(
                      text: 'Edit Profile',
                      onPressed: () {
                        // TODO: Navigate to edit profile screen
                      },
                      buttonType: ButtonType.outline,
                    ),
                    const SizedBox(width: 16),
                    AppButton(
                      text: 'Upload Photo',
                      onPressed: () {
                        // TODO: Handle photo upload
                      },
                      buttonType: ButtonType.outline,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Personal information card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
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
                  _buildInfoRow('Date of Birth', dateFormat.format(profile.dateOfBirth)),
                  _buildInfoRow('National ID', profile.nationalId),
                  _buildInfoRow('Occupation', profile.occupation ?? 'Not specified'),
                  _buildInfoRow('Monthly Income', 'UGX ${NumberFormat.decimalPattern().format(profile.monthlyIncome)}'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Contact information card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Contact Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow('Physical Address', profile.physicalAddress),
                  _buildInfoRow('Postal Address', profile.postalAddress ?? 'Not specified'),
                  _buildInfoRow('City', profile.city),
                  _buildInfoRow('District', profile.district),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildMembershipTab(ProfileViewModel viewModel) {
    final profile = viewModel.memberProfile!;
    final dateFormat = DateFormat('dd MMM, yyyy');
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Membership status card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Membership Status',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: profile.isActive
                              ? Colors.green[100]
                              : Colors.grey[200],
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          profile.membershipStatusText,
                          style: TextStyle(
                            color: profile.isActive
                                ? Colors.green[800]
                                : Colors.grey[600],
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow('Member Number', profile.memberNumber),
                  _buildInfoRow('Membership Number', profile.membershipNumber),
                  _buildInfoRow('Membership Type', profile.membershipTypeText),
                  _buildInfoRow('Registration Date', dateFormat.format(profile.registrationDate)),
                  _buildInfoRow(
                    'Verification Status',
                    profile.isVerified ? 'Verified' : 'Not Verified',
                    valueColor: profile.isVerified
                        ? Colors.green[700]
                        : Colors.red[700],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Documents card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Documents',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildDocumentItem(
                    'National ID',
                    profile.idDocumentUrl != null,
                    onUpload: () {
                      // TODO: Handle ID document upload
                    },
                    onView: profile.idDocumentUrl != null
                        ? () {
                            // TODO: View ID document
                          }
                        : null,
                  ),
                  const Divider(),
                  _buildDocumentItem(
                    'Passport Photo',
                    profile.passportPhotoUrl != null,
                    onUpload: () {
                      // TODO: Handle passport photo upload
                    },
                    onView: profile.passportPhotoUrl != null
                        ? () {
                            // TODO: View passport photo
                          }
                        : null,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildNextOfKinTab(ProfileViewModel viewModel) {
    final nextOfKin = viewModel.nextOfKin;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,