/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként keresni szeretnék a gyógyszertárak között, látni azok
 * elhelyezkedését térképen és listában, hogy megtaláljam a hozzám legközelebbi
 * vagy egy adott készítménnyel rendelkező patikát.
 * 
 * FUNKCIÓK:
 * - Gyógyszertár kereső (cím, név, város alapján).
 * - Kétnézetes megjelenítés:
 *   - Térkép nézet (Map View): Interaktív térkép jelölőkkel.
 *   - Lista nézet (List View): Részletes kártyák a patikák adataival.
 * - Reszponzív váltó gomb mobil nézetben (Térkép/Lista).
 * - Térkép automatikus pozícionálása a kiválasztott gyógyszertárra.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Az adatok (/api/pharmacies) betöltése után a Leaflet térkép inicializálódik.
 * - Kereséskor a találati lista és a térképi markerek is szűrésre kerülnek.
 * - Kártyára kattintva a térkép az adott patikára fókuszál.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/components/pharmacies/PharmacyMap.tsx: Térkép komponens
 * - src/components/pharmacies/PharmacyCard.tsx: Patika kártya
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Pharmacy } from '@/types';
import { PharmacyCard } from '@/components/pharmacies/PharmacyCard';

// Dynamically import the Map component with no SSR, as Leaflet needs window object
const PharmacyMap = dynamic(() => import('@/components/pharmacies/PharmacyMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-base-200 animate-pulse flex items-center justify-center text-gray-400">Térkép betöltése...</div>
});

export default function PharmaciesPage() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);

    // Map state
    const [mapCenter, setMapCenter] = useState<[number, number]>([47.1625, 19.5033]);
    const [mapZoom, setMapZoom] = useState(7);
    const [showMapMobile, setShowMapMobile] = useState(false);

    useEffect(() => {
        async function fetchPharmacies() {
            try {
                const response = await fetch('/api/pharmacies');
                const data = await response.json();
                setPharmacies(data);
            } catch (error) {
                console.error('Failed to load pharmacies:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPharmacies();
    }, []);

    const filteredPharmacies = useMemo(() => {
        return pharmacies.filter(pharmacy =>
            pharmacy.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.telepules.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.cim.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pharmacies, searchTerm]);

    const handleSelectPharmacy = (id: string) => {
        setSelectedPharmacyId(id);
        const pharmacy = pharmacies.find(p => p.id === id);
        if (pharmacy && pharmacy.latitude && pharmacy.longitude) {
            setMapCenter([pharmacy.latitude, pharmacy.longitude]);
            setMapZoom(15);
            // On mobile, switch to map view when selected
            if (window.innerWidth < 1024) {
                setShowMapMobile(true);
            }
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col"> {/* Full height minus navbar */}

            {/* Header & Filter */}
            <div className="flex-none mb-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gyógyszertárak</h1>
                    {/* Mobile View Toggler */}
                    <div className="lg:hidden join">
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

                <label className="input input-bordered flex items-center gap-2 max-w-md">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Keresés név, cím vagy település alapján..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="material-symbols-rounded text-gray-400">search</span>
                </label>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 h-full">

                {/* List Panel */}
                <div className={`
            lg:w-1/3 xl:w-1/4 overflow-y-auto pr-2 space-y-3 pb-20
            ${showMapMobile ? 'hidden lg:block' : 'block h-full'}
        `}>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-gray-500 mb-2">{filteredPharmacies.length} találat</div>
                            {filteredPharmacies.slice(0, 50).map((pharmacy) => ( // Limit rendering for performance
                                <PharmacyCard
                                    key={pharmacy.id}
                                    pharmacy={pharmacy}
                                    isSelected={selectedPharmacyId === pharmacy.id}
                                    onSelect={handleSelectPharmacy}
                                />
                            ))}
                            {filteredPharmacies.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nincs találat.
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Map Panel */}
                <div className={`
            lg:w-2/3 xl:w-3/4 bg-base-100 rounded-box shadow-inner overflow-hidden relative z-0
            ${!showMapMobile ? 'hidden lg:block' : 'block h-full'}
        `}>
                    {/* The Map */}
                    <PharmacyMap
                        pharmacies={filteredPharmacies}
                        center={mapCenter}
                        zoom={mapZoom}
                        selectedPharmacyId={selectedPharmacyId}
                        onSelectPharmacy={handleSelectPharmacy}
                    />
                </div>

            </div>
        </div>
    );
}
