'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - HELYETTESÍTŐ GYÓGYSZEREK TÁBLÁZAT
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez a komponens azonos vagy rokon hatóanyagú, elérhető alternatív gyógyszereket
 * jelenít meg az adatlapon. Kiemelten fontos hiánycikk vagy megszűnt készítmény
 * esetén, amikor az orvosnak gyors terápiás helyettesítést kell találnia.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként szeretném látni a kiválasztott gyógyszerrel megegyező hatóanyagú,
 *   de jelenleg elérhető készítményeket, hogy azonnal helyettesíthessem a hiányzó szert.
 * - Orvosként látni szeretném a helyettesítő termékek elérhetőségét a kedvenc/közeli
 *   patikámban is, hogy a páciens garantáltan kiválthassa a felírt receptet.
 * - Felhasználóként szeretném közvetlenül menteni vagy részleteit megnyitni a javasolt
 *   helyettesítő készítménynek.
 * - Orvosként mobil nézetben (<768px) szeretném, ha a helyettesítő készítmények
 *   horizontálisan görgetendő táblázat helyett érintésbarát mobil kártyákon jelennének meg.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - src/app/(dashboard)/gyogyszerek/adatlap/page.tsx: Gyógyszer adatlap felület
 * - NearbyPharmacyContext: Közeli patika elérhetőség lekérése
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.2.2, 4.2.2.6)
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { isAvailableInPharmacy, getMedicinePharmacyStockStatus } from '@/lib/utils';
import { MedicineStockBadge } from './MedicineStockBadge';
import { FavoriteRemovalModal } from './FavoriteRemovalModal';

interface SimilarMedicinesProps {
    substance: string;
    medicines: Medicine[];
}

