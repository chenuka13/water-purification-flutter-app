import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/water_quality_provider.dart';
import '../../providers/theme_provider.dart';
import '../../providers/notification_provider.dart';
import '../../providers/uvc_control_provider.dart';
import '../../widgets/parameter_card.dart';
import '../../widgets/water_bottle_3d.dart';
import '../../config/routes.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _showNotifications = false;
  bool _showLogoutConfirm = false;

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final waterQualityProvider = context.watch<WaterQualityProvider>();
    final themeProvider = context.watch<ThemeProvider>();
    final notificationProvider = context.watch<NotificationProvider>();
    final uvcProvider = context.watch<UvcControlProvider>();
    final theme = Theme.of(context);

    final user = authProvider.currentUser;
    final reading = waterQualityProvider.latestReading;

    if (waterQualityProvider.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (waterQualityProvider.error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'Connection Error',
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(waterQualityProvider.error!),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back ${user?.displayNameOrEmail ?? "User"}!',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              'Real-time sensor data',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        actions: [
          // Notification Bell
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () {
                  setState(() {
                    _showNotifications = !_showNotifications;
                  });
                },
              ),
              if (notificationProvider.unreadCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '${notificationProvider.unreadCount}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),

          // Theme Toggle
          IconButton(
            icon: Icon(
              themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
            ),
            onPressed: () {
              themeProvider.toggleTheme();
            },
          ),

          // Logout Button
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              setState(() {
                _showLogoutConfirm = true;
              });
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Parameter Cards Grid
                LayoutBuilder(
                  builder: (context, constraints) {
                    if (constraints.maxWidth > 900) {
                      // Large screen: 3 columns
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                ParameterCard(
                                  title: 'Turbidity',
                                  value: reading?.turbidity.toStringAsFixed(1) ?? '0.0',
                                  unit: 'NTU',
                                  icon: Icons.water_drop,
                                  color: Colors.blue,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.turbidity),
                                ),
                                const SizedBox(height: 16),
                                ParameterCard(
                                  title: 'Temperature',
                                  value: reading?.temperature.toStringAsFixed(1) ?? '0.0',
                                  unit: '°C',
                                  icon: Icons.thermostat,
                                  color: Colors.red,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.temperature),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _build3DBottleCard(reading, uvcProvider, theme),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              children: [
                                ParameterCard(
                                  title: 'Conductivity',
                                  value: reading?.conductivity.toStringAsFixed(0) ?? '0',
                                  unit: 'µS/cm',
                                  icon: Icons.flash_on,
                                  color: Colors.amber,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.conductivity),
                                ),
                                const SizedBox(height: 16),
                                ParameterCard(
                                  title: 'Overall Quality',
                                  value: reading?.overallQualityScore.toString() ?? '0',
                                  unit: 'Score',
                                  icon: Icons.verified_user,
                                  color: Colors.purple,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.overallQuality),
                                ),
                                const SizedBox(height: 16),
                                ParameterCard(
                                  title: 'Community Forum',
                                  value: 'Active',
                                  unit: '',
                                  icon: Icons.forum,
                                  color: Colors.green,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.forum),
                                ),
                                const SizedBox(height: 16),
                                ParameterCard(
                                  title: 'Analytics & Reports',
                                  value: 'View',
                                  unit: '',
                                  icon: Icons.analytics,
                                  color: Colors.indigo,
                                  onTap: () => Navigator.pushNamed(context, AppRoutes.reports),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    } else {
                      // Small/Medium screen: Single column
                      return Column(
                        children: [
                          ParameterCard(
                            title: 'Turbidity',
                            value: reading?.turbidity.toStringAsFixed(1) ?? '0.0',
                            unit: 'NTU',
                            icon: Icons.water_drop,
                            color: Colors.blue,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.turbidity),
                          ),
                          const SizedBox(height: 16),
                          ParameterCard(
                            title: 'Temperature',
                            value: reading?.temperature.toStringAsFixed(1) ?? '0.0',
                            unit: '°C',
                            icon: Icons.thermostat,
                            color: Colors.red,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.temperature),
                          ),
                          const SizedBox(height: 16),
                          _build3DBottleCard(reading, uvcProvider, theme),
                          const SizedBox(height: 16),
                          ParameterCard(
                            title: 'Conductivity',
                            value: reading?.conductivity.toStringAsFixed(0) ?? '0',
                            unit: 'µS/cm',
                            icon: Icons.flash_on,
                            color: Colors.amber,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.conductivity),
                          ),
                          const SizedBox(height: 16),
                          ParameterCard(
                            title: 'Overall Quality',
                            value: reading?.overallQualityScore.toString() ?? '0',
                            unit: 'Score',
                            icon: Icons.verified_user,
                            color: Colors.purple,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.overallQuality),
                          ),
                          const SizedBox(height: 16),
                          ParameterCard(
                            title: 'Community Forum',
                            value: 'Active',
                            unit: '',
                            icon: Icons.forum,
                            color: Colors.green,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.forum),
                          ),
                          const SizedBox(height: 16),
                          ParameterCard(
                            title: 'Analytics & Reports',
                            value: 'View',
                            unit: '',
                            icon: Icons.analytics,
                            color: Colors.indigo,
                            onTap: () => Navigator.pushNamed(context, AppRoutes.reports),
                          ),
                        ],
                      );
                    }
                  },
                ),
              ],
            ),
          ),

          // Notification Panel
          if (_showNotifications)
            Positioned(
              top: 0,
              right: 0,
              child: _buildNotificationPanel(notificationProvider, theme),
            ),

          // Logout Confirmation Dialog
          if (_showLogoutConfirm)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => setState(() => _showLogoutConfirm = false),
                child: Container(
                  color: Colors.black.withOpacity(0.3),
                  child: Center(
                    child: _buildLogoutDialog(authProvider, theme),
                  ),
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, AppRoutes.chatbot);
        },
        child: const Icon(Icons.chat),
      ),
    );
  }

  Widget _build3DBottleCard(reading, UvcControlProvider uvcProvider, ThemeData theme) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              'Live Water Level',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 300,
              child: WaterBottle3D(
                waterLevel: reading?.waterLevel ?? 0,
                isUvcActive: uvcProvider.isActive,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Status: ${uvcProvider.statusText}',
              style: theme.textTheme.bodyMedium,
            ),
            if (uvcProvider.status == PurificationStatus.purifying ||
                uvcProvider.status == PurificationStatus.paused)
              Text(
                '${uvcProvider.remainingTime}s remaining',
                style: theme.textTheme.bodySmall,
              ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: uvcProvider.progress / 100,
            ),
            const SizedBox(height: 16),
            if (uvcProvider.status == PurificationStatus.idle ||
                uvcProvider.status == PurificationStatus.completed)
              ElevatedButton.icon(
                onPressed: () => uvcProvider.startPurification(),
                icon: const Icon(Icons.play_arrow),
                label: const Text('START PURIFICATION'),
              )
            else
              Row(
                children: [
                  if (uvcProvider.status == PurificationStatus.paused)
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => uvcProvider.resumePurification(),
                        icon: const Icon(Icons.play_arrow),
                        label: const Text('RESUME'),
                      ),
                    )
                  else
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => uvcProvider.pausePurification(),
                        icon: const Icon(Icons.pause),
                        label: const Text('PAUSE'),
                      ),
                    ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => uvcProvider.stopPurification(),
                      icon: const Icon(Icons.stop),
                      label: const Text('STOP'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationPanel(NotificationProvider provider, ThemeData theme) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: Container(
        width: 320,
        constraints: const BoxConstraints(maxHeight: 400),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Notifications',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (provider.notifications.isNotEmpty)
                    TextButton(
                      onPressed: () {
                        provider.clearAll();
                        setState(() => _showNotifications = false);
                      },
                      child: const Text('Clear all'),
                    ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: provider.notifications.isEmpty
                  ? const Center(child: Text('No notifications'))
                  : ListView.builder(
                      itemCount: provider.notifications.length,
                      itemBuilder: (context, index) {
                        final notification = provider.notifications[index];
                        return ListTile(
                          leading: Icon(
                            notification.type == NotificationType.error
                                ? Icons.error
                                : notification.type == NotificationType.warning
                                    ? Icons.warning
                                    : Icons.info,
                            color: notification.type == NotificationType.error
                                ? Colors.red
                                : notification.type == NotificationType.warning
                                    ? Colors.orange
                                    : Colors.blue,
                          ),
                          title: Text(notification.title),
                          subtitle: Text(notification.message),
                          onTap: () {
                            provider.markAsRead(notification.id);
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutDialog(AuthProvider authProvider, ThemeData theme) {
    return Card(
      margin: const EdgeInsets.all(24),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Confirm Logout',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text('Are you sure you want to logout?'),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => setState(() => _showLogoutConfirm = false),
                  child: const Text('Cancel'),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () async {
                    await authProvider.signOut();
                    if (mounted) {
                      Navigator.of(context).pushReplacementNamed(AppRoutes.login);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                  ),
                  child: const Text('Logout'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
