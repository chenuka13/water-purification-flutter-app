class AppConstants {
  // App Info
  static const String appName = 'Water Purification Monitor';
  static const String appVersion = '1.0.0';
  
  // Firebase Collections
  static const String waterQualityCollection = 'waterQuality';
  static const String bottlesCollection = 'bottles';
  static const String forumCollection = 'forum';
  static const String usersCollection = 'users';
  
  // Water Quality Thresholds
  static const double turbidityWarningThreshold = 5.0;
  static const double turbidityDangerThreshold = 10.0;
  
  static const double temperatureMinThreshold = 15.0;
  static const double temperatureMaxThreshold = 30.0;
  
  static const double conductivityMinThreshold = 50.0;
  static const double conductivityMaxThreshold = 500.0;
  
  // UVC Purification
  static const int uvcPurificationDuration = 60; // seconds
  
  // Chart Settings
  static const int maxDataPoints = 20;
  
  // Notification Settings
  static const int maxNotifications = 50;
  
  // Map Settings
  static const double defaultLatitude = 6.9271;
  static const double defaultLongitude = 79.8612;
  static const double defaultZoom = 12.0;
}
