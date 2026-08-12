'use client';

import { useState, useEffect, useMemo } from 'react';
import { Pharmacy } from '@/types';
import Link from 'next/link';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';
import { fetchStaticData } from '@/lib/static-fetch';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - GYÓGYSZERTÁRAK ADMIN OLDAL
 * ============================================================================
 * 
 * USER STORY:
 * Adminisztrátorként szeretném áttekinteni a rendszerben nyilvántartott gyógyszertárak
 * listáját, gyorsan keresni az adataik között, és részletes nézetre navigálni.
 * 
 * FUNKCIÓK:
 * - Gyógyszertárak listázása táblázatban.
 * - Keresés (név, település, cím).
 * - Gyors áttekintés: nyitvatartás, település, kapcsolat.
 * - Részletes nézetre navigálás.
 * 
 * MOCK ADATOK:
 * - Szinkronizációs dátumok szimulálva.
 */

// Mock sync dates for demonstration
function getMockSyncDates(pharmacyId: string) {
    const hash = pharmacyId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const now = new Date();

    const dataSync = new Date(now.getTime() - (hash % 7) * 24 * 60 * 60 * 1000 - (hash % 12) * 60 * 60 * 1000);
    const stockSync = new Date(now.getTime() - (hash % 3) * 24 * 60 * 60 * 1000 - ((hash * 7) % 24) * 60 * 60 * 1000);

    return {
        lastDataSync: dataSync.toISOString(),
        lastStockSync: stockSync.toISOString(),
    };
}

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('hu-HU', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

export default function AdminPharmaciesPage() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchStaticData<Pharmacy[]>('/data/pharmacies.json');
                setPharmacies(data);
            } catch (e) {
                console.error('Failed to load pharmacies', e);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return pharmacies;
        const term = searchTerm.toLowerCase();
        return pharmacies.filter(p =>
            p.nev.toLowerCase().includes(term) ||
            p.telepules.toLowerCase().includes(term) ||
            p.cim.toLowerCase().includes(term) ||
            p.id.toLowerCase().includes(term)
        );
    }, [pharmacies, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">local_pharmacy</span>
                        Gyógyszertárak áttekintése
                    </h2>
                    <p className="text-sm text-base-content/60 mt-1">
                        Összesen <span className="font-semibold text-primary">{pharmacies.length}</span> gyógyszertár a rendszerben
                    </p>
                </div>
                <div className="w-full sm:w-auto">
                    <div className="join w-full">
                        <span className="join-item btn btn-sm btn-ghost no-animation pointer-events-none">
                            <span className="material-symbols-rounded text-base-content/40">search</span>
                        </span>
                        <input
                            type="text"
                            className="input input-sm input-bordered join-item w-full sm:w-72"
                            placeholder="Keresés (név, település, cím)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="join-item btn btn-sm btn-ghost"
                                onClick={() => setSearchTerm('')}
                            >
                                <span className="material-symbols-rounded text-sm">close</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search results info */}
            {searchTerm && (
                <div className="alert alert-info py-2 text-sm">
                    <span className="material-symbols-rounded text-sm">filter_list</span>
                    <span><strong>{filtered.length}</strong> találat a keresésre: &quot;{searchTerm}&quot;</span>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                <table className="table table-sm">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th>BF kód</th>
                            <th>Név</th>
                            <th>Település</th>
                            <th>Cím</th>
                            <th>Nyitvatartás (ma)</th>
                            <th>Utolsó adatszinkron</th>
                            <th>Utolsó készletszinkron</th>
                            <th className="text-right">Művelet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-base-content/50">
                                    <span className="material-symbols-rounded text-4xl mb-2 block">search_off</span>
                                    Nincs találat
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => {
                                const openingStatus = getPharmacyOpeningStatus(p);
                                const syncDates = getMockSyncDates(p.id);
                                return (
                                    <tr key={p.id} className="hover:bg-base-200/30 transition-colors">
                                        <td>
                                            <span className="font-mono text-xs text-base-content/60">{p.id}</span>
                                        </td>
                                        <td>
                                            <div className="font-semibold text-sm">{p.nev}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm">
                                                <span className="material-symbols-rounded text-xs text-base-content/40">location_on</span>
                                                {p.telepules}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm text-base-content/80 max-w-48 truncate" title={`${p.irsz} ${p.telepules}, ${p.cim}`}>
                                                {p.irsz} {p.cim}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${openingStatus.status === 'open' ? 'badge-success' :
                                                    openingStatus.status === 'closing_soon' ? 'badge-warning' :
                                                        'badge-error'
                                                }`}>
                                                {openingStatus.statusText}
                                            </span>
                                            <span className="text-xs text-base-content/50 ml-1">{openingStatus.hoursDisplay}</span>
                                        </td>
                                        <td>
                                            <span className="text-xs text-base-content/70 font-mono">
                                                {formatDateTime(syncDates.lastDataSync)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-xs text-base-content/70 font-mono">
                                                {formatDateTime(syncDates.lastStockSync)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <Link
                                                href={`/admin/pharmacies/${p.id}`}
                                                className="btn btn-ghost btn-xs gap-1"
                                            >
                                                <span className="material-symbols-rounded text-sm text-primary">visibility</span>
                                                Részletek
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
