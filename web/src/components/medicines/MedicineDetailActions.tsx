'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZER ADATLAP AKCIÓK
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A gyógyszer adatlap fejlécében elhelyezkedő akciógombok, amelyek lehetővé teszik
 * a készítmény mentését a kedvencek közé, valamint készlethiány- és státuszértesítés
 * beállítását vagy lemondását.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként szeretném a számomra fontos gyógyszereket a mentett listámhoz adni,
 *   hogy a későbbiekben azonnal elérhessem őket a felületről.
 * - Orvosként szeretnék feliratkozni egy gyógyszer készletváltozásaira, hogy azonnal
 *   értesüljek a hiány bekövetkeztéről vagy megszűnéséről.
 * - Felhasználóként figyelmeztetést várok, ha egy aktív értesítéssel rendelkező
 *   gyógyszert próbálok törölni a mentettek közül.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - src/app/(dashboard)/gyogyszerek/adatlap/page.tsx: Gyógyszer adatlap
 * - FavoriteRemovalModal: Megerősítő párbeszédablak
 * - NotificationContext & FavoriteContext: Állapotkezelés
 * ============================================================================
 */

import React from 'react';
import { Medicine } from '@/types';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { FavoriteRemovalModal } from './FavoriteRemovalModal';

interface MedicineDetailActionsProps {
    medicine: Medicine;
}

export const MedicineDetailActions = ({ medicine }: MedicineDetailActionsProps) => {
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const subscribed = isSubscribed(medicine.tkSzam);
    const favorit = isFavorite(medicine.tkSzam);

    const [isRemovalWarningOpen, setIsRemovalWarningOpen] = React.useState(false);

    const handleSubscription = () => {
        if (subscribed) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
            // Ha feliratkozik, automatikusan kedvenc is lesz, ha még nem az
            if (!favorit) {
                addFavorite(medicine);
            }
        }
    };

    const handleFavorite = () => {
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

    return (
        <div className="flex flex-wrap items-center gap-[16px] justify-start md:justify-end">
            <FavoriteRemovalModal
                isOpen={isRemovalWarningOpen}
                onClose={() => setIsRemovalWarningOpen(false)}
                onConfirm={confirmRemoval}
            />
            <button
                className={`h-[48px] px-[20px] py-[12px] rounded-[8px] border border-[#002664] font-bold text-[16px] flex items-center justify-center gap-[8px] transition-colors cursor-pointer ${
                    favorit
                        ? 'bg-[#002664] text-white'
                        : 'bg-white text-[#002664] hover:bg-slate-50'
                }`}
                onClick={handleFavorite}
            >
                <img
                    src={favorit ? "/assets/figma/0f46a8820ef14e70f1707a091b6a494ac0448773.svg" : "/assets/figma/944c7c49d7facfffc581f76fcabc2cff7a31b865.svg"}
                    alt=""
                    className="size-[24px]"
                />
                <span>{favorit ? 'Mentve' : 'Mentés'}</span>
            </button>
            <button
                className={`h-[48px] px-[20px] py-[12px] rounded-[8px] border border-[#002664] font-bold text-[16px] flex items-center justify-center gap-[8px] transition-colors cursor-pointer ${
                    subscribed
                        ? 'bg-[#002664] text-white'
                        : 'bg-white text-[#002664] hover:bg-slate-50'
                }`}
                onClick={handleSubscription}
            >
                <img
                    src={subscribed ? "/assets/figma/a490d8a3ba430f0d884765763912ceec677e0181.svg" : "/assets/figma/475a3a63bba1e5d0fe7309be1d8843540bbf7f88.svg"}
                    alt=""
                    className="size-[24px]"
                />
                <span>{subscribed ? 'Értesítés törlése' : 'Értesítés kérése'}</span>
            </button>
        </div>
    );
};
