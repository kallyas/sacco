import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class DocumentViewerScreen extends StatelessWidget {
  final String documentUrl;
  final String documentName;
  
  const DocumentViewerScreen({
    super.key,
    required this.documentUrl,
    required this.documentName,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(documentName),
        actions: [
          // Download button (if needed)
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              // TODO: Implement document download
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Document downloading...'),
                ),
              );
            },
          ),
        ],
      ),
      body: _documentViewer(),
    );
  }

  Widget _documentViewer() {
    final fileType = documentUrl.split('.').last.toLowerCase();
    
    // For image files (jpg, png, etc)
    if (['jpg', 'jpeg', 'png'].contains(fileType)) {
      return _buildImageViewer();
    }
    
    // For PDF files
    else if (fileType == 'pdf') {
      return _buildPdfViewer();
    }
    
    // For unsupported file types
    else {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.file_present,
              size: 64,
              color: Colors.grey,
            ),
            const SizedBox(height: 16),
            Text(
              'Preview not available for $fileType files',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement document download
              },
              child: const Text('Download File'),
            ),
          ],
        ),
      );
    }
  }

  Widget _buildImageViewer() {
    return PhotoView(
      imageProvider: NetworkImage(documentUrl),
      loadingBuilder: (context, event) => const Center(
        child: LoadingIndicator(
          message: 'Loading image...',
        ),
      ),
      errorBuilder: (context, error, stackTrace) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.broken_image,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            const Text(
              'Failed to load image',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              error.toString(),
              style: const TextStyle(fontSize: 12, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
      backgroundDecoration: const BoxDecoration(
        color: Colors.black,
      ),
      minScale: PhotoViewComputedScale.contained,
      maxScale: PhotoViewComputedScale.covered * 2,
    );
  }

  Widget _buildPdfViewer() {
    // Note: This is a placeholder for PDF viewer implementation
    // In a real application, you might want to use a package like flutter_pdfview
    return const Center(
      child: Text('PDF Viewer would be implemented here'),
    );
    
    // Example PDF viewer implementation (requires flutter_pdfview package):
    /*
    return PDFView(
      filePath: null,
      pdfData: null, // If you have PDF data as bytes
      enableSwipe: true,
      autoSpacing: true,
      pageFling: true,
      pageSnap: true,
      defaultPage: 0,
      fitPolicy: FitPolicy.BOTH,
      preventLinkNavigation: false,
      onRender: (_pages) {
        // PDF is rendered
      },
      onError: (error) {
        // Handle error
      },
      onPageError: (page, error) {
        // Handle page error
      },
      onViewCreated: (PDFViewController pdfViewController) {
        // PDF viewer created
      },
      onPageChanged: (int? page, int? total) {
        // Page changed
      },
    );
    */
  }
}