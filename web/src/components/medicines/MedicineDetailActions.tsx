'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként a termék adatlapján szeretném kezelni a kedvenc státuszt
 * és az értesítés feliratkozást.
 * 
 * FUNKCIÓK:
 * - Kedvencekhez adás / eltávolítás.
 * - Értesítés kérése / lemondása.
 * - Kedvenc eltávolítása esetén figyelmeztetés, ha értesítés is aktív.
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
        <div className="card-actions justify-start md:justify-end">
            <FavoriteRemovalModal
                isOpen={isRemovalWarningOpen}
                onClose={() => setIsRemovalWarningOpen(false)}
                onConfirm={confirmRemoval}
            />
            <button
                className={`btn gap-2 ${favorit ? 'btn-active bg-warning text-warning-content border-warning' : 'btn-outline border-base-300'}`}
                onClick={handleFavorite}
            >
                <span className={`material-symbols-rounded ${favorit ? 'fill-1' : ''}`}>star</span>
                {favorit ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez'}
            </button>
            <button
                className={`btn gap-2 ${subscribed ? 'btn-primary' : 'btn-outline border-base-300'}`}
                onClick={handleSubscription}
            >
                <span className="material-symbols-rounded">
                    {subscribed ? 'notifications_active' : 'notifications'}
                </span>
                {subscribed ? 'Értesítés törlése' : 'Értesítés kérése'}
            </button>
        </div>
    );
};
