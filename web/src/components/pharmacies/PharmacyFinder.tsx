/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként keresni szeretnék a gyógyszertárak között, látni azok
 * elhelyezkedését térképen és listában. Ezt a felületet használom a fő
 * gyógyszertár kereső oldalon és a termék-specifikus készlet modalban is.
 * 
 * FUNKCIÓK:
 * - Gyógyszertár kereső (cím, név, város alapján).
 * - Kétnézetes megjelenítés (Térkép / Lista).
 * - Filterezhető patika lista (kereső, térkép láthatóság, nyitvatartás alapján).
 * - Speciális filterek: Most nyitva, Hétvégén nyitva, 0-24 órában nyitva.
 * - Térkép szinkronizáció: a lista csak a térképen látható patikákat mutatja.
 * - Találati számok kijelzése: összes találat vs. térképen látható találatok.
 * - [Mutasd az összest] funkció: térkép visszaállítása az összes találat megjelenítéséhez.
 * 
 * PARAMÉTEREK:
 * - filterIds?: Csak ezeket a patikákat mutassa (pl. készleten lévők).
 * - title?: Egyedi címsor a kereső felett.
 * - description?: Opcionális leírás a cím alatt.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Pharmacy } from '@/types';
import { PharmacyCard } from './PharmacyCard';

const PharmacyMap = dynamic(() => import('./PharmacyMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-base-200 animate-pulse flex items-center justify-center text-gray-400">Térkép betöltése...</div>
});

interface PharmacyFinderProps {
    filterIds?: string[];
    title?: string;
    description?: string;
}

export const PharmacyFinder: React.FC<PharmacyFinderProps> = ({
    filterIds,
    title = "Gyógyszertárak",
    description
}) => {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
    const [visiblePharmacyIds, setVisiblePharmacyIds] = useState<string[] | null>(null);

    // Filters state
    const [onlyOpenNow, setOnlyOpenNow] = useState(false);
    const [onlyWeekendOpen, setOnlyWeekendOpen] = useState(false);
    const [only24h, setOnly24h] = useState(false);

    // Map state
    const [mapCenter, setMapCenter] = useState<[number, number]>([47.1625, 19.5033]);
    const [mapZoom, setMapZoom] = useState(7);
    const [showMapMobile, setShowMapMobile] = useState(false);

    useEffect(() => {
        async function fetchPharmacies() {
            try {
                const response = await fetch('/api/pharmacies');
                const data = await response.json();

                // If filterIds is provided, only keep those
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

    const filteredPharmacies = useMemo(() => {
        let filtered = pharmacies.filter(pharmacy =>
            pharmacy.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.telepules.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.cim.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const now = new Date();
        const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const isCurrentlyOpen = (p: Pharmacy) => {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const openKey = `${dayNames[currentDay]}Open` as keyof Pharmacy;
            const closeKey = `${dayNames[currentDay]}Close` as keyof Pharmacy;

            const openTime = p[openKey] as string;
            const closeTime = p[closeKey] as string;

            if (!openTime || !closeTime) return false;
            return currentTime >= openTime && currentTime <= closeTime;
        };

        const isWeekendOpen = (p: Pharmacy) => {
            return (!!p.saturdayOpen && !!p.saturdayClose) || (!!p.sundayOpen && !!p.sundayClose);
        };

        const is24h = (p: Pharmacy) => {
            // Check if any day has 00:00 - 24:00 or similar.
            // Based on data analysis, we'll look for 00:00 as open and 23:59 or 24:00 as close, or full coverage.
            // Since we don't have clear 24h indicators in mock data yet, we implement the check.
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
        const pharmacy = pharmacies.find(p => p.id === id);
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
        <div className="flex flex-col h-full bg-base-100 overflow-hidden">
            {/* Header & Filter */}
            <div className="flex-none p-4 border-b border-base-200 relative z-10 bg-base-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>

                    {/* View Toggler (Mobile specific mostly, but reachable) */}
                    <div className="lg:hidden join self-end">
                        <button
                            className={`btn btn-sm join-item ${!showMapMobile ? 'btn-active btn-primary' : ''}`}
                            onClick={() => setShowMapMobile(false)}
                        >
                            Lista
                        </button>
                        <button
                            className={`btn btn-sm join-item ${showMapMobile ? 'btn-active btn-primary' : ''}`}
                            onClick={() => setShowMapMobile(true)}
                        >
                            Térkép
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Keresés név, cím vagy település alapján..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="material-symbols-rounded text-gray-400">search</span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`btn btn-sm rounded-full ${onlyOpenNow ? 'btn-primary' : 'btn-outline border-base-300'}`}
                            onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                        >
                            <span className="material-symbols-rounded text-sm">schedule</span>
                            Most nyitva
                        </button>
                        <button
                            className={`btn btn-sm rounded-full ${onlyWeekendOpen ? 'btn-primary' : 'btn-outline border-base-300'}`}
                            onClick={() => setOnlyWeekendOpen(!onlyWeekendOpen)}
                        >
                            <span className="material-symbols-rounded text-sm">calendar_month</span>
                            Hétvégén nyitva
                        </button>
                        <button
                            className={`btn btn-sm rounded-full ${only24h ? 'btn-primary' : 'btn-outline border-base-300'}`}
                            onClick={() => setOnly24h(!only24h)}
                        >
                            <span className="material-symbols-rounded text-sm">timer_10_alt_1</span>
                            0-24 órában nyitva
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row h-full">
                {/* List Panel */}
                <div className={`
                    lg:w-1/3 xl:w-1/4 overflow-y-auto p-4 space-y-3
                    ${showMapMobile ? 'hidden lg:block' : 'block h-full'}
                `}>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-gray-500 mb-4 flex flex-col gap-1">
                                <div>Összesen {filteredPharmacies.length} gyógyszertár</div>
                                {visiblePharmacies.length !== filteredPharmacies.length && (
                                    <>
                                        <div>a térképen és listában {visiblePharmacies.length} gyógyszertár.</div>
                                        <div className="mt-1">
                                            <button
                                                onClick={handleShowAll}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                [Mutasd az összest]
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            {visiblePharmacies.slice(0, 50).map((pharmacy) => (
                                <PharmacyCard
                                    key={pharmacy.id}
                                    pharmacy={pharmacy}
                                    isSelected={selectedPharmacyId === pharmacy.id}
                                    onSelect={handleSelectPharmacy}
                                />
                            ))}
                            {visiblePharmacies.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nincs találat a látható területen.
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Map Panel */}
                <div className={`
                    lg:w-2/3 xl:w-3/4 bg-base-200 lg:m-4 lg:rounded-box shadow-inner overflow-hidden relative z-0
                    ${!showMapMobile ? 'hidden lg:block' : 'block h-full lg:h-auto'}
                `}>
                    <PharmacyMap
                        pharmacies={filteredPharmacies}
                        center={mapCenter}
                        zoom={mapZoom}
                        selectedPharmacyId={selectedPharmacyId}
                        onSelectPharmacy={handleSelectPharmacy}
                        onVisiblePharmaciesChange={setVisiblePharmacyIds}
                    />
                </div>
            </div>
        </div>
    );
};
