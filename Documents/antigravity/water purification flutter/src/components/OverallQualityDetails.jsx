import React from 'react';
import { Link } from 'react-router-dom';
import { useWaterQuality } from '../contexts/WaterQualityContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OverallQualityDetails = () => {
    const { readings } = useWaterQuality();

    // Process readings for the graphs (reverse to show oldest to newest)
    const graphData = [...readings].reverse().map(reading => {
        // Calculate a simple quality score if not present
        // This is a heuristic: start at 100, deduct for deviations
        let calculatedQuality = 100;
        calculatedQuality -= (reading.turbidity || 0) * 5;
        calculatedQuality -= Math.abs((reading.temperature || 25) - 25) * 2;
        calculatedQuality -= Math.abs((reading.conductivity || 500) - 500) / 10;
        calculatedQuality = Math.max(0, Math.min(100, calculatedQuality));

        return {
            time: reading.timestamp instanceof Date
                ? reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            turbidity: reading.turbidity,
            temperature: reading.temperature,
            conductivity: reading.conductivity,
            quality: reading.quality || Math.round(calculatedQuality)
        };
    });

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

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Overall Water Quality Analysis</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Overall Quality Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md lg:col-span-2 transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Overall Quality Score</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="quality" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} name="Quality Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Turbidity Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Turbidity Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="turbidity" stroke="#3b82f6" strokeWidth={2} name="Turbidity (NTU)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Temperature Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Temperature Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conductivity Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md lg:col-span-2 transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Conductivity Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="conductivity" stroke="#eab308" strokeWidth={2} name="Conductivity (µS/cm)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallQualityDetails;
