'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '@/types';

interface Subscription {
    tkSzam: string;
    name: string;
    status: string;
    subscribedAt: string;
}

interface NotificationContextType {
    subscriptions: Subscription[];
    subscribe: (medicine: Medicine) => void;
    unsubscribe: (tkSzam: string) => void;
    isSubscribed: (tkSzam: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('medicine_subscriptions');
        if (saved) {
            try {
                setSubscriptions(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse subscriptions', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('medicine_subscriptions', JSON.stringify(subscriptions));
    }, [subscriptions]);

    const subscribe = (medicine: { tkSzam: string; nev?: string; name?: string; status: string }) => {
        setSubscriptions(prev => {
            if (prev.some(s => s.tkSzam === medicine.tkSzam)) return prev;
            return [...prev, {
                tkSzam: medicine.tkSzam,
                name: medicine.nev || medicine.name || 'Ismeretlen',
                status: medicine.status,
                subscribedAt: new Date().toISOString()
            }];
        });
    };

    const unsubscribe = (tkSzam: string) => {
        setSubscriptions(prev => prev.filter(s => s.tkSzam !== tkSzam));
    };

    const isSubscribed = (tkSzam: string) => {
        return subscriptions.some(s => s.tkSzam === tkSzam);
    };

    return (
        <NotificationContext.Provider value={{ subscriptions, subscribe, unsubscribe, isSubscribed }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
