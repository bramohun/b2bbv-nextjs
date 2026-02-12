'use client';

import React from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { formatDate } from '@/lib/utils';

interface StockChangesWidgetProps {
    medicines: Medicine[];
}

export function StockChangesWidget({ medicines }: StockChangesWidgetProps) {
    const latestChanges = [...medicines]
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 10);

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">inventory_2</span>
                        Készletváltozások (TOP 10)
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>Név</th>
                                <th>Státusz</th>
                                <th className="text-right">Dátum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestChanges.length > 0 ? (
                                latestChanges.map((med) => (
                                    <tr key={med.internalId || med.tkSzam} className="hover:bg-base-200/30">
                                        <td>
                                            <Link
                                                href={`/gyogyszerek/${med.tkSzam}`}
                                                className="font-medium text-primary hover:underline truncate max-w-[120px] block"
                                            >
                                                {med.nev}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className={`badge ${med.status === 'Elérhető' ? 'badge-success' :
                                                    med.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'
                                                } badge-xs font-bold whitespace-nowrap`}>
                                                {med.status}
                                            </div>
                                        </td>
                                        <td className="text-right text-xs text-base-content/60">
                                            {formatDate(med.lastUpdate)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-base-content/50">
                                        Nincs új változás.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                    <Link href="/gyogyszerek" className="btn btn-ghost btn-sm text-primary gap-1">
                        Összes változás
                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
