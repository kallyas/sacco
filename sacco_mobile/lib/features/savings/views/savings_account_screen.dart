import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/savings/models/transaction.dart' as savings;
import 'package:sacco_mobile/features/savings/viewmodels/savings_account_viewmodel.dart';
import 'package:sacco_mobile/features/savings/viewmodels/transaction_viewmodel.dart';
import 'package:sacco_mobile/features/savings/views/deposit_screen.dart';
import 'package:sacco_mobile/features/savings/views/transaction_detail_screen.dart';
import 'package:sacco_mobile/features/savings/views/withdraw_screen.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/error_widget.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class SavingsAccountScreen extends StatefulWidget {
  const SavingsAccountScreen({super.key});

  @override
  State<SavingsAccountScreen> createState() => _SavingsAccountScreenState();
}

class _SavingsAccountScreenState extends State<SavingsAccountScreen> {
  final currencyFormat = NumberFormat.currency(
    symbol: 'UGX ',
    decimalDigits: 0,
  );
  
  @override
  void initState() {
    super.initState();
    // Load savings account data when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SavingsAccountViewModel>().loadSavingsAccount();
      context.read<TransactionViewModel>().loadTransactions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => getIt<SavingsAccountViewModel>()),
        ChangeNotifierProvider(create: (_) => getIt<TransactionViewModel>()),
      ],
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Savings Account'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                context.read<SavingsAccountViewModel>().loadSavingsAccount();
                context.read<TransactionViewModel>().loadTransactions();
              },
            ),
          ],
        ),
        body: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    return Consumer2<SavingsAccountViewModel, TransactionViewModel>(
      builder: (context, savingsViewModel, transactionViewModel, child) {
        if (savingsViewModel.state == SavingsAccountState.loading || 
            transactionViewModel.state == TransactionState.loading) {
          return const Center(
            child: LoadingIndicator(
              message: 'Loading account data...',
            ),
          );
        } else if (savingsViewModel.state == SavingsAccountState.error) {
          return AppErrorWidget(
            message: savingsViewModel.errorMessage ?? 'Failed to load account data',
            onRetry: () => savingsViewModel.loadSavingsAccount(),
          );
        } else if (transactionViewModel.state == TransactionState.error) {
          return AppErrorWidget(
            message: transactionViewModel.errorMessage ?? 'Failed to load transactions',
            onRetry: () => transactionViewModel.loadTransactions(),
          );
        } else if (savingsViewModel.state == SavingsAccountState.success &&
                   savingsViewModel.savingsAccount != null) {
          return RefreshIndicator(
            onRefresh: () async {
              await savingsViewModel.loadSavingsAccount();
              await transactionViewModel.loadTransactions();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildAccountCard(savingsViewModel),
                  const SizedBox(height: 16),
                  _buildActionButtons(context),
                  const SizedBox(height: 16),
                  _buildTransactionsList(transactionViewModel),
                ],
              ),
            ),
          );
        } else {
          return const Center(
            child: Text('No savings account found'),
          );
        }
      },
    );
  }

  Widget _buildAccountCard(SavingsAccountViewModel viewModel) {
    final account = viewModel.savingsAccount!;
    final dateFormat = DateFormat('dd MMM, yyyy');

    return Container(
      margin: const EdgeInsets.all(16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    account.accountTypeText,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: account.isActive
                          ? Colors.green[100]
                          : Colors.grey[200],
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      account.statusText,
                      style: TextStyle(
                        color: account.isActive
                            ? Colors.green[800]
                            : Colors.grey[600],
                        fontWeight: FontWeight.w500,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Account Number: ${account.accountNumber}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Opened on: ${dateFormat.format(account.dateOpened)}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Current Balance',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                currencyFormat.format(account.balance),
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Available Balance',
                        style: TextStyle(
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        currencyFormat.format(account.availableBalance),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Interest Rate',
                        style: TextStyle(
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${account.interestRate}%',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Minimum Balance',
                        style: TextStyle(
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        currencyFormat.format(account.minimumBalance),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              if (account.lastInterestDate != null) ...[
                const SizedBox(height: 12),
                Text(
                  'Last Interest Credit: ${dateFormat.format(account.lastInterestDate!)}',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          Expanded(
            child: AppButton(
              text: 'Deposit',
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const DepositScreen(),
                  ),
                );
              },
              iconData: Icons.arrow_upward,
              height: 48,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: AppButton(
              text: 'Withdraw',
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const WithdrawScreen(),
                  ),
                );
              },
              iconData: Icons.arrow_downward,
              buttonType: ButtonType.secondary,
              height: 48,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionsList(TransactionViewModel viewModel) {
    final transactions = viewModel.transactions;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Transactions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  // TODO: Navigate to all transactions screen
                },
                child: const Text('View All'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        if (transactions.isEmpty)
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Center(
              child: Text(
                'No transactions found',
                style: TextStyle(
                  color: Colors.grey,
                ),
              ),
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: transactions.length > 5 ? 5 : transactions.length,
            itemBuilder: (context, index) {
              final transaction = transactions[index];
              return _buildTransactionItem(transaction);
            },
          ),
      ],
    );
  }

  Widget _buildTransactionItem(savings.Transaction transaction) {
    final dateFormat = DateFormat('dd MMM, yyyy');
    final timeFormat = DateFormat('hh:mm a');

    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => TransactionDetailScreen(
              transaction: transaction,
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: Colors.grey[300]!)),
        ),
        child: Row(
          children: [
            // Transaction icon
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: transaction.isDeposit 
                    ? Colors.green[100] 
                    : Colors.orange[100],
                shape: BoxShape.circle,
              ),
              child: Icon(
                transaction.isDeposit 
                    ? Icons.arrow_downward
                    : Icons.arrow_upward,
                color: transaction.isDeposit 
                    ? Colors.green[700]
                    : Colors.orange[700],
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            // Transaction details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    transaction.transactionTypeText,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text(
                        dateFormat.format(transaction.createdAt),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        timeFormat.format(transaction.createdAt),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Transaction amount
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  currencyFormat.format(transaction.amount),
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                    color: transaction.isDeposit 
                        ? Colors.green[700]
                        : Colors.red[700],
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: transaction.isCompleted
                        ? Colors.green[100]
                        : Colors.amber[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    transaction.statusText,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      color: transaction.isCompleted
                          ? Colors.green[800]
                          : Colors.amber[800],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}