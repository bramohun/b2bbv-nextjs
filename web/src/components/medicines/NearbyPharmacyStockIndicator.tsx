'use client';

import React from 'react';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { getNearbyPharmacyStatusUpdate, isAvailableInPharmacy } from '@/lib/utils';

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
 * - Státuszjelző badge megjelenítése (pl. Elérhető - Zöld, Készlethiány - Sárga).
 * - **UTOLSÓ FRISSÍTÉS IDŐPONTJA**: A státusz mellett megjelenik az utolsó módosítás legutóbbi időpontja is, hogy a felhasználó tudja, mennyire friss az adat.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Ha nincs beállítva közeli patika, a komponens nem jelenít meg semmit.
 * - Ha be van állítva, az `isAvailableInPharmacy` függvény dönti el a státuszt, a `getNearbyPharmacyStatusUpdate` pedig az időpontot.
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
    const lastUpdate = getNearbyPharmacyStatusUpdate(medicineId, nearbyPharmacy.id, '');

    return (
        <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-2">
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
            <div className="text-[10px] text-gray-400 pl-1 flex items-center gap-1">
                <span className="material-symbols-rounded text-[12px]">schedule</span>
                Frissítve: {lastUpdate}
            </div>
        </div>
    );
};
