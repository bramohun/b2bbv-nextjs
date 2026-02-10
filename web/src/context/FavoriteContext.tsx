'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '@/types';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném a számomra fontos gyógyszereket kedvencnek jelölni,
 * hogy később gyorsan elérhessem őket a listában anélkül, hogy értesítéseket
 * kapnék a változásaikról.
 * 
 * FUNKCIÓK:
 * - Gyógyszerek hozzáadása a kedvencekhez.
 * - Gyógyszerek eltávolítása a kedvencekből.
 * - Kedvenc státusz ellenőrzése (isFavorite).
 * - Adatok perzisztenciája (localStorage).
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A kedvenceket a `medicine_favorites` kulcs alatt tároljuk a localStorage-ban.
 * - Csak a legszükségesebb adatokat tároljuk (tkSzam, név, státusz).
 * - A Context API biztosítja az adatok elérhetőségét az egész alkalmazásban.
 */

interface Favorite {
    tkSzam: string;
    name: string;
    status: string;
    addedAt: string;
}

interface FavoriteContextType {
    favorites: Favorite[];
    addFavorite: (medicine: Medicine) => void;
    removeFavorite: (tkSzam: string) => void;
    isFavorite: (tkSzam: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('medicine_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('medicine_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (medicine: Medicine) => {
        setFavorites(prev => {
            if (prev.some(s => s.tkSzam === medicine.tkSzam)) return prev;
            return [...prev, {
                tkSzam: medicine.tkSzam,
                name: medicine.nev,
                status: medicine.status,
                addedAt: new Date().toISOString()
            }];
        });
    };

    const removeFavorite = (tkSzam: string) => {
        setFavorites(prev => prev.filter(s => s.tkSzam !== tkSzam));
    };

    const isFavorite = (tkSzam: string) => {
        return favorites.some(s => s.tkSzam === tkSzam);
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export function useFavorite() {
    const context = useContext(FavoriteContext);
    if (context === undefined) {
        throw new Error('useFavorite must be used within a FavoriteProvider');
    }
    return context;
}
