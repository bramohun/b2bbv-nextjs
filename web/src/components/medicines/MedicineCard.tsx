/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként látni szeretném egy gyógyszer főbb adatait (név, státusz,
 * ár, kiszerelés) egy kompakt kártyán, hogy gyorsan dönthessek a részletek
 * megtekintéséről vagy a kosárba tételről.
 * 
 * FUNKCIÓK:
 * - Gyógyszer adatainak megjelenítése (Név, Ár, Kiszerelés, Gyártó).
 * - Státuszjelző badge megjelenítése (pl. Elérhető - Zöld, Készlethiány - Sárga).
 * - "Részletek" gomb, amely a termék adatlapjára navigál.
 * - Kedvencekhez adás és értesítés kérése gombok (Jelenleg csak UI elemek).
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/types/index.ts: Medicine interfész
 * - Parent: MedicinesPage (src/app/(dashboard)/medicines/page.tsx)
 */

import React from 'react';
import { Medicine } from '@/types';
import Link from 'next/link';

interface MedicineCardProps {
    medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">
            {/* Image section removed by user request */}

            <div className="card-body p-5">
                <div className="flex justify-between items-center mb-2">
                    <div className={`badge ${getStatusColor(medicine.status)} font-semibold`}>
                        {medicine.status}
                    </div>
                </div>

                <h2 className="card-title text-lg leading-tight min-h-[3rem] line-clamp-2">
                    <Link href={`/medicines/${medicine.tkSzam}`} className="hover:text-primary transition-colors">
                        {medicine.nev}
                    </Link>
                </h2>

                <div className="text-sm text-gray-500 mb-2 space-y-1">
                    <div className="flex justify-between">
                        <span>TK:</span>
                        <span className="font-mono text-xs font-semibold">{medicine.tkSzam}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Kiszerelés:</span>
                        <span>{medicine.kiszereles}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Gyártó:</span>
                        <span className="truncate max-w-[120px]" title={medicine.gyarto}>{medicine.gyarto}</span>
                    </div>
                </div>

                <div className="divider my-2"></div>

                <div className="card-actions justify-between items-center mt-auto">
                    <div className="flex gap-2">
                        <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-warning" title="Kedvencekhez">
                            <span className="material-symbols-rounded">star</span>
                        </button>
                        <button className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-info" title="Értesítés">
                            <span className="material-symbols-rounded">notifications</span>
                        </button>
                    </div>
                    <Link href={`/medicines/${medicine.tkSzam}`} className="btn btn-primary btn-sm">
                        Részletek
                    </Link>
                </div>
            </div>
        </div>
    );
};
