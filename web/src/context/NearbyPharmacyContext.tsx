'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pharmacy } from '@/types';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék beállítani egy "Közeli gyógyszertárat", ami számomra
 * kiemelt fontosságú (pl. az orvosi rendelőmhöz legközelebbi), hogy gyorsan
 * elérhessem annak adatait a navigációs sávban.
 * 
 * FUNKCIÓK:
 * - Közeli gyógyszertár beállítása (setNearbyPharmacy).
 * - Közeli gyógyszertár törlése (clearNearbyPharmacy).
 * - Adatok perzisztenciája (localStorage - 'nearby_pharmacy' kulcs alatt).
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Egyszerre csak egy gyógyszertár jelölhető meg "közeli"-nek.
 * - Ha új gyógyszertárat jelölünk meg, az felülírja a korábbit.
 * - A Context API biztosítja, hogy a Navbar és a térkép/lista nézetek is azonnal
 *   értesüljenet a változásról.
 */

interface NearbyPharmacyContextType {
    nearbyPharmacy: Pharmacy | null;
    setNearbyPharmacy: (pharmacy: Pharmacy) => void;
    clearNearbyPharmacy: () => void;
    isNearby: (id: string) => boolean;
}

const NearbyPharmacyContext = createContext<NearbyPharmacyContextType | undefined>(undefined);

export function NearbyPharmacyProvider({ children }: { children: React.ReactNode }) {
    const [nearbyPharmacy, setNearbyPharmacyState] = useState<Pharmacy | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('nearby_pharmacy');
        if (saved) {
            try {
                setNearbyPharmacyState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse nearby pharmacy', e);
            }
        }
    }, []);

    const setNearbyPharmacy = (pharmacy: Pharmacy) => {
        setNearbyPharmacyState(pharmacy);
        localStorage.setItem('nearby_pharmacy', JSON.stringify(pharmacy));
    };

    const clearNearbyPharmacy = () => {
        setNearbyPharmacyState(null);
        localStorage.removeItem('nearby_pharmacy');
    };

    const isNearby = (id: string) => {
        return nearbyPharmacy?.id === id;
    };

    return (
        <NearbyPharmacyContext.Provider value={{ nearbyPharmacy, setNearbyPharmacy, clearNearbyPharmacy, isNearby }}>
            {children}
        </NearbyPharmacyContext.Provider>
    );
}

export function useNearbyPharmacy() {
    const context = useContext(NearbyPharmacyContext);
    if (context === undefined) {
        throw new Error('useNearbyPharmacy must be used within a NearbyPharmacyProvider');
    }
    return context;
}
