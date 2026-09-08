/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - TÉRKÉP KOMPONENS ÉS MARKEREK
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A gyógyszertárak interaktív földrajzi megjelenítésére szolgáló térképes modul
 * (Figma: Desktop / Gyógyszertár térkép réteg és egyedi BENU Pin jelölők).
 * Megjeleníti a patikákat hivatalos zöld-kék BENU csepp alakú markerekkel,
 * támogatja a kiválasztott marker kiemelését, a térképi felugró kártyát
 * (Pharmacy Details master popup) és a térkép mozgásának szinkronizációját
 * a látható patikák szűréséhez.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném egy áttekinthető térképen látni a gyógyszertárak
 *   elhelyezkedését hivatalos BENU arculatú ikonokkal.
 * - Felhasználóként egy pinre kattintva szeretném látni a patika részletező
 *   kártyáját nyitvatartással, és közvetlenül innen is közelinek jelölni.
 * - Felhasználóként elvárom, hogy a listából kiválasztott patikára a térkép
 *   automatikusan ráközelítsen (FlyTo/SetView).
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszertár kereső oldal (/gyogyszertarak)
 * - Patikakártya komponens (PharmacyCard.tsx)
 * - Részletes patika adatlap modal (PharmacyDetailModal.tsx)
 * - Globális preferált patika kontextus (NearbyPharmacyContext)
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.3.1.5, 4.3.1.7)
 * ============================================================================
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { Pharmacy } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Custom Leaflet DivIcon matching Figma Pin (default vs active)
const createBenuPinIcon = (isActive: boolean) => {
    const pinImg = isActive
        ? '/assets/figma/df0bf66cf724a768677440b4d42ea0a6af747932.svg'
        : '/assets/figma/1cb600a55719b6263427c70d181cfb32eb0308be.svg';

    return L.divIcon({
        className: `benu-custom-pin-${isActive ? 'active' : 'default'}`,
        html: `
            <div style="position: relative; width: 40px; height: 54px; filter: drop-shadow(0px 5px 2px rgba(0,0,0,0.24)); transition: transform 0.2s ease;">
                <img src="${pinImg}" style="width: 40px; height: 54px; display: block;" alt="BENU Pin" />
                <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center;">
                    <img src="/assets/figma/298bbbf4bad5aee1fcf6c0e4d4db725c604f8e29.svg" style="width: 24px; height: 24px; display: block;" alt="BENU" />
                </div>
            </div>
        `,
        iconSize: [40, 54],
        iconAnchor: [20, 54],
        popupAnchor: [0, -56],
    });
};

interface PharmacyMapProps {
    pharmacies: Pharmacy[];
    center?: [number, number];
    zoom?: number;
    selectedPharmacyId?: string | null;
    userLocation?: { lat: number; lng: number } | null;
    onSelectPharmacy?: (id: string) => void;
    onVisiblePharmaciesChange?: (ids: string[]) => void;
    onViewDetails?: (pharmacy: Pharmacy) => void;
}

// Helper component to center and zoom map dynamically
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

// Helper component to detect visible markers
const MapBoundsListener = ({
    pharmacies,
    onVisiblePharmaciesChange
}: {
    pharmacies: Pharmacy[];
    onVisiblePharmaciesChange?: (ids: string[]) => void;
}) => {
    const map = useMap();

    useEffect(() => {
        if (!onVisiblePharmaciesChange) return;

        const updateVisible = () => {
            const bounds = map.getBounds();
            const visibleIds = pharmacies
                .filter(p => p.latitude && p.longitude && bounds.contains([p.latitude, p.longitude]))
                .map(p => p.id);
            onVisiblePharmaciesChange(visibleIds);
        };

        // Initial check and on every move/zoom
        updateVisible();
        map.on('moveend', updateVisible);

        return () => {
            map.off('moveend', updateVisible);
        };
    }, [map, pharmacies, onVisiblePharmaciesChange]);

    return null;
};

