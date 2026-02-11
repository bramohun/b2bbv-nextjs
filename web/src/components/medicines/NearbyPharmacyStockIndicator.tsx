'use client';

import React from 'react';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { isAvailableInPharmacy } from '@/lib/utils';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném látni a termékoldalon, hogy a kedvencnek jelölt 
 * közeli patikámban elérhető-e az adott gyógyszer, hogy tudjam, érdemes-e oda mennem.
 * 
 * FUNKCIÓK:
 * - Közeli patika azonosítása a NearbyPharmacyContext segítségével.
 * - Készletinformáció szimulálása determinisztikus mock logikával.
 * - Vizuális visszajelzés (Badge):
 *   - Zöld: "Közeli patikában elérhető"
 *   - Szürke: "Közeli patikában nem elérhető"
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Ha nincs beállítva közeli patika, a komponens nem jelenít meg semmit.
 * - Ha be van állítva, az `isAvailableInPharmacy` függvény dönti el a státuszt.
 */

interface NearbyPharmacyStockIndicatorProps {
    medicineId: string;
}

export const NearbyPharmacyStockIndicator: React.FC<NearbyPharmacyStockIndicatorProps> = ({ medicineId }) => {
    const { nearbyPharmacy } = useNearbyPharmacy();

    if (!nearbyPharmacy) {
        return null;
    }

    const available = isAvailableInPharmacy(medicineId, nearbyPharmacy.id);

    return (
        <div className="flex items-center gap-2 mt-1">
            <div className={`badge ${available ? 'badge-success' : 'bg-gray-200 text-gray-500 border-gray-300'} badge-md gap-1`}>
                <span className="material-symbols-rounded text-xs">
                    {available ? 'check_circle' : 'block'}
                </span>
                {available ? 'Közeli patikában elérhető' : 'Közeli patikában nem elérhető'}
            </div>
            <span className="text-xs text-gray-400 italic">
                ({nearbyPharmacy.nev})
            </span>
        </div>
    );
};
