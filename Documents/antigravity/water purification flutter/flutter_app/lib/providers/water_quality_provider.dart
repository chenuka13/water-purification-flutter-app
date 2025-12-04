import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/water_quality_reading.dart';
import '../models/bottle_location.dart';
import '../services/firestore_service.dart';

class WaterQualityProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();
  
  WaterQualityReading? _latestReading;
  List<WaterQualityReading> _readings = [];
  List<BottleLocation> _bottles = [];
  bool _isLoading = true;
  String? _error;

  StreamSubscription? _latestReadingSubscription;
  StreamSubscription? _readingsSubscription;
  StreamSubscription? _bottlesSubscription;

  WaterQualityReading? get latestReading => _latestReading;
  List<WaterQualityReading> get readings => List.unmodifiable(_readings);
  List<BottleLocation> get bottles => List.unmodifiable(_bottles);
  bool get isLoading => _isLoading;
  String? get error => _error;

  WaterQualityProvider() {
    _initializeListeners();
  }

  void _initializeListeners() {
    // Listen to latest reading
    _latestReadingSubscription = _firestoreService.getLatestReading().listen(
      (reading) {
        _latestReading = reading;
        _isLoading = false;
        _error = null;
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        _isLoading = false;
        notifyListeners();
      },
    );

    // Listen to all readings
    _readingsSubscription = _firestoreService.getWaterQualityReadings().listen(
      (readings) {
        _readings = readings;
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );

    // Listen to bottle locations
    _bottlesSubscription = _firestoreService.getBottleLocations().listen(
      (bottles) {
        _bottles = bottles;
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );
  }

  Future<List<WaterQualityReading>> getReadingsInDateRange(
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      return await _firestoreService.getReadingsInDateRange(startDate, endDate);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return [];
    }
  }

  @override
  void dispose() {
    _latestReadingSubscription?.cancel();
    _readingsSubscription?.cancel();
    _bottlesSubscription?.cancel();
    super.dispose();
  }
}
