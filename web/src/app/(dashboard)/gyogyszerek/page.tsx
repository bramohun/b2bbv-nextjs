/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném áttekinteni az elérhető gyógyszerek listáját, 
 * keresni közöttük név, hatóanyag vagy TK-szám alapján, és szűrni a státuszuk szerint,
 * hogy gyorsan megtaláljam a számomra releváns készítményeket.
 * 
 * FUNKCIÓK:
 * - Gyógyszerlista megjelenítése rácsos elrendezésben (MedicineCard).
 * - Keresés (Search): Valós idejű szűrés név, INN vagy TK-szám alapján.
 * - Szűrés (Filter): Szűrés gyógyszerstátusz szerint (Elérhető, Készlethiány, Megszűnt).
 * - Lapozás (Pagination): Az eredmények tördelése a gyorsabb betöltés és áttekinthetőség érdekében.
 * - Reszponzív nézet: Mobil és asztali felületre optimalizált megjelenés.
 * - Nézet testreszabása (Customization): Oszlopok és kártyaadatok láthatóságának kapcsolása, beállítások mentése localStorage-ba.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Az oldal betöltésekor (/api/medicines) lekéri az összes gyógyszert.
 * - A kliens oldalon történik a szűrés és a lapozás a `medicines` state alapján.
 * - Kereséskor vagy szűréskor a lapozó automatikusan az első oldalra ugrik.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/components/medicines/MedicineCard.tsx: Egyedi termékkártya
 * - src/lib/data.ts: Adatforrás
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Medicine, ViewSettings, MedicineTableColumn, MedicineCardField } from '@/types';
import Link from 'next/link';
import { MedicineCard } from '@/components/medicines/MedicineCard';

