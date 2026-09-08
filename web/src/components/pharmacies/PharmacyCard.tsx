/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZERTÁR KÁRTYA KOMPONENS
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A gyógyszertár-kereső lista nézetében és a térképi felugró ablakban megjelenő
 * kártya elem (Figma: Pharmacy Details (master)), amely bemutatja a patika nevét,
 * pontos címét, a felhasználó tartózkodási helyétől számított távolságát, az aktuális
 * napi nyitvatartási idejét és státuszát, valamint lehetővé teszi a patika "Közeli
 * gyógyszertárként" történő kijelölését vagy a részletes heti adatlap megnyitását.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném gyorsan áttekinteni a gyógyszertárak legfontosabb adatait
 *   (cím, nyitvatartás, távolság), hogy a legmegfelelőbb patikát választhassam.
 * - Felhasználóként egyetlen kattintással szeretném a kiválasztott patikát preferált
 *   "Közeli gyógyszertáramként" megjelölni a készletek ellenőrzéséhez.
 * - Felhasználóként a kártyára kattintva szeretném, ha a térkép az adott patikára ugrana,
 *   a "Többit mutasd" gombbal pedig megnyithatnám a teljes heti nyitvatartási rendet.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszertár kereső oldal (/gyogyszertarak)
 * - Térkép komponens és markerek (PharmacyMap.tsx)
 * - Részletes patika adatlap modal (PharmacyDetailModal.tsx)
 * - Globális preferált patika kontextus (NearbyPharmacyContext)
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.3.1.6, 4.3.1.7)
 * ============================================================================
 */

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Pharmacy } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onViewDetails?: (pharmacy: Pharmacy) => void;
    userLocation?: { lat: number; lng: number } | null;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
    pharmacy,
    isSelected,
    onSelect,
    onViewDetails,
    userLocation
}) => {
    const { isNearby, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();
    const markedNearby = isNearby(pharmacy.id);

    const openingStatus = useMemo(() => getPharmacyOpeningStatus(pharmacy), [pharmacy]);

    // Format current Hungarian day name
    const currentDayName = useMemo(() => {
        const dayNamesHu = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
        const dayIndex = new Date().getDay();
        return `${dayNamesHu[dayIndex]}:`;
    }, []);

    // Calculate distance from user's location (or default reference point: Budapest, Soroksári út)
    const distanceDisplay = useMemo(() => {
        if (!pharmacy.latitude || !pharmacy.longitude) return null;
        const refLat = userLocation?.lat ?? 47.4728;
        const refLng = userLocation?.lng ?? 19.0712;
        const dist = calculateDistanceKm(refLat, refLng, pharmacy.latitude, pharmacy.longitude);
        return `~${dist.toFixed(1)} km`;
    }, [pharmacy.latitude, pharmacy.longitude, userLocation]);

    const handleNearbyToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (markedNearby) {
            clearNearbyPharmacy();
        } else {
            setNearbyPharmacy(pharmacy);
        }
    };

    const handleOpenDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onViewDetails) {
            onViewDetails(pharmacy);
        }
    };

    return (
        <div
            onClick={() => onSelect(pharmacy.id)}
            className={`w-full bg-white rounded-[16px] p-[16px] transition-all cursor-pointer drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] border-2 ${
                isSelected
                    ? 'border-[#317907] ring-1 ring-[#317907]/20 shadow-md'
                    : 'border-transparent hover:border-gray-200 shadow-sm'
            }`}
        >
            <div className="flex flex-col gap-[12px] w-full">
                {/* Pharmacy Details */}
                <div className="flex flex-col gap-[8px] w-full">
                    {/* Pharmacy Name & Address */}
                    <div className="flex flex-col items-start w-full">
                        <button
                            type="button"
                            onClick={handleOpenDetails}
                            className="text-left font-['Ubuntu',sans-serif] text-[16px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[24px] transition-colors"
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
                            {distanceDisplay && (
                                <span className="font-['Ubuntu',sans-serif] text-[14px] text-[#002664] leading-[21px]">
                                    {distanceDisplay}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Pharmacy Hours */}
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

                    {/* Show more details link */}
                    <button
                        type="button"
                        onClick={handleOpenDetails}
                        className="text-left font-['Ubuntu',sans-serif] text-[14px] text-[#002664] underline decoration-solid hover:text-[#378509] leading-[21px] transition-colors"
                    >
                        Többit mutasd
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#d8d9e0]" />

                {/* Actions / Services Tag */}
                <div className="flex items-center w-full">
                    <button
                        type="button"
                        onClick={handleNearbyToggle}
                        className={`h-[32px] px-[12px] py-[4px] rounded-[22px] flex items-center justify-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-all ${
                            markedNearby
                                ? 'bg-[#378509] text-white hover:bg-[#2f7108]'
                                : 'bg-[#e8f8e2] text-[#317907] hover:bg-[#d7f1cf]'
                        }`}
                        title={markedNearby ? 'Közeli jelölés visszavonása' : 'Közeli patikának jelölöm'}
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
        </div>
    );
};
