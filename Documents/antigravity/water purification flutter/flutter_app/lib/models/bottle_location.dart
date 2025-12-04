import 'package:google_maps_flutter/google_maps_flutter.dart';

class BottleLocation {
  final String id;
  final String name;
  final LatLng position;
  final double waterLevel;
  final String status;

  BottleLocation({
    required this.id,
    required this.name,
    required this.position,
    required this.waterLevel,
    required this.status,
  });

  factory BottleLocation.fromMap(Map<String, dynamic> map, String id) {
    return BottleLocation(
      id: id,
      name: map['name'] ?? 'Bottle $id',
      position: LatLng(
        (map['latitude'] ?? 0).toDouble(),
        (map['longitude'] ?? 0).toDouble(),
      ),
      waterLevel: (map['waterLevel'] ?? 0).toDouble(),
      status: map['status'] ?? 'Unknown',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'latitude': position.latitude,
      'longitude': position.longitude,
      'waterLevel': waterLevel,
      'status': status,
    };
  }
}
