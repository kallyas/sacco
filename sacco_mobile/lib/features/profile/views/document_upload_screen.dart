import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class DocumentUploadScreen extends StatefulWidget {
  final String documentType; // 'ID' or 'PHOTO'
  final String documentTitle;

  const DocumentUploadScreen({
    super.key,
    required this.documentType,
    required this.documentTitle,
  });

  @override
  State<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends State<DocumentUploadScreen> {
  File? _selectedFile;
  final ImagePicker _imagePicker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => getIt<ProfileViewModel>(),
      child: Consumer<ProfileViewModel>(
        builder: (context, viewModel, child) {
          return Scaffold(
            appBar: AppBar(
              title: Text('Upload ${widget.documentTitle}'),
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
          message: 'Uploading...',
        ),
      );
    }

    return Column(
      children: [
        // Document preview area
        Expanded(
          child: _selectedFile == null
              ? _buildEmptyPreview()
              : _buildFilePreview(),
        ),

        // Error message
        if (viewModel.errorMessage != null)
          Container(
            padding: const EdgeInsets.all(8),
            margin: const EdgeInsets.only(bottom: 16, left: 16, right: 16),
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

        // Action buttons
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  text: 'Select from Gallery',
                  onPressed: _selectedFile != null &&
                          viewModel.state == ProfileState.loading
                      ? null
                      : () => _pickImage(ImageSource.gallery),
                  iconData: Icons.photo_library,
                  buttonType: ButtonType.outline,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  text: 'Take Photo',
                  onPressed: _selectedFile != null &&
                          viewModel.state == ProfileState.loading
                      ? null
                      : () => _pickImage(ImageSource.camera),
                  iconData: Icons.camera_alt,
                  buttonType: ButtonType.outline,
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  text: 'Upload',
                  onPressed: _selectedFile == null ||
                          viewModel.state == ProfileState.loading
                      ? null
                      : () => _uploadDocument(viewModel),
                  isLoading: viewModel.state == ProfileState.loading,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyPreview() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              widget.documentType == 'PHOTO'
                  ? Icons.account_circle
                  : Icons.assignment_ind,
              size: 64,
              color: Colors.grey[500],
            ),
            const SizedBox(height: 16),
            Text(
              'No ${widget.documentTitle.toLowerCase()} selected',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Select from gallery or take a photo',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilePreview() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Image preview
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(
              _selectedFile!,
              fit: BoxFit.contain,
            ),
          ),

          // Clear button
          Positioned(
            top: 8,
            right: 8,
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedFile = null;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: source,
        imageQuality: 70, // Reduce quality to decrease file size
      );

      if (pickedFile != null) {
        setState(() {
          _selectedFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _uploadDocument(ProfileViewModel viewModel) async {
    if (_selectedFile == null) return;

    bool success;

    // Upload based on document type
    if (widget.documentType == 'PHOTO') {
      success = await viewModel.uploadProfilePhoto(_selectedFile!);
    } else {
      success = await viewModel.uploadIdDocument(_selectedFile!);
    }

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${widget.documentTitle} uploaded successfully'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.of(context).pop();
    }
  }
}
