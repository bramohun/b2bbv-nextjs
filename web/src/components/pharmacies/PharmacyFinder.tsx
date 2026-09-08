/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZERTÁR KERESŐ MODUL
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A BENU Vény Orvosi Portál központi gyógyszertár kereső és böngésző felülete
 * (Figma: Desktop / Gyógyszertár node: 13385:228895). Kétpanelos elrendezésben
 * biztosítja a patikák közötti valós idejű keresést, a nyitvatartási szűrést
 * ("Most nyitva", "Hétvégén nyitva", "0-24 órában nyitva"), az Ön tartózkodási
 * helyének észlelését és frissítését, a közeli patika kiválasztását, valamint a
 * térképpel szinkronizált lista megjelenítését.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretnék név, cím vagy település alapján keresni patikát,
 *   és egy kattintással szűrni a jelenleg vagy hétvégén nyitva tartó gyógyszertárakra.
 * - Felhasználóként szeretném látni a jelenlegi tartózkodási helyemet, és egyetlen
 *   kattintással frissíteni azt, hogy a rendszer a legközelebbi patikákat ajánlja.
 * - Felhasználóként szeretném térképen és listában egyaránt látni a találatokat,
 *   a kártyára vagy markerre kattintva pedig fókuszálni az adott gyógyszertárra.
 * - Felhasználóként egy kattintással szeretném kijelölni a preferált közeli patikát.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszertárak főoldal (/gyogyszertarak)
 * - Fejléc közeli patika modal (Navbar.tsx)
 * - Részletes patika adatlap modal (PharmacyDetailModal.tsx)
 * - Térkép komponens (PharmacyMap.tsx)
 * - Patikakártya komponens (PharmacyCard.tsx)
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.3.1)
 * ============================================================================
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Pharmacy } from '@/types';
import { PharmacyCard } from './PharmacyCard';
import { PharmacyDetailModal } from './PharmacyDetailModal';
import { fetchStaticData } from '@/lib/static-fetch';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';

const PharmacyMap = dynamic(() => import('./PharmacyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-[#62788f]">
            Térkép betöltése...
        </div>
    )
});

interface PharmacyFinderProps {
    filterIds?: string[];
    title?: string;
    description?: string;
    initialSelectedId?: string;
    onClose?: () => void;
}

