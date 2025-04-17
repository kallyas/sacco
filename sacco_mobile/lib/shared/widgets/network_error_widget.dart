// lib/shared/widgets/network_error_widget.dart
import 'package:flutter/material.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';

class NetworkErrorWidget extends StatelessWidget {
  final VoidCallback onRetry;
  final String message;

  const NetworkErrorWidget({
    super.key,
    required this.onRetry,
    this.message =
        'No internet connection. Please check your network settings and try again.',
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.wifi_off,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Connection Error',
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            AppButton(
              text: 'Retry',
              onPressed: onRetry,
              iconData: Icons.refresh,
            ),
          ],
        ),
      ),
    );
  }
}
