import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_datetime_picker_plus/flutter_datetime_picker_plus.dart';
import '../../providers/water_quality_provider.dart';
import '../../models/water_quality_reading.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 7));
  DateTime _endDate = DateTime.now();
  List<WaterQualityReading> _filteredReadings = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    final waterQualityProvider = context.read<WaterQualityProvider>();
    final readings = await waterQualityProvider.getReadingsInDateRange(
      _startDate,
      _endDate,
    );

    setState(() {
      _filteredReadings = readings;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics & Reports'),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download),
            onPressed: () {
              // TODO: Implement CSV export
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('CSV export feature coming soon')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            onPressed: () {
              // TODO: Implement PDF export
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('PDF export feature coming soon')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Date Range Selector
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Select Date Range',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              DatePicker.showDatePicker(
                                context,
                                showTitleActions: true,
                                onConfirm: (date) {
                                  setState(() => _startDate = date);
                                  _loadData();
                                },
                                currentTime: _startDate,
                              );
                            },
                            icon: const Icon(Icons.calendar_today),
                            label: Text(
                              'From: ${_startDate.day}/${_startDate.month}/${_startDate.year}',
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              DatePicker.showDatePicker(
                                context,
                                showTitleActions: true,
                                onConfirm: (date) {
                                  setState(() => _endDate = date);
                                  _loadData();
                                },
                                currentTime: _endDate,
                              );
                            },
                            icon: const Icon(Icons.calendar_today),
                            label: Text(
                              'To: ${_endDate.day}/${_endDate.month}/${_endDate.year}',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else if (_filteredReadings.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text('No data available for selected date range'),
                ),
              )
            else ...[
              // Comparison Charts
              Text(
                'Parameter Comparison',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Turbidity Chart
              _buildChartCard(
                'Turbidity',
                Colors.blue,
                _filteredReadings.map((r) => r.turbidity).toList(),
              ),
              const SizedBox(height: 16),

              // Temperature Chart
              _buildChartCard(
                'Temperature',
                Colors.red,
                _filteredReadings.map((r) => r.temperature).toList(),
              ),
              const SizedBox(height: 16),

              // Conductivity Chart
              _buildChartCard(
                'Conductivity',
                Colors.amber,
                _filteredReadings.map((r) => r.conductivity).toList(),
              ),
              const SizedBox(height: 24),

              // Statistics
              Text(
                'Statistics',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildStatisticsCard(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildChartCard(String title, Color color, List<double> data) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true)),
                    bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: data
                          .asMap()
                          .entries
                          .map((e) => FlSpot(e.key.toDouble(), e.value))
                          .toList(),
                      isCurved: true,
                      color: color,
                      barWidth: 3,
                      dotData: FlDotData(show: false),
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

  Widget _buildStatisticsCard() {
    if (_filteredReadings.isEmpty) return const SizedBox();

    final avgTurbidity = _filteredReadings.map((r) => r.turbidity).reduce((a, b) => a + b) / _filteredReadings.length;
    final avgTemp = _filteredReadings.map((r) => r.temperature).reduce((a, b) => a + b) / _filteredReadings.length;
    final avgConductivity = _filteredReadings.map((r) => r.conductivity).reduce((a, b) => a + b) / _filteredReadings.length;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildStatRow('Average Turbidity', '${avgTurbidity.toStringAsFixed(2)} NTU', Colors.blue),
            const Divider(),
            _buildStatRow('Average Temperature', '${avgTemp.toStringAsFixed(1)} °C', Colors.red),
            const Divider(),
            _buildStatRow('Average Conductivity', '${avgConductivity.toStringAsFixed(0)} µS/cm', Colors.amber),
            const Divider(),
            _buildStatRow('Total Readings', '${_filteredReadings.length}', Colors.purple),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: color,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
