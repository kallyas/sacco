import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/features/savings/models/transaction.dart';

class TransactionDetailScreen extends StatelessWidget {
  final Transaction transaction;

  const TransactionDetailScreen({
    super.key,
    required this.transaction,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      symbol: 'UGX ',
      decimalDigits: 0,
    );
    final dateFormat = DateFormat('dd MMMM, yyyy');
    final timeFormat = DateFormat('hh:mm a');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaction Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // TODO: Implement share functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Share functionality to be implemented'),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Status icon
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: transaction.isCompleted
                            ? Colors.green[100]
                            : Colors.amber[100],
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        transaction.isCompleted
                            ? Icons.check_circle
                            : Icons.pending,
                        color: transaction.isCompleted
                            ? Colors.green[700]
                            : Colors.amber[700],
                        size: 40,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Status text
                    Text(
                      transaction.statusText,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: transaction.isCompleted
                            ? Colors.green[700]
                            : Colors.amber[700],
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Transaction type
                    Text(
                      transaction.transactionTypeText,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Amount
                    const Text(
                      'Amount',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      currencyFormat.format(transaction.amount),
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: transaction.isDeposit
                            ? Colors.green[700]
                            : Colors.red[700],
                      ),
                    ),
                    const SizedBox(height: 4),

                    // Date and time
                    Text(
                      '${dateFormat.format(transaction.createdAt)} at ${timeFormat.format(transaction.createdAt)}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Transaction details
            const Text(
              'Transaction Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            _buildDetailRow('Transaction ID', transaction.transactionRef),
            _buildDetailRow(
                'Transaction Type', transaction.transactionTypeText),
            _buildDetailRow('Payment Method', transaction.paymentMethodText),
            if (transaction.sourceAccount != null)
              _buildDetailRow('Source Account', transaction.sourceAccount!),
            if (transaction.destinationAccount != null)
              _buildDetailRow(
                  'Destination Account', transaction.destinationAccount!),
            _buildDetailRow('Date', dateFormat.format(transaction.createdAt)),
            _buildDetailRow('Time', timeFormat.format(transaction.createdAt)),
            if (transaction.externalReference != null)
              _buildDetailRow(
                  'External Reference', transaction.externalReference!),
            if (transaction.providerReference != null)
              _buildDetailRow(
                  'Provider Reference', transaction.providerReference!),
            if (transaction.processedDate != null)
              _buildDetailRow('Processed Date',
                  dateFormat.format(transaction.processedDate!)),

            // Description
            if (transaction.description != null) ...[
              const SizedBox(height: 24),
              const Text(
                'Description',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Text(
                  transaction.description!,
                  style: const TextStyle(
                    fontSize: 14,
                  ),
                ),
              ),
            ],

            // Action buttons
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildActionButton(
                  context,
                  icon: Icons.receipt,
                  label: 'Receipt',
                  onTap: () {
                    // TODO: Implement view receipt functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content:
                            Text('Receipt functionality to be implemented'),
                      ),
                    );
                  },
                ),
                const SizedBox(width: 16),
                _buildActionButton(
                  context,
                  icon: Icons.copy,
                  label: 'Copy ID',
                  onTap: () {
                    Clipboard.setData(
                        ClipboardData(text: transaction.transactionRef));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Transaction ID copied to clipboard'),
                      ),
                    );
                  },
                ),
                const SizedBox(width: 16),
                _buildActionButton(
                  context,
                  icon: Icons.help_outline,
                  label: 'Help',
                  onTap: () {
                    // TODO: Implement help functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Help functionality to be implemented'),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
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
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Column(
          children: [
            Icon(
              icon,
              color: AppTheme.primaryColor,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
