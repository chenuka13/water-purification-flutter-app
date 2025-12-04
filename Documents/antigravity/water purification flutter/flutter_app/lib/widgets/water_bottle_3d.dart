import 'package:flutter/material.dart';
import 'dart:math' as math;

class WaterBottle3D extends StatefulWidget {
  final double waterLevel; // 0-100
  final bool isUvcActive;

  const WaterBottle3D({
    super.key,
    required this.waterLevel,
    this.isUvcActive = false,
  });

  @override
  State<WaterBottle3D> createState() => _WaterBottle3DState();
}

class _WaterBottle3DState extends State<WaterBottle3D>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: WaterBottlePainter(
            waterLevel: widget.waterLevel,
            isUvcActive: widget.isUvcActive,
            animationValue: _controller.value,
            isDarkMode: Theme.of(context).brightness == Brightness.dark,
          ),
          child: Container(),
        );
      },
    );
  }
}

class WaterBottlePainter extends CustomPainter {
  final double waterLevel;
  final bool isUvcActive;
  final double animationValue;
  final bool isDarkMode;

  WaterBottlePainter({
    required this.waterLevel,
    required this.isUvcActive,
    required this.animationValue,
    required this.isDarkMode,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width / 2;
    final centerY = size.height / 2;

    // Bottle dimensions
    final bottleWidth = size.width * 0.4;
    final bottleHeight = size.height * 0.7;
    final capHeight = size.height * 0.1;

    // Draw bottle body
    final bottlePaint = Paint()
      ..color = isDarkMode
          ? Colors.white.withOpacity(0.2)
          : Colors.blue.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    final bottleOutline = Paint()
      ..color = isDarkMode ? Colors.white70 : Colors.blue.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final bottleRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(centerX, centerY + capHeight / 2),
        width: bottleWidth,
        height: bottleHeight,
      ),
      const Radius.circular(20),
    );

    canvas.drawRRect(bottleRect, bottlePaint);
    canvas.drawRRect(bottleRect, bottleOutline);

    // Draw water
    final waterHeight = (bottleHeight - 20) * (waterLevel / 100);
    final waterTop = centerY + bottleHeight / 2 + capHeight / 2 - 10 - waterHeight;

    final waterPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: isUvcActive
            ? [
                Colors.purple.withOpacity(0.6),
                Colors.blue.withOpacity(0.8),
              ]
            : [
                Colors.blue.withOpacity(0.4),
                Colors.blue.withOpacity(0.7),
              ],
      ).createShader(Rect.fromLTWH(
        centerX - bottleWidth / 2 + 10,
        waterTop,
        bottleWidth - 20,
        waterHeight,
      ));

    // Draw water with wave effect
    final waterPath = Path();
    waterPath.moveTo(centerX - bottleWidth / 2 + 10, waterTop);

    // Create wave at top of water
    for (double i = 0; i <= bottleWidth - 20; i += 5) {
      final x = centerX - bottleWidth / 2 + 10 + i;
      final waveOffset = math.sin((i / 20) + (animationValue * 2 * math.pi)) * 3;
      waterPath.lineTo(x, waterTop + waveOffset);
    }

    waterPath.lineTo(centerX + bottleWidth / 2 - 10, centerY + bottleHeight / 2 + capHeight / 2 - 10);
    waterPath.lineTo(centerX - bottleWidth / 2 + 10, centerY + bottleHeight / 2 + capHeight / 2 - 10);
    waterPath.close();

    canvas.drawPath(waterPath, waterPaint);

    // Draw bottle cap
    final capPaint = Paint()
      ..color = isDarkMode ? Colors.grey.shade700 : Colors.grey.shade400
      ..style = PaintingStyle.fill;

    final capRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(centerX, centerY - bottleHeight / 2 - capHeight / 2),
        width: bottleWidth * 0.6,
        height: capHeight,
      ),
      const Radius.circular(8),
    );

    canvas.drawRRect(capRect, capPaint);

    // Draw UVC LED indicator
    if (isUvcActive) {
      final uvcPaint = Paint()
        ..color = Colors.purple.withOpacity(0.3 + (animationValue * 0.4))
        ..style = PaintingStyle.fill;

      // Draw glowing effect
      for (int i = 3; i > 0; i--) {
        canvas.drawCircle(
          Offset(centerX, centerY),
          20.0 * i,
          Paint()
            ..color = Colors.purple.withOpacity(0.1 / i)
            ..style = PaintingStyle.fill,
        );
      }

      canvas.drawCircle(
        Offset(centerX, centerY),
        15,
        uvcPaint,
      );

      // UVC LED core
      canvas.drawCircle(
        Offset(centerX, centerY),
        8,
        Paint()
          ..color = Colors.purple.shade300
          ..style = PaintingStyle.fill,
      );
    }

    // Draw grip texture
    for (int i = 0; i < 5; i++) {
      final gripY = centerY + (i * 15) - 30;
      final gripPaint = Paint()
        ..color = isDarkMode
            ? Colors.white.withOpacity(0.1)
            : Colors.blue.withOpacity(0.15)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1;

      canvas.drawLine(
        Offset(centerX - bottleWidth / 2 + 15, gripY),
        Offset(centerX + bottleWidth / 2 - 15, gripY),
        gripPaint,
      );
    }
  }

  @override
  bool shouldRepaint(WaterBottlePainter oldDelegate) {
    return oldDelegate.waterLevel != waterLevel ||
        oldDelegate.isUvcActive != isUvcActive ||
        oldDelegate.animationValue != animationValue ||
        oldDelegate.isDarkMode != isDarkMode;
  }
}
