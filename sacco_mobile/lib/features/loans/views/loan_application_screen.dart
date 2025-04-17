import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/loans/viewmodels/loan_application_viewmodel.dart';
import 'package:sacco_mobile/shared/widgets/app_button.dart';
import 'package:sacco_mobile/shared/widgets/app_text_field.dart';
import 'package:sacco_mobile/shared/widgets/loading_indicator.dart';

class LoanApplicationScreen extends StatefulWidget {
  const LoanApplicationScreen({Key? key}) : super(key: key);

  @override
  State<LoanApplicationScreen> createState() => _LoanApplicationScreenState();
}

class _LoanApplicationScreenState extends State<LoanApplicationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();
  
  // Form controllers
  final _amountController = TextEditingController();
  final _purposeController = TextEditingController();
  final _collateralController = TextEditingController();
  final _employmentDetailsController = TextEditingController();
  final _monthlyIncomeController = TextEditingController();
  
  // Form values
  String? _selectedLoanType;
  int _termMonths = 12;
  
  // Current page and total pages
  int _currentPage = 0;
  final int _totalPages = 3;
  
  // Calculated values
  double _monthlyPayment = 0;
  double _totalInterest = 0;
  double _totalPayable = 0;
  
  // Formatters
  final currencyFormat = NumberFormat.currency(
    symbol: 'UGX ',
    decimalDigits: 0,
  );
  
  @override
  void initState() {
    super.initState();
    // Initialize with default values if needed
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final viewModel = context.read<LoanApplicationViewModel>();
      viewModel.resetState();
    });
  }
  
  @override
  void dispose() {
    _amountController.dispose();
    _purposeController.dispose();
    _collateralController.dispose();
    _employmentDetailsController.dispose();
    _monthlyIncomeController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => getIt<LoanApplicationViewModel>(),
      child: Consumer<LoanApplicationViewModel>(
        builder: (context, viewModel, child) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Loan Application'),
              actions: [
                if (_currentPage > 0)
                  TextButton(
                    onPressed: () {
                      _previousPage();
                    },
                    child: const Text('Back'),
                  ),
              ],
            ),
            body: _buildBody(viewModel),
          );
        },
      ),
    );
  }

  Widget _buildBody(LoanApplicationViewModel viewModel) {
    if (viewModel.state == LoanApplicationState.submitting) {
      return const Center(
        child: LoadingIndicator(
          message: 'Submitting application...',
        ),
      );
    } else if (viewModel.state == LoanApplicationState.submitted) {
      return _buildSuccessScreen(viewModel);
    } else {
      return _buildApplicationForm(viewModel);
    }
  }

  Widget _buildApplicationForm(LoanApplicationViewModel viewModel) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Progress indicator
          LinearProgressIndicator(
            value: (_currentPage + 1) / _totalPages,
            backgroundColor: Colors.grey[200],
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
          ),
          const SizedBox(height: 8),
          
          // Page indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_totalPages, (index) {
              return Container(
                width: 10,
                height: 10,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: index == _currentPage
                      ? AppTheme.primaryColor
                      : Colors.grey[300],
                ),
              );
            }),
          ),
          const SizedBox(height: 16),
          
          // Form pages
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              onPageChanged: (page) {
                setState(() {
                  _currentPage = page;
                });
              },
              children: [
                _buildLoanTypeAndAmountPage(viewModel),
                _buildPurposeAndCollateralPage(viewModel),
                _buildEmploymentAndSummaryPage(viewModel),
              ],
            ),
          ),
          
          // Navigation and submission buttons
          _buildBottomBar