import 'package:flutter/foundation.dart';
import '../models/notification_model.dart';
import '../models/water_quality_reading.dart';
import '../config/constants.dart';

class NotificationService extends ChangeNotifier {
  final List<NotificationModel> _notifications = [];
  
  List<NotificationModel> get notifications => List.unmodifiable(_notifications);
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  void checkWaterQuality(WaterQualityReading reading) {
    // Check turbidity
    if (reading.turbidity >= AppConstants.turbidityDangerThreshold) {
      _addNotification(
        title: 'High Turbidity Alert',
        message: 'Turbidity is ${reading.turbidity.toStringAsFixed(1)} NTU. Water quality is poor!',
        type: NotificationType.error,
      );
    } else if (reading.turbidity >= AppConstants.turbidityWarningThreshold) {
      _addNotification(
        title: 'Turbidity Warning',
        message: 'Turbidity is ${reading.turbidity.toStringAsFixed(1)} NTU. Consider purification.',
        type: NotificationType.warning,
      );
    }

    // Check temperature
    if (reading.temperature < AppConstants.temperatureMinThreshold ||
        reading.temperature > AppConstants.temperatureMaxThreshold) {
      _addNotification(
        title: 'Temperature Alert',
        message: 'Temperature is ${reading.temperature.toStringAsFixed(1)}°C. Outside optimal range.',
        type: NotificationType.warning,
      );
    }

    // Check conductivity
    if (reading.conductivity < AppConstants.conductivityMinThreshold ||
        reading.conductivity > AppConstants.conductivityMaxThreshold) {
      _addNotification(
        title: 'Conductivity Alert',
        message: 'Conductivity is ${reading.conductivity.toStringAsFixed(0)} µS/cm. Outside normal range.',
        type: NotificationType.warning,
      );
    }
  }

  void _addNotification({
    required String title,
    required String message,
    required NotificationType type,
  }) {
    // Check if similar notification already exists (within last 5 minutes)
    final now = DateTime.now();
    final recentSimilar = _notifications.any((n) =>
        n.title == title &&
        now.difference(n.timestamp).inMinutes < 5);

    if (recentSimilar) return;

    final notification = NotificationModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      message: message,
      type: type,
      timestamp: now,
    );

    _notifications.insert(0, notification);

    // Limit notifications
    if (_notifications.length > AppConstants.maxNotifications) {
      _notifications.removeLast();
    }

    notifyListeners();
  }

  void addCustomNotification({
    required String title,
    required String message,
    NotificationType type = NotificationType.info,
  }) {
    _addNotification(title: title, message: message, type: type);
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (int i = 0; i < _notifications.length; i++) {
      _notifications[i] = _notifications[i].copyWith(isRead: true);
    }
    notifyListeners();
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
  }

  void removeNotification(String id) {
    _notifications.removeWhere((n) => n.id == id);
    notifyListeners();
  }
}
