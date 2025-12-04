import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useWaterQuality } from '../contexts/WaterQualityContext';

const Reports = () => {
    const navigate = useNavigate();
    const { readings, loading } = useWaterQuality();
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (readings.length > 0) {
            const filtered = readings.filter(reading => {
                const readingDate = new Date(reading.timestamp);
                return readingDate >= startDate && readingDate <= endDate;
            }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setFilteredData(filtered);
        }
    }, [readings, startDate, endDate]);

    const handleExportCSV = () => {
        const headers = ["Timestamp", "Turbidity (NTU)", "Temperature (°C)", "Conductivity (µS/cm)"];
        const csvContent = [
            headers.join(","),
            ...filteredData.map(row => [
                new Date(row.timestamp).toLocaleString(),
                row.turbidity,
                row.temperature,
                row.conductivity
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `water_quality_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Water Quality Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 14, 28);

        const tableColumn = ["Timestamp", "Turbidity", "Temperature", "Conductivity"];
        const tableRows = [];

        filteredData.forEach(reading => {
            const readingData = [
                new Date(reading.timestamp).toLocaleString(),
                reading.turbidity,
                reading.temperature,
                reading.conductivity
            ];
            tableRows.push(readingData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
        });

        doc.save(`water_quality_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
                            <p className="text-gray-500 dark:text-gray-400">Analyze historical water quality data</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FileText size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-6 items-center transition-colors">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-400">to</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Charts */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Parameter Comparison</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                                    stroke="#9ca3af"
                                />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    labelFormatter={(time) => new Date(time).toLocaleString()}
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="turbidity" stroke="#3B82F6" name="Turbidity (NTU)" />
                                <Line type="monotone" dataKey="temperature" stroke="#EF4444" name="Temperature (°C)" />
                                <Line type="monotone" dataKey="conductivity" stroke="#EAB308" name="Conductivity (µS/cm)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Readings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Turbidity (NTU)</th>
                                    <th className="px-6 py-4">Temperature (°C)</th>
                                    <th className="px-6 py-4">Conductivity (µS/cm)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No data found for the selected date range.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                                                {new Date(row.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.turbidity}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.temperature}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.conductivity}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
