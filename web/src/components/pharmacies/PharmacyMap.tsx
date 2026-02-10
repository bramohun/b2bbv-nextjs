/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként vizuálisan szeretném látni a gyógyszertárak elhelyezkedését
 * egy térképen, hogy földrajzi közelség alapján választhassak közülük, és
 * egy kattintással "Közeli gyógyszertárnak" jelölhessem bármelyiket.
 * 
 * FUNKCIÓK:
 * - Leaflet térkép megjelenítése OpenStreetMap réteggel.
 * - Gyógyszertárak megjelenítése marker-ként.
 * - Marker-re kattintva felugró ablak (Popup) a patika adataival.
 * - "Közeli patikának jelölöm" funkció a popup-ból.
 * - Térkép automatikus mozgatása (FlyTo) a kívülről kiválasztott patikára.
 * 
 * TECHNOLÓGIA:
 * - react-leaflet (Leaflet wrapper React-hez).
 * - SSR tiltása szükséges (dynamic import).
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - Parent: PharmaciesPage
 * - Context: NearbyPharmacyContext
 */

'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pharmacy } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';

// Fix for default marker icon in Leaflet with Next.js/React
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
    const { isNearby, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();

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

                const markedNearby = isNearby(pharmacy.id);

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
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-base leading-tight mb-1">{pharmacy.nev}</h3>
                                {markedNearby && (
                                    <div className="flex items-center text-primary text-[10px] font-bold mb-2 uppercase tracking-wider">
                                        <span className="material-symbols-rounded text-xs mr-1 fill-1">home</span>
                                        Közeli gyógyszertár
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mb-0.5">{pharmacy.cim}</p>
                                <p className="text-sm text-gray-500 mb-3">{pharmacy.telepules}</p>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            if (markedNearby) {
                                                clearNearbyPharmacy();
                                            } else {
                                                setNearbyPharmacy(pharmacy);
                                            }
                                        }}
                                        className={`btn btn-xs ${markedNearby ? 'btn-outline btn-primary' : 'btn-primary'} w-full`}
                                    >
                                        <span className="material-symbols-rounded text-xs mr-1">
                                            {markedNearby ? 'close' : 'add_location'}
                                        </span>
                                        {markedNearby ? 'Jelölés törlése' : 'Közeli patikának jelölöm'}
                                    </button>
                                    <button
                                        onClick={() => onSelectPharmacy && onSelectPharmacy(pharmacy.id)}
                                        className="btn btn-xs btn-ghost text-primary w-full"
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