export function SimilarMedicines({ substance, medicines }: SimilarMedicinesProps) {
    const { nearbyPharmacy } = useNearbyPharmacy();
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const [pendingRemovalMed, setPendingRemovalMed] = React.useState<Medicine | null>(null);

    if (medicines.length === 0) return null;

    const handleFavoriteToggle = (med: Medicine) => {
        if (isFavorite(med.tkSzam)) {
            if (isSubscribed(med.tkSzam)) {
                setPendingRemovalMed(med);
            } else {
                removeFavorite(med.tkSzam);
            }
        } else {
            addFavorite(med);
        }
    };

    const handleSubscriptionToggle = (med: Medicine) => {
        if (isSubscribed(med.tkSzam)) {
            unsubscribe(med.tkSzam);
        } else {
            subscribe(med);
            if (!isFavorite(med.tkSzam)) {
                addFavorite(med);
            }
        }
    };

    const confirmRemoval = () => {
        if (pendingRemovalMed) {
            removeFavorite(pendingRemovalMed.tkSzam);
            unsubscribe(pendingRemovalMed.tkSzam);
            setPendingRemovalMed(null);
        }
    };

    return (
        <div className="bg-white border border-[#e7e8ec] rounded-[16px] p-[24px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] mt-8 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-[12px]">
                    <div className="size-[24px] flex items-center justify-center shrink-0">
                        <img src="/assets/figma/38bf5ad3ce1d1b2b21785ece01507074f555c665.svg" alt="" className="size-[20px]" />
                    </div>
                    <h2 className="font-bold text-[#002664] text-[18px]">
                        Elérhető helyettesítő termékek{' '}
                        <span className="text-[#378509]">{substance}</span>{' '}
                        hatóanyaggal
                    </h2>
                </div>
            </div>

            <FavoriteRemovalModal
                isOpen={!!pendingRemovalMed}
                onClose={() => setPendingRemovalMed(null)}
                onConfirm={confirmRemoval}
            />

            {/* Mobil kártyás nézet (< 768px) */}
            <div className="md:hidden space-y-3">
                {medicines.map((med) => {
                    const availableInPharmacy = nearbyPharmacy ? isAvailableInPharmacy(med.tkSzam, nearbyPharmacy.id) : false;
                    const isFav = isFavorite(med.tkSzam);
                    const isSub = isSubscribed(med.tkSzam);

                    return (
                        <div key={med.tkSzam} className="p-3 bg-[#f9f9fb] rounded-xl border border-[#e7e8ec] flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-[6px] bg-[#e8f8e2] text-[#317907] px-[8px] py-[2px] rounded-[4px] font-medium text-[12px]">
                                    <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[14px]" />
                                    <span>Elérhető</span>
                                </span>
                                {nearbyPharmacy && (
                                    <MedicineStockBadge status={getMedicinePharmacyStockStatus(med.status, availableInPharmacy)} />
                                )}
                            </div>
                            <Link
                                href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
                                className="font-bold text-[#002664] hover:text-[#378509] transition-colors text-[15px]"
                            >
                                {med.nev}
                            </Link>
                            <div className="text-[13px] text-[#62788f]">
                                <span>{med.kiszereles}</span> • <span>{med.gyarto}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-[#e7e8ec]">
                                <div className="flex items-center gap-2">
                                    <button
                                        className={`size-[32px] rounded-[6px] flex items-center justify-center p-[4px] transition-colors cursor-pointer ${
                                            isFav ? 'bg-[#002664] border border-[#002664]' : 'bg-white border border-[#002664]'
                                        }`}
                                        onClick={() => handleFavoriteToggle(med)}
                                        title={isFav ? "Eltávolítás" : "Mentés"}
                                        aria-label="Mentés kedvencnek"
                                    >
                                        <img src={isFav ? "/assets/figma/0f46a8820ef14e70f1707a091b6a494ac0448773.svg" : "/assets/figma/944c7c49d7facfffc581f76fcabc2cff7a31b865.svg"} alt="" className="size-[18px]" />
                                    </button>
                                    <button
                                        className={`size-[32px] rounded-[6px] flex items-center justify-center p-[4px] transition-colors cursor-pointer ${
                                            isSub ? 'bg-[#002664] border border-[#002664]' : 'bg-white border border-[#002664]'
                                        }`}
                                        onClick={() => handleSubscriptionToggle(med)}
                                        title={isSub ? "Leiratkozás" : "Értesítés"}
                                        aria-label="Értesítés kérése"
                                    >
                                        <img src={isSub ? "/assets/figma/a490d8a3ba430f0d884765763912ceec677e0181.svg" : "/assets/figma/475a3a63bba1e5d0fe7309be1d8843540bbf7f88.svg"} alt="" className="size-[18px]" />
                                    </button>
                                </div>
                                <Link
                                    href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
                                    className="inline-flex items-center gap-1 text-[#002664] font-bold text-xs bg-white px-2.5 py-1.5 rounded border border-[#d8d9e0]"
                                >
                                    <span>Részletek</span>
                                    <img src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg" alt="" className="size-[14px]" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Asztali táblázat (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#f9f9fb] border-y border-[#e7e8ec] text-[#002664] font-bold text-[14px]">
                            <th className="px-[16px] py-[12px] text-left w-[320px]">Név</th>
                            <th className="px-[16px] py-[12px] text-left w-[240px]">Kiszerelés</th>
                            <th className="px-[16px] py-[12px] text-left w-[200px]">Gyártó</th>
                            <th className="px-[16px] py-[12px] text-left w-[130px]">Státusz</th>
                            <th className="px-[16px] py-[12px] text-left w-[140px]">Közeli Patika</th>
                            <th className="px-[16px] py-[12px] text-right w-[160px]">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med) => {
                            const availableInPharmacy = nearbyPharmacy ? isAvailableInPharmacy(med.tkSzam, nearbyPharmacy.id) : false;
                            const isFav = isFavorite(med.tkSzam);
                            const isSub = isSubscribed(med.tkSzam);

                            return (
                                <tr key={med.tkSzam} className="border-b border-[#e7e8ec] hover:bg-slate-50 transition-colors">
                                    <td className="px-[16px] py-[14px]">
                                        <Link
                                            href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
                                            className="font-bold text-[#002664] hover:text-[#378509] transition-colors leading-snug block"
                                        >
                                            {med.nev}
                                        </Link>
                                    </td>
                                    <td className="px-[16px] py-[14px] text-[14px] text-[#62788f]">
                                        {med.kiszereles}
                                    </td>
                                    <td className="px-[16px] py-[14px] text-[14px] text-[#62788f]">
                                        {med.gyarto}
                                    </td>
                                    <td className="px-[16px] py-[14px]">
                                        <span className="inline-flex items-center gap-[8px] bg-[#e8f8e2] text-[#317907] px-[10px] py-[4px] rounded-[4px] font-medium text-[14px] leading-none whitespace-nowrap">
                                            <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[16px] shrink-0" />
                                            <span>Elérhető</span>
                                        </span>
                                    </td>
                                    <td className="px-[16px] py-[14px]">
                                        {nearbyPharmacy ? (
                                            <MedicineStockBadge status={getMedicinePharmacyStockStatus(med.status, availableInPharmacy)} />
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Nincs patika</span>
                                        )}
                                    </td>
                                    <td className="px-[16px] py-[14px] text-right">
                                        <div className="flex items-center justify-end gap-[8px]">
                                            <button
                                                className={`size-[32px] rounded-[6px] flex items-center justify-center p-[4px] transition-colors cursor-pointer ${
                                                    isFav
                                                        ? 'bg-[#002664] border border-[#002664]'
                                                        : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                                                }`}
                                                onClick={() => handleFavoriteToggle(med)}
                                                title={isFav ? "Eltávolítás a mentettek közül" : "Mentés a listához"}
                                            >
                                                <img
                                                    src={isFav ? "/assets/figma/0f46a8820ef14e70f1707a091b6a494ac0448773.svg" : "/assets/figma/944c7c49d7facfffc581f76fcabc2cff7a31b865.svg"}
                                                    alt="Mentés"
                                                    className="size-[20px]"
                                                />
                                            </button>
                                            <button
                                                className={`size-[32px] rounded-[6px] flex items-center justify-center p-[4px] transition-colors cursor-pointer ${
                                                    isSub
                                                        ? 'bg-[#002664] border border-[#002664]'
                                                        : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                                                }`}
                                                onClick={() => handleSubscriptionToggle(med)}
                                                title={isSub ? "Leiratkozás" : "Értesítés kérése"}
                                            >
                                                <img
                                                    src={isSub ? "/assets/figma/a490d8a3ba430f0d884765763912ceec677e0181.svg" : "/assets/figma/475a3a63bba1e5d0fe7309be1d8843540bbf7f88.svg"}
                                                    alt="Értesítés"
                                                    className="size-[20px]"
                                                />
                                            </button>
                                            <Link
                                                href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
                                                className="inline-flex items-center gap-[4px] text-[#002664] hover:text-[#378509] font-bold text-[13px] ml-1 transition-colors"
                                            >
                                                <span>Részletek</span>
                                                <img src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg" alt="" className="size-[16px]" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
