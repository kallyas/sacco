import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sacco_mobile/app/app_theme.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';
import 'package:sacco_mobile/features/auth/viewmodels/login_viewmodel.dart';
import 'package:sacco_mobile/features/auth/viewmodels/register_viewmodel.dart';
import 'package:sacco_mobile/features/auth/views/login_screen.dart';
import 'package:sacco_mobile/features/dashboard/viewmodels/dashboard_viewmodel.dart';
import 'package:sacco_mobile/features/dashboard/views/dashboard_screen.dart';
import 'package:sacco_mobile/core/services/auth_service.dart';
import 'package:sacco_mobile/features/profile/viewmodels/profile_viewmodel.dart';

class SaccoApp extends StatelessWidget {
  const SaccoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => getIt<LoginViewModel>()),
        ChangeNotifierProvider(create: (_) => getIt<RegisterViewModel>()),
        ChangeNotifierProvider(create: (_) => getIt<DashboardViewModel>()),
        ChangeNotifierProvider(create: (_) => getIt<ProfileViewModel>()),
        // Add other providers here
      ],
      child: MaterialApp(
        title: 'SACCO Mobile',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        debugShowCheckedModeBanner: false,
        home: _buildInitialScreen(),
      ),
    );
  }

  Widget _buildInitialScreen() {
    final authService = getIt<AuthService>();
    
    // Check if user is already logged in
    return FutureBuilder<bool>(
      future: authService.isLoggedIn(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }
        
        final isLoggedIn = snapshot.data ?? false;
        if (isLoggedIn) {
          return const DashboardScreen();
        } else {
          return const LoginScreen();
        }
      },
    );
  }
}