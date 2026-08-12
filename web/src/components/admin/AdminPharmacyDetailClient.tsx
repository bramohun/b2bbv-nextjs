'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Pharmacy, Medicine } from '@/types';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';
import { fetchStaticData } from '@/lib/static-fetch';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - GYÓGYSZERTÁR ADMIN RÉSZLETES NÉZET
 * ============================================================================
 * 
 * USER STORY:
 * Adminisztrátorként szeretném részletesen áttekinteni egy adott gyógyszertár
 * adatait, szinkronizációs állapotát és készleteit, hogy hatékonyan monitorozhassam.
 */

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
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

interface PharmacyStock {
    tkSzam: string;
    nev: string;
    inn: string;
    kiszereles: string;
    gyarto: string;
    status: string;
    dapieces: number;
}

type SortField = 'tkSzam' | 'nev' | 'inn' | 'kiszereles' | 'gyarto' | 'status' | 'dapieces';
type SortDir = 'asc' | 'desc';

export default function AdminPharmacyDetailClient() {
    const params = useParams();
    const pharmacyId = params.id as string;

    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [stocks, setStocks] = useState<PharmacyStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filterTk, setFilterTk] = useState('');
    const [filterNev, setFilterNev] = useState('');
    const [filterInn, setFilterInn] = useState('');
    const [filterKiszereles, setFilterKiszereles] = useState('');
    const [filterGyarto, setFilterGyarto] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [sortField, setSortField] = useState<SortField>('nev');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    useEffect(() => {
        async function load() {
            try {
                const [pharmacies, medicines] = await Promise.all([
                    fetchStaticData<Pharmacy[]>('/data/pharmacies.json'),
                    fetchStaticData<Medicine[]>('/data/medicines.json')
                ]);

                const foundPharmacy = pharmacies.find(p => p.id === pharmacyId);
                if (!foundPharmacy) {
                    setPharmacy(null);
                    return;
                }

                setPharmacy(foundPharmacy);

                const sampleStocks: PharmacyStock[] = medicines.slice(0, 100).map(m => ({
                    tkSzam: m.tkSzam,
                    nev: m.nev,
                    inn: m.inn || '',
                    kiszereles: m.kiszereles || '',
                    gyarto: m.gyarto || '',
                    status: m.status,
                    dapieces: Math.floor(Math.abs(Math.sin(m.tkSzam.length + Number(pharmacyId || 1))) * 45) + 1
                }));

                setStocks(sampleStocks);
            } catch (e) {
                console.error('Failed to load pharmacy or stock data', e);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [pharmacyId]);

    const filteredStocks = useMemo(() => {
        let result = [...stocks];

        if (filterTk) result = result.filter(s => s.tkSzam.toLowerCase().includes(filterTk.toLowerCase()));
        if (filterNev) result = result.filter(s => s.nev.toLowerCase().includes(filterNev.toLowerCase()));
        if (filterInn) result = result.filter(s => s.inn.toLowerCase().includes(filterInn.toLowerCase()));
        if (filterKiszereles) result = result.filter(s => s.kiszereles.toLowerCase().includes(filterKiszereles.toLowerCase()));
        if (filterGyarto) result = result.filter(s => s.gyarto.toLowerCase().includes(filterGyarto.toLowerCase()));
        if (filterStatus) result = result.filter(s => s.status === filterStatus);

        result.sort((a, b) => {
            let valA: string | number = a[sortField];
            let valB: string | number = b[sortField];

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [stocks, filterTk, filterNev, filterInn, filterKiszereles, filterGyarto, filterStatus, sortField, sortDir]);

    const totalPages = Math.ceil(filteredStocks.length / pageSize);
    const paginatedStocks = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredStocks.slice(start, start + pageSize);
    }, [filteredStocks, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterTk, filterNev, filterInn, filterKiszereles, filterGyarto, filterStatus]);

    const handleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    }, [sortField]);

    const SortIcon = ({ field }: { field: SortField }) => (
        <span className={`material-symbols-rounded text-xs ml-0.5 ${sortField === field ? 'text-primary' : 'text-base-content/20'}`}>
            {sortField === field ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
        </span>
    );

    const clearAllFilters = () => {
        setFilterTk('');
        setFilterNev('');
        setFilterInn('');
        setFilterKiszereles('');
        setFilterGyarto('');
        setFilterStatus('');
    };

    const hasActiveFilters = filterTk || filterNev || filterInn || filterKiszereles || filterGyarto || filterStatus;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!pharmacy) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-rounded text-5xl text-error mb-4 block">error</span>
                <h2 className="text-xl font-bold text-error">Gyógyszertár nem található</h2>
                <p className="text-base-content/60 mt-2">A keresett BF kód: <span className="font-mono">{pharmacyId}</span></p>
                <Link href="/admin/pharmacies" className="btn btn-primary btn-sm mt-4">
                    <span className="material-symbols-rounded">arrow_back</span>
                    Vissza a listához
                </Link>
            </div>
        );
    }

    const openingStatus = getPharmacyOpeningStatus(pharmacy);
    const syncDates = getMockSyncDates(pharmacy.id);
    const daysOfWeek = [
        { label: 'Hétfő', open: pharmacy.mondayOpen, close: pharmacy.mondayClose },
        { label: 'Kedd', open: pharmacy.tuesdayOpen, close: pharmacy.tuesdayClose },
        { label: 'Szerda', open: pharmacy.wednesdayOpen, close: pharmacy.wednesdayClose },
        { label: 'Csütörtök', open: pharmacy.thursdayOpen, close: pharmacy.thursdayClose },
        { label: 'Péntek', open: pharmacy.fridayOpen, close: pharmacy.fridayClose },
        { label: 'Szombat', open: pharmacy.saturdayOpen, close: pharmacy.saturdayClose },
        { label: 'Vasárnap', open: pharmacy.sundayOpen, close: pharmacy.sundayClose },
    ];

    return (
        <div className="space-y-6">
            <Link href="/admin/pharmacies" className="btn btn-ghost btn-sm gap-1">
                <span className="material-symbols-rounded text-sm">arrow_back</span>
                Vissza a listához
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card bg-base-100 border border-base-300 shadow-sm lg:col-span-2">
                    <div className="card-body">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="card-title text-xl flex items-center gap-2">
                                    <span className="material-symbols-rounded text-primary">local_pharmacy</span>
                                    {pharmacy.nev}
                                </h2>
                                <p className="text-sm text-base-content/60 mt-1 font-mono">BF kód: {pharmacy.id}</p>
                            </div>
                            <span className={`badge ${openingStatus.status === 'open' ? 'badge-success' :
                                openingStatus.status === 'closing_soon' ? 'badge-warning' :
                                    'badge-error'
                                }`}>
                                {openingStatus.statusText}
                            </span>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-rounded text-base-content/40 text-sm">location_on</span>
                                    <span className="font-medium">Cím:</span>
                                    <span className="text-base-content/80">{pharmacy.irsz} {pharmacy.telepules}, {pharmacy.cim}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-rounded text-base-content/40 text-sm">call</span>
                                    <span className="font-medium">Telefon:</span>
                                    <span className="text-base-content/80">{pharmacy.telefon || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-rounded text-base-content/40 text-sm">mail</span>
                                    <span className="font-medium">Email:</span>
                                    <span className="text-base-content/80">{pharmacy.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-rounded text-base-content/40 text-sm">public</span>
                                    <span className="font-medium">Koordináták:</span>
                                    <span className="text-base-content/80 font-mono text-xs">{pharmacy.latitude.toFixed(4)}, {pharmacy.longitude.toFixed(4)}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2 flex items-center gap-1">
                                    <span className="material-symbols-rounded text-sm text-base-content/40">schedule</span>
                                    Nyitvatartás
                                </h3>
                                <div className="space-y-0.5">
                                    {daysOfWeek.map(day => (
                                        <div key={day.label} className="flex justify-between text-sm px-2 py-0.5 rounded hover:bg-base-200/50">
                                            <span className="text-base-content/70">{day.label}</span>
                                            <span className="font-mono text-xs">
                                                {day.open ? `${day.open} - ${day.close}` : 'Zárva'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="alert alert-info py-2 text-xs">
                                <span className="material-symbols-rounded text-sm">info</span>
                                Az adatok szerkesztése a Patika Kezelő rendszerben történik. Itt csak áttekintő nézet érhető el.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-base flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">sync</span>
                            Szinkronizáció
                        </h3>

                        <div className="space-y-4 mt-2">
                            <div className="bg-base-200/50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-rounded text-info text-sm">database</span>
                                    <span className="text-sm font-medium">Utolsó adatszinkron</span>
                                </div>
                                <div className="text-lg font-mono font-bold text-base-content">
                                    {formatDateTime(syncDates.lastDataSync)}
                                </div>
                                <div className="text-xs text-base-content/50 mt-1">
                                    Patikai alapadatok frissítése
                                </div>
                            </div>

                            <div className="bg-base-200/50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-rounded text-success text-sm">inventory_2</span>
                                    <span className="text-sm font-medium">Utolsó készletszinkron</span>
                                </div>
                                <div className="text-lg font-mono font-bold text-base-content">
                                    {formatDateTime(syncDates.lastStockSync)}
                                </div>
                                <div className="text-xs text-base-content/50 mt-1">
                                    Készletadatok frissítése
                                </div>
                            </div>

                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-rounded text-primary text-sm">inventory</span>
                                    <span className="text-sm font-medium">Készleten lévő termékek</span>
                                </div>
                                <div className="text-2xl font-bold text-primary">
                                    {stocks.length}
                                </div>
                                <div className="text-xs text-base-content/50">
                                    db különböző termék
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                        <h3 className="card-title text-lg flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">inventory_2</span>
                            Termékkészlet
                            <span className="badge badge-sm badge-primary">{filteredStocks.length}</span>
                        </h3>
                        <div className="flex gap-2">
                            {hasActiveFilters && (
                                <button className="btn btn-ghost btn-xs gap-1" onClick={clearAllFilters}>
                                    <span className="material-symbols-rounded text-sm">filter_list_off</span>
                                    Szűrők törlése
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-sm table-pin-rows">
                            <thead>
                                <tr className="bg-base-200/50">
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('tkSzam')}>
                                        <div className="flex items-center">TK-szám <SortIcon field="tkSzam" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('nev')}>
                                        <div className="flex items-center">Megnevezés <SortIcon field="nev" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('inn')}>
                                        <div className="flex items-center">Hatóanyag (INN) <SortIcon field="inn" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('kiszereles')}>
                                        <div className="flex items-center">Kiszerelés <SortIcon field="kiszereles" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('gyarto')}>
                                        <div className="flex items-center">Gyártó <SortIcon field="gyarto" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                                        <div className="flex items-center">Státusz <SortIcon field="status" /></div>
                                    </th>
                                    <th className="cursor-pointer select-none text-right" onClick={() => handleSort('dapieces')}>
                                        <div className="flex items-center justify-end">Készlet (db) <SortIcon field="dapieces" /></div>
                                    </th>
                                </tr>
                                <tr className="bg-base-200/30">
                                    <th>
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full max-w-[120px]"
                                            placeholder="Szűrés..."
                                            value={filterTk}
                                            onChange={e => setFilterTk(e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full"
                                            placeholder="Szűrés..."
                                            value={filterNev}
                                            onChange={e => setFilterNev(e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full"
                                            placeholder="Szűrés..."
                                            value={filterInn}
                                            onChange={e => setFilterInn(e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full"
                                            placeholder="Szűrés..."
                                            value={filterKiszereles}
                                            onChange={e => setFilterKiszereles(e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full"
                                            placeholder="Szűrés..."
                                            value={filterGyarto}
                                            onChange={e => setFilterGyarto(e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <select
                                            className="select select-xs select-bordered w-full"
                                            value={filterStatus}
                                            onChange={e => setFilterStatus(e.target.value)}
                                        >
                                            <option value="">Mind</option>
                                            <option value="Elérhető">Elérhető</option>
                                            <option value="Készlethiány">Készlethiány</option>
                                            <option value="Megszűnt">Megszűnt</option>
                                        </select>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStocks.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-base-content/50">
                                            <span className="material-symbols-rounded text-3xl block mb-1">search_off</span>
                                            Nincs a szűrőknek megfelelő termék
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStocks.map((stock) => (
                                        <tr key={stock.tkSzam} className="hover:bg-base-200/30 transition-colors">
                                            <td>
                                                <span className="font-mono text-xs">{stock.tkSzam}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm font-medium">{stock.nev}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm text-base-content/80">{stock.inn || '-'}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm text-base-content/80">{stock.kiszereles || '-'}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm text-base-content/80 max-w-32 truncate block" title={stock.gyarto}>
                                                    {stock.gyarto || '-'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${stock.status === 'Elérhető' ? 'badge-success' :
                                                    stock.status === 'Készlethiány' ? 'badge-warning' :
                                                        'badge-error'
                                                    }`}>
                                                    {stock.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className={`font-mono font-bold text-sm ${stock.dapieces === 0 ? 'text-error' :
                                                    stock.dapieces < 10 ? 'text-warning' :
                                                        'text-success'
                                                    }`}>
                                                    {stock.dapieces}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-base-content/60">
                                Összesen <strong>{filteredStocks.length}</strong> termék
                                {' '}({(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredStocks.length)})
                            </p>
                            <div className="join">
                                <button
                                    className="join-item btn btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    <span className="material-symbols-rounded text-sm">chevron_left</span>
                                </button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let page: number;
                                    if (totalPages <= 7) {
                                        page = i + 1;
                                    } else if (currentPage <= 4) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 3) {
                                        page = totalPages - 6 + i;
                                    } else {
                                        page = currentPage - 3 + i;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            className={`join-item btn btn-sm ${currentPage === page ? 'btn-active btn-primary' : ''}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    className="join-item btn btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    <span className="material-symbols-rounded text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
