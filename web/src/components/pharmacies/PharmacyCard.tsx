/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként látni szeretném egy gyógyszertár alapvető adatait (név, cím,
 * nyitvatartás, elérhetőség) egy listaelemként, hogy kiválaszthassam a számomra
 * legmegfelelőbbet.
 * 
 * FUNKCIÓK:
 * - Gyógyszertár adatainak megjelenítése.
 * - Nyitvatartási státusz (Nyitva/Zárva) számítása és megjelenítése.
 * - "Mutasd térképen" gomb, amely a térképen az adott patikára ugrik.
 * - Kiválasztott állapot vizuális jelzése.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - Parent: PharmaciesPage
 */

import React from 'react';
import { Pharmacy } from '@/types';

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, isSelected, onSelect }) => {
    return (
        <div
            className={`card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-transparent'}`}
            onClick={() => onSelect(pharmacy.id)}
        >
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                    <h3 className="card-title text-base font-bold">{pharmacy.nev}</h3>
                    {/* Placeholder for "Open/Closed" badge - needs logic */}
                    <div className="badge badge-success badge-sm badge-outline">Nyitva</div>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                    <span className="material-symbols-rounded text-sm align-middle mr-1">location_on</span>
                    {pharmacy.irsz} {pharmacy.telepules}, {pharmacy.cim}
                </p>

                <p className="text-sm text-gray-500">
                    <span className="material-symbols-rounded text-sm align-middle mr-1">call</span>
                    {pharmacy.telefon}
                </p>

                <div className="card-actions justify-end mt-2">
                    <button className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-red-500">
                        <span className="material-symbols-rounded text-lg">favorite</span>
                    </button>
                    <button className="btn btn-sm btn-ghost text-primary text-xs" onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to details
                    }}>
                        Részletek
                    </button>
                </div>
            </div>
        </div>
    );
};
