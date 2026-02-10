'use client';

import React from 'react';
import { Medicine } from '@/types';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';

interface MedicineDetailActionsProps {
    medicine: Medicine;
}

export const MedicineDetailActions = ({ medicine }: MedicineDetailActionsProps) => {
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const subscribed = isSubscribed(medicine.tkSzam);
    const favorit = isFavorite(medicine.tkSzam);

    const handleSubscription = () => {
        if (subscribed) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
        }
    };

    const handleFavorite = () => {
        if (favorit) {
            removeFavorite(medicine.tkSzam);
        } else {
            addFavorite(medicine);
        }
    };

    return (
        <div className="card-actions justify-end mt-4">
            <button
                className={`btn gap-2 ${favorit ? 'btn-active bg-warning text-warning-content border-warning' : 'btn-outline border-base-300'}`}
                onClick={handleFavorite}
            >
                <span className={`material-symbols-rounded ${favorit ? 'fill-1' : ''}`}>star</span>
                {favorit ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez'}
            </button>
            <button
                className={`btn gap-2 ${subscribed ? 'btn-active' : 'btn-primary'}`}
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
