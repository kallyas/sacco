// lib/core/services/connectivity_service.dart
import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

enum NetworkStatus { online, offline }

class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  final StreamController<NetworkStatus> _networkStatusController =
      StreamController<NetworkStatus>.broadcast();

  // Stream of network status changes that can be listened to
  Stream<NetworkStatus> get networkStatusStream =>
      _networkStatusController.stream;

  // Current connectivity result
  ConnectivityResult _currentConnectivityResult = ConnectivityResult.none;

  ConnectivityResult get currentConnectivityResult =>
      _currentConnectivityResult;

  ConnectivityService() {
    // Initialize with the current connectivity status
    _initConnectivity();

    // Listen for changes in connectivity
    _connectivity.onConnectivityChanged.listen((results) {
      for (var result in results) {
        _updateConnectionStatus(result);
      }
    });
  }

  // Initialize connectivity status
  Future<void> _initConnectivity() async {
    try {
      final connectivityResults = await _connectivity.checkConnectivity();
      _currentConnectivityResult = connectivityResults.isNotEmpty
          ? connectivityResults.first
          : ConnectivityResult.none;
      _networkStatusController
          .add(_getNetworkStatus(_currentConnectivityResult));
    } catch (e) {
      _networkStatusController.add(NetworkStatus.offline);
      print('Error initializing connectivity: $e'); // Add error logging
    }
  }

  // Update connection status based on connectivity changes
  void _updateConnectionStatus(ConnectivityResult result) {
    _currentConnectivityResult = result;
    _networkStatusController.add(_getNetworkStatus(result));
  }

  // Convert ConnectivityResult to NetworkStatus
  NetworkStatus _getNetworkStatus(ConnectivityResult result) {
    return result == ConnectivityResult.none
        ? NetworkStatus.offline
        : NetworkStatus.online;
  }

  // Check if currently connected
  Future<bool> isConnected() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  // Check if currently on a WiFi connection
  Future<bool> isOnWifi() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    return connectivityResult == ConnectivityResult.wifi;
  }

  // Check if currently on a mobile connection
  Future<bool> isOnMobile() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    return connectivityResult == ConnectivityResult.mobile;
  }

  // Dispose of resources
  void dispose() {
    _networkStatusController.close();
  }
}