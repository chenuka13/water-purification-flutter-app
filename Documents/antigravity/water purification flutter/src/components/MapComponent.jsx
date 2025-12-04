import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ bottles }) => {
    // Default center (Colombo, Sri Lanka based on mock data)
    const center = [6.9271, 79.8612];

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6 transition-colors duration-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Bottle Locations</h2>
            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
                <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {bottles.map((bottle) => (
                        <Marker key={bottle.id} position={[bottle.location.lat, bottle.location.lng]}>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-lg text-gray-900">{bottle.name}</h3>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>Status: <span className={`font-semibold ${bottle.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{bottle.status}</span></p>
                                        <p>Turbidity: {bottle.lastReading.turbidity} NTU</p>
                                        <p>Temp: {bottle.lastReading.temperature} °C</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