const DEFAULT_VIEW_SETTINGS: ViewSettings = {
    tableColumns: {
        tkSzam: true,
        nev: true,
        activeSubstance: true,
        kiszereles: true,
        gyarto: true,
        status: true,
        actions: true,
        packagingDetails: false,
        dispensability: false,
        dispensabilitySub: false,
        safetyFeatures: false,
        authorizationDate: false,
    },
    cardFields: {
        status: true,
        tkSzam: true,
        kiszereles: true,
        gyarto: true,
        actions: true,
        packagingDetails: false,
        dispensability: false,
        dispensabilitySub: false,
        safetyFeatures: false,
        authorizationDate: false,
    }
};

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [viewSettings, setViewSettings] = useState<ViewSettings>(DEFAULT_VIEW_SETTINGS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24; // Nice grid number (1, 2, 3, 4 col compatible)

    useEffect(() => {
        async function fetchMedicines() {
            try {
                const response = await fetch('/api/medicines');
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error('Failed to load medicines:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMedicines();
    }, []);

    // Load view settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('medicineViewSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                // Deep merge with defaults to ensure all keys exist even if localStorage has partial data
                setViewSettings({
                    tableColumns: { ...DEFAULT_VIEW_SETTINGS.tableColumns, ...parsed.tableColumns },
                    cardFields: { ...DEFAULT_VIEW_SETTINGS.cardFields, ...parsed.cardFields }
                });
            } catch (e) {
                console.error('Failed to parse view settings', e);
            }
        }
    }, []);

    // Save view settings to localStorage
    useEffect(() => {
        localStorage.setItem('medicineViewSettings', JSON.stringify(viewSettings));
    }, [viewSettings]);

    // Click outside listener
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        }

        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen]);

    const toggleTableColumn = (column: MedicineTableColumn) => {
        setViewSettings(prev => ({
            ...prev,
            tableColumns: {
                ...prev.tableColumns,
                [column]: !prev.tableColumns[column]
            }
        }));
    };

    const toggleCardField = (field: MedicineCardField) => {
        setViewSettings(prev => ({
            ...prev,
            cardFields: {
                ...prev.cardFields,
                [field]: !prev.cardFields[field]
            }
        }));
    };

    // Filter Logic
    const filteredMedicines = medicines.filter(medicine => {
        const nev = medicine.nev || '';
        const inn = medicine.inn || '';
        const tk = medicine.tkSzam || '';

        const matchesSearch =
            nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tk.toLowerCase().includes(searchTerm.toLowerCase());

        // Status normalization for filter matching
        // Make sure we handle potential status variations
        const medStatus = medicine.status || 'Elérhető';
        const matchesStatus = filterStatus === 'all' || medStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Reset to page 1 when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // Pagination Logic
    const totalItems = filteredMedicines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredMedicines.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="container mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">
                    Gyógyszerek
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({totalItems} termék)
                    </span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">

                    <div className="join">
                        <button
                            className={`join-item btn btn-md ${viewMode === 'grid' ? 'btn-active btn-primary' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Rács nézet"
                        >
                            <span className="material-symbols-rounded">grid_view</span>
                        </button>
                        <button
                            className={`join-item btn btn-md ${viewMode === 'table' ? 'btn-active btn-primary' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Lista nézet"
                        >
                            <span className="material-symbols-rounded">view_list</span>
                        </button>
                    </div>

                    <div className="relative z-50">
                        <button
                            className="btn btn-md m-1"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            aria-label="Nézet testreszabása"
                        >
                            <span className="material-symbols-rounded">tune</span>
                            Nézet
                        </button>
                        {isSettingsOpen && (
                            <div
                                ref={settingsRef}
                                className="absolute right-0 top-full mt-2 z-[50] w-64 p-2 shadow-xl bg-base-100 rounded-box border border-base-200 overflow-y-auto max-h-[80vh]"
                            >
                                <ul className="menu menu-sm gap-1">
                                    {viewMode === 'table' ? (
                                        <>
                                            <li className="menu-title px-2">Oszlopok megjelenítése</li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">TK-szám</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.tkSzam} onChange={() => toggleTableColumn('tkSzam')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Hatóanyag</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.activeSubstance} onChange={() => toggleTableColumn('activeSubstance')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiszerelés</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.kiszereles} onChange={() => toggleTableColumn('kiszereles')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Gyártó</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.gyarto} onChange={() => toggleTableColumn('gyarto')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Csomagolás</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.packagingDetails} onChange={() => toggleTableColumn('packagingDetails')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Státusz</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.status} onChange={() => toggleTableColumn('status')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiadhatóság</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.dispensability} onChange={() => toggleTableColumn('dispensability')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiad. Alcsop.</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.dispensabilitySub} onChange={() => toggleTableColumn('dispensabilitySub')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Biztonsági Elemek</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.safetyFeatures} onChange={() => toggleTableColumn('safetyFeatures')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Engedély Dátuma</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.authorizationDate} onChange={() => toggleTableColumn('authorizationDate')} />
                                                </label>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="menu-title px-2">Kártya mezők</li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Státusz</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.status} onChange={() => toggleCardField('status')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">TK-szám</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.tkSzam} onChange={() => toggleCardField('tkSzam')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiszerelés</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.kiszereles} onChange={() => toggleCardField('kiszereles')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Gyártó</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.gyarto} onChange={() => toggleCardField('gyarto')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Csomagolás</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.packagingDetails} onChange={() => toggleCardField('packagingDetails')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiadhatóság</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.dispensability} onChange={() => toggleCardField('dispensability')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Kiad. Alcsop.</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.dispensabilitySub} onChange={() => toggleCardField('dispensabilitySub')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Biztonsági Elemek</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.safetyFeatures} onChange={() => toggleCardField('safetyFeatures')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Engedély Dátuma</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.authorizationDate} onChange={() => toggleCardField('authorizationDate')} />
                                                </label>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Keresés név, hatóanyag, tk-szám..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="material-symbols-rounded text-gray-400">search</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Minden státusz</option>
                        <option value="Elérhető">Elérhető</option>
                        <option value="Készlethiány">Készlethiány</option>
                        <option value="Megszűnt">Megszűnt</option>
                    </select>
                </div>
            </div>

            {
                loading ? (
                    <div className="flex justify-center p-12" >
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                                {paginatedItems.length > 0 ? (
                                    paginatedItems.map((medicine) => (
                                        <MedicineCard
                                            key={medicine.internalId}
                                            medicine={medicine}
                                            visibleFields={viewSettings.cardFields}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        Nem található a keresésnek megfelelő gyógyszer.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto mb-8 bg-base-100 rounded-lg shadow">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            {viewSettings.tableColumns.nev && <th>Terméknév / TK-szám</th>}
                                            {viewSettings.tableColumns.activeSubstance && <th>Hatóanyag</th>}
                                            {viewSettings.tableColumns.kiszereles && <th>Kiszerelés</th>}
                                            {viewSettings.tableColumns.gyarto && <th>Gyártó</th>}
                                            {viewSettings.tableColumns.packagingDetails && <th>Csomagolás</th>}
                                            {viewSettings.tableColumns.dispensability && <th>Kiadhatóság</th>}
                                            {viewSettings.tableColumns.dispensabilitySub && <th>Kiad. Alcsop.</th>}
                                            {viewSettings.tableColumns.safetyFeatures && <th>B. Elemek</th>}
                                            {viewSettings.tableColumns.authorizationDate && <th>Eng. Dátum</th>}
                                            {viewSettings.tableColumns.status && <th>Státusz</th>}
                                            {viewSettings.tableColumns.actions && <th>Műveletek</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedItems.length > 0 ? (
                                            paginatedItems.map((medicine) => (
                                                <tr key={medicine.internalId} className="hover">
                                                    {viewSettings.tableColumns.nev && (
                                                        <td>
                                                            <div className="font-bold text-primary">
                                                                <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="hover:underline">
                                                                    {medicine.nev}
                                                                </Link>
                                                            </div>
                                                            {viewSettings.tableColumns.tkSzam && <div className="text-xs opacity-50">{medicine.tkSzam}</div>}
                                                        </td>
                                                    )}
                                                    {viewSettings.tableColumns.activeSubstance && (
                                                        <td>
                                                            {medicine.activeSubstance || medicine.inn || '-'}
                                                        </td>
                                                    )}
                                                    {viewSettings.tableColumns.kiszereles && <td>{medicine.kiszereles}</td>}
                                                    {viewSettings.tableColumns.gyarto && (
                                                        <td>
                                                            <div className="tooltip" data-tip={medicine.gyarto}>
                                                                <span className="truncate max-w-[150px] block">{medicine.gyarto}</span>
                                                            </div>
                                                        </td>
                                                    )}

                                                    {viewSettings.tableColumns.packagingDetails && <td>{medicine.packagingDetails}</td>}
                                                    {viewSettings.tableColumns.dispensability && <td>{medicine.dispensability}</td>}
                                                    {viewSettings.tableColumns.dispensabilitySub && <td>{medicine.dispensabilitySub}</td>}
                                                    {viewSettings.tableColumns.safetyFeatures && <td>{medicine.safetyFeatures}</td>}
                                                    {viewSettings.tableColumns.authorizationDate && <td>{medicine.authorizationDate}</td>}
                                                    {viewSettings.tableColumns.status && (
                                                        <td>
                                                            <div className={`badge ${medicine.status === 'Elérhető' ? 'badge-success' : medicine.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'} badge-sm`}>
                                                                {medicine.status}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="bg-base-100 sticky right-0 z-10 shadow-[-5px_0px_5px_-5px_#0000001a]">
                                                        <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="btn btn-ghost btn-xs">
                                                            Részletek
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={Object.values(viewSettings.tableColumns).filter(Boolean).length} className="text-center py-12 text-gray-500">
                                                    Nem található a keresésnek megfelelő gyógyszer.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table >
                            </div >
                        )
                        }

                        {/* Pagination Controls */}
                        {
                            totalPages > 1 && (
                                <div className="flex justify-center pb-8">
                                    <div className="join">
                                        <button
                                            className="join-item btn"
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            «
                                        </button>

                                        {/* Mobile: simple page number */}
                                        <button className="join-item btn pointer-events-none md:hidden">
                                            {currentPage} / {totalPages}
                                        </button>

                                        {/* Desktop: numeric buttons */}
                                        <div className="hidden md:flex">
                                            {/* Always show first page */}
                                            <button
                                                className={`join-item btn ${currentPage === 1 ? 'btn-active' : ''}`}
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>

                                            {/* Show dots if far from start */}
                                            {currentPage > 3 && <button className="join-item btn btn-disabled">...</button>}

                                            {/* Dynamic range around current page */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(p => p !== 1 && p !== totalPages && Math.abs(currentPage - p) <= 1)
                                                .map(page => (
                                                    <button
                                                        key={page}
                                                        className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                ))
                                            }

                                            {/* Show dots if far from end */}
                                            {currentPage < totalPages - 2 && <button className="join-item btn btn-disabled">...</button>}

                                            {/* Always show last page */}
                                            <button
                                                className={`join-item btn ${currentPage === totalPages ? 'btn-active' : ''}`}
                                                onClick={() => handlePageChange(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </div>

                                        <button
                                            className="join-item btn"
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </div >
    );
}
