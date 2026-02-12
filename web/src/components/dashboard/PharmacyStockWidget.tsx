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
        const changes = medicines
            .filter(m => isAvailableInPharmacy(m.tkSzam, nearbyPharmacy.id))
            .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
            .slice(0, 10);

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

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="bg-base-200/50">
                                    <th>Név</th>
                                    <th className="text-right">Dátum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {changes.length > 0 ? (
                                    changes.map((med) => (
                                        <tr key={med.internalId || med.tkSzam} className="hover:bg-base-200/30">
                                            <td>
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/gyogyszerek/${med.tkSzam}`}
                                                        className="font-medium text-primary hover:underline truncate max-w-[150px] block"
                                                    >
                                                        {med.nev}
                                                    </Link>
                                                    <div className={`badge ${med.status === 'Elérhető' ? 'badge-success' : med.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'} badge-xs whitespace-nowrap mt-1`}>
                                                        {med.status}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right text-xs text-base-content/60 align-top pt-3">
                                                {formatDate(med.lastUpdate)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center py-20 text-base-content/50">
                                            Nincs új változás ennél a patikánál.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 pt-4 border-t border-base-200">
                        <Link
                            href="/gyogyszerek?sort=nearbyPharmacyLastUpdate&order=desc"
                            className="btn btn-ghost btn-sm btn-block text-primary gap-2"
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

                <div className="p-4 bg-primary/5">
                    <div className="alert alert-info py-2 rounded-lg text-xs mb-3">
                        <span className="material-symbols-rounded text-sm">info</span>
                        <div>Ha kiválaszt egy közeli patikát, láthatja annak készletmódosulását</div>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/gyogyszertarak" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                            Tovább a gyógyszertárkeresőre
                            <span className="material-symbols-rounded text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
