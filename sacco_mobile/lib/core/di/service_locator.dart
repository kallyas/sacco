import 'package:get_it/get_it.dart';
import 'package:sacco_mobile/core/api/api_client.dart';
import 'package:sacco_mobile/core/services/auth_service.dart';
import 'package:sacco_mobile/core/services/secure_storage_service.dart';
import 'package:sacco_mobile/core/services/connectivity_service.dart';
import 'package:sacco_mobile/features/auth/repositories/auth_repository.dart';
import 'package:sacco_mobile/features/auth/viewmodels/login_viewmodel.dart';
import 'package:sacco_mobile/features/auth/viewmodels/register_viewmodel.dart';
import 'package:sacco_mobile/features/dashboard/viewmodels/dashboard_viewmodel.dart';
import 'package:sacco_mobile/features/loans/repositories/loan_repository.dart';
import 'package:sacco_mobile/features/loans/viewmodels/loan_list_viewmodel.dart';
import 'package:sacco_mobile/features/loans/viewmodels/loan_application_viewmodel.dart';
import 'package:sacco_mobile/features/savings/repositories/savings_repository.dart';
import 'package:sacco_mobile/features/savings/viewmodels/savings_account_viewmodel.dart';
import 'package:sacco_mobile/features/savings/viewmodels/transaction_viewmodel.dart';
import 'package:sacco_mobile/features/profile/repositories/profile_repository.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';

// Global instance of GetIt service locator
final GetIt getIt = GetIt.instance;

Future<void> setupServiceLocator() async {
  // Register core services
  getIt.registerLazySingleton<ApiClient>(() => ApiClient());
  getIt.registerLazySingleton<SecureStorageService>(() => SecureStorageService());
  getIt.registerLazySingleton<ConnectivityService>(() => ConnectivityService());
  getIt.registerLazySingleton<AuthService>(() => AuthService(
    getIt<ApiClient>(),
    getIt<SecureStorageService>(),
  ));
  
  // Register repositories
  getIt.registerLazySingleton<AuthRepository>(() => AuthRepository(
    getIt<ApiClient>(),
  ));
  
  getIt.registerLazySingleton<LoanRepository>(() => LoanRepository(
    getIt<ApiClient>(),
  ));
  
  getIt.registerLazySingleton<SavingsRepository>(() => SavingsRepository(
    getIt<ApiClient>(),
  ));
  
  getIt.registerLazySingleton<ProfileRepository>(() => ProfileRepository(
    getIt<ApiClient>(),
  ));
  
  // Register view models
  getIt.registerFactory<LoginViewModel>(() => LoginViewModel(
    getIt<AuthRepository>(),
    getIt<AuthService>(),
  ));
  
  getIt.registerFactory<RegisterViewModel>(() => RegisterViewModel(
    getIt<AuthRepository>(),
    getIt<AuthService>(),
  ));
  
  getIt.registerFactory<DashboardViewModel>(() => DashboardViewModel(
    getIt<AuthService>(),
    getIt<SavingsRepository>(),
    getIt<LoanRepository>(),
  ));
  
  getIt.registerFactory<LoanListViewModel>(() => LoanListViewModel(
    getIt<LoanRepository>(),
  ));
  
  getIt.registerFactory<LoanApplicationViewModel>(() => LoanApplicationViewModel(
    getIt<LoanRepository>(),
  ));
  
  getIt.registerFactory<SavingsAccountViewModel>(() => SavingsAccountViewModel(
    getIt<SavingsRepository>(),
  ));
  
  getIt.registerFactory<TransactionViewModel>(() => TransactionViewModel(
    getIt<SavingsRepository>(),
  ));
  
  getIt.registerFactory<ProfileViewModel>(() => ProfileViewModel(
    getIt<ProfileRepository>(),
  ));
}