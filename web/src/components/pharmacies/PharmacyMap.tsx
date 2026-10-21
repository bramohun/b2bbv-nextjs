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

// Setup Leaflet default icon fallback in Next.js
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

const DEFAULT_CENTER: [number, number] = [47.1625, 19.5033];

// Helper component to center and zoom map dynamically without breaking initial mount
const MapUpdater = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
    const map = useMap();
    const isFirstMountRef = React.useRef(true);
    const prevKeyRef = React.useRef<string>('');

    useEffect(() => {
        if (!center || typeof center[0] !== 'number' || typeof center[1] !== 'number') return;
        const currentZoom = typeof zoom === 'number' ? zoom : 7;
        const key = `${center[0].toFixed(4)}-${center[1].toFixed(4)}-${currentZoom}`;

        // Skip setView on initial mount because MapContainer already set the initial view
        if (isFirstMountRef.current) {
            isFirstMountRef.current = false;
            prevKeyRef.current = key;
            return;
        }

        if (prevKeyRef.current !== key) {
            prevKeyRef.current = key;
            map.setView(center, currentZoom, { animate: false });
        }
    }, [center, zoom, map]);

    return null;
};

// Helper component to force Leaflet to recalculate container dimensions (fixes white/empty map)
const MapResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
        const resize = () => {
            try {
                map.invalidateSize();
            } catch (e) {
                // Ignore if unmounted
            }
        };

        resize();
        const t1 = setTimeout(resize, 100);
        const t2 = setTimeout(resize, 350);
        const t3 = setTimeout(resize, 800);
        const t4 = setTimeout(resize, 1500);

        window.addEventListener('resize', resize);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            window.removeEventListener('resize', resize);
        };
    }, [map]);
    return null;
};

// Helper component to detect visible markers safely
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
            try {
                const bounds = map.getBounds();
                if (!bounds) return;
                const visibleIds = (pharmacies || [])
                    .filter(p => p.latitude && p.longitude && bounds.contains([p.latitude, p.longitude]))
                    .map(p => p.id);
                onVisiblePharmaciesChange(visibleIds);
            } catch (err) {
                console.warn('Map bounds check error:', err);
            }
        };

        updateVisible();
        map.on('moveend', updateVisible);

        return () => {
            map.off('moveend', updateVisible);
        };
    }, [map, pharmacies, onVisiblePharmaciesChange]);

    return null;
};

// Native event-safe nearby button inside Leaflet Popup (bypasses Leaflet popup click swallowing)
const PopupNearbyButton: React.FC<{
    markedNearby: boolean;
    onToggle: () => void;
}> = ({ markedNearby, onToggle }) => {
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const lastClickRef = React.useRef<number>(0);

    const handleClick = React.useCallback((e: Event | React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            if ('preventDefault' in e && typeof (e as any).preventDefault === 'function') {
                (e as any).preventDefault();
            }
        }
        const now = Date.now();
        if (now - lastClickRef.current < 250) return;
        lastClickRef.current = now;
        onToggle();
    }, [onToggle]);

    React.useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;
        btn.addEventListener('click', handleClick);
        btn.addEventListener('touchend', handleClick);
        return () => {
            btn.removeEventListener('click', handleClick);
            btn.removeEventListener('touchend', handleClick);
        };
    }, [handleClick]);

    return (
        <button
            ref={btnRef}
            type="button"
            onClick={handleClick}
            className={`h-[32px] px-[12px] py-[4px] rounded-[22px] flex items-center justify-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-all cursor-pointer ${
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
    );
};

// Native event-safe detail button inside Leaflet Popup
const PopupDetailLink: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}> = ({ onClick, children, className }) => {
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const lastClickRef = React.useRef<number>(0);

    const handleClick = React.useCallback((e: Event | React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            if ('preventDefault' in e && typeof (e as any).preventDefault === 'function') {
                (e as any).preventDefault();
            }
        }
        const now = Date.now();
        if (now - lastClickRef.current < 250) return;
        lastClickRef.current = now;
        onClick();
    }, [onClick]);

    React.useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;
        btn.addEventListener('click', handleClick);
        btn.addEventListener('touchend', handleClick);
        return () => {
            btn.removeEventListener('click', handleClick);
            btn.removeEventListener('touchend', handleClick);
        };
    }, [handleClick]);

    return (
        <button
            ref={btnRef}
            type="button"
            onClick={handleClick}
            className={className}
        >
            {children}
        </button>
    );
};

const PharmacyMap: React.FC<PharmacyMapProps> = ({
    pharmacies,
    center = DEFAULT_CENTER,
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

    const selectedPharmacy = useMemo(() => {
        if (!selectedPharmacyId || !pharmacies) return null;
        return pharmacies.find(p => p.id === selectedPharmacyId) || null;
    }, [selectedPharmacyId, pharmacies]);

    const safeCenter: [number, number] = useMemo(() => {
        if (selectedPharmacy && selectedPharmacy.latitude && selectedPharmacy.longitude) {
            return [selectedPharmacy.latitude, selectedPharmacy.longitude];
        }
        if (Array.isArray(center) && typeof center[0] === 'number' && typeof center[1] === 'number') {
            return center;
        }
        return DEFAULT_CENTER;
    }, [center, selectedPharmacy]);

    const safeZoom = useMemo(() => {
        if (selectedPharmacy) return 14;
        return typeof zoom === 'number' ? zoom : 7;
    }, [zoom, selectedPharmacy]);

    return (
        <div className="w-full h-full min-h-[500px] relative">
            <MapContainer
                center={safeCenter}
                zoom={safeZoom}
                className="w-full h-full min-h-[500px]"
                style={{ height: '100%', width: '100%', minHeight: '500px', zIndex: 0 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />

                <MapResizeHandler />
                <MapUpdater center={safeCenter} zoom={safeZoom} />
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
                            <Popup
                                eventHandlers={{
                                    add: (e) => {
                                        const popupNode = e.target.getElement();
                                        if (popupNode) {
                                            L.DomEvent.disableClickPropagation(popupNode);
                                            L.DomEvent.disableScrollPropagation(popupNode);
                                        }
                                    }
                                }}
                            >
                                <div className="bg-white p-[16px] flex flex-col gap-[12px] w-full text-left font-['Ubuntu',sans-serif]">
                                    <div className="flex flex-col gap-[8px] w-full pr-4">
                                        <div className="flex flex-col items-start w-full">
                                            <PopupDetailLink
                                                onClick={() => onViewDetails?.(pharmacy)}
                                                className="text-left font-['Ubuntu',sans-serif] text-[16px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[24px] cursor-pointer"
                                            >
                                                {pharmacy.nev}
                                            </PopupDetailLink>
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

                                        <PopupDetailLink
                                            onClick={() => onViewDetails?.(pharmacy)}
                                            className="text-left font-['Ubuntu',sans-serif] text-[14px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[21px] cursor-pointer"
                                        >
                                            Többit mutasd
                                        </PopupDetailLink>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-[#d8d9e0]" />

                                    {/* Action button */}
                                    <div className="flex items-center w-full">
                                        <PopupNearbyButton
                                            markedNearby={markedNearby}
                                            onToggle={() => {
                                                if (markedNearby) {
                                                    clearNearbyPharmacy();
                                                } else {
                                                    setNearbyPharmacy(pharmacy);
                                                }
                                            }}
                                        />
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
