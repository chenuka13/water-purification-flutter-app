import 'package:cloud_firestore/cloud_firestore.dart';

class WaterQualityReading {
  final String id;
  final double turbidity;
  final double temperature;
  final double conductivity;
  final double waterLevel;
  final DateTime timestamp;
  final String? userId;

  WaterQualityReading({
    required this.id,
    required this.turbidity,
    required this.temperature,
    required this.conductivity,
    required this.waterLevel,
    required this.timestamp,
    this.userId,
  });

  factory WaterQualityReading.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return WaterQualityReading(
      id: doc.id,
      turbidity: (data['turbidity'] ?? 0).toDouble(),
      temperature: (data['temperature'] ?? 0).toDouble(),
      conductivity: (data['conductivity'] ?? 0).toDouble(),
      waterLevel: (data['waterLevel'] ?? 0).toDouble(),
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      userId: data['userId'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'turbidity': turbidity,
      'temperature': temperature,
      'conductivity': conductivity,
      'waterLevel': waterLevel,
      'timestamp': Timestamp.fromDate(timestamp),
      'userId': userId,
    };
  }

  String get turbidityStatus {
    if (turbidity < 1) return 'Excellent';
    if (turbidity < 5) return 'Good';
    if (turbidity < 10) return 'Fair';
    return 'Poor';
  }

  String get temperatureStatus {
    if (temperature >= 15 && temperature <= 30) return 'Optimal';
    if (temperature < 15) return 'Too Cold';
    return 'Too Warm';
  }

  String get conductivityStatus {
    if (conductivity >= 50 && conductivity <= 500) return 'Good';
    if (conductivity < 50) return 'Too Low';
    return 'Too High';
  }

  int get overallQualityScore {
    int score = 100;
    
    // Turbidity impact (0-40 points)
    if (turbidity >= 10) {
      score -= 40;
    } else if (turbidity >= 5) {
      score -= 20;
    } else if (turbidity >= 1) {
      score -= 10;
    }
    
    // Temperature impact (0-30 points)
    if (temperature < 15 || temperature > 30) {
      score -= 30;
    } else if (temperature < 18 || temperature > 27) {
      score -= 15;
    }
    
    // Conductivity impact (0-30 points)
    if (conductivity < 50 || conductivity > 500) {
      score -= 30;
    } else if (conductivity < 100 || conductivity > 400) {
      score -= 15;
    }
    
    return score.clamp(0, 100);
  }
}
