'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pharmacy } from '@/types';

// Fix for default marker icon in Leaflet with Next.js/React
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PharmacyMapProps {
    pharmacies: Pharmacy[];
    center?: [number, number];
    zoom?: number;
    selectedPharmacyId?: string | null;
    onSelectPharmacy?: (id: string) => void;
}

// Helper component to fly to location
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({
    pharmacies,
    center = [47.1625, 19.5033], // Default Hungary center
    zoom = 7,
    selectedPharmacyId,
    onSelectPharmacy
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={center} zoom={zoom} />

            {pharmacies.map((pharmacy) => {
                // Skip invalid coordinates
                if (!pharmacy.latitude || !pharmacy.longitude) return null;

                return (
                    <Marker
                        key={pharmacy.id}
                        position={[pharmacy.latitude, pharmacy.longitude]}
                        eventHandlers={{
                            click: () => {
                                if (onSelectPharmacy) onSelectPharmacy(pharmacy.id);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-base">{pharmacy.nev}</h3>
                                <p className="text-sm">{pharmacy.cim}</p>
                                <p className="text-sm text-gray-500">{pharmacy.telefon}</p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => onSelectPharmacy && onSelectPharmacy(pharmacy.id)}
                                        className="btn btn-xs btn-primary w-full"
                                    >
                                        Részletek
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    );
};

export default PharmacyMap;
