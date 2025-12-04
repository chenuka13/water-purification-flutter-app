import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaterQuality } from '../contexts/WaterQualityContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ParameterCard from './ParameterCard';
import WaterBottle from './WaterBottle';
import MapComponent from './MapComponent';
import ThemeToggle from './ThemeToggle';

// Icons
const WaterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
);

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const LightningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ForumIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
);

const ReportsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// Control Icons
const PlayIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PauseIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const StopIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
    </svg>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { latestReading, loading, error, uvcStatus, toggleUvc, startUvc, pauseUvc, resumeUvc, stopUvc, bottles, purificationData } = useWaterQuality();
    const { currentUser, logout } = useAuth();
    const { notifications, clearAll } = useNotifications();
    const { theme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [data, setData] = useState({
        turbidity: 0,
        temperature: 0,
        conductivity: 0,
        waterLevel: 0,
    });

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    useEffect(() => {
        if (latestReading) {
            setData({
                turbidity: latestReading.turbidity || 0,
                temperature: latestReading.temperature || 0,
                conductivity: latestReading.conductivity || 0,
                waterLevel: latestReading.waterLevel || 0,
            });
        }
    }, [latestReading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Loading water quality data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 p-8 rounded-lg max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Connection Error</h2>
                    <p className="text-red-600 mb-4">{error.message}</p>
                    <p className="text-sm text-red-500">Please check your internet connection and Firebase configuration.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'} !
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time sensor data</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-full relative transition-colors"
                        >
                            <BellIcon />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-xs text-white font-bold flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearAll}
                                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`p-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${n.type === 'error' ? 'border-l-4 border-l-red-500' :
                                                n.type === 'warning' ? 'border-l-4 border-l-yellow-500' :
                                                    'border-l-4 border-l-blue-500'
                                                }`}>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">
                                                    {n.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <ThemeToggle />
                    <div className="relative">
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
                        >
                            Logout
                        </button>

                        {showLogoutConfirm && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                                    onClick={() => setShowLogoutConfirm(false)}
                                />

                                {/* Confirmation Modal */}
                                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">Are you sure you want to logout?</p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowLogoutConfirm(false)}
                                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                {/* Left Column */}
                <div className="flex flex-col space-y-6">
                    <ParameterCard
                        title="Turbidity"
                        value={data.turbidity}
                        unit="NTU"
                        icon={<WaterIcon />}
                        color="bg-blue-500"
                        onClick={() => navigate('/turbidity')}
                    />
                    <ParameterCard
                        title="Temperature"
                        value={data.temperature}
                        unit="°C"
                        icon={<ThermometerIcon />}
                        color="bg-red-500"
                        onClick={() => navigate('/temperature')}
                    />
                </div>

                {/* Center Column - 3D Bottle */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-96 flex flex-col transition-colors duration-200">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 text-center">Live Water Level</h3>
                    <div className="flex-grow relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                        <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.waterLevel}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">%</span>
                        </div>
                        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <WaterBottle level={data.waterLevel} uvcActive={uvcStatus} theme={theme} />
                            <OrbitControls enableZoom={false} />
                            <Environment preset="city" />
                        </Canvas>
                    </div>
                    <div className="mt-4 flex items-center justify-center px-4">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex items-center justify-between w-full mb-2">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Status: <span className={`font-bold ${purificationData.status === 'Purifying' ? 'text-purple-500' : purificationData.status === 'Paused' ? 'text-yellow-500' : 'text-gray-500'}`}>{purificationData.status}</span>
                                </span>
                                {purificationData.status === 'Purifying' && (
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                        {purificationData.remainingTime}s left
                                    </span>
                                )}
                                {purificationData.status === 'Paused' && (
                                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                                        Paused ({purificationData.remainingTime}s left)
                                    </span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${purificationData.status === 'Purifying' ? 'bg-purple-600 animate-pulse' :
                                        purificationData.status === 'Paused' ? 'bg-yellow-500' :
                                            'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    style={{ width: `${purificationData.progress}%` }}
                                ></div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-center gap-4 w-full mt-4">
                                {purificationData.status === 'Idle' || purificationData.status === 'Completed' ? (
                                    <button
                                        onClick={startUvc}
                                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                        title="Start Purification"
                                    >
                                        <PlayIcon className="w-5 h-5" />
                                        START PURIFICATION
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        {purificationData.status === 'Paused' ? (
                                            <button
                                                onClick={resumeUvc}
                                                className="py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                title="Resume Purification"
                                            >
                                                <PlayIcon className="w-4 h-4" />
                                                RESUME
                                            </button>
                                        ) : (
                                            <button
                                                onClick={pauseUvc}
                                                className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                title="Pause Purification"
                                            >
                                                <PauseIcon className="w-4 h-4" />
                                                PAUSE
                                            </button>
                                        )}

                                        <button
                                            onClick={stopUvc}
                                            className="py-2 px-4 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                            title="Stop Purification"
                                        >
                                            <StopIcon className="w-4 h-4" />
                                            STOP
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col space-y-6">
                    <ParameterCard
                        title="Conductivity"
                        value={data.conductivity}
                        unit="µS/cm"
                        icon={<LightningIcon />}
                        color="bg-yellow-500"
                        onClick={() => navigate('/conductivity')}
                    />
                    <ParameterCard
                        title="Overall Quality"
                        value={94}
                        unit="Score"
                        icon={<ShieldCheckIcon />}
                        color="bg-purple-500"
                        onClick={() => navigate('/overall-quality')}
                    />
                    <ParameterCard
                        title="Community Forum"
                        value="Active"
                        unit=""
                        icon={<ForumIcon />}
                        color="bg-green-500"
                        onClick={() => navigate('/forum')}
                    />
                    <ParameterCard
                        title="Analytics & Reports"
                        value="View"
                        unit=""
                        icon={<ReportsIcon />}
                        color="bg-indigo-500"
                        onClick={() => navigate('/reports')}
                    />
                </div>
            </div>

            {/* Map View Section */}
            {bottles && bottles.length > 0 && (
                <div className="mt-8">
                    <MapComponent bottles={bottles} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
