'use client';

import React from 'react';
import { Medicine } from '@/types';
import { useNotification } from '@/context/NotificationContext';

interface MedicineDetailActionsProps {
    medicine: Medicine;
}

export const MedicineDetailActions = ({ medicine }: MedicineDetailActionsProps) => {
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const subscribed = isSubscribed(medicine.tkSzam);

    const handleSubscription = () => {
        if (subscribed) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
        }
    };

    return (
        <div className="card-actions justify-end mt-4">
            <button className="btn btn-outline gap-2">
                <span className="material-symbols-rounded">star</span>
                Kedvencekhez
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
