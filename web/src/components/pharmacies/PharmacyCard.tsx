/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként látni szeretném egy gyógyszertár alapvető adatait (név, cím,
 * nyitvatartás, elérhetőség) egy listaelemként, hogy kiválaszthassam a számomra
 * legmegfelelőbbet, és megjelölhessem mint "Közeli gyógyszertár".
 * 
 * FUNKCIÓK:
 * - Gyógyszertár adatainak megjelenítése.
 * - Nyitvatartási státusz (Nyitva/Zárva) és napi nyitvatartási idő (tól-ig) megjelenítése.
 * - "Mutasd térképen" gomb, amely a térképen az adott patikára ugrik.
 * - Kiválasztott állapot vizuális jelzése.
 * - "Közeli patikának jelölöm" gomb (Favorite / Home ikon).
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - Parent: PharmaciesPage
 * - Context: NearbyPharmacyContext
 */

import React, { useMemo } from 'react';
import { Pharmacy } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onViewDetails?: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, isSelected, onSelect, onViewDetails }) => {
    const { isNearby, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();
    const markedNearby = isNearby(pharmacy.id);

    const openingStatus = useMemo(() => getPharmacyOpeningStatus(pharmacy), [pharmacy]);

    return (
        <div
            className={`card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-transparent'} ${markedNearby ? 'bg-primary-focus bg-opacity-5' : ''}`}
            onClick={() => onSelect(pharmacy.id)}
        >
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <h3 className="card-title text-base font-bold">{pharmacy.nev}</h3>
                        {markedNearby && (
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Közeli gyógyszertár</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{openingStatus.hoursDisplay}</span>
                        {openingStatus.status === 'open' ? (
                            <div className="badge badge-success badge-sm badge-outline font-bold">Nyitva</div>
                        ) : openingStatus.status === 'closing_soon' ? (
                            <div className="badge badge-warning badge-sm badge-outline font-bold">Hamarosan zár</div>
                        ) : (
                            <div className="badge badge-error badge-sm badge-outline font-bold">Zárva</div>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                    <span className="material-symbols-rounded text-sm align-middle mr-1">location_on</span>
                    {pharmacy.irsz} {pharmacy.telepules}, {pharmacy.cim}
                </p>

                <p className="text-sm text-gray-500">
                    <span className="material-symbols-rounded text-sm align-middle mr-1">call</span>
                    {pharmacy.telefon}
                </p>

                <div className="card-actions justify-end mt-2 items-center">
                    <button
                        title={markedNearby ? "Közeli jelölés eltávolítása" : "Közeli patikának jelölöm"}
                        className={`btn btn-sm btn-circle ${markedNearby ? 'btn-primary' : 'btn-ghost text-gray-400 hover:text-primary'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (markedNearby) {
                                clearNearbyPharmacy();
                            } else {
                                setNearbyPharmacy(pharmacy);
                            }
                        }}
                    >
                        <span className={`material-symbols-rounded text-lg ${markedNearby ? 'fill-1' : ''}`}>
                            {markedNearby ? 'home' : 'add_location'}
                        </span>
                    </button>
                    <button className="btn btn-sm btn-ghost text-primary text-xs" onClick={(e) => {
                        e.stopPropagation();
                        if (onViewDetails) {
                            onViewDetails(pharmacy);
                        }
                    }}>
                        Részletek
                    </button>
                </div>
            </div>
        </div>
    );
};