const PharmacyMap: React.FC<PharmacyMapProps> = ({
    pharmacies,
    center = [47.1625, 19.5033], // Default Hungary center
    zoom = 7,
    selectedPharmacyId,
    userLocation,
    onSelectPharmacy,
    onVisiblePharmaciesChange,
    onViewDetails
}) => {
    const { isNearby, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();

    const defaultPin = useMemo(() => createBenuPinIcon(false), []);
    const activePin = useMemo(() => createBenuPinIcon(true), []);

    const dayNamesHu = useMemo(() => ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'], []);
    const currentDayName = `${dayNamesHu[new Date().getDay()]}:`;

    return (
        <div className="relative w-full h-full">
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    padding: 0 !important;
                    border-radius: 16px !important;
                    box-shadow: 0px 10px 25px -5px rgba(0, 26, 72, 0.2), 0px 8px 10px -6px rgba(0, 26, 72, 0.1) !important;
                    overflow: hidden !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    line-height: inherit !important;
                    min-width: 340px !important;
                    max-width: 400px !important;
                }
                .leaflet-container a.leaflet-popup-close-button {
                    top: 12px !important;
                    right: 12px !important;
                    color: #002664 !important;
                    font-size: 18px !important;
                    width: 24px !important;
                    height: 24px !important;
                    line-height: 24px !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .leaflet-container a.leaflet-popup-close-button:hover {
                    background-color: #f0f4f9 !important;
                }
            `}</style>

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
                <MapBoundsListener
                    pharmacies={pharmacies}
                    onVisiblePharmaciesChange={onVisiblePharmaciesChange}
                />

                {pharmacies.map((pharmacy) => {
                    if (!pharmacy.latitude || !pharmacy.longitude) return null;

                    const isSelected = selectedPharmacyId === pharmacy.id;
                    const markedNearby = isNearby(pharmacy.id);
                    const openingStatus = getPharmacyOpeningStatus(pharmacy);

                    const refLat = userLocation?.lat ?? 47.4728;
                    const refLng = userLocation?.lng ?? 19.0712;
                    const distanceKm = calculateDistanceKm(refLat, refLng, pharmacy.latitude, pharmacy.longitude);
                    const distanceDisplay = `~${distanceKm.toFixed(1)} km`;

                    return (
                        <Marker
                            key={pharmacy.id}
                            position={[pharmacy.latitude, pharmacy.longitude]}
                            icon={isSelected ? activePin : defaultPin}
                            zIndexOffset={isSelected ? 1000 : 0}
                            eventHandlers={{
                                click: () => {
                                    if (onSelectPharmacy) onSelectPharmacy(pharmacy.id);
                                },
                            }}
                        >
                            <Popup>
                                <div className="bg-white p-[16px] flex flex-col gap-[12px] w-full text-left font-['Ubuntu',sans-serif]">
                                    <div className="flex flex-col gap-[8px] w-full pr-4">
                                        <div className="flex flex-col items-start w-full">
                                            <button
                                                type="button"
                                                onClick={() => onViewDetails?.(pharmacy)}
                                                className="text-left font-['Ubuntu',sans-serif] text-[16px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[24px]"
                                            >
                                                {pharmacy.nev}
                                            </button>
                                            <p className="font-['Ubuntu',sans-serif] font-bold text-[16px] text-[#002664] leading-[24px]">
                                                {pharmacy.cim}
                                            </p>
                                            <div className="flex gap-[16px] items-center whitespace-nowrap">
                                                <span className="font-['Ubuntu',sans-serif] font-bold text-[16px] text-[#002664] leading-[24px]">
                                                    {pharmacy.irsz}, {pharmacy.telepules}
                                                </span>
                                                <span className="font-['Ubuntu',sans-serif] text-[14px] text-[#002664] leading-[21px]">
                                                    {distanceDisplay}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hours */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 items-center w-full">
                                            <span className="font-['Ubuntu',sans-serif] font-bold text-[14px] text-[#002664] leading-[21px]">
                                                {currentDayName}
                                            </span>
                                            <div className="flex gap-[8px] items-center">
                                                <span className="font-['Ubuntu',sans-serif] font-bold text-[14px] text-[#002664] leading-[21px]">
                                                    {openingStatus.hoursDisplay}
                                                </span>
                                                <div className="relative size-[20px] shrink-0">
                                                    <Image
                                                        src="/assets/figma/173788ad626559479a2703e73f7c3b76b778d9d6.svg"
                                                        alt="Óra"
                                                        width={20}
                                                        height={20}
                                                        className="block size-full"
                                                    />
                                                </div>
                                                <span
                                                    className={`font-['Ubuntu',sans-serif] text-[14px] leading-[21px] whitespace-nowrap font-medium ${
                                                        openingStatus.status === 'open'
                                                            ? 'text-[#317907]'
                                                            : openingStatus.status === 'closing_soon'
                                                            ? 'text-[#7a6c21]'
                                                            : 'text-[#b1174e]'
                                                    }`}
                                                >
                                                    {openingStatus.statusText}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => onViewDetails?.(pharmacy)}
                                            className="text-left font-['Ubuntu',sans-serif] text-[14px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[21px]"
                                        >
                                            Többit mutasd
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-[#d8d9e0]" />

                                    {/* Action button */}
                                    <div className="flex items-center w-full">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (markedNearby) {
                                                    clearNearbyPharmacy();
                                                } else {
                                                    setNearbyPharmacy(pharmacy);
                                                }
                                            }}
                                            className={`h-[32px] px-[12px] py-[4px] rounded-[22px] flex items-center justify-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-all ${
                                                markedNearby
                                                    ? 'bg-[#378509] text-white hover:bg-[#2f7108]'
                                                    : 'bg-[#e8f8e2] text-[#317907] hover:bg-[#d7f1cf]'
                                            }`}
                                        >
                                            {markedNearby ? (
                                                <>
                                                    <span className="material-symbols-rounded text-[18px]">check</span>
                                                    <span>Közeli gyógyszertár</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Közelinek jelölöm</span>
                                                    <span className="material-symbols-rounded text-[18px]">add</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default PharmacyMap;
