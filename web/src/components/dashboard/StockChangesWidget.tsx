/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként látni szeretném a legfrissebb gyógyszerkészlet-változásokat 
 * és egy napi/tegnapi összesítést, hogy értesüljek a hiánycikkekről vagy 
 * megszűnt termékekről.
 * 
 * FUNKCIÓK:
 * - Statisztikai összesítő: Mai és tegnapi "Készlethiány" vagy "Megszűnt" státuszú változások száma.
 * - TOP 10 lista: A legutóbbi 10 készletváltozás időrendi sorrendben.
 * - Táblázatos megjelenítés:
 *   - Státusz: Első oszlop, színes badge jelöléssel.
 *   - Név: Második oszlop, dinamikusan nyúlik a dátumig.
 *   - Dátum: Harmadik oszlop, jobbra zárt, formázott időbélyeg.
 * - Navigáció: Linkek a gyógyszer részletes adatlapjára és az összes változás oldalra.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/app/(dashboard)/gyogyszerek/page.tsx
 * - src/lib/data.ts (mock adatok a statisztikához)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { formatDate } from '@/lib/utils';

interface StockChangesWidgetProps {
    medicines: Medicine[];
}

export function StockChangesWidget({ medicines }: StockChangesWidgetProps) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const stats = medicines.reduce((acc, med) => {
        const updateDate = med.lastUpdate.split('T')[0];
        const isTargetStatus = med.status === 'Készlethiány' || med.status === 'Megszűnt';

        if (isTargetStatus) {
            if (updateDate === todayStr) acc.today++;
            if (updateDate === yesterdayStr) acc.yesterday++;
        }
        return acc;
    }, { today: 0, yesterday: 0 });

    const latestChanges = [...medicines]
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 10);

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">inventory_2</span>
                        Készletváltozások
                    </h2>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-semibold text-warning-content/70 uppercase tracking-wider mb-1">Mai változások</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-warning-content">{stats.today}</span>
                            <span className="text-[10px] font-bold text-warning-content/50">db</span>
                        </div>
                    </div>
                    <div className="bg-base-200/50 border border-base-300 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-1">Tegnapi nap</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-base-content/80">{stats.yesterday}</span>
                            <span className="text-[10px] font-bold text-base-content/40">db</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>Státusz</th>
                                <th className="w-full">Név</th>
                                <th className="text-right">Dátum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestChanges.length > 0 ? (
                                latestChanges.map((med) => (
                                    <tr key={med.internalId || med.tkSzam} className="hover:bg-base-200/30">
                                        <td>
                                            <div className={`badge ${med.status === 'Elérhető' ? 'badge-success' :
                                                med.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'
                                                } badge-xs font-bold whitespace-nowrap`}>
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
