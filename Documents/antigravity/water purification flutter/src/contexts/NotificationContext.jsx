import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWaterQuality } from './WaterQualityContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { latestReading } = useWaterQuality();

    const addNotification = useCallback((message, type = 'info', title = 'Notification') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type, title, timestamp: new Date() }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Monitor water quality and trigger alerts
    useEffect(() => {
        if (!latestReading) return;

        // const { turbidity, temperature, conductivity } = latestReading;

        // if (turbidity > 5) {
        //     addNotification(`Turbidity is high (${turbidity} NTU). Water may be unsafe.`, 'error', 'High Turbidity');
        // }

        // if (temperature > 30) {
        //     addNotification(`Water temperature is high (${temperature}°C).`, 'warning', 'High Temperature');
        // } else if (temperature < 5) {
        //     addNotification(`Water temperature is low (${temperature}°C).`, 'warning', 'Low Temperature');
        // }

        // if (conductivity > 1000) {
        //     addNotification(`Conductivity is high (${conductivity} µS/cm).`, 'warning', 'High Conductivity');
        // }

    }, [latestReading, addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
