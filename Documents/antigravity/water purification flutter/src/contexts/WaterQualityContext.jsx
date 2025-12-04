import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WaterQualityContext = createContext();

export const useWaterQuality = () => useContext(WaterQualityContext);

export const WaterQualityProvider = ({ children }) => {
    const [readings, setReadings] = useState([]);
    const [latestReading, setLatestReading] = useState(null);
    const [uvcStatus, setUvcStatus] = useState(false);
    const [uvcStartTime, setUvcStartTime] = useState(null);
    const [exposureTime, setExposureTime] = useState(30); // Default 30s
    const [isPaused, setIsPaused] = useState(false);
    const [pausedElapsed, setPausedElapsed] = useState(0);
    const [purificationData, setPurificationData] = useState({
        status: 'Idle',
        progress: 0,
        remainingTime: 0,
        totalTime: 30
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Readings listener
            const q = query(collection(db, 'readings'), orderBy('timestamp', 'desc'), limit(50));
            const unsubscribeReadings = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date()
                }));

                setReadings(data);
                if (data.length > 0) {
                    setLatestReading(data[0]);
                }
                setLoading(false);
            }, (err) => {
                console.error("Firebase readings error:", err);
                setError(err);
                setLoading(false);
            });

            // UVC Status listener
            const unsubscribeControl = onSnapshot(doc(db, 'control', 'device_settings'), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUvcStatus(data.uvcActive || false);
                    setIsPaused(data.isPaused || false);
                    setPausedElapsed(data.pausedElapsed || 0);

                    if (data.uvcStartTime) {
                        // Handle both Firestore Timestamp and ISO string
                        const startTime = data.uvcStartTime.toDate ? data.uvcStartTime.toDate() : new Date(data.uvcStartTime);
                        setUvcStartTime(startTime);
                    }
                    if (data.exposureTime) {
                        setExposureTime(data.exposureTime);
                    }
                }
            }, (err) => {
                console.error("Firebase control error:", err);
                // Don't set global error for control failure, just log it
            });

            return () => {
                unsubscribeReadings();
                unsubscribeControl();
            };
        } catch (err) {
            console.error("Error setting up Firebase listener:", err);
            setError(err);
            setLoading(false);
        }
    }, []);

    // Timer for purification progress
    useEffect(() => {
        let interval;

        if (isPaused) {
            // Paused State
            const remaining = Math.max(0, exposureTime - pausedElapsed);
            const progress = Math.min(100, (pausedElapsed / exposureTime) * 100);
            setPurificationData({
                status: 'Paused',
                progress: progress,
                remainingTime: Math.round(remaining),
                totalTime: exposureTime
            });
        } else if (uvcStatus && uvcStartTime) {
            // Active State
            interval = setInterval(() => {
                const now = new Date();
                const elapsed = (now - uvcStartTime) / 1000; // in seconds
                const remaining = Math.max(0, exposureTime - elapsed);
                const progress = Math.min(100, (elapsed / exposureTime) * 100);

                if (remaining <= 0) {
                    // Time is up, turn off UVC automatically
                    stopUvc();
                    setPurificationData({
                        status: 'Completed',
                        progress: 100,
                        remainingTime: 0,
                        totalTime: exposureTime
                    });
                    clearInterval(interval);
                } else {
                    setPurificationData({
                        status: 'Purifying',
                        progress: progress,
                        remainingTime: Math.round(remaining),
                        totalTime: exposureTime
                    });
                }

            }, 1000);
        } else {
            // Idle State
            setPurificationData({
                status: 'Idle',
                progress: 0,
                remainingTime: 0,
                totalTime: exposureTime
            });
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [uvcStatus, uvcStartTime, exposureTime, isPaused, pausedElapsed]);

    const startUvc = async () => {
        try {
            const updateData = {
                uvcActive: true,
                isPaused: false,
                pausedElapsed: 0,
                uvcStartTime: new Date(),
                lastUpdated: new Date()
            };
            await setDoc(doc(db, 'control', 'device_settings'), updateData, { merge: true });
        } catch (err) { console.error(err); }
    };

    const pauseUvc = async () => {
        try {
            // Calculate current elapsed time before pausing
            let currentElapsed = 0;
            if (uvcStartTime) {
                currentElapsed = (new Date() - uvcStartTime) / 1000;
            }
            // If already paused, don't update elapsed again? 
            // Actually, if we are here, we assume we are running.

            const updateData = {
                uvcActive: false,
                isPaused: true,
                pausedElapsed: currentElapsed,
                lastUpdated: new Date()
            };
            await setDoc(doc(db, 'control', 'device_settings'), updateData, { merge: true });
        } catch (err) { console.error(err); }
    };

    const resumeUvc = async () => {
        try {
            // Calculate new start time so that (now - newStart) = pausedElapsed
            // newStart = now - pausedElapsed
            // pausedElapsed is in seconds, need ms
            const newStartTime = new Date(new Date().getTime() - (pausedElapsed * 1000));

            const updateData = {
                uvcActive: true,
                isPaused: false,
                uvcStartTime: newStartTime,
                lastUpdated: new Date()
            };
            await setDoc(doc(db, 'control', 'device_settings'), updateData, { merge: true });
        } catch (err) { console.error(err); }
    };

    const stopUvc = async () => {
        try {
            const updateData = {
                uvcActive: false,
                isPaused: false,
                pausedElapsed: 0,
                lastUpdated: new Date()
            };
            await setDoc(doc(db, 'control', 'device_settings'), updateData, { merge: true });
        } catch (err) { console.error(err); }
    };

    const toggleUvc = async (newStatus) => {
        if (newStatus) startUvc();
        else stopUvc();
    };

    const [bottles, setBottles] = useState([
        { id: 'b1', name: 'Main Tank', location: { lat: 6.9271, lng: 79.8612 }, status: 'Active', lastReading: { turbidity: 5, temperature: 28 } },
        { id: 'b2', name: 'Reserve Tank', location: { lat: 6.9321, lng: 79.8552 }, status: 'Inactive', lastReading: { turbidity: 12, temperature: 29 } },
        { id: 'b3', name: 'Distribution Unit', location: { lat: 6.9171, lng: 79.8712 }, status: 'Active', lastReading: { turbidity: 2, temperature: 27 } }
    ]);

    const value = {
        readings,
        latestReading,
        uvcStatus,
        purificationData,
        toggleUvc,
        startUvc,
        pauseUvc,
        resumeUvc,
        stopUvc,
        loading,
        error,
        bottles
    };

    return (
        <WaterQualityContext.Provider value={value}>
            {children}
        </WaterQualityContext.Provider>
    );
};
