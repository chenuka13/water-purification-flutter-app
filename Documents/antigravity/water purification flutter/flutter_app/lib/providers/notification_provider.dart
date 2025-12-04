import 'package:flutter/foundation.dart';
import '../models/notification_model.dart';
import '../services/notification_service.dart';

class NotificationProvider extends ChangeNotifier {
  final NotificationService _notificationService = NotificationService();

  List<NotificationModel> get notifications => _notificationService.notifications;
  int get unreadCount => _notificationService.unreadCount;

  NotificationProvider() {
    _notificationService.addListener(_onNotificationUpdate);
  }

  void _onNotificationUpdate() {
    notifyListeners();
  }

  void addNotification({
    required String title,
    required String message,
    NotificationType type = NotificationType.info,
  }) {
    _notificationService.addCustomNotification(
      title: title,
      message: message,
      type: type,
    );
  }

  void markAsRead(String id) {
    _notificationService.markAsRead(id);
  }

  void markAllAsRead() {
    _notificationService.markAllAsRead();
  }

  void clearAll() {
    _notificationService.clearAll();
  }

  void removeNotification(String id) {
    _notificationService.removeNotification(id);
  }

  NotificationService get service => _notificationService;

  @override
  void dispose() {
    _notificationService.removeListener(_onNotificationUpdate);
    super.dispose();
  }
}
