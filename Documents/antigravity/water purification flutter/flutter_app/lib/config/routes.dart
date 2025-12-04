import 'package:flutter/material.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/details/turbidity_details_screen.dart';
import '../screens/details/temperature_details_screen.dart';
import '../screens/details/conductivity_details_screen.dart';
import '../screens/details/overall_quality_screen.dart';
import '../screens/forum/forum_screen.dart';
import '../screens/chatbot/chatbot_screen.dart';
import '../screens/reports/reports_screen.dart';

class AppRoutes {
  static const String login = '/login';
  static const String register = '/register';
  static const String dashboard = '/dashboard';
  static const String turbidity = '/turbidity';
  static const String temperature = '/temperature';
  static const String conductivity = '/conductivity';
  static const String overallQuality = '/overall-quality';
  static const String forum = '/forum';
  static const String chatbot = '/chatbot';
  static const String reports = '/reports';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case turbidity:
        return MaterialPageRoute(builder: (_) => const TurbidityDetailsScreen());
      case temperature:
        return MaterialPageRoute(builder: (_) => const TemperatureDetailsScreen());
      case conductivity:
        return MaterialPageRoute(builder: (_) => const ConductivityDetailsScreen());
      case overallQuality:
        return MaterialPageRoute(builder: (_) => const OverallQualityScreen());
      case forum:
        return MaterialPageRoute(builder: (_) => const ForumScreen());
      case chatbot:
        return MaterialPageRoute(builder: (_) => const ChatbotScreen());
      case reports:
        return MaterialPageRoute(builder: (_) => const ReportsScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
