import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../providers/water_quality_provider.dart';

class OverallQualityScreen extends StatelessWidget {
  const OverallQualityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final waterQualityProvider = context.watch<WaterQualityProvider>();
    final readings = waterQualityProvider.readings;
    final theme = Theme.of(context);
    final latestReading = waterQualityProvider.latestReading;

    return Scaffold(
      appBar: AppBar(title: const Text('Overall Water Quality')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Overall Score Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text('Overall Quality Score', style: theme.textTheme.titleLarge),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 150,
                      width: 150,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            height: 150,
                            width: 150,
                            child: CircularProgressIndicator(
                              value: (latestReading?.overallQualityScore ?? 0) / 100,
                              strokeWidth: 12,
                              backgroundColor: Colors.grey.shade200,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                _getScoreColor(latestReading?.overallQualityScore ?? 0),
                              ),
                            ),
                          ),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '${latestReading?.overallQualityScore ?? 0}',
                                style: theme.textTheme.displayLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: _getScoreColor(latestReading?.overallQualityScore ?? 0),
                                ),
                              ),
                              Text(
                                _getScoreLabel(latestReading?.overallQualityScore ?? 0),
                                style: theme.textTheme.bodyMedium,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Individual Parameters
            Text('Parameter Breakdown', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildParameterRow('Turbidity', latestReading?.turbidity.toStringAsFixed(1) ?? '0', 'NTU', Colors.blue, latestReading?.turbidityStatus ?? ''),
            _buildParameterRow('Temperature', latestReading?.temperature.toStringAsFixed(1) ?? '0', '°C', Colors.red, latestReading?.temperatureStatus ?? ''),
            _buildParameterRow('Conductivity', latestReading?.conductivity.toStringAsFixed(0) ?? '0', 'µS/cm', Colors.amber, latestReading?.conductivityStatus ?? ''),
            
            const SizedBox(height: 24),

            // Combined Chart
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Quality Score Trend', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 250,
                      child: readings.isEmpty
                          ? const Center(child: Text('No data available'))
                          : LineChart(
                              LineChartData(
                                gridData: FlGridData(show: true),
                                titlesData: FlTitlesData(
                                  leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 40)),
                                  bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                ),
                                borderData: FlBorderData(show: true),
                                lineBarsData: [
                                  LineChartBarData(
                                    spots: readings.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.overallQualityScore.toDouble())).toList(),
                                    isCurved: true,
                                    color: Colors.purple,
                                    barWidth: 3,
                                    dotData: FlDotData(show: true),
                                  ),
                                ],
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildParameterRow(String name, String value, String unit, Color color, String status) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color,
          child: Icon(
            name == 'Turbidity' ? Icons.water_drop : name == 'Temperature' ? Icons.thermostat : Icons.flash_on,
            color: Colors.white,
          ),
        ),
        title: Text(name),
        subtitle: Text(status),
        trailing: Text(
          '$value $unit',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ),
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 90) return Colors.green;
    if (score >= 70) return Colors.lightGreen;
    if (score >= 50) return Colors.orange;
    return Colors.red;
  }

  String _getScoreLabel(int score) {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }
}
