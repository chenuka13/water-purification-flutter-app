import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out animate-slide-in ${notification.type === 'error' ? 'bg-white dark:bg-gray-800 border-red-500 text-gray-800 dark:text-gray-200' :
                        notification.type === 'warning' ? 'bg-white dark:bg-gray-800 border-yellow-500 text-gray-800 dark:text-gray-200' :
                            'bg-white dark:bg-gray-800 border-blue-500 text-gray-800 dark:text-gray-200'
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className={`font-bold text-sm ${notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
                                notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-blue-600 dark:text-blue-400'
                                }`}>
                                {notification.title}
                            </h4>
                            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
