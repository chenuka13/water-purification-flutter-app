import 'package:cloud_firestore/cloud_firestore.dart';

class ForumMessage {
  final String id;
  final String userId;
  final String userName;
  final String message;
  final DateTime timestamp;
  final bool isFromChatbot;

  ForumMessage({
    required this.id,
    required this.userId,
    required this.userName,
    required this.message,
    required this.timestamp,
    this.isFromChatbot = false,
  });

  factory ForumMessage.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ForumMessage(
      id: doc.id,
      userId: data['userId'] ?? '',
      userName: data['userName'] ?? 'Anonymous',
      message: data['message'] ?? '',
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      isFromChatbot: data['isFromChatbot'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'userName': userName,
      'message': message,
      'timestamp': Timestamp.fromDate(timestamp),
      'isFromChatbot': isFromChatbot,
    };
  }
}
