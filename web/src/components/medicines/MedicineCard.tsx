'use client';

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
 * - Adatok dinamikus megjelenítése: A szülő komponenstől kapott beállítások alapján a mezők elrejtése/megjelenítése.
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
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { formatDate } from '@/lib/utils';

interface MedicineCardProps {
    medicine: Medicine;
    visibleFields?: Record<string, boolean>; // Make it optional for backward compatibility
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, visibleFields }) => {
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const subscribed = isSubscribed(medicine.tkSzam);
    const favorit = isFavorite(medicine.tkSzam);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    const handleSubscription = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        if (subscribed) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
        }
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        if (favorit) {
            removeFavorite(medicine.tkSzam);
        } else {
            addFavorite(medicine);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">
            {/* Image section removed by user request */}

            <div className="card-body p-5">
                <div className="flex justify-between items-center mb-2">
                    {(!visibleFields || visibleFields.status) && (
                        <div className={`badge ${getStatusColor(medicine.status)} font-semibold`}>
                            {medicine.status}
                        </div>
                    )}
                </div>

                <h2 className="card-title text-lg leading-tight min-h-[3rem] line-clamp-2">
                    <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="hover:text-primary transition-colors">
                        {medicine.nev}
                    </Link>
                </h2>

                <div className="text-sm text-gray-500 mb-2 space-y-1">
                    {(!visibleFields || visibleFields.tkSzam) && (
                        <div className="flex justify-between">
                            <span>TK:</span>
                            <span className="font-mono text-xs font-semibold">{medicine.tkSzam}</span>
                        </div>
                    )}
                    {(!visibleFields || visibleFields.kiszereles) && (
                        <div className="flex justify-between">
                            <span>Kiszerelés:</span>
                            <span>{medicine.kiszereles}</span>
                        </div>
                    )}
                    {(!visibleFields || visibleFields.gyarto) && (
                        <div className="flex justify-between">
                            <span>Gyártó:</span>
                            <span className="truncate max-w-[120px]" title={medicine.gyarto}>{medicine.gyarto}</span>
                        </div>
                    )}
                    {(visibleFields?.packagingDetails) && (
                        <div className="flex justify-between">
                            <span>Csomagolás:</span>
                            <span className="truncate max-w-[120px]" title={medicine.packagingDetails}>{medicine.packagingDetails}</span>
                        </div>
                    )}
                    {(visibleFields?.dispensability) && (
                        <div className="flex justify-between">
                            <span>Kiadhatóság:</span>
                            <span>{medicine.dispensability}</span>
                        </div>
                    )}
                    {(visibleFields?.dispensabilitySub) && (
                        <div className="flex justify-between">
                            <span>Kiad. Alcsop.:</span>
                            <span>{medicine.dispensabilitySub}</span>
                        </div>
                    )}
                    {(visibleFields?.safetyFeatures) && (
                        <div className="flex justify-between">
                            <span>Biztonsági E.:</span>
                            <span>{medicine.safetyFeatures}</span>
                        </div>
                    )}
                    {(visibleFields?.authorizationDate) && (
                        <div className="flex justify-between">
                            <span>Eng. Dátum:</span>
                            <span>{medicine.authorizationDate}</span>
                        </div>
                    )}
                    {(visibleFields?.lastUpdate) && (
                        <div className="flex justify-between">
                            <span>Utolsó friss.:</span>
                            <span>{formatDate(medicine.lastUpdate)}</span>
                        </div>
                    )}
                </div>

                <div className="divider my-2"></div>

                <div className="card-actions justify-between items-center mt-auto">
                    <div className="flex gap-2">
                        <button
                            className={`btn btn-circle btn-sm ${favorit ? 'btn-active bg-warning text-warning-content border-warning' : 'btn-ghost text-gray-400 hover:text-warning'}`}
                            onClick={handleFavorite}
                            title={favorit ? "Eltávolítás a kedvencekből" : "Kedvencekhez"}
                        >
                            <span className={`material-symbols-rounded ${favorit ? 'fill-1' : ''}`}>star</span>
                        </button>
                        <button
                            className={`btn btn-circle btn-sm ${subscribed ? 'btn-primary' : 'btn-ghost text-gray-400 hover:text-info'}`}
                            onClick={handleSubscription}
                            title={subscribed ? "Leiratkozás" : "Értesítés kérése"}
                        >
                            <span className="material-symbols-rounded">
                                {subscribed ? 'notifications_active' : 'notifications'}
                            </span>
                        </button>
                    </div>
                    <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="btn btn-primary btn-sm">
                        Részletek
                    </Link>
                </div>
            </div>
        </div>
    );
};
