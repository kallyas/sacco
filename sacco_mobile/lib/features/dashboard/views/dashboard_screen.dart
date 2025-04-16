import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/auth/views/login_screen.dart';
import 'package:sacco_mobile/features/dashboard/viewmodels/dashboard_viewmodel.dart';
import 'package:sacco_mobile/features/loans/views/loan_list_screen.dart';
import 'package:sacco_mobile/features/profile/views/profile_screen.dart';
import 'package:sacco_mobile/features/savings/views/savings_account_screen.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/error_widget.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';
import 'package:intl/intl.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final currencyFormat = NumberFormat.currency(
    symbol: 'UGX ',
    decimalDigits: 0,
  );

  @override
  void initState() {
    super.initState();
    // Load dashboard data when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardViewModel>().loadDashboardData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => getIt<DashboardViewModel>(),
      child: Consumer<DashboardViewModel>(
        builder: (context, viewModel, child) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Dashboard'),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: viewModel.state == DashboardLoadState.loading
                      ? null
                      : () => viewModel.refreshData(),
                ),
                IconButton(
                  icon: const Icon(Icons.person),
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const ProfileScreen(),
                      ),
                    );
                  },
                ),
                PopupMenuButton<String>(
                  onSelected: (value) async {
                    if (value == 'logout') {
                      await viewModel.logout();
                      if (mounted) {
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(
                            builder: (context) => const LoginScreen(),
                          ),
                          (route) => false,
                        );
                      }
                    }
                  },
                  itemBuilder: (BuildContext context) {
                    return {'logout'}.map((String choice) {
                      return PopupMenuItem<String>(
                        value: choice,
                        child: const Text('Logout'),
                      );
                    }).toList();
                  },
                ),
              ],
            ),
            body: _buildBody(viewModel),
          );
        },
      ),
    );
  }

  Widget _buildBody(DashboardViewModel viewModel) {
    switch (viewModel.state) {
      case DashboardLoadState.loading:
        return const Center(
          child: LoadingIndicator(
            message: 'Loading dashboard...',
          ),
        );
      case DashboardLoadState.success:
        return RefreshIndicator(
          onRefresh: () => viewModel.refreshData(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSavingsCard(viewModel),
                const SizedBox(height: 16),
                _buildLoansSection(viewModel),
                const SizedBox(height: 16),
                _buildQuickActions(),
              ],
            ),
          ),
        );
      case DashboardLoadState.error:
        return AppErrorWidget(
          message: viewModel.errorMessage ?? 'Failed to load dashboard data',
          onRetry: () => viewModel.refreshData(),
        );
      case DashboardLoadState.initial:
        return const Center(
          child: LoadingIndicator(message: 'Initializing...'),
        );
    }
  }

  Widget _buildSavingsCard(DashboardViewModel viewModel) {
    final savingsAccount = viewModel.savingsAccount;

    if (savingsAccount == null) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('No savings account found'),
        ),
      );
    }

    return Card(
      elevation: 3,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => const SavingsAccountScreen(),
            ),
          );
        },
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Savings Account',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: savingsAccount.isActive
                          ? Colors.green[100]
                          : Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      savingsAccount.statusText,
                      style: TextStyle(
                        color: savingsAccount.isActive
                            ? Colors.green[800]
                            : Colors.grey[600],
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                savingsAccount.accountTypeText,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Acc No: ${savingsAccount.accountNumber}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Current Balance',
                style: TextStyle(
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                currencyFormat.format(savingsAccount.balance),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 16),
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
                        currencyFormat.format(savingsAccount.availableBalance),
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
                        '${savingsAccount.interestRate}%',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Deposit',
                      onPressed: () {
                        // TODO: Navigate to deposit screen
                      },
                      iconData: Icons.arrow_upward,
                      buttonType: ButtonType.outline,
                      height: 40,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Withdraw',
                      onPressed: () {
                        // TODO: Navigate to withdrawal screen
                      },
                      iconData: Icons.arrow_downward,
                      buttonType: ButtonType.outline,
                      height: 40,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoansSection(DashboardViewModel viewModel) {
    final activeLoans = viewModel.activeLoans;

    return Card(
      elevation: 3,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Active Loans',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const LoanListScreen(),
                      ),
                    );
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (activeLoans.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24.0),
                child: Center(
                  child: Text(
                    'No active loans',
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
                itemCount: activeLoans.length > 2 ? 2 : activeLoans.length,
                itemBuilder: (context, index) {
                  final loan = activeLoans[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                'Loan #${loan.reference}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: loan.status == 'DISBURSED'
                                    ? Colors.blue[100]
                                    : Colors.grey[200],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                loan.statusText,
                                style: TextStyle(
                                  color: loan.status == 'DISBURSED'
                                      ? Colors.blue[800]
                                      : Colors.grey[600],
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Amount: ${currencyFormat.format(loan.amount)}',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              '${loan.termMonths} months @ ${loan.interestRate}%',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        LinearProgressIndicator(
                          value: loan.progressPercentage / 100,
                          backgroundColor: Colors.grey[200],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTheme.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Outstanding: ${currencyFormat.format(loan.outstandingBalance)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              '${loan.progressPercentage.toStringAsFixed(0)}% Paid',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                        if (loan.nextPaymentDate != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            'Next payment: ${DateFormat('MMM dd, yyyy').format(loan.nextPaymentDate!)}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ],
                    ),
                  );
                },
              ),
            if (activeLoans.length > 2)
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const LoanListScreen(),
                      ),
                    );
                  },
                  child: const Text('View More Loans'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      elevation: 3,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                _buildActionButton(
                  icon: Icons.account_balance_wallet,
                  label: 'Accounts',
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const SavingsAccountScreen(),
                      ),
                    );
                  },
                ),
                _buildActionButton(
                  icon: Icons.description,
                  label: 'Statements',
                  onTap: () {
                    // TODO: Navigate to statements screen
                  },
                ),
                _buildActionButton(
                  icon: Icons.credit_card,
                  label: 'Apply for Loan',
                  onTap: () {
                    // TODO: Navigate to loan application screen
                  },
                ),
                _buildActionButton(
                  icon: Icons.payment,
                  label: 'Pay Loan',
                  onTap: () {
                    // TODO: Navigate to loan payment screen
                  },
                ),
                _buildActionButton(
                  icon: Icons.swap_horiz,
                  label: 'Transfer',
                  onTap: () {
                    // TODO: Navigate to transfer screen
                  },
                ),
                _buildActionButton(
                  icon: Icons.help_outline,
                  label: 'Support',
                  onTap: () {
                    // TODO: Navigate to support screen
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey[300]!),
        ),
        padding: const EdgeInsets.all(8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: AppTheme.primaryColor,
              size: 32,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
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
