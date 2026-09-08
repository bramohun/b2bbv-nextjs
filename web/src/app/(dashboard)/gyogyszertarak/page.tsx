/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZERTÁRAK OLDAL
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A portál önálló Gyógyszertárak oldala (/gyogyszertarak), amely a Figma terv
 * (Desktop / Gyógyszertár, node: 13385:228895) szerinti teljes képernyős,
 * kétpaneles patikakereső felületet jeleníti meg a felső navigációs sáv (Navbar)
 * és az alsó lábléc (Footer) között.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként / szakemberként szeretnék földrajzilag és nyitvatartás szerint
 *   keresni a magyarországi BENU gyógyszertárak között.
 * - Felhasználóként szeretném a térképes és a listás megjelenítést egyszerre
 *   látni a képernyőn, hogy gyorsan kiválaszthassam a legközelebbi patikát.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszertár kereső modul (PharmacyFinder.tsx)
 * - Térkép komponens (PharmacyMap.tsx)
 * - Részletes patika adatlap modal (PharmacyDetailModal.tsx)
 * - Globális navigáció (Navbar.tsx) és lábléc (Footer.tsx)
 * - Funkcionális specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.3.1)
 * ============================================================================
 */

'use client';

import { Suspense } from 'react';
import { PharmacyFinder } from '@/components/pharmacies/PharmacyFinder';

export default function PharmaciesPage() {
    return (
        <div className="h-[calc(100vh-73px-60px)] min-h-[650px] w-full flex flex-col bg-white">
            <Suspense fallback={
                <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center text-[#62788f]">
                    Gyógyszertárak betöltése...
                </div>
            }>
                <PharmacyFinder />
            </Suspense>
        </div>
    );
}
