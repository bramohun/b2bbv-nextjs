'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZER MOBIL KÁRTYA KOMPONENS
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez a komponens a gyógyszeradatok modern, mobilbarát kártyás megjelenítéséért
 * felel a Gyógyszerkereső oldalon (< 1024px képernyőszélesség esetén automatikusan,
 * vagy kézi nézetváltás esetén desktopon is).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként páciensvizit során szeretném egy kompakt kártyán látni a készítmény
 *   nevét, országos készletstátuszát és a jobb felső sarokban az utolsó frissítés pontos idejét.
 * - Orvosként szeretném látni a hatóanyagot, kiszerelést, gyártót és a törzskönyvi azonosítót (TK-szám)
 *   anélkül, hogy a részletes adatlapra kellene navigálnom vagy lenyitnám a másodlagos adatokat.
 * - Felhasználóként egy kattintással szeretném lenyitni a másodlagos adatokat
 *   (csomagolás, kiadhatóság, engedély dátuma).
 * - Felhasználóként közvetlenül a kártyáról szeretném a gyógyszert kedvencnek jelölni,
 *   hiányértesítésre feliratkozni, vagy megnyitni a részletes adatlapot.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszerkereső lista: /gyogyszerek
 * - Gyógyszer részletes adatlap: /gyogyszerek/adatlap?tk=...
 * - Kedvencek és Értesítések kezelése (FavoriteContext, NotificationContext)
 * - Közeli gyógyszertár készletindikátor (NearbyPharmacyStockIndicator)
 * - Törlés megerősítő modális ablak (FavoriteRemovalModal)
 * ============================================================================
 */

import React, { useState } from 'react';
import { Medicine } from '@/types';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { formatDate } from '@/lib/utils';
import { NearbyPharmacyStockIndicator } from './NearbyPharmacyStockIndicator';
import { FavoriteRemovalModal } from './FavoriteRemovalModal';

