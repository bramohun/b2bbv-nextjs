/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném áttekinteni az elérhető gyógyszerek listáját, 
 * keresni közöttük név, hatóanyag vagy TK-szám alapján, és szűrni a státuszuk szerint,
 * hogy gyorsan megtaláljam a számomra releváns készítményeket.
 * Emellett rendezni szeretném az eredményeket különböző szempontok szerint.
 * 
 * FUNKCIÓK:
 * - Gyógyszerlista megjelenítése rácsos elrendezésben (MedicineCard).
 * - Keresés (Search): Valós idejű szűrés név, INN vagy TK-szám alapján.
 * - Szűrés (Filter): 
 *   - Szűrés gyógyszerstátusz szerint (Elérhető, Készlethiány, Megszűnt).
 *   - Szűrés közeli patikában elérhető termékekre.
 * - Rendezés (Sorting):
 *   - Táblázatos nézet: az egyes oszlopok fejlécére kattintva növekvő/csökkenő rendezés.
 *     Az aktuális rendezési irány ▲/▼ jelzéssel látható a fejlécen.
 *   - Kártyás nézet: a találatok felett dropdown az alábbi opciókkal:
 *     "ABC sorrendben növekvő", "ABC sorrendben csökkenő", "Frissítés szerint",
 *     "Hatóanyag szerint növekvő", "Hatóanyag szerint csökkenő".
 * - Lapozás (Pagination): Az eredmények tördelése a gyorsabb betöltés és áttekinthetőség érdekében.
 * - Reszponzív nézet: Mobil és asztali felületre optimalizált megjelenés.
 * - Nézet testreszabása (Customization): 
 *   - Oszlopok és kártyaadatok láthatóságának kapcsolása, beállítások mentése localStorage-ba.
 *   - Táblázat oszlopainak átrendezése drag & drop segítségével a fejlécet megragadva.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Kedvencekhez adás / eltávolítás és értesítés kérése / lemondása.
 * - ÉRTESÍTÉS LOGIKA: Értesítésre való feliratkozáskor a termék automatikusan a kedvenc listára kerül.
 * - KEDVENC LOGIKA: Kedvenc eltávolítása esetén figyelmeztetés jelenik meg, ha értesítés is aktív a termékhez.
 * - KÖZELI PATIKA LOGIKA: Ha közeli patika van beállítva, a "Közeli patika" oszlop automatikusan megjelenik a táblázatban, 
 *   megjelenítve a készletstátuszt és az utolsó frissítés időpontját.
 * - Rendezés a szűrt listán (`filteredMedicines`) történik, mielőtt a lapozás alkalmazásra kerül.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/components/medicines/MedicineCard.tsx: Egyedi termékkártya
 * - src/lib/data.ts: Adatforrás
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Medicine, ViewSettings, MedicineTableColumn, MedicineCardField } from '@/types';
import Link from 'next/link';
import { MedicineCard } from '@/components/medicines/MedicineCard';
import { formatDate } from '@/lib/utils';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { FavoriteRemovalModal } from '@/components/medicines/FavoriteRemovalModal';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { isAvailableInPharmacy, getNearbyPharmacyStatusUpdate } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;
type SortKey = 'nev' | 'activeSubstance' | 'kiszereles' | 'gyarto' | 'status'
    | 'tkSzam' | 'packagingDetails' | 'dispensability' | 'dispensabilitySub'
    | 'safetyFeatures' | 'authorizationDate' | 'lastUpdate'
    | 'nearbyPharmacyStock' | 'nearbyPharmacyLastUpdate';
type CardSortOption = 'name-asc' | 'name-desc' | 'lastUpdate-desc'
    | 'activeSubstance-asc' | 'activeSubstance-desc';

const DEFAULT_COLUMN_ORDER: MedicineTableColumn[] = [
    'lastUpdate', 'status', 'nev', 'activeSubstance', 'kiszereles', 'gyarto', 'nearbyPharmacyStock', 'nearbyPharmacyLastUpdate',
    'tkSzam', 'packagingDetails', 'dispensability', 'dispensabilitySub', 'safetyFeatures', 'authorizationDate', 'actions'
];

