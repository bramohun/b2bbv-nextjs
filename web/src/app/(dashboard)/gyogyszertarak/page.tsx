/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként keresni szeretnék a gyógyszertárak között, látni azok
 * elhelyezkedését térképen és listában, hogy megtaláljam a hozzám legközelebbi
 * vagy egy adott készítménnyel rendelkező patikát.
 * 
 * FUNKCIÓK:
 * - Gyógyszertár kereső (cím, név, város alapján).
 * - Kétnézetes megjelenítés:
 *   - Térkép nézet (Map View): Interaktív térkép jelölőkkel.
 *   - Lista nézet (List View): Részletes kártyák a patikák adataival.
 * - Reszponzív váltó gomb mobil nézetben (Térkép/Lista).
 * - Térkép automatikus pozícionálása a kiválasztott gyógyszertárra.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Az adatok (/api/pharmacies) betöltése után a Leaflet térkép inicializálódik.
 * - Kereséskor a találati lista és a térképi markerek is szűrésre kerülnek.
 * - Kártyára kattintva a térkép az adott patikára fókuszál.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/components/pharmacies/PharmacyMap.tsx: Térkép komponens
 * - src/components/pharmacies/PharmacyCard.tsx: Patika kártya
 */

'use client';

import { Suspense } from 'react';
import { PharmacyFinder } from '@/components/pharmacies/PharmacyFinder';

export default function PharmaciesPage() {
    return (
        <div className="h-[calc(100vh-64px)]"> {/* Full height minus navbar */}
            <Suspense fallback={<div className="h-full w-full bg-base-200 animate-pulse flex items-center justify-center text-gray-400">Gyógyszertárak betöltése...</div>}>
                <PharmacyFinder />
            </Suspense>
        </div>
    );
}
