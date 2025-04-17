// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sacco_mobile/app/app.dart';
import 'package:sacco_mobile/core/di/service_locator.dart';

void main() async {
  // Ensure Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Setup service locator (dependency injection)
  await setupServiceLocator();

  // Run the app
  runApp(const SaccoApp());
}
