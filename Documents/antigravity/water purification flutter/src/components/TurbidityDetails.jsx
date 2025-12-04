import React from 'react';
import { Link } from 'react-router-dom';
import { useWaterQuality } from '../contexts/WaterQualityContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TurbidityDetails = () => {
    const { readings } = useWaterQuality();

    // Process readings for the graph (reverse to show oldest to newest)
    const graphData = [...readings].reverse().map(reading => ({
        time: reading.timestamp instanceof Date
            ? reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        turbidity: reading.turbidity
    }));

    // Process readings for the history table
    const historyData = readings.map((reading, index) => ({
        id: reading.id || index,
        time: reading.timestamp instanceof Date
            ? reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: reading.timestamp instanceof Date
            ? reading.timestamp.toLocaleDateString()
            : new Date(reading.timestamp).toLocaleDateString(),
        value: reading.turbidity,
        status: reading.turbidity < 1 ? 'Good' : reading.turbidity < 5 ? 'Fair' : 'Poor'
    }));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return 'text-green-600 bg-green-100';
            case 'Fair': return 'text-yellow-600 bg-yellow-100';
            case 'Poor': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <Link to="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Turbidity Details</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graph Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Turbidity Trend</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis label={{ value: 'NTU', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="turbidity" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* History Table Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recorded History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value (NTU)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quality</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {historyData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurbidityDetails;