interface MedicineCardProps {
    medicine: Medicine;
    visibleFields?: Record<string, boolean>;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, visibleFields }) => {
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const subscribed = isSubscribed(medicine.tkSzam);
    const favorit = isFavorite(medicine.tkSzam);

    const [isRemovalWarningOpen, setIsRemovalWarningOpen] = useState(false);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    const handleSubscription = (e: React.MouseEvent) => {
        e.preventDefault();
        if (subscribed) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
            if (!favorit) {
                addFavorite(medicine);
            }
        }
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (favorit) {
            if (subscribed) {
                setIsRemovalWarningOpen(true);
            } else {
                removeFavorite(medicine.tkSzam);
            }
        } else {
            addFavorite(medicine);
        }
    };

    const confirmRemoval = () => {
        removeFavorite(medicine.tkSzam);
        unsubscribe(medicine.tkSzam);
        setIsRemovalWarningOpen(false);
    };

    const renderStatusBadge = () => {
        switch (medicine.status) {
            case 'Elérhető':
                return (
                    <span className="inline-flex items-center gap-[6px] bg-[#e8f8e2] text-[#317907] px-[8px] py-[3px] rounded-[4px] font-medium text-[13px] leading-none whitespace-nowrap">
                        <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[14px] shrink-0" />
                        <span>Elérhető</span>
                    </span>
                );
            case 'Készlethiány':
                return (
                    <span className="inline-flex items-center gap-[6px] bg-[#fff7ba] text-[#7a6c21] px-[8px] py-[3px] rounded-[4px] font-medium text-[13px] leading-none whitespace-nowrap">
                        <img src="/assets/figma/95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg" alt="" className="size-[14px] shrink-0" />
                        <span>Hiány</span>
                    </span>
                );
            case 'Megszűnt':
                return (
                    <span className="inline-flex items-center gap-[6px] bg-[#feeaed] text-[#b1174e] px-[8px] py-[3px] rounded-[4px] font-medium text-[13px] leading-none whitespace-nowrap">
                        <img src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg" alt="" className="size-[14px] shrink-0" />
                        <span>Megszűnt</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center bg-gray-100 text-gray-600 px-[8px] py-[3px] rounded-[4px] font-medium text-[13px] leading-none whitespace-nowrap">
                        {medicine.status || 'Ismeretlen'}
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-[16px] border border-[#e7e8ec] p-4 shadow-[0px_4px_16px_0px_rgba(0,26,72,0.04)] hover:shadow-[0px_10px_24px_0px_rgba(0,26,72,0.08)] transition-all flex flex-col justify-between">
            <FavoriteRemovalModal
                isOpen={isRemovalWarningOpen}
                onClose={() => setIsRemovalWarningOpen(false)}
                onConfirm={confirmRemoval}
            />

            <div>
                {/* 1. Fejléc: Státuszok & Utolsó frissítés */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                        {renderStatusBadge()}
                        <NearbyPharmacyStockIndicator medicineId={medicine.tkSzam} />
                    </div>
                    <span className="text-[12px] text-[#62788f] bg-[#f9f9fb] px-2 py-0.5 rounded border border-[#e7e8ec] whitespace-nowrap">
                        Utolsó frissítés: {formatDate(medicine.lastUpdate)}
                    </span>
                </div>

                {/* 2. Gyógyszernév */}
                <h3 className="mb-2">
                    <Link
                        href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(medicine.tkSzam)}`}
                        className="font-bold text-[#002664] text-[16px] hover:text-[#378509] transition-colors leading-snug block line-clamp-2"
                    >
                        {medicine.nev}
                    </Link>
                </h3>

                {/* 3. Elsődleges adatok */}
                <div className="space-y-1.5 text-[13px] text-[#62788f] mb-3">
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-[#62788f] shrink-0">Hatóanyag:</span>
                        <span className="font-medium text-[#002664] text-right truncate">
                            {medicine.activeSubstance || medicine.inn || '-'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-[#62788f] shrink-0">Kiszerelés:</span>
                        <span className="font-medium text-[#002664] text-right truncate">
                            {medicine.kiszereles || '-'}
                        </span>
                    </div>
                    {medicine.gyarto && (
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-[#62788f] shrink-0">Gyártó:</span>
                            <span className="font-medium text-[#002664] text-right truncate max-w-[200px]" title={medicine.gyarto}>
                                {medicine.gyarto}
                            </span>
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-[#62788f] shrink-0">Azonosító:</span>
                        <span className="font-mono font-medium text-[#002664] text-right truncate">
                            {medicine.tkSzam}
                        </span>
                    </div>
                </div>

                {/* 4. Lenyitható további adatok szekció */}
                {isDetailsExpanded && (
                    <div className="pt-2.5 pb-1 border-t border-[#e7e8ec] space-y-1.5 text-[12px] text-[#62788f] animate-fade-in">
                        {medicine.packagingDetails && (
                            <div className="flex items-start justify-between gap-2">
                                <span>Csomagolás:</span>
                                <span className="font-medium text-[#002664] text-right">{medicine.packagingDetails}</span>
                            </div>
                        )}
                        {medicine.dispensability && (
                            <div className="flex items-start justify-between gap-2">
                                <span>Kiadhatóság:</span>
                                <span className="font-medium text-[#002664] text-right">{medicine.dispensability}</span>
                            </div>
                        )}
                        {medicine.dispensabilitySub && (
                            <div className="flex items-start justify-between gap-2">
                                <span>Kiad. alcsoport:</span>
                                <span className="font-medium text-[#002664] text-right">{medicine.dispensabilitySub}</span>
                            </div>
                        )}
                        {medicine.safetyFeatures && (
                            <div className="flex items-start justify-between gap-2">
                                <span>Biztonsági elemek:</span>
                                <span className="font-medium text-[#002664] text-right">{medicine.safetyFeatures}</span>
                            </div>
                        )}
                        {medicine.authorizationDate && (
                            <div className="flex items-start justify-between gap-2">
                                <span>Engedély dátuma:</span>
                                <span className="font-medium text-[#002664] text-right">{medicine.authorizationDate}</span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    className="text-[12px] font-semibold text-[#002664] hover:text-[#378509] flex items-center gap-1 my-2 transition-colors cursor-pointer"
                >
                    <span>{isDetailsExpanded ? 'Kevesebb adat' : 'További adatok megjelenítése'}</span>
                    <span className="material-symbols-rounded text-sm">
                        {isDetailsExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
            </div>

            {/* 5. Alsó műveleti gombok */}
            <div className="pt-3 border-t border-[#e7e8ec] flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-2">
                    <button
                        className={`w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-[8px] flex items-center justify-center p-[6px] transition-colors cursor-pointer ${
                            favorit
                                ? 'bg-[#002664] border border-[#002664]'
                                : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                        }`}
                        onClick={handleFavorite}
                        title={favorit ? "Eltávolítás a mentettek közül" : "Mentés a listához"}
                        aria-label="Mentés kedvencnek"
                    >
                        <img
                            src={favorit ? "/assets/figma/0f46a8820ef14e70f1707a091b6a494ac0448773.svg" : "/assets/figma/944c7c49d7facfffc581f76fcabc2cff7a31b865.svg"}
                            alt="Mentés"
                            className="size-[20px] shrink-0 object-contain"
                        />
                    </button>
                    <button
                        className={`w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-[8px] flex items-center justify-center p-[6px] transition-colors cursor-pointer ${
                            subscribed
                                ? 'bg-[#002664] border border-[#002664]'
                                : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                        }`}
                        onClick={handleSubscription}
                        title={subscribed ? "Leiratkozás" : "Értesítés kérése"}
                        aria-label="Értesítés kérése"
                    >
                        <img
                            src={subscribed ? "/assets/figma/a490d8a3ba430f0d884765763912ceec677e0181.svg" : "/assets/figma/475a3a63bba1e5d0fe7309be1d8843540bbf7f88.svg"}
                            alt="Értesítés"
                            className="size-[20px] shrink-0 object-contain"
                        />
                    </button>
                </div>

                <Link
                    href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(medicine.tkSzam)}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#f0f4fa] hover:bg-[#002664] text-[#002664] hover:text-white font-bold text-[13px] transition-colors whitespace-nowrap"
                >
                    <span>Részletek</span>
                    <img src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg" alt="" className="size-[16px] shrink-0" />
                </Link>
            </div>
        </div>
    );
};
