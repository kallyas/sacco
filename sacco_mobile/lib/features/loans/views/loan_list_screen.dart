import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/loans/models/loan.dart';
import 'package:sacco_mobile/features/loans/viewmodels/loan_list_viewmodel.dart';
import 'package:sacco_mobile/features/loans/views/loan_application_screen.dart';
import 'package:sacco_mobile/features/loans/views/loan_detail_screen.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/error_widget.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class LoanListScreen extends StatefulWidget {
  const LoanListScreen({super.key});

  @override
  State<LoanListScreen> createState() => _LoanListScreenState();
}

class _LoanListScreenState extends State<LoanListScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final currencyFormat = NumberFormat.currency(
    symbol: 'UGX ',
    decimalDigits: 0,
  );

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    
    // Load loans data when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LoanListViewModel>().loadLoans();
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
      create: (_) => getIt<LoanListViewModel>(),
      child: Consumer<LoanListViewModel>(
        builder: (context, viewModel, child) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('My Loans'),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: viewModel.state == LoanListState.loading
                      ? null
                      : () => viewModel.refreshLoans(),
                ),
              ],
              bottom: TabBar(
                controller: _tabController,
                tabs: const [
                  Tab(text: 'Active'),
                  Tab(text: 'All Loans'),
                  Tab(text: 'History'),
                ],
              ),
            ),
            body: _buildBody(viewModel),
            floatingActionButton: FloatingActionButton.extended(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const LoanApplicationScreen(),
                  ),
                );
              },
              label: const Text('Apply for Loan'),
              icon: const Icon(Icons.add),
              backgroundColor: AppTheme.primaryColor,
            ),
          );
        },
      ),
    );
  }

  Widget _buildBody(LoanListViewModel viewModel) {
    if (viewModel.state == LoanListState.loading) {
      return const Center(
        child: LoadingIndicator(
          message: 'Loading loans...',
        ),
      );
    } else if (viewModel.state == LoanListState.error) {
      return AppErrorWidget(
        message: viewModel.errorMessage ?? 'Failed to load loans',
        onRetry: () => viewModel.refreshLoans(),
      );
    } else if (viewModel.state == LoanListState.success) {
      return TabBarView(
        controller: _tabController,
        children: [
          _buildActiveLoansTab(viewModel),
          _buildAllLoansTab(viewModel),
          _buildLoanHistoryTab(viewModel),
        ],
      );
    } else {
      return const Center(
        child: LoadingIndicator(message: 'Initializing...'),
      );
    }
  }

  Widget _buildActiveLoansTab(LoanListViewModel viewModel) {
    final activeLoans = viewModel.activeLoans;
    
    if (activeLoans.isEmpty) {
      return _buildEmptyState(
        'No active loans',
        'You don\'t have any active loans at the moment.',
        Icons.account_balance,
      );
    }
    
    return RefreshIndicator(
      onRefresh: () => viewModel.refreshLoans(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: activeLoans.length,
        itemBuilder: (context, index) {
          return _buildLoanCard(activeLoans[index]);
        },
      ),
    );
  }

  Widget _buildAllLoansTab(LoanListViewModel viewModel) {
    final allLoans = viewModel.loans;
    
    if (allLoans.isEmpty) {
      return _buildEmptyState(
        'No loans found',
        'You haven\'t taken any loans yet.',
        Icons.account_balance,
      );
    }
    
    return RefreshIndicator(
      onRefresh: () => viewModel.refreshLoans(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: allLoans.length,
        itemBuilder: (context, index) {
          return _buildLoanCard(allLoans[index]);
        },
      ),
    );
  }

  Widget _buildLoanHistoryTab(LoanListViewModel viewModel) {
    // Filter completed and rejected loans
    final historyLoans = viewModel.loans.where(
      (loan) => loan.isCompleted || loan.isRejected
    ).toList();
    
    if (historyLoans.isEmpty) {
      return _buildEmptyState(
        'No loan history',
        'No completed or rejected loans to display.',
        Icons.history,
      );
    }
    
    return RefreshIndicator(
      onRefresh: () => viewModel.refreshLoans(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: historyLoans.length,
        itemBuilder: (context, index) {
          return _buildHistoryLoanCard(historyLoans[index]);
        },
      ),
    );
  }

  Widget _buildLoanCard(Loan loan) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => LoanDetailScreen(
                loanId: loan.id,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      _getLoanTypeText(loan.loanType),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(loan.status, light: true),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      loan.statusText,
                      style: TextStyle(
                        color: _getStatusColor(loan.status),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Ref: ${loan.reference}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Loan Amount',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        currencyFormat.format(loan.amount),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Outstanding',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        currencyFormat.format(loan.outstandingBalance),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: loan.isActive ? AppTheme.primaryColor : null,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              LinearProgressIndicator(
                value: loan.progressPercentage / 100,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(
                  _getStatusColor(loan.status),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${loan.progressPercentage.toStringAsFixed(0)}% Paid',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    '${loan.interestRate}% / ${loan.termMonths} months',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              if (loan.isActive && loan.nextPaymentDate != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.amber[50],
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: Colors.amber[200]!),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Colors.amber[800],
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Next payment: ${DateFormat('dd MMM, yyyy').format(loan.nextPaymentDate!)}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.amber[800],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHistoryLoanCard(Loan loan) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 1,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => LoanDetailScreen(
                loanId: loan.id,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      _getLoanTypeText(loan.loanType),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(loan.status, light: true),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      loan.statusText,
                      style: TextStyle(
                        color: _getStatusColor(loan.status),
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
                    'Ref: ${loan.reference}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  Text(
                    DateFormat('MMM dd, yyyy').format(loan.applicationDate),
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    currencyFormat.format(loan.amount),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    '${loan.termMonths} months @ ${loan.interestRate}%',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[700],
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

  Widget _buildEmptyState(String title, String message, IconData icon) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 24),
            AppButton(
              text: 'Apply for Loan',
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const LoanApplicationScreen(),
                  ),
                );
              },
              iconData: Icons.add,
            ),
          ],
        ),
      ),
    );
  }

  String _getLoanTypeText(String loanType) {
    switch (loanType) {
      case 'PERSONAL':
        return 'Personal Loan';
      case 'BUSINESS':
        return 'Business Loan';
      case 'EDUCATION':
        return 'Education Loan';
      case 'EMERGENCY':
        return 'Emergency Loan';
      default:
        return loanType;
    }
  }

  Color _getStatusColor(String status, {bool light = false}) {
    switch (status) {
      case 'PENDING':
        return light ? Colors.amber[100]! : Colors.amber[700]!;
      case 'APPROVED':
        return light ? Colors.blue[100]! : Colors.blue[700]!;
      case 'REJECTED':
        return light ? Colors.red[100]! : Colors.red[700]!;
      case 'DISBURSED':
        return light ? Colors.green[100]! : Colors.green[700]!;
      case 'COMPLETED':
        return light ? Colors.indigo[100]! : Colors.indigo[700]!;
      case 'DEFAULTED':
        return light ? Colors.deepOrange[100]! : Colors.deepOrange[700]!;
      default:
        return light ? Colors.grey[200]! : Colors.grey[700]!;
    }
  }
}