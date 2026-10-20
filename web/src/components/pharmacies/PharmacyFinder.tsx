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
 * - Orvosként mobil eszközön vagy helyszíni vizit során szeretném a patikákat a térkép feletti
 *   Bottom Sheet felületen böngészni, a fejléc címsorával egy sorban elhelyezett nézetválasztóval
 *   ([Térkép | Osztott | Lista]). Lista nézetben a lista kitakarja a címsor alatti teljes területet,
 *   maximális képernyőmagasságot biztosítva a patikakártyáknak beépített gyorskeresővel.
 * - Felhasználóként szeretném a térképes keresőt és szűrőket egyetlen kattintással accordionként
 *   összecsukni a viewport felszabadítására, aktív szűrés esetén pedig számláló jelvényben (badge)
 *   látni a beállított szűrők darabszámát.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszertárak főoldal (/gyogyszertarak)
 * - Fejléc közeli patika modal (Navbar.tsx)
 * - Részletes patika adatlap modal (PharmacyDetailModal.tsx)
 * - Térkép komponens (PharmacyMap.tsx)
 * - Patikakártya komponens (PharmacyCard.tsx)
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.3.1, 4.3.7, 4.3.8)
 * ============================================================================
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

    // Collapsible Search & Filter Accordion state
    const [isSearchAccordionOpen, setIsSearchAccordionOpen] = useState<boolean>(false);

    useEffect(() => {
        // Default open on desktop (>=1024px), closed on mobile to maximize viewport
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsSearchAccordionOpen(true);
        }
    }, []);

    // Number of active search/filter criteria
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchTerm.trim().length > 0) count += 1;
        if (onlyOpenNow) count += 1;
        if (onlyWeekendOpen) count += 1;
        if (only24h) count += 1;
        return count;
    }, [searchTerm, onlyOpenNow, onlyWeekendOpen, only24h]);

    const hasActiveFilters = activeFilterCount > 0;

    const handleResetFilters = () => {
        setSearchTerm('');
        setOnlyOpenNow(false);
        setOnlyWeekendOpen(false);
        setOnly24h(false);
    };

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
    const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');

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
        }
        // If in map (peek) mode on mobile, automatically expand to split mode so user sees the pharmacy details
        if (mobileView === 'map') {
            setMobileView('split');
        }
    };

    const handleShowAll = () => {
        setMapCenter([47.1625, 19.5033]);
        setMapZoom(7);
    };

    // Touch gesture handling for Mobile Bottom Sheet
    const touchStartYRef = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartYRef.current === null) return;
        const endY = e.changedTouches[0].clientY;
        const diff = endY - touchStartYRef.current;
        touchStartYRef.current = null;

        if (diff < -35) {
            // Dragged up
            if (mobileView === 'map') setMobileView('split');
            else if (mobileView === 'split') setMobileView('list');
        } else if (diff > 35) {
            // Dragged down
            if (mobileView === 'list') setMobileView('split');
            else if (mobileView === 'split') setMobileView('map');
        }
    };

    // Reusable info cards for Location and Nearby Pharmacy (scrolls naturally in list)
    const renderInfoCards = (compact = false) => (
        <div className={`flex flex-col gap-2.5 ${compact ? 'mb-2.5' : 'mb-3.5'}`}>
            {/* 1. Az Ön tartózkodási helye */}
            <div className="bg-[#f5f9ff] rounded-[12px] p-3 sm:p-4 flex flex-col gap-1 text-left border border-[#e0ecfc]">
                <div className="flex items-center gap-[10px]">
                    <div className="size-[20px] sm:size-[24px] shrink-0">
                        <Image
                            src="/assets/figma/844df6fc16ad433d1a7272782cb238abc8ff7144.svg"
                            alt="Helyzet"
                            width={24}
                            height={24}
                            className="size-full"
                        />
                    </div>
                    <h3 className="font-['Ubuntu',sans-serif] font-medium text-[15px] sm:text-[16px] text-[#002664] leading-tight">
                        Az Ön tartózkodási helye
                    </h3>
                </div>
                <div className="pl-[30px] sm:pl-[34px] flex flex-col items-start gap-0.5">
                    <p className="font-['Ubuntu',sans-serif] text-[13px] sm:text-[14px] text-[#002664] leading-normal line-clamp-1 sm:line-clamp-none">
                        {userLocation.address}
                    </p>
                    <button
                        type="button"
                        onClick={handleUpdateLocation}
                        disabled={userLocation.isDetecting}
                        className="font-['Ubuntu',sans-serif] text-[13px] sm:text-[14px] text-[#002664] underline hover:text-[#378509] leading-tight transition-colors cursor-pointer"
                    >
                        {userLocation.isDetecting ? 'Helymeghatározás folyamatban...' : 'Aktuális hely frissítése'}
                    </button>
                </div>
            </div>

            {/* 2. Válasszon közeli gyógyszertárat / Az Ön közeli gyógyszertára: */}
            <div className="bg-[#f5fbf3] rounded-[12px] p-3 sm:p-4 flex flex-col gap-1 text-left border border-[#e4f5df]">
                <div className="flex items-center gap-[10px]">
                    <div className="size-[20px] sm:size-[24px] shrink-0">
                        <Image
                            src="/assets/figma/1cc0864fe39f4aa111389c89892eb776efd99f41.svg"
                            alt="Patika"
                            width={24}
                            height={24}
                            className="size-full"
                        />
                    </div>
                    <h3 className="font-['Ubuntu',sans-serif] font-medium text-[15px] sm:text-[16px] text-[#317907] leading-tight">
                        {nearbyPharmacy ? 'Az Ön közeli gyógyszertára:' : 'Válasszon közeli gyógyszertárat'}
                    </h3>
                </div>
                <div className="pl-[30px] sm:pl-[34px]">
                    {nearbyPharmacy ? (
                        <button
                            type="button"
                            onClick={() => handleSelectPharmacy(nearbyPharmacy.id)}
                            className="font-['Ubuntu',sans-serif] text-[13px] sm:text-[14px] text-[#317907] underline hover:text-[#002664] font-medium leading-normal text-left transition-colors cursor-pointer line-clamp-1"
                            title="Ráközelítés a térképen"
                        >
                            {nearbyPharmacy.nev}
                        </button>
                    ) : (
                        <p className="font-['Ubuntu',sans-serif] text-[13px] sm:text-[14px] text-[#317907] leading-tight">
                            Válasszon a listából közeli gyógyszertárat, hogy láthassa a készletét!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-white overflow-hidden">
            {/* SubHeader Row matching Figma 13381:172141 */}
            <div className="flex-none border-b border-[#e7e8ec] bg-white px-4 md:px-8 lg:px-12 py-2.5 sm:py-3 z-10">
                <div className="flex flex-col w-full">
                    {/* Top Row / Címsor: BENU Cross + Title + Accordion Button on left, Mobile View Switcher (+ Close button) on right */}
                    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
                        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
                            <div className="size-[28px] sm:size-[32px] shrink-0 relative flex items-center justify-center">
                                <Image
                                    src="/assets/figma/298bbbf4bad5aee1fcf6c0e4d4db725c604f8e29.svg"
                                    alt="BENU"
                                    width={30}
                                    height={30}
                                    className="size-full object-contain"
                                />
                            </div>
                            <h1 className="font-['Ubuntu',sans-serif] font-bold text-[17px] sm:text-[22px] text-[#002664] leading-normal whitespace-nowrap truncate">
                                {title}
                            </h1>

                            {/* Collapsible Search and Filter Accordion Toggle Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSearchAccordionOpen(prev => !prev);
                                    if (mobileView === 'list') {
                                        setMobileView('split');
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none shrink-0 ${
                                    isSearchAccordionOpen
                                        ? 'bg-[#002664] text-white border-[#002664] shadow-sm'
                                        : activeFilterCount > 0
                                        ? 'bg-[#eef4ff] text-[#002664] border-[#002664]/40 hover:bg-[#e0ecff]'
                                        : 'bg-[#f0f4f9] text-[#002664] border-[#d8d9e0] hover:bg-[#e2e8f0]'
                                }`}
                                title={isSearchAccordionOpen ? 'Kereső és szűrők összecsukása' : 'Kereső és szűrők megnyitása'}
                                aria-expanded={isSearchAccordionOpen}
                            >
                                <span className="material-symbols-rounded text-[18px]">
                                    {isSearchAccordionOpen ? 'tune' : 'search'}
                                </span>
                                <span className="hidden sm:inline">Keresés és szűrők</span>
                                <span className="sm:hidden">Szűrők</span>

                                {/* Active filter count badge */}
                                {activeFilterCount > 0 && (
                                    <span
                                        className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                                            isSearchAccordionOpen
                                                ? 'bg-white text-[#002664]'
                                                : 'bg-[#002664] text-white shadow-sm'
                                        }`}
                                        title={`${activeFilterCount} aktív szűrő`}
                                    >
                                        {activeFilterCount}
                                    </span>
                                )}

                                <span className="material-symbols-rounded text-[18px] transition-transform">
                                    {isSearchAccordionOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                </span>
                            </button>
                        </div>

                        {/* Mobile View Switcher (Térkép / Osztott / Lista) + Close button */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <div className="lg:hidden flex items-center bg-[#f0f4f9] rounded-lg p-0.5 sm:p-1 border border-[#d8d9e0]">
                                <button
                                    type="button"
                                    className={`px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                                        mobileView === 'map' ? 'bg-[#002664] text-white shadow-sm' : 'text-[#002664] hover:bg-white/60'
                                    }`}
                                    onClick={() => setMobileView('map')}
                                    title="Térkép nézet (lap becsukása)"
                                >
                                    Térkép
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                                        mobileView === 'split' ? 'bg-[#002664] text-white shadow-sm' : 'text-[#002664] hover:bg-white/60'
                                    }`}
                                    onClick={() => setMobileView('split')}
                                    title="Osztott képernyő (50% térkép, 50% lista)"
                                >
                                    Osztott
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                                        mobileView === 'list' ? 'bg-[#002664] text-white shadow-sm' : 'text-[#002664] hover:bg-white/60'
                                    }`}
                                    onClick={() => setMobileView('list')}
                                    title="Teljes lista nézet"
                                >
                                    Lista
                                </button>
                            </div>

                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="btn btn-circle btn-ghost btn-sm"
                                    title="Bezárás"
                                >
                                    <span className="material-symbols-rounded">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Collapsible Search and Filters Accordion Panel */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out w-full ${
                            isSearchAccordionOpen && mobileView !== 'list'
                                ? 'max-h-[350px] opacity-100 mt-2.5 pt-2.5 border-t border-[#f0f2f5]'
                                : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none'
                        }`}
                    >
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area: Desktop side-by-side, Mobile Full Map with Bottom Sheet overlay */}
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
                {/* Map Panel (Mobile: full-bleed background; Desktop: flex-1 right side) */}
                <div className="absolute inset-0 lg:relative lg:flex-1 lg:h-full bg-[#f9f9fb] z-0 order-1 lg:order-2">
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

                {/* Desktop Sidebar (≥1024px: 476px sidebar on left) */}
                <div className="hidden lg:flex lg:h-full lg:w-[476px] xl:w-[490px] shrink-0 bg-white border-r border-[#d8d9e0] flex-col z-10 order-1">
                    <div className="flex-1 overflow-y-auto bg-[#f9f9fb] p-4 md:p-6 lg:pl-10 lg:pr-6 space-y-3">
                        {/* Info cards scroll naturally with list */}
                        {renderInfoCards(false)}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 gap-3">
                                <span className="loading loading-spinner loading-md text-[#002664]"></span>
                                <span className="text-sm text-[#62788f]">Gyógyszertárak betöltése...</span>
                            </div>
                        ) : (
                            <>
                                {/* Result count title */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h2 className="font-['Ubuntu',sans-serif] font-medium text-[18px] text-[#002664] leading-[27px]">
                                        {visiblePharmacies.length} BENU gyógyszertár a térképen
                                    </h2>
                                    {visiblePharmacies.length !== filteredPharmacies.length && (
                                        <button
                                            type="button"
                                            onClick={handleShowAll}
                                            className="text-[13px] text-[#002664] hover:text-[#378509] font-medium underline cursor-pointer whitespace-nowrap"
                                            title="Az összes gyógyszertár mutatása a térképen"
                                        >
                                            Összes ({filteredPharmacies.length} db)
                                        </button>
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

                {/* Mobile Bottom Sheet (<1024px: Interactive Bottom Sheet over the Map) */}
                <div
                    className={`lg:hidden absolute bottom-0 left-0 right-0 z-20 bg-white flex flex-col transition-all duration-300 ease-out ${
                        mobileView === 'map'
                            ? 'h-[92px] rounded-t-[20px] shadow-[0_-6px_30px_rgba(0,0,0,0.18)] border-t border-[#d8d9e0]'
                            : mobileView === 'split'
                            ? 'h-[50%] rounded-t-[20px] shadow-[0_-6px_30px_rgba(0,0,0,0.18)] border-t border-[#d8d9e0]'
                            : 'h-full top-0 rounded-t-none border-t-0 shadow-none'
                    }`}
                >
                    {/* Drag handle header bar */}
                    <div
                        className="w-full shrink-0 flex flex-col items-center pt-2.5 pb-2 px-4 cursor-grab active:cursor-grabbing border-b border-[#f0f2f5] select-none touch-none"
                        onClick={() => {
                            if (mobileView === 'map') setMobileView('split');
                            else if (mobileView === 'split') setMobileView('list');
                            else setMobileView('split');
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Grab Pill */}
                        <div className="w-12 h-1.5 bg-[#cbd5e1] rounded-full mb-1.5 hover:bg-[#94a3b8] transition-colors" />

                        {/* Quick summary line (especially useful in peek/map mode) */}
                        <div className="w-full flex items-center justify-between text-xs text-[#002664] font-medium">
                            <div className="flex items-center gap-1.5">
                                <span>{visiblePharmacies.length} BENU gyógyszertár a térképen</span>
                                {visiblePharmacies.length !== filteredPharmacies.length && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowAll();
                                        }}
                                        className="text-[#002664] hover:text-[#378509] font-medium underline cursor-pointer whitespace-nowrap"
                                        title="Az összes gyógyszertár mutatása a térképen"
                                    >
                                        Összes ({filteredPharmacies.length} db)
                                    </button>
                                )}
                            </div>
                            <span className="text-[11px] text-[#62788f] flex items-center gap-1">
                                {mobileView === 'map' ? 'Húzza fel a listához ▲' : mobileView === 'split' ? '50% Osztott nézet' : 'Teljes lista ▼'}
                            </span>
                        </div>
                    </div>

                    {/* Compact in-sheet search bar when mobileView === 'list' */}
                    {mobileView === 'list' && (
                        <div className="bg-white px-3 sm:px-4 py-2 border-b border-[#e7e8ec] shrink-0 space-y-2">
                            <div className="bg-white border border-[#d8d9e0] rounded-[8px] flex items-center px-3 py-1.5 w-full focus-within:border-[#002664] transition-colors">
                                <input
                                    type="text"
                                    placeholder="Gyógyszertár neve, címe..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="font-['Ubuntu',sans-serif] text-[14px] text-[#002664] placeholder-[#62788f] bg-transparent outline-none flex-1 leading-normal"
                                />
                                <div className="size-[20px] shrink-0 ml-1.5 flex items-center justify-center text-[#002664]">
                                    <span className="material-symbols-rounded text-[20px]">search</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[12px]">
                                <button
                                    type="button"
                                    onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                                    className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-colors ${
                                        onlyOpenNow ? 'bg-[#002664] text-white border-[#002664]' : 'bg-white text-[#002664] border-[#d8d9e0]'
                                    }`}
                                >
                                    Most nyitva
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOnlyWeekendOpen(!onlyWeekendOpen)}
                                    className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-colors ${
                                        onlyWeekendOpen ? 'bg-[#002664] text-white border-[#002664]' : 'bg-white text-[#002664] border-[#d8d9e0]'
                                    }`}
                                >
                                    Hétvégén nyitva
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOnly24h(!only24h)}
                                    className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-colors ${
                                        only24h ? 'bg-[#002664] text-white border-[#002664]' : 'bg-white text-[#002664] border-[#d8d9e0]'
                                    }`}
                                >
                                    0-24
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="text-[12px] text-[#002664] underline whitespace-nowrap ml-1 cursor-pointer font-medium"
                                    >
                                        Törlés
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scrollable Sheet Content */}
                    <div className="flex-1 overflow-y-auto bg-[#f9f9fb] p-3 sm:p-4 space-y-3">
                        {/* Info cards scroll naturally with list */}
                        {renderInfoCards(true)}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-8 gap-2">
                                <span className="loading loading-spinner loading-md text-[#002664]"></span>
                                <span className="text-xs text-[#62788f]">Gyógyszertárak betöltése...</span>
                            </div>
                        ) : (
                            <>
                                {/* Result count title */}
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h2 className="font-['Ubuntu',sans-serif] font-medium text-[16px] text-[#002664]">
                                        {visiblePharmacies.length} BENU gyógyszertár a térképen
                                    </h2>
                                    {visiblePharmacies.length !== filteredPharmacies.length && (
                                        <button
                                            type="button"
                                            onClick={handleShowAll}
                                            className="text-[13px] text-[#002664] hover:text-[#378509] font-medium underline cursor-pointer whitespace-nowrap"
                                            title="Az összes gyógyszertár mutatása a térképen"
                                        >
                                            Összes ({filteredPharmacies.length} db)
                                        </button>
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
                                    <div className="bg-white rounded-[16px] p-6 text-center text-[#62788f] shadow-sm">
                                        Nincs találat a kiválasztott szűrők alapján vagy a látható térképi területen.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
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
