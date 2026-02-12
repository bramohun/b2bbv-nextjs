/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném követni a kiválasztott közeli patikám készletének 
 * változásait, vagy keresni egyet a térképen, ha még nincs kiválasztva.
 * 
 * FUNKCIÓK:
 * - Kiválasztott patika nézet:
 *   - Patika neve és statisztikai összesítő (ma/tegnap) a patika készletére.
 *   - TOP 12 változás a patikában (Státusz, Név, Dátum oszlopokkal).
 *   - Link az összes gyógyszertári változáshoz.
 * - Patika kiválasztása nézet (Fallback):
 *   - Interaktív térkép (PharmacyMap) a patikák böngészéséhez.
 *   - Tájékoztató üzenet a kiválasztás előnyeiről.
 *   - Link a gyógyszertárkereső oldalra.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/context/NearbyPharmacyContext.tsx
 * - src/components/pharmacies/PharmacyMap.tsx
 */

'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Pharmacy, Medicine } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { formatDate, isAvailableInPharmacy } from '@/lib/utils';

// Dynamic import for PharmacyMap to avoid SSR issues
const PharmacyMap = dynamic(() => import('../pharmacies/PharmacyMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-base-200 animate-pulse rounded flex items-center justify-center">Térkép betöltése...</div>
});

interface PharmacyStockWidgetProps {
    medicines: Medicine[];
    pharmacies: Pharmacy[];
}

export function PharmacyStockWidget({ medicines, pharmacies }: PharmacyStockWidgetProps) {
    const { nearbyPharmacy } = useNearbyPharmacy();

    // If a nearby pharmacy is selected, show its latest stock changes
    if (nearbyPharmacy) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const pharmacyMedicines = medicines.filter(m => isAvailableInPharmacy(m.tkSzam, nearbyPharmacy.id));

        const stats = pharmacyMedicines.reduce((acc, med) => {
            const updateDate = med.lastUpdate.split('T')[0];
            const isTargetStatus = med.status === 'Készlethiány' || med.status === 'Megszűnt';

            if (updateDate === todayStr) {
                if (isTargetStatus) {
                    acc.today++;
                    acc.nemElerheto++;
                }

                if (med.status === 'Elérhető') acc.elerheto++;
            }

            if (updateDate === yesterdayStr && isTargetStatus) {
                acc.yesterday++;
            }
            return acc;
        }, { today: 0, yesterday: 0, nemElerheto: 0, elerheto: 0 });

        const changes = pharmacyMedicines
            .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
            .slice(0, 12);

        return (
            <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
                <div className="card-body p-4">
                    <div className="mb-4">
                        <h2 className="card-title text-lg flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">local_pharmacy</span>
                            Készletváltozások itt:
                        </h2>
                        <div className="text-sm font-bold text-primary truncate">
                            {nearbyPharmacy.nev}
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">Mai nap</span>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-2xl font-black text-primary">{stats.today}</span>
                                <span className="text-[10px] font-bold text-primary/50">db</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-[10px] font-medium text-primary/70">
                                <Link href="/gyogyszerek?status=not_available&nearbyOnly=true" className="hover:underline hover:text-primary transition-colors">
                                    • {stats.nemElerheto} db már nem elérhető
                                </Link>
                                <Link href="/gyogyszerek?status=Elérhető&nearbyOnly=true" className="hover:underline hover:text-primary transition-colors">
                                    • {stats.elerheto} db újra elérhető
                                </Link>
                            </div>
                        </div>
                        <div className="bg-base-200/50 border border-base-300 rounded-xl p-3 flex flex-col items-center justify-center text-center h-full">
                            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-1">Tegnapi nap</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-base-content/80">{stats.yesterday}</span>
                                <span className="text-[10px] font-bold text-base-content/40">db</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="bg-base-200/50">
                                    <th>Státusz</th>
                                    <th className="w-full">Név</th>
                                    <th className="text-right">Dátum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {changes.length > 0 ? (
                                    changes.map((med) => (
                                        <tr key={med.internalId || med.tkSzam} className="hover:bg-base-200/30">
                                            <td>
                                                <div className={`badge ${med.status === 'Elérhető' ? 'badge-success' : med.status === 'Készlethiány' ? 'badge-warning' : med.status === 'Elfogyott' ? 'badge-error' : 'badge-ghost'} badge-xs whitespace-nowrap`}>
                                                    {med.status}
                                                </div>
                                            </td>
                                            <td>
                                                <Link
                                                    href={`/gyogyszerek/${med.tkSzam}`}
                                                    className="font-medium text-primary hover:underline block"
                                                >
                                                    {med.nev}
                                                </Link>
                                            </td>
                                            <td className="text-right text-xs text-base-content/60 whitespace-nowrap">
                                                {formatDate(med.lastUpdate)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-20 text-base-content/50">
                                            Nincs új változás ennél a patikánál.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-actions justify-start mt-4 pt-4 border-t border-base-200">
                        <Link
                            href="/gyogyszerek?sort=nearbyPharmacyLastUpdate&order=desc"
                            className="btn btn-ghost btn-sm text-primary gap-1"
                        >
                            Összes gyógyszertári változás
                            <span className="material-symbols-rounded text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Default view: Map and Info box
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full overflow-hidden">
            <div className="flex flex-col h-full">
                <div className="p-4 bg-base-100 border-b border-base-200">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">explore</span>
                        Közeli patika kiválasztása
                    </h2>
                </div>

                <div className="flex-1 min-h-[300px] relative">
                    <PharmacyMap pharmacies={pharmacies} />
                </div>

                <div className="card-actions justify-start p-4 bg-primary/5 border-t border-base-200">
                    <div className="alert alert-info py-2 rounded-lg text-xs mb-3 w-full">
                        <span className="material-symbols-rounded text-sm">info</span>
                        <div>Ha kiválaszt egy közeli patikát, láthatja annak készletmódosulását</div>
                    </div>

                    <div className="flex justify-start w-full">
                        <Link href="/gyogyszertarak" className="btn btn-ghost btn-sm text-primary gap-1">
                            Tovább a gyógyszertárkeresőre
                            <span className="material-symbols-rounded text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
