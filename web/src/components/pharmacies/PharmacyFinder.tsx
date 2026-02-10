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
 * - Filterezhető patika lista.
 * - Térkép szinkronizáció.
 * 
 * PARAMÉTEREK:
 * - filterIds?: Csak ezeket a patikákat mutassa (pl. készleten lévők).
 * - title?: Egyedi címsor a kereső felett.
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
            if (window.innerWidth < 1024) {
                setShowMapMobile(true);
            }
        }
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

                <div className="mt-4">
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
                            <div className="text-sm text-gray-500 mb-2">{filteredPharmacies.length} találat</div>
                            {filteredPharmacies.slice(0, 50).map((pharmacy) => (
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
                    lg:w-2/3 xl:w-3/4 bg-base-200 lg:m-4 lg:rounded-box shadow-inner overflow-hidden relative z-0
                    ${!showMapMobile ? 'hidden lg:block' : 'block h-full lg:h-auto'}
                `}>
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
};
