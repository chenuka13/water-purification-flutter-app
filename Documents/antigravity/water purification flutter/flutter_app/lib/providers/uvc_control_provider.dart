import 'dart:async';
import 'package:flutter/foundation.dart';
import '../config/constants.dart';

enum PurificationStatus { idle, purifying, paused, completed }

class UvcControlProvider extends ChangeNotifier {
  PurificationStatus _status = PurificationStatus.idle;
  int _remainingTime = AppConstants.uvcPurificationDuration;
  double _progress = 0.0;
  Timer? _timer;

  PurificationStatus get status => _status;
  int get remainingTime => _remainingTime;
  double get progress => _progress;
  bool get isActive => _status == PurificationStatus.purifying;

  void startPurification() {
    if (_status == PurificationStatus.purifying) return;

    _status = PurificationStatus.purifying;
    _remainingTime = AppConstants.uvcPurificationDuration;
    _progress = 0.0;
    notifyListeners();

    _startTimer();
  }

  void pausePurification() {
    if (_status != PurificationStatus.purifying) return;

    _status = PurificationStatus.paused;
    _timer?.cancel();
    notifyListeners();
  }

  void resumePurification() {
    if (_status != PurificationStatus.paused) return;

    _status = PurificationStatus.purifying;
    notifyListeners();

    _startTimer();
  }

  void stopPurification() {
    _status = PurificationStatus.idle;
    _remainingTime = AppConstants.uvcPurificationDuration;
    _progress = 0.0;
    _timer?.cancel();
    notifyListeners();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingTime > 0) {
        _remainingTime--;
        _progress = ((AppConstants.uvcPurificationDuration - _remainingTime) /
                AppConstants.uvcPurificationDuration) *
            100;
        notifyListeners();
      } else {
        _status = PurificationStatus.completed;
        _progress = 100.0;
        timer.cancel();
        notifyListeners();

        // Auto-reset after 3 seconds
        Future.delayed(const Duration(seconds: 3), () {
          if (_status == PurificationStatus.completed) {
            stopPurification();
          }
        });
      }
    });
  }

  String get statusText {
    switch (_status) {
      case PurificationStatus.idle:
        return 'Idle';
      case PurificationStatus.purifying:
        return 'Purifying';
      case PurificationStatus.paused:
        return 'Paused';
      case PurificationStatus.completed:
        return 'Completed';
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
