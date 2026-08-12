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
 * - TOP 20 lista: A legutóbbi 20 készletváltozás időrendi sorrendben.
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

export interface StockStats {
    total: number;
    megszunt: number;
    hiany: number;
    elerheto: number;
}

interface StockChangesWidgetProps {
    stats: StockStats;
    changes: Medicine[];
    period?: number;
}

export function StockChangesWidget({ stats, changes, period = 1 }: StockChangesWidgetProps) {
    const now = new Date();

    // Calculate start date based on period for URL params
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - period);
    startDate.setHours(0, 0, 0, 0);

    const periodLabel = period === 1 ? 'Mai nap' : `Elmúlt ${period} nap`;

    // Helper for date link
    const getDateFilterParams = () => {
        const fromDateStr = startDate.toISOString().split('T')[0];
        return `&lastUpdate_from=${fromDateStr}`;
    };

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
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex flex-col items-center justify-center text-center col-span-2">
                        <span className="text-xs font-semibold text-warning-content/70 uppercase tracking-wider mb-1">
                            {periodLabel} változásai
                        </span>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-black text-warning-content">{stats.total}</span>
                            <span className="text-[10px] font-bold text-warning-content/50">db</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-[10px] font-medium text-warning-content/70 w-full">
                            <div className="flex justify-center gap-4">
                                <Link href={`/gyogyszerek?status=Megszűnt${getDateFilterParams()}`} className="hover:underline hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="badge badge-error badge-xs"></span> {stats.megszunt} megszűnt
                                </Link>
                                <Link href={`/gyogyszerek?status=Készlethiány${getDateFilterParams()}`} className="hover:underline hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="badge badge-warning badge-xs"></span> {stats.hiany} hiány
                                </Link>
                                <Link href={`/gyogyszerek?status=Elérhető${getDateFilterParams()}`} className="hover:underline hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="badge badge-success badge-xs"></span> {stats.elerheto} elérhető
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="text-sm font-semibold text-base-content/70">
                        Legutóbbi {changes.length} készletváltozás
                    </h3>
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
                            {changes.length > 0 ? (
                                changes.map((med) => (
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
                                                href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
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

                <div className="card-actions justify-start mt-4 pt-4 border-t border-base-200">
                    <Link href="/gyogyszerek?sort=lastUpdate&order=desc" className="btn btn-ghost btn-sm text-primary gap-1">
                        Összes változás
                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