export const PharmacyFinder: React.FC<PharmacyFinderProps> = ({
    filterIds,
    title = "Gyógyszertárak",
    description,
    initialSelectedId,
    onClose
}) => {
    const { nearbyPharmacy } = useNearbyPharmacy();
    const searchParams = useSearchParams();
    const urlPharmacyId = searchParams ? (searchParams.get('id') || searchParams.get('pharmacyId')) : null;

    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(initialSelectedId || urlPharmacyId || null);
    const [visiblePharmacyIds, setVisiblePharmacyIds] = useState<string[] | null>(null);
    const [detailPharmacy, setDetailPharmacy] = useState<Pharmacy | null>(null);

    // Filters state (Figma filter pills)
    const [onlyOpenNow, setOnlyOpenNow] = useState(false);
    const [onlyWeekendOpen, setOnlyWeekendOpen] = useState(false);
    const [only24h, setOnly24h] = useState(false);

    // User location state (defaults to Figma mockup reference: Budapest, Soroksári út 32., 1095)
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
        isDetecting?: boolean;
    }>({
        lat: 47.4728,
        lng: 19.0712,
        address: 'Budapest, Soroksári út 32.,1095'
    });

    // Map state
    const [mapCenter, setMapCenter] = useState<[number, number]>([47.4728, 19.0712]);
    const [mapZoom, setMapZoom] = useState(13);
    const [showMapMobile, setShowMapMobile] = useState(false);

    useEffect(() => {
        const targetId = initialSelectedId || urlPharmacyId;
        if (targetId && pharmacies.length > 0) {
            const pharmacy = pharmacies.find(p => p.id === targetId);
            if (pharmacy) {
                setSelectedPharmacyId(targetId);
                if (pharmacy.latitude && pharmacy.longitude) {
                    setMapCenter([pharmacy.latitude, pharmacy.longitude]);
                    setMapZoom(15);
                }
                setDetailPharmacy(pharmacy);
                if (window.innerWidth < 1024) {
                    setShowMapMobile(true);
                }
            }
        }
    }, [initialSelectedId, urlPharmacyId, pharmacies]);

    useEffect(() => {
        async function fetchPharmacies() {
            try {
                const data = await fetchStaticData<Pharmacy[]>('/data/pharmacies.json');

                if (filterIds) {
                    setPharmacies(data.filter((p: Pharmacy) => filterIds.includes(p.id)));
                } else {
                    setPharmacies(data);
                }
            } catch (error) {
                console.error('Failed to load pharmacies:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPharmacies();
    }, [filterIds]);

    const handleUpdateLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('A böngésző nem támogatja a helymeghatározást.');
            return;
        }

        setUserLocation(prev => ({ ...prev, isDetecting: true }));
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({
                    lat: latitude,
                    lng: longitude,
                    address: `Észlelt pozíció (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                    isDetecting: false
                });
                setMapCenter([latitude, longitude]);
                setMapZoom(14);
            },
            (err) => {
                console.warn('Geolocation warning:', err);
                setUserLocation(prev => ({ ...prev, isDetecting: false }));
                alert('A helymeghatározás nem sikerült vagy le lett tiltva. A referencia helyszínt használjuk.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const handleResetFilters = () => {
        setSearchTerm('');
        setOnlyOpenNow(false);
        setOnlyWeekendOpen(false);
        setOnly24h(false);
    };

    const hasActiveFilters = Boolean(searchTerm || onlyOpenNow || onlyWeekendOpen || only24h);

    const filteredPharmacies = useMemo(() => {
        let filtered = pharmacies.filter(pharmacy =>
            pharmacy.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.telepules.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.cim.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const isCurrentlyOpen = (p: Pharmacy) => {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const openKey = `${dayNames[currentDay]}Open` as keyof Pharmacy;
            const closeKey = `${dayNames[currentDay]}Close` as keyof Pharmacy;

            const openTime = p[openKey] as string;
            const closeTime = p[closeKey] as string;

            if (!openTime || !closeTime || openTime === 'Zárva') return false;
            return currentTime >= openTime && currentTime <= closeTime;
        };

        const isWeekendOpen = (p: Pharmacy) => {
            return (!!p.saturdayOpen && p.saturdayOpen !== 'Zárva') || (!!p.sundayOpen && p.sundayOpen !== 'Zárva');
        };

        const is24h = (p: Pharmacy) => {
            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            return dayNames.every(day => {
                const open = p[`${day}Open` as keyof Pharmacy] as string;
                const close = p[`${day}Close` as keyof Pharmacy] as string;
                return open === '00:00' && (close === '24:00' || close === '23:59');
            });
        };

        if (onlyOpenNow) {
            filtered = filtered.filter(isCurrentlyOpen);
        }

        if (onlyWeekendOpen) {
            filtered = filtered.filter(isWeekendOpen);
        }

        if (only24h) {
            filtered = filtered.filter(is24h);
        }

        return filtered;
    }, [pharmacies, searchTerm, onlyOpenNow, onlyWeekendOpen, only24h]);

    const visiblePharmacies = useMemo(() => {
        if (!visiblePharmacyIds) return filteredPharmacies;
        return filteredPharmacies.filter(p => visiblePharmacyIds.includes(p.id));
    }, [filteredPharmacies, visiblePharmacyIds]);

    const handleSelectPharmacy = (id: string) => {
        setSelectedPharmacyId(id);
        const pharmacy = pharmacies.find(p => p.id === id) || (nearbyPharmacy?.id === id ? nearbyPharmacy : null);
        if (pharmacy && pharmacy.latitude && pharmacy.longitude) {
            setMapCenter([pharmacy.latitude, pharmacy.longitude]);
            setMapZoom(15);
            if (window.innerWidth < 1024) {
                setShowMapMobile(true);
            }
        }
    };

    const handleShowAll = () => {
        setMapCenter([47.1625, 19.5033]);
        setMapZoom(7);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white overflow-hidden">
            {/* SubHeader Row matching Figma 13381:172141 */}
            <div className="flex-none border-b border-[#e7e8ec] bg-white px-4 md:px-8 lg:px-12 py-3 z-10">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                    {/* Left SubHeader: BENU Cross + Title */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="size-[32px] shrink-0 relative flex items-center justify-center">
                            <Image
                                src="/assets/figma/298bbbf4bad5aee1fcf6c0e4d4db725c604f8e29.svg"
                                alt="BENU"
                                width={30}
                                height={30}
                                className="size-full object-contain"
                            />
                        </div>
                        <h1 className="font-['Ubuntu',sans-serif] font-bold text-[22px] text-[#002664] leading-normal whitespace-nowrap">
                            {title}
                        </h1>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="btn btn-circle btn-ghost btn-sm ml-auto xl:hidden"
                                title="Bezárás"
                            >
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        )}
                    </div>

                    {/* Right SubHeader: Search Field + 3 Filter Pills + Clear Filters */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full xl:w-auto">
                        {/* Search field */}
                        <div className="bg-white border border-[#d8d9e0] rounded-[8px] flex items-center px-[15px] py-[8px] md:py-[10px] w-full sm:w-[320px] shrink-0 focus-within:border-[#002664] transition-colors">
                            <input
                                type="text"
                                placeholder="Gyógyszertár neve, címe..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="font-['Ubuntu',sans-serif] text-[15px] text-[#002664] placeholder-[#62788f] bg-transparent outline-none flex-1 leading-[24px]"
                            />
                            <div className="size-[22px] shrink-0 ml-2 flex items-center justify-center text-[#002664]">
                                <span className="material-symbols-rounded text-[22px]">search</span>
                            </div>
                        </div>

                        {/* Filter pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Most nyitva */}
                            <button
                                type="button"
                                onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                                className={`rounded-[20px] px-[16px] py-[8px] md:py-[10px] flex items-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-colors border ${
                                    onlyOpenNow
                                        ? 'bg-[#002664] text-white border-[#002664]'
                                        : 'bg-white text-[#002664] border-[#e7e8ec] hover:border-[#002664]/40'
                                }`}
                            >
                                <div className={`size-[18px] shrink-0 ${onlyOpenNow ? 'brightness-0 invert' : ''}`}>
                                    <Image
                                        src="/assets/figma/8c1db043a2461bda2fbe0f3fc236e575c110480f.svg"
                                        alt="Most nyitva"
                                        width={18}
                                        height={18}
                                        className="size-full"
                                    />
                                </div>
                                <span>Most nyitva</span>
                            </button>

                            {/* Hétvégén nyitva */}
                            <button
                                type="button"
                                onClick={() => setOnlyWeekendOpen(!onlyWeekendOpen)}
                                className={`rounded-[20px] px-[16px] py-[8px] md:py-[10px] flex items-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-colors border ${
                                    onlyWeekendOpen
                                        ? 'bg-[#002664] text-white border-[#002664]'
                                        : 'bg-white text-[#002664] border-[#e7e8ec] hover:border-[#002664]/40'
                                }`}
                            >
                                <div className={`size-[18px] shrink-0 ${onlyWeekendOpen ? 'brightness-0 invert' : ''}`}>
                                    <Image
                                        src="/assets/figma/a7cb3cb19c5667dff4ba94fcc111144f3a62abd3.svg"
                                        alt="Hétvégén nyitva"
                                        width={18}
                                        height={18}
                                        className="size-full"
                                    />
                                </div>
                                <span>Hétvégén nyitva</span>
                            </button>

                            {/* 0-24 órában nyitva */}
                            <button
                                type="button"
                                onClick={() => setOnly24h(!only24h)}
                                className={`rounded-[20px] px-[16px] py-[8px] md:py-[10px] flex items-center gap-[8px] text-[14px] font-['Ubuntu',sans-serif] font-medium transition-colors border ${
                                    only24h
                                        ? 'bg-[#002664] text-white border-[#002664]'
                                        : 'bg-white text-[#002664] border-[#e7e8ec] hover:border-[#002664]/40'
                                }`}
                            >
                                <div className={`size-[18px] shrink-0 ${only24h ? 'brightness-0 invert' : ''}`}>
                                    <Image
                                        src="/assets/figma/433f00c45226ea1db5736643b75ad9fcfc38ae31.svg"
                                        alt="0-24"
                                        width={18}
                                        height={18}
                                        className="size-full"
                                    />
                                </div>
                                <span>0-24 órában nyitva</span>
                            </button>
                        </div>

                        {/* Szűrés törlése */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="font-['Ubuntu',sans-serif] text-[15px] text-[#002664] underline hover:text-[#378509] transition-colors whitespace-nowrap ml-1 cursor-pointer"
                            >
                                Szűrés törlése
                            </button>
                        )}

                        {/* Mobile View Switcher */}
                        <div className="lg:hidden flex items-center bg-[#f0f4f9] rounded-lg p-1 ml-auto">
                            <button
                                type="button"
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    !showMapMobile ? 'bg-white text-[#002664] shadow-sm' : 'text-gray-600'
                                }`}
                                onClick={() => setShowMapMobile(false)}
                            >
                                Lista
                            </button>
                            <button
                                type="button"
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    showMapMobile ? 'bg-white text-[#002664] shadow-sm' : 'text-gray-600'
                                }`}
                                onClick={() => setShowMapMobile(true)}
                            >
                                Térkép
                            </button>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="hidden xl:flex btn btn-circle btn-ghost btn-sm ml-2"
                                title="Bezárás"
                            >
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area (Sidebar + Map Container) */}
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
                {/* Sidebar Container (Figma 13385:227923) */}
                <div
                    className={`
                        w-full lg:w-[476px] xl:w-[490px] shrink-0 bg-white border-r border-[#d8d9e0] flex flex-col h-full z-10
                        ${showMapMobile ? 'hidden lg:flex' : 'flex'}
                    `}
                >
                    {/* Sidebar Header / Info & Notification Cards (Figma 13385:227924) */}
                    <div className="p-4 md:p-6 lg:pl-10 lg:pr-6 flex flex-col gap-3 bg-white border-b border-[#e7e8ec] shrink-0">
                        {/* 1. Az Ön tartózkodási helye */}
                        <div className="bg-[#f5f9ff] rounded-[12px] p-[16px] flex flex-col gap-1 text-left">
                            <div className="flex items-center gap-[12px]">
                                <div className="size-[24px] shrink-0">
                                    <Image
                                        src="/assets/figma/844df6fc16ad433d1a7272782cb238abc8ff7144.svg"
                                        alt="Helyzet"
                                        width={24}
                                        height={24}
                                        className="size-full"
                                    />
                                </div>
                                <h3 className="font-['Ubuntu',sans-serif] font-medium text-[16px] text-[#002664] leading-[24px]">
                                    Az Ön tartózkodási helye
                                </h3>
                            </div>
                            <div className="pl-[36px] flex flex-col items-start gap-0.5">
                                <p className="font-['Ubuntu',sans-serif] text-[14px] text-[#002664] leading-[21px]">
                                    {userLocation.address}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleUpdateLocation}
                                    disabled={userLocation.isDetecting}
                                    className="font-['Ubuntu',sans-serif] text-[14px] text-[#002664] underline hover:text-[#378509] leading-[21px] transition-colors cursor-pointer"
                                >
                                    {userLocation.isDetecting ? 'Helymeghatározás folyamatban...' : 'Aktuális hely frissítése'}
                                </button>
                            </div>
                        </div>

                        {/* 2. Válasszon közeli gyógyszertárat / Az Ön közeli gyógyszertára: */}
                        <div className="bg-[#f5fbf3] rounded-[12px] p-[16px] flex flex-col gap-1 text-left">
                            <div className="flex items-center gap-[12px]">
                                <div className="size-[24px] shrink-0">
                                    <Image
                                        src="/assets/figma/1cc0864fe39f4aa111389c89892eb776efd99f41.svg"
                                        alt="Patika"
                                        width={24}
                                        height={24}
                                        className="size-full"
                                    />
                                </div>
                                <h3 className="font-['Ubuntu',sans-serif] font-medium text-[16px] text-[#317907] leading-[24px]">
                                    {nearbyPharmacy ? 'Az Ön közeli gyógyszertára:' : 'Válasszon közeli gyógyszertárat'}
                                </h3>
                            </div>
                            <div className="pl-[36px]">
                                {nearbyPharmacy ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPharmacy(nearbyPharmacy.id)}
                                        className="font-['Ubuntu',sans-serif] text-[14px] text-[#317907] underline hover:text-[#002664] font-medium leading-[21px] text-left transition-colors cursor-pointer"
                                        title="Ráközelítés a térképen"
                                    >
                                        {nearbyPharmacy.nev}
                                    </button>
                                ) : (
                                    <p className="font-['Ubuntu',sans-serif] text-[14px] text-[#317907] leading-[21px]">
                                        Válasszon a listából közeli gyógyszertárat, hogy láthassa a készletét!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pharmacy List Section (Figma 13385:227941) */}
                    <div className="flex-1 overflow-y-auto bg-[#f9f9fb] p-4 md:p-6 lg:pl-10 lg:pr-6 space-y-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 gap-3">
                                <span className="loading loading-spinner loading-md text-[#002664]"></span>
                                <span className="text-sm text-[#62788f]">Gyógyszertárak betöltése...</span>
                            </div>
                        ) : (
                            <>
                                {/* Result count title */}
                                <div className="flex flex-col gap-1 mb-2">
                                    <h2 className="font-['Ubuntu',sans-serif] font-medium text-[18px] text-[#002664] leading-[27px]">
                                        {filteredPharmacies.length} BENU gyógyszertárat találtunk
                                    </h2>
                                    {visiblePharmacies.length !== filteredPharmacies.length && (
                                        <div className="text-xs text-[#62788f] flex items-center gap-2">
                                            <span>a térképen {visiblePharmacies.length} látható</span>
                                            <button
                                                type="button"
                                                onClick={handleShowAll}
                                                className="text-[#002664] hover:text-[#378509] font-medium underline"
                                            >
                                                [Mutasd az összest]
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Pharmacy Cards */}
                                {visiblePharmacies.slice(0, 50).map((pharmacy) => (
                                    <PharmacyCard
                                        key={pharmacy.id}
                                        pharmacy={pharmacy}
                                        isSelected={selectedPharmacyId === pharmacy.id}
                                        userLocation={userLocation}
                                        onSelect={handleSelectPharmacy}
                                        onViewDetails={(p) => setDetailPharmacy(p)}
                                    />
                                ))}

                                {visiblePharmacies.length === 0 && (
                                    <div className="bg-white rounded-[16px] p-8 text-center text-[#62788f] shadow-sm">
                                        Nincs találat a kiválasztott szűrők alapján vagy a látható térképi területen.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Map Panel */}
                <div
                    className={`
                        flex-1 h-full bg-[#f9f9fb] relative z-0
                        ${!showMapMobile ? 'hidden lg:block' : 'block'}
                    `}
                >
                    <PharmacyMap
                        pharmacies={filteredPharmacies}
                        center={mapCenter}
                        zoom={mapZoom}
                        selectedPharmacyId={selectedPharmacyId}
                        userLocation={userLocation}
                        onSelectPharmacy={handleSelectPharmacy}
                        onVisiblePharmaciesChange={setVisiblePharmacyIds}
                        onViewDetails={(p) => setDetailPharmacy(p)}
                    />
                </div>
            </div>

            {/* Pharmacy Detail Modal */}
            <PharmacyDetailModal
                pharmacy={detailPharmacy}
                isOpen={Boolean(detailPharmacy)}
                onClose={() => setDetailPharmacy(null)}
                onSelectOnMap={handleSelectPharmacy}
            />
        </div>
    );
};