const DEFAULT_VIEW_SETTINGS: ViewSettings = {
    tableColumns: {
        tkSzam: true,
        nev: true,
        activeSubstance: true,
        kiszereles: true,
        gyarto: false,
        status: true,
        nearbyPharmacyStock: false,
        nearbyPharmacyLastUpdate: false,
        actions: true,
        packagingDetails: false,
        dispensability: false,
        dispensabilitySub: false,
        safetyFeatures: false,
        authorizationDate: false,
        lastUpdate: true,
    },
    cardFields: {
        status: true,
        tkSzam: true,
        kiszereles: true,
        gyarto: false,
        actions: true,
        packagingDetails: false,
        dispensability: false,
        dispensabilitySub: false,
        safetyFeatures: false,
        authorizationDate: false,
        lastUpdate: false,
    },
    tableColumnOrder: DEFAULT_COLUMN_ORDER
};

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [viewSettings, setViewSettings] = useState<ViewSettings>(DEFAULT_VIEW_SETTINGS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [nearbyOnly, setNearbyOnly] = useState(false);
    const { nearbyPharmacy } = useNearbyPharmacy();
    const [isRemovalWarningOpen, setIsRemovalWarningOpen] = useState(false);
    const [selectedMedicineForRemoval, setSelectedMedicineForRemoval] = useState<Medicine | null>(null);

    // Sorting State
    const [sortKey, setSortKey] = useState<SortKey | null>('lastUpdate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [cardSortOption, setCardSortOption] = useState<CardSortOption>('name-asc');
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

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
                // Ensure all default columns are present in the order, even if not in saved settings
                let savedOrder = parsed.tableColumnOrder || DEFAULT_COLUMN_ORDER;

                // Ensure 'actions' is removed from its current position and added to the end
                savedOrder = savedOrder.filter((col: string) => col !== 'actions');
                const updatedOrder = [...savedOrder];

                DEFAULT_COLUMN_ORDER.forEach(col => {
                    if (!updatedOrder.includes(col) && col !== 'actions') {
                        updatedOrder.push(col);
                    }
                });

                // Always add 'actions' to the end
                updatedOrder.push('actions');

                setViewSettings({
                    tableColumns: { ...DEFAULT_VIEW_SETTINGS.tableColumns, ...parsed.tableColumns },
                    cardFields: { ...DEFAULT_VIEW_SETTINGS.cardFields, ...parsed.cardFields },
                    tableColumnOrder: updatedOrder
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

    // Automatically show nearby pharmacy column if a pharmacy is selected
    useEffect(() => {
        if (nearbyPharmacy) {
            setViewSettings(prev => ({
                ...prev,
                tableColumns: {
                    ...prev.tableColumns,
                    nearbyPharmacyStock: true,
                    nearbyPharmacyLastUpdate: true
                }
            }));
        }
    }, [nearbyPharmacy]);

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

    const handleColumnFilterChange = (column: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [column]: value
        }));
        setCurrentPage(1);
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

        // Column filters
        const matchesColumnFilters = Object.entries(columnFilters).every(([key, value]) => {
            if (!value) return true;

            // Special handling for Last Update date range
            if (key === 'lastUpdate_from') {
                const filterDate = new Date(value);
                filterDate.setHours(0, 0, 0, 0);
                const itemDate = new Date(medicine.lastUpdate || 0);
                return itemDate.getTime() >= filterDate.getTime();
            }
            if (key === 'lastUpdate_to') {
                const filterDate = new Date(value);
                filterDate.setHours(23, 59, 59, 999);
                const itemDate = new Date(medicine.lastUpdate || 0);
                return itemDate.getTime() <= filterDate.getTime();
            }

            const itemValue = (medicine as any)[key];
            if (key === 'lastUpdate' || key === 'authorizationDate') {
                // For dates, check if formatted date string contains search term 
                // or raw date string contains it (simplified approach)
                return String(itemValue).toLowerCase().includes(value.toLowerCase()) ||
                    formatDate(itemValue).toLowerCase().includes(value.toLowerCase())
            }
            return String(itemValue || '').toLowerCase().includes(value.toLowerCase());
        });

        const matchesFavorites = !favoritesOnly || isFavorite(medicine.tkSzam);

        const matchesNearby = !nearbyOnly || (nearbyPharmacy && isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id));

        const matchesNearbyColumnFilter = !columnFilters['nearbyPharmacyStock'] || (
            nearbyPharmacy && (
                columnFilters['nearbyPharmacyStock'] === 'available'
                    ? isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id)
                    : !isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id)
            )
        );

        const matchesNearbyUpdateFilter = (!columnFilters['nearbyPharmacyLastUpdate_from'] && !columnFilters['nearbyPharmacyLastUpdate_to']) || (
            nearbyPharmacy && (() => {
                const updateTimeStr = getNearbyPharmacyStatusUpdate(medicine.tkSzam, nearbyPharmacy.id, '');
                const updateTime = new Date(updateTimeStr).getTime();

                if (columnFilters['nearbyPharmacyLastUpdate_from']) {
                    const fromDate = new Date(columnFilters['nearbyPharmacyLastUpdate_from']);
                    fromDate.setHours(0, 0, 0, 0);
                    if (updateTime < fromDate.getTime()) return false;
                }

                if (columnFilters['nearbyPharmacyLastUpdate_to']) {
                    const toDate = new Date(columnFilters['nearbyPharmacyLastUpdate_to']);
                    toDate.setHours(23, 59, 59, 999);
                    if (updateTime > toDate.getTime()) return false;
                }

                return true;
            })()
        );

        return matchesSearch && matchesStatus && matchesColumnFilters && matchesFavorites && matchesNearby && matchesNearbyColumnFilter && matchesNearbyUpdateFilter;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, favoritesOnly, nearbyOnly]);

    // Sorting Logic
    const sortedMedicines = useMemo(() => {
        const list = [...filteredMedicines];
        let key: string | null = null;
        let dir: 'asc' | 'desc' = 'asc';

        if (viewMode === 'table' && sortKey && sortDirection) {
            key = sortKey;
            dir = sortDirection;
        } else if (viewMode === 'grid') {
            switch (cardSortOption) {
                case 'name-asc': key = 'nev'; dir = 'asc'; break;
                case 'name-desc': key = 'nev'; dir = 'desc'; break;
                case 'lastUpdate-desc': key = 'lastUpdate'; dir = 'desc'; break;
                case 'activeSubstance-asc': key = 'activeSubstance'; dir = 'asc'; break;
                case 'activeSubstance-desc': key = 'activeSubstance'; dir = 'desc'; break;
            }
        }

        if (!key) return list;

        list.sort((a, b) => {
            const va = (a as any)[key!] ?? '';
            const vb = (b as any)[key!] ?? '';
            if (key === 'lastUpdate' || key === 'authorizationDate') {
                return dir === 'asc'
                    ? new Date(va).getTime() - new Date(vb).getTime()
                    : new Date(vb).getTime() - new Date(va).getTime();
            }
            if (key === 'nearbyPharmacyStock' && nearbyPharmacy) {
                const availableA = isAvailableInPharmacy(a.tkSzam, nearbyPharmacy.id);
                const availableB = isAvailableInPharmacy(b.tkSzam, nearbyPharmacy.id);
                return dir === 'asc'
                    ? (availableA === availableB ? 0 : availableA ? 1 : -1)
                    : (availableA === availableB ? 0 : availableA ? -1 : 1);
            }
            if (key === 'nearbyPharmacyLastUpdate' && nearbyPharmacy) {
                const dateA = new Date(getNearbyPharmacyStatusUpdate(a.tkSzam, nearbyPharmacy.id, '')).getTime();
                const dateB = new Date(getNearbyPharmacyStatusUpdate(b.tkSzam, nearbyPharmacy.id, '')).getTime();
                return dir === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return dir === 'asc'
                ? String(va).localeCompare(String(vb), 'hu')
                : String(vb).localeCompare(String(va), 'hu');
        });
        return list;
    }, [filteredMedicines, viewMode, sortKey, sortDirection, cardSortOption]);

    const handleTableSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortDirection(null);
                setSortKey(null);
            }
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Pagination Logic
    const totalItems = sortedMedicines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = sortedMedicines.slice(startIndex, startIndex + itemsPerPage);

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

    const handleSubscription = (medicine: Medicine) => {
        if (isSubscribed(medicine.tkSzam)) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
            // Ha feliratkozik, automatikusan kedvenc is lesz, ha még nem az
            if (!isFavorite(medicine.tkSzam)) {
                addFavorite(medicine);
            }
        }
    };

    const handleFavorite = (medicine: Medicine) => {
        if (isFavorite(medicine.tkSzam)) {
            if (isSubscribed(medicine.tkSzam)) {
                setSelectedMedicineForRemoval(medicine);
                setIsRemovalWarningOpen(true);
            } else {
                removeFavorite(medicine.tkSzam);
            }
        } else {
            addFavorite(medicine);
        }
    };

    const confirmRemoval = () => {
        if (selectedMedicineForRemoval) {
            removeFavorite(selectedMedicineForRemoval.tkSzam);
            unsubscribe(selectedMedicineForRemoval.tkSzam);
        }
        setIsRemovalWarningOpen(false);
        setSelectedMedicineForRemoval(null);
    };

    // Drag and Drop Logic for Columns
    const [draggedColumn, setDraggedColumn] = useState<MedicineTableColumn | null>(null);

    const handleDragStart = (e: React.DragEvent, column: MedicineTableColumn) => {
        if (column === 'actions') {
            e.preventDefault();
            return;
        }
        setDraggedColumn(column);
        e.dataTransfer.effectAllowed = 'move';
        // Add a ghost image or styling if needed
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.4';
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
        }
        setDraggedColumn(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetColumn: MedicineTableColumn) => {
        e.preventDefault();
        if (!draggedColumn || draggedColumn === targetColumn || targetColumn === 'actions') return;

        const newOrder = [...viewSettings.tableColumnOrder];
        const currentIndex = newOrder.indexOf(draggedColumn);
        const targetIndex = newOrder.indexOf(targetColumn);

        newOrder.splice(currentIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumn);

        // Safety check to ensure actions is still at the end
        const finalOrder: MedicineTableColumn[] = [
            ...newOrder.filter(col => col !== 'actions'),
            'actions'
        ];

        setViewSettings(prev => ({
            ...prev,
            tableColumnOrder: finalOrder
        }));
    };

    const renderHeaderCell = (col: MedicineTableColumn) => {
        if (!viewSettings.tableColumns[col]) return null;

        const isSortable = col !== 'actions';
        const labelMap: Record<string, string> = {
            tkSzam: 'TK-szám',
            nev: 'Terméknév',
            activeSubstance: 'Hatóanyag',
            kiszereles: 'Kiszerelés',
            gyarto: 'Gyártó',
            packagingDetails: 'Csomagolás',
            dispensability: 'Kiadhatóság',
            dispensabilitySub: 'Kiad. Alcsop.',
            safetyFeatures: 'B. Elemek',
            authorizationDate: 'Eng. Dátum',
            lastUpdate: 'Utolsó friss.',
            status: 'Státusz',
            nearbyPharmacyStock: 'Közeli patika',
            nearbyPharmacyLastUpdate: 'Közeli patika frissítve',
            actions: 'Műveletek'
        };

        const sortKeyMap: Record<string, SortKey | undefined> = {
            tkSzam: 'tkSzam',
            nev: 'nev',
            activeSubstance: 'activeSubstance',
            kiszereles: 'kiszereles',
            gyarto: 'gyarto',
            packagingDetails: 'packagingDetails',
            dispensability: 'dispensability',
            dispensabilitySub: 'dispensabilitySub',
            safetyFeatures: 'safetyFeatures',
            authorizationDate: 'authorizationDate',
            lastUpdate: 'lastUpdate',
            nearbyPharmacyStock: 'nearbyPharmacyStock',
            nearbyPharmacyLastUpdate: 'nearbyPharmacyLastUpdate',
            status: 'status',
            actions: undefined
        };

        return (
            <th
                key={col}
                draggable={col !== 'actions'}
                onDragStart={(e) => handleDragStart(e, col)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
                className={`sticky top-[64px] lg:top-[80px] z-20 bg-base-100 shadow-sm ${col !== 'actions' ? 'cursor-grab active:cursor-grabbing hover:bg-base-200' : ''} select-none ${draggedColumn === col ? 'bg-base-300' : ''}`}
                onClick={() => isSortable && sortKeyMap[col] && handleTableSort(sortKeyMap[col]!)}
            >
                <div className="flex items-center gap-1">
                    {col !== 'actions' && (
                        <span className="material-symbols-rounded text-xs opacity-30">drag_indicator</span>
                    )}
                    {labelMap[col]}
                    {sortKey === sortKeyMap[col] && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </div>
            </th>
        );
    };

    const renderFilterCell = (col: MedicineTableColumn) => {
        if (!viewSettings.tableColumns[col]) return null;

        if (col === 'actions') return <th key={col} className="bg-base-100 p-1"></th>;

        if (col === 'status') {
            return (
                <th key={col} className="bg-base-100 p-1">
                    <select
                        className="select select-bordered select-xs w-full font-normal"
                        value={columnFilters['status'] || ''}
                        onChange={(e) => handleColumnFilterChange('status', e.target.value)}
                    >
                        <option value="">Mindegy</option>
                        <option value="Elérhető">Elérhető</option>
                        <option value="Készlethiány">Készlethiány</option>
                        <option value="Megszűnt">Megszűnt</option>
                    </select>
                </th>
            );
        }

        if (col === 'nearbyPharmacyStock') {
            return (
                <th key={col} className="bg-base-100 p-1">
                    <select
                        className="select select-bordered select-xs w-full font-normal"
                        value={columnFilters['nearbyPharmacyStock'] || ''}
                        onChange={(e) => handleColumnFilterChange('nearbyPharmacyStock', e.target.value)}
                        disabled={!nearbyPharmacy}
                    >
                        <option value="">Mindegy</option>
                        <option value="available">Elérhető</option>
                        <option value="not_available">Nem elérhető</option>
                    </select>
                </th>
            );
        }

        if (col === 'nearbyPharmacyLastUpdate') {
            return (
                <th key={col} className="bg-base-100 p-1">
                    <div className="flex flex-col gap-1">
                        <input
                            type="date"
                            className="input input-bordered input-xs w-full font-normal"
                            title="Dátumtól"
                            value={columnFilters['nearbyPharmacyLastUpdate_from'] || ''}
                            onChange={(e) => handleColumnFilterChange('nearbyPharmacyLastUpdate_from', e.target.value)}
                            disabled={!nearbyPharmacy}
                        />
                        <input
                            type="date"
                            className="input input-bordered input-xs w-full font-normal"
                            title="Dátumig"
                            value={columnFilters['nearbyPharmacyLastUpdate_to'] || ''}
                            onChange={(e) => handleColumnFilterChange('nearbyPharmacyLastUpdate_to', e.target.value)}
                            disabled={!nearbyPharmacy}
                        />
                    </div>
                </th>
            );
        }

        if (col === 'lastUpdate') {
            return (
                <th key={col} className="bg-base-100 p-1">
                    <div className="flex flex-col gap-1">
                        <input
                            type="date"
                            className="input input-bordered input-xs w-full font-normal"
                            title="Dátumtól"
                            value={columnFilters['lastUpdate_from'] || ''}
                            onChange={(e) => handleColumnFilterChange('lastUpdate_from', e.target.value)}
                        />
                        <input
                            type="date"
                            className="input input-bordered input-xs w-full font-normal"
                            title="Dátumig"
                            value={columnFilters['lastUpdate_to'] || ''}
                            onChange={(e) => handleColumnFilterChange('lastUpdate_to', e.target.value)}
                        />
                    </div>
                </th>
            );
        }

        return (
            <th key={col} className="bg-base-100 p-1">
                <input
                    type="text"
                    className="input input-bordered input-xs w-full font-normal"
                    placeholder="Szűrés..."
                    value={columnFilters[col] || ''}
                    onChange={(e) => handleColumnFilterChange(col, e.target.value)}
                />
            </th>
        );
    };

    const renderDataCell = (col: MedicineTableColumn, medicine: Medicine) => {
        if (!viewSettings.tableColumns[col]) return null;

        switch (col) {
            case 'tkSzam':
                return <td key={col} className="text-xs font-mono">{medicine.tkSzam}</td>;
            case 'nev':
                return (
                    <td key={col}>
                        <div className="font-bold text-primary">
                            <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="hover:underline">
                                {medicine.nev}
                            </Link>
                        </div>
                    </td>
                );
            case 'activeSubstance':
                return <td key={col}>{medicine.activeSubstance || medicine.inn || '-'}</td>;
            case 'kiszereles':
                return <td key={col}>{medicine.kiszereles}</td>;
            case 'gyarto':
                return (
                    <td key={col}>
                        <div className="tooltip" data-tip={medicine.gyarto}>
                            <span className="truncate max-w-[150px] block">{medicine.gyarto}</span>
                        </div>
                    </td>
                );
            case 'packagingDetails':
                return <td key={col}>{medicine.packagingDetails}</td>;
            case 'dispensability':
                return <td key={col}>{medicine.dispensability}</td>;
            case 'dispensabilitySub':
                return <td key={col}>{medicine.dispensabilitySub}</td>;
            case 'safetyFeatures':
                return <td key={col}>{medicine.safetyFeatures}</td>;
            case 'authorizationDate':
                return <td key={col}>{medicine.authorizationDate}</td>;
            case 'lastUpdate':
                return <td key={col}>{formatDate(medicine.lastUpdate)}</td>;
            case 'status':
                return (
                    <td key={col}>
                        <div className={`badge ${medicine.status === 'Elérhető' ? 'badge-success' : medicine.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'} badge-xs whitespace-nowrap`}>
                            {medicine.status}
                        </div>
                    </td>
                );
            case 'nearbyPharmacyStock':
                return (
                    <td key={col}>
                        {nearbyPharmacy ? (
                            <div className={`badge ${isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id) ? 'badge-success' : 'bg-gray-200 text-gray-500 border-gray-300'} badge-xs whitespace-nowrap`}>
                                {isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id) ? 'Elérhető' : 'Nem elérhető'}
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Nincs beállítva</span>
                        )}
                    </td>
                );
            case 'nearbyPharmacyLastUpdate':
                return (
                    <td key={col}>
                        {nearbyPharmacy ? (
                            <div className="text-xs text-gray-400 flex items-center gap-0.5">
                                <span className="material-symbols-rounded text-[14px]">schedule</span>
                                {getNearbyPharmacyStatusUpdate(medicine.tkSzam, nearbyPharmacy.id, '')}
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">-</span>
                        )}
                    </td>
                );
            case 'actions':
                return (
                    <td key={col} className="bg-base-100 sticky right-0 z-10 shadow-[-5px_0px_5px_-5px_#0000001a]">
                        <div className="flex items-center gap-1">
                            <button
                                className={`btn btn-circle btn-xs ${isFavorite(medicine.tkSzam) ? 'bg-warning text-warning-content border-warning' : 'btn-ghost text-gray-400 hover:text-warning'}`}
                                onClick={() => handleFavorite(medicine)}
                                title={isFavorite(medicine.tkSzam) ? "Eltávolítás a kedvencekből" : "Kedvencekhez"}
                            >
                                <span className={`material-symbols-rounded text-[18px] ${isFavorite(medicine.tkSzam) ? 'fill-1' : ''}`}>star</span>
                            </button>
                            <button
                                className={`btn btn-circle btn-xs ${isSubscribed(medicine.tkSzam) ? 'btn-primary' : 'btn-ghost text-gray-400 hover:text-info'}`}
                                onClick={() => handleSubscription(medicine)}
                                title={isSubscribed(medicine.tkSzam) ? "Leiratkozás" : "Értesítés kérése"}
                            >
                                <span className="material-symbols-rounded text-[18px]">
                                    {isSubscribed(medicine.tkSzam) ? 'notifications_active' : 'notifications'}
                                </span>
                            </button>
                            <Link href={`/gyogyszerek/${medicine.tkSzam}`} className="btn btn-ghost btn-xs">
                                Részletek
                            </Link>
                        </div>
                    </td>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto">
            <FavoriteRemovalModal
                isOpen={isRemovalWarningOpen}
                onClose={() => setIsRemovalWarningOpen(false)}
                onConfirm={confirmRemoval}
            />
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">
                    Gyógyszerek
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({totalItems} termék)
                    </span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">
                    <button
                        className={`btn btn-md gap-2 ${favoritesOnly ? 'btn-warning' : 'btn-ghost border-base-300'}`}
                        onClick={() => setFavoritesOnly(!favoritesOnly)}
                        title={favoritesOnly ? "Minden gyógyszer mutatása" : "Csak kedvencek mutatása"}
                    >
                        <span className={`material-symbols-rounded ${favoritesOnly ? 'fill-1' : ''}`}>star</span>
                        Kedvencek
                    </button>

                    {nearbyPharmacy && (
                        <button
                            className={`btn btn-md gap-2 ${nearbyOnly ? 'btn-success' : 'btn-ghost border-base-300'}`}
                            onClick={() => setNearbyOnly(!nearbyOnly)}
                            title={nearbyOnly ? "Minden gyógyszer mutatása" : "Csak közeli patikában elérhetőek mutatása"}
                        >
                            <span className="material-symbols-rounded">local_pharmacy</span>
                            Közeli patikában elérhető
                        </button>
                    )}

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
                                                    <span className="label-text">Közeli patika</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.nearbyPharmacyStock} onChange={() => toggleTableColumn('nearbyPharmacyStock')} />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Közeli patika frissítve</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.nearbyPharmacyLastUpdate} onChange={() => toggleTableColumn('nearbyPharmacyLastUpdate')} />
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
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Utolsó frissítés</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.tableColumns.lastUpdate} onChange={() => toggleTableColumn('lastUpdate')} />
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
                                            <li>
                                                <label className="label cursor-pointer hover:bg-base-200">
                                                    <span className="label-text">Utolsó frissítés</span>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={!!viewSettings.cardFields.lastUpdate} onChange={() => toggleCardField('lastUpdate')} />
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
                            <>
                                <div className="flex justify-end mb-4">
                                    <select
                                        className="select select-bordered select-sm"
                                        value={cardSortOption}
                                        onChange={(e) => { setCardSortOption(e.target.value as CardSortOption); setCurrentPage(1); }}
                                    >
                                        <option value="name-asc">ABC sorrendben növekvő</option>
                                        <option value="name-desc">ABC sorrendben csökkenő</option>
                                        <option value="lastUpdate-desc">Frissítés szerint</option>
                                        <option value="activeSubstance-asc">Hatóanyag szerint növekvő</option>
                                        <option value="activeSubstance-desc">Hatóanyag szerint csökkenő</option>
                                    </select>
                                </div>
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
                            </>
                        ) : (
                            <div className="overflow-x-visible mb-8 bg-base-100 rounded-lg shadow">
                                <table className="table table-pin-rows">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            {viewSettings.tableColumnOrder.map(renderHeaderCell)}
                                        </tr>
                                        <tr>
                                            {viewSettings.tableColumnOrder.map(renderFilterCell)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedItems.length > 0 ? (
                                            paginatedItems.map((medicine) => (
                                                <tr key={medicine.internalId} className="hover">
                                                    {viewSettings.tableColumnOrder.map(col => renderDataCell(col, medicine))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={viewSettings.tableColumnOrder.filter(col => viewSettings.tableColumns[col] || col === 'actions').length} className="text-center py-12 text-gray-500">
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
