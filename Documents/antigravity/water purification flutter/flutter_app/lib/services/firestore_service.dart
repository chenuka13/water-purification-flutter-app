import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/water_quality_reading.dart';
import '../models/forum_message.dart';
import '../models/bottle_location.dart';
import '../config/constants.dart';
import 'firebase_service.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseService.instance.firestore;

  // Water Quality Readings
  Stream<List<WaterQualityReading>> getWaterQualityReadings({int limit = 20}) {
    return _firestore
        .collection(AppConstants.waterQualityCollection)
        .orderBy('timestamp', descending: true)
        .limit(limit)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => WaterQualityReading.fromFirestore(doc))
            .toList());
  }

  Stream<WaterQualityReading?> getLatestReading() {
    return _firestore
        .collection(AppConstants.waterQualityCollection)
        .orderBy('timestamp', descending: true)
        .limit(1)
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) return null;
      return WaterQualityReading.fromFirestore(snapshot.docs.first);
    });
  }

  Future<void> addWaterQualityReading(WaterQualityReading reading) async {
    await _firestore
        .collection(AppConstants.waterQualityCollection)
        .add(reading.toMap());
  }

  // Bottle Locations
  Stream<List<BottleLocation>> getBottleLocations() {
    return _firestore
        .collection(AppConstants.bottlesCollection)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => BottleLocation.fromMap(
                  doc.data() as Map<String, dynamic>,
                  doc.id,
                ))
            .toList());
  }

  // Forum Messages
  Stream<List<ForumMessage>> getForumMessages({int limit = 50}) {
    return _firestore
        .collection(AppConstants.forumCollection)
        .orderBy('timestamp', descending: true)
        .limit(limit)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ForumMessage.fromFirestore(doc))
            .toList());
  }

  Future<void> addForumMessage(ForumMessage message) async {
    await _firestore
        .collection(AppConstants.forumCollection)
        .add(message.toMap());
  }

  // Get historical data for date range
  Future<List<WaterQualityReading>> getReadingsInDateRange(
    DateTime startDate,
    DateTime endDate,
  ) async {
    final snapshot = await _firestore
        .collection(AppConstants.waterQualityCollection)
        .where('timestamp', isGreaterThanOrEqualTo: Timestamp.fromDate(startDate))
        .where('timestamp', isLessThanOrEqualTo: Timestamp.fromDate(endDate))
        .orderBy('timestamp', descending: false)
        .get();

    return snapshot.docs
        .map((doc) => WaterQualityReading.fromFirestore(doc))
        .toList();
  }
}
