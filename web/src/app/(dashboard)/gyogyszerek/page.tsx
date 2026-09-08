/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZERLISTA FELÜLET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez az oldal a BENU Vény Orvosi Portál központi gyógyszerkereső és -böngésző
 * felülete. Lehetővé teszi a magyarországi forgalomban lévő gyógyszerek (több mint 41 000 tétel)
 * gyors keresését, oszlopszintű szűrését, rendezését, a készlet- és hiányállapotok
 * áttekintését, valamint a kedvencek és feliratkozások kezelését.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként szeretnék gyorsan rákeresni egy készítményre név, hatóanyag vagy törzskönyvi szám
 *   alapján, hogy azonnal lássam annak elérhetőségét és adatait.
 * - Orvosként szeretném látni a készlethiányos és megszűnt gyógyszereket, hogy időben értesülhessek
 *   a piaci ellátási problémákról.
 * - Felhasználóként szeretném egyetlen kattintással szűrni a listát csak a mentett (kedvenc)
 *   gyógyszereimre vagy a kijelölt közeli gyógyszertáramban elérhető tételekre.
 * - Felhasználóként szeretném testreszabni a táblázat oszlopait (megjelenítés/elrejtés és drag-and-drop sorrend),
 *   hogy a napi orvosi munkámhoz legfontosabb adatokat láthassam elsődlegesen.
 * - Felhasználóként szeretnék közvetlenül a listából kedvencnek jelölni vagy készlethiány-értesítést
 *   beállítani egy adott gyógyszerre.
 * - Felhasználóként szeretném, hogy a műveletek oszlop (kedvenc mentés, értesítés, részletek gomb)
 *   a táblázat vízszintes görgetése során is folyamatosan rögzítve (fix/sticky) maradjon a jobb szélen.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszer részletes adatlap: /gyogyszerek/adatlap?tk=...
 * - Kedvencek kezelése: FavoriteContext & Mentett tételek lista a fejlécben
 * - Készletértesítések kezelése: NotificationContext & Bell ikon akciók
 * - Közeli gyógyszertár integráció: NearbyPharmacyContext & készletindikátor
 * - Fejléc globális kereső: GlobalSearch autocompletion
 * ============================================================================
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Medicine, ViewSettings, MedicineTableColumn } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { FavoriteRemovalModal } from '@/components/medicines/FavoriteRemovalModal';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { isAvailableInPharmacy, getNearbyPharmacyStatusUpdate } from '@/lib/utils';
import { fetchStaticData } from '@/lib/static-fetch';

type SortDirection = 'asc' | 'desc' | null;
type SortKey = 'nev' | 'activeSubstance' | 'kiszereles' | 'gyarto' | 'status'
    | 'tkSzam' | 'packagingDetails' | 'dispensability' | 'dispensabilitySub'
    | 'safetyFeatures' | 'authorizationDate' | 'lastUpdate'
    | 'nearbyPharmacyStock' | 'nearbyPharmacyLastUpdate';


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
    tableColumnOrder: DEFAULT_COLUMN_ORDER
};

function MedicinesPageContent() {
    const searchParams = useSearchParams();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
    const [viewMode] = useState<'grid' | 'table'>('table');
    const [viewSettings, setViewSettings] = useState<ViewSettings>(DEFAULT_VIEW_SETTINGS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [nearbyOnly, setNearbyOnly] = useState(searchParams.get('nearbyOnly') === 'true');
    const { nearbyPharmacy } = useNearbyPharmacy();
    const [isRemovalWarningOpen, setIsRemovalWarningOpen] = useState(false);
    const [selectedMedicineForRemoval, setSelectedMedicineForRemoval] = useState<Medicine | null>(null);

    // Sorting State
    const [sortKey, setSortKey] = useState<SortKey | null>((searchParams.get('sort') as SortKey) || 'lastUpdate');
    const [sortDirection, setSortDirection] = useState<SortDirection>((searchParams.get('order') as SortDirection) || 'desc');

    // Initialize column filters from URL params
    const initialColumnFilters: Record<string, string> = {};
    if (searchParams.get('lastUpdate_from')) {
        initialColumnFilters['lastUpdate_from'] = searchParams.get('lastUpdate_from')!;
    }
    if (searchParams.get('lastUpdate_to')) {
        initialColumnFilters['lastUpdate_to'] = searchParams.get('lastUpdate_to')!;
    }
    if (searchParams.get('nearbyPharmacyStock')) {
        initialColumnFilters['nearbyPharmacyStock'] = searchParams.get('nearbyPharmacyStock')!;
    }

    const [columnFilters, setColumnFilters] = useState<Record<string, string>>(initialColumnFilters);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMedicines() {
            try {
                const data = await fetchStaticData<Medicine[]>('/data/medicines.json');
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
            if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
                setIsPerPageDropdownOpen(false);
            }
        }

        if (isSettingsOpen || isPerPageDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen, isPerPageDropdownOpen]);

    const toggleTableColumn = (column: MedicineTableColumn) => {
        setViewSettings(prev => ({
            ...prev,
            tableColumns: {
                ...prev.tableColumns,
                [column]: !prev.tableColumns[column]
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
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'not_available' ? (medStatus === 'Készlethiány' || medStatus === 'Megszűnt') : medStatus === filterStatus);

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

            if (key === 'nearbyPharmacyStock' || key.startsWith('nearbyPharmacyLastUpdate')) {
                return true;
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

        if (sortKey && sortDirection) {
            key = sortKey;
            dir = sortDirection;
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
    }, [filteredMedicines, sortKey, sortDirection]);

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
            case 'elérhető': return 'badge-status-available';
            case 'készlethiány': return 'badge-status-shortage';
            case 'megszűnt': return 'badge-status-discontinued';
            default: return 'badge-ghost';
        }
    };

    const handleSubscription = (medicine: Medicine) => {
        if (isSubscribed(medicine.tkSzam)) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
            // Ha feliratkozik, automatikusan mentett is lesz, ha még nem az
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
            tkSzam: 'TK szám',
            nev: 'Termék neve',
            activeSubstance: 'Hatóanyag',
            kiszereles: 'Kiszerelés',
            gyarto: 'Gyártó',
            packagingDetails: 'Csomagolás',
            dispensability: 'Kiadhatóság',
            dispensabilitySub: 'Kiad. Alcsop.',
            safetyFeatures: 'B. Elemek',
            authorizationDate: 'Eng. Dátum',
            lastUpdate: 'Dátum / idő',
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

        const colWidthClass: Record<string, string> = {
            lastUpdate: 'min-w-[150px] whitespace-nowrap',
            status: 'min-w-[120px] whitespace-nowrap',
            nev: 'min-w-[260px]',
            activeSubstance: 'min-w-[160px]',
            kiszereles: 'min-w-[160px]',
            gyarto: 'min-w-[160px]',
            nearbyPharmacyStock: 'min-w-[140px] whitespace-nowrap',
            nearbyPharmacyLastUpdate: 'min-w-[170px] whitespace-nowrap',
            tkSzam: 'min-w-[150px] whitespace-nowrap',
            packagingDetails: 'min-w-[160px]',
            dispensability: 'min-w-[140px]',
            dispensabilitySub: 'min-w-[140px]',
            safetyFeatures: 'min-w-[140px]',
            authorizationDate: 'min-w-[140px] whitespace-nowrap',
            actions: 'w-[230px] min-w-[230px] whitespace-nowrap text-right sticky right-0 z-20 bg-[#f9f9fb] shadow-[-4px_0_8px_-2px_rgba(0,26,72,0.06)] border-l border-[#e7e8ec]'
        };

        return (
            <th
                key={col}
                draggable={col !== 'actions'}
                onDragStart={(e) => handleDragStart(e, col)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
                className={`bg-[#f9f9fb] px-[24px] py-[10px] text-[#62788f] text-[12px] font-bold tracking-normal uppercase border-b border-[#e7e8ec] ${colWidthClass[col] || ''} ${col === 'actions' ? 'text-right' : 'text-left'} ${col !== 'actions' ? 'cursor-grab active:cursor-grabbing hover:bg-slate-100' : ''} select-none ${draggedColumn === col ? 'bg-slate-200' : ''}`}
                onClick={() => isSortable && sortKeyMap[col] && handleTableSort(sortKeyMap[col]!)}
            >
                <div className={`flex items-center gap-1.5 ${col === 'actions' ? 'justify-end' : 'justify-start'}`}>
                    {col !== 'actions' && (
                        <img src="/assets/figma/deafcd0a1d15ec8a0769a1c0ddd59e713ab49928.svg" alt="" className="size-[20px] shrink-0 opacity-60" />
                    )}
                    <span>{labelMap[col]}</span>
                    {sortKey === sortKeyMap[col] && (
                        <span className="text-[#002664] font-bold">{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                </div>
            </th>
        );
    };

    const renderFilterCell = (col: MedicineTableColumn) => {
        if (!viewSettings.tableColumns[col]) return null;

        if (col === 'actions') return <th key={col} className="bg-[#f9f9fb] px-[24px] py-[12px] border-b border-l border-[#e7e8ec] w-[230px] min-w-[230px] sticky right-0 z-20 shadow-[-4px_0_8px_-2px_rgba(0,26,72,0.06)]"></th>;

        if (col === 'status') {
            return (
                <th key={col} className="bg-[#f9f9fb] px-[24px] py-[12px] border-b border-[#e7e8ec]">
                    <select
                        className="w-full bg-white border border-[#d8d9e0] rounded-[24px] px-[12px] py-[8px] text-[13px] text-[#002664] font-normal cursor-pointer focus:outline-none focus:border-[#002664]"
                        value={columnFilters['status'] || ''}
                        onChange={(e) => handleColumnFilterChange('status', e.target.value)}
                    >
                        <option value="">Státusz</option>
                        <option value="Elérhető">Elérhető</option>
                        <option value="Készlethiány">Készlethiány</option>
                        <option value="Megszűnt">Megszűnt</option>
                    </select>
                </th>
            );
        }

        if (col === 'nearbyPharmacyStock') {
            return (
                <th key={col} className="bg-[#f9f9fb] px-[24px] py-[12px] border-b border-[#e7e8ec]">
                    <select
                        className="w-full bg-white border border-[#d8d9e0] rounded-[24px] px-[12px] py-[8px] text-[13px] text-[#002664] font-normal cursor-pointer focus:outline-none focus:border-[#002664]"
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

        if (col === 'nearbyPharmacyLastUpdate' || col === 'lastUpdate') {
            const prefix = col === 'nearbyPharmacyLastUpdate' ? 'nearbyPharmacyLastUpdate' : 'lastUpdate';
            return (
                <th key={col} className="bg-[#f9f9fb] px-[24px] py-[12px] border-b border-[#e7e8ec]">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 bg-white border border-[#d8d9e0] rounded-[8px] px-2 py-1">
                            <img src="/assets/figma/0805af40480be0d0f5e523ccec7510bfc0f81007.svg" alt="" className="size-3.5 opacity-60" />
                            <input
                                type="date"
                                className="w-full text-xs text-[#62788f] bg-transparent outline-none font-normal"
                                title="Dátumtól"
                                value={columnFilters[`${prefix}_from`] || ''}
                                onChange={(e) => handleColumnFilterChange(`${prefix}_from`, e.target.value)}
                                disabled={col === 'nearbyPharmacyLastUpdate' && !nearbyPharmacy}
                            />
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-[#d8d9e0] rounded-[8px] px-2 py-1">
                            <img src="/assets/figma/0805af40480be0d0f5e523ccec7510bfc0f81007.svg" alt="" className="size-3.5 opacity-60" />
                            <input
                                type="date"
                                className="w-full text-xs text-[#62788f] bg-transparent outline-none font-normal"
                                title="Dátumig"
                                value={columnFilters[`${prefix}_to`] || ''}
                                onChange={(e) => handleColumnFilterChange(`${prefix}_to`, e.target.value)}
                                disabled={col === 'nearbyPharmacyLastUpdate' && !nearbyPharmacy}
                            />
                        </div>
                    </div>
                </th>
            );
        }

        return (
            <th key={col} className="bg-[#f9f9fb] px-[24px] py-[12px] border-b border-[#e7e8ec]">
                <input
                    type="text"
                    className="w-full bg-white border border-[#d8d9e0] rounded-[8px] px-[12px] py-[8px] text-[13px] text-[#002664] placeholder-[#62788f] font-normal focus:outline-none focus:border-[#002664]"
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
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] whitespace-nowrap border-b border-[#e7e8ec]">{medicine.tkSzam}</td>;
            case 'nev':
                return (
                    <td key={col} className="px-[24px] py-[16px] border-b border-[#e7e8ec]">
                        <Link href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(medicine.tkSzam)}`} className="font-bold text-[#002664] text-[15px] hover:text-[#378509] transition-colors leading-snug block">
                            {medicine.nev}
                        </Link>
                    </td>
                );
            case 'activeSubstance':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.activeSubstance || medicine.inn || '-'}</td>;
            case 'kiszereles':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.kiszereles}</td>;
            case 'gyarto':
                return (
                    <td key={col} className="px-[24px] py-[16px] border-b border-[#e7e8ec]">
                        <span className="truncate max-w-[150px] block text-[14px] text-[#62788f]" title={medicine.gyarto}>{medicine.gyarto}</span>
                    </td>
                );
            case 'packagingDetails':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.packagingDetails}</td>;
            case 'dispensability':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.dispensability}</td>;
            case 'dispensabilitySub':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.dispensabilitySub}</td>;
            case 'safetyFeatures':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] border-b border-[#e7e8ec]">{medicine.safetyFeatures}</td>;
            case 'authorizationDate':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] whitespace-nowrap border-b border-[#e7e8ec]">{medicine.authorizationDate}</td>;
            case 'lastUpdate':
                return <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] whitespace-nowrap border-b border-[#e7e8ec]">{formatDate(medicine.lastUpdate)}</td>;
            case 'status':
                return (
                    <td key={col} className="px-[24px] py-[16px] whitespace-nowrap border-b border-[#e7e8ec]">
                        {medicine.status === 'Elérhető' && (
                            <span className="inline-flex items-center gap-[6px] bg-[#e8f8e2] text-[#317907] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px] whitespace-nowrap">
                                <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[16px]" />
                                Elérhető
                            </span>
                        )}
                        {medicine.status === 'Készlethiány' && (
                            <span className="inline-flex items-center gap-[6px] bg-[#fff7ba] text-[#7a6c21] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px] whitespace-nowrap">
                                <img src="/assets/figma/95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg" alt="" className="size-[16px]" />
                                Hiány
                            </span>
                        )}
                        {medicine.status === 'Megszűnt' && (
                            <span className="inline-flex items-center gap-[6px] bg-[#feeaed] text-[#b1174e] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px] whitespace-nowrap">
                                <img src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg" alt="" className="size-[16px]" />
                                Megszűnt
                            </span>
                        )}
                    </td>
                );
            case 'nearbyPharmacyStock':
                return (
                    <td key={col} className="px-[24px] py-[16px] whitespace-nowrap border-b border-[#e7e8ec]">
                        {nearbyPharmacy ? (
                            isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id) ? (
                                <span className="inline-flex items-center gap-[6px] bg-[#e8f8e2] text-[#317907] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px] whitespace-nowrap">
                                    <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[16px]" />
                                    Elérhető
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-[6px] bg-gray-100 text-gray-500 px-[8px] py-[3px] rounded-[4px] font-medium text-[14px] whitespace-nowrap">
                                    Nem elérhető
                                </span>
                            )
                        ) : (
                            <span className="text-xs text-gray-400 italic">Nincs beállítva</span>
                        )}
                    </td>
                );
            case 'nearbyPharmacyLastUpdate':
                return (
                    <td key={col} className="px-[24px] py-[16px] text-[14px] text-[#62788f] whitespace-nowrap border-b border-[#e7e8ec]">
                        {nearbyPharmacy ? getNearbyPharmacyStatusUpdate(medicine.tkSzam, nearbyPharmacy.id, '') : '-'}
                    </td>
                );
            case 'actions':
                return (
                    <td key={col} className="px-[24px] py-[16px] text-right border-b border-l border-[#e7e8ec] w-[230px] min-w-[230px] whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_-2px_rgba(0,26,72,0.06)]">
                        <div className="flex items-center justify-end gap-[8px] shrink-0">
                            <button
                                className={`w-[36px] h-[36px] min-w-[36px] min-h-[36px] shrink-0 aspect-square rounded-[8px] flex items-center justify-center p-[6px] transition-colors cursor-pointer ${
                                    isFavorite(medicine.tkSzam)
                                        ? 'bg-[#002664] border border-[#002664]'
                                        : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                                }`}
                                onClick={() => handleFavorite(medicine)}
                                title={isFavorite(medicine.tkSzam) ? "Eltávolítás a mentettek közül" : "Mentés a listához"}
                            >
                                <img
                                    src={isFavorite(medicine.tkSzam) ? "/assets/figma/0f46a8820ef14e70f1707a091b6a494ac0448773.svg" : "/assets/figma/944c7c49d7facfffc581f76fcabc2cff7a31b865.svg"}
                                    alt="Mentés"
                                    className="size-[24px] min-w-[24px] min-h-[24px] shrink-0 object-contain aspect-square"
                                />
                            </button>
                            <button
                                className={`w-[36px] h-[36px] min-w-[36px] min-h-[36px] shrink-0 aspect-square rounded-[8px] flex items-center justify-center p-[6px] transition-colors cursor-pointer ${
                                    isSubscribed(medicine.tkSzam)
                                        ? 'bg-[#002664] border border-[#002664]'
                                        : 'bg-white border border-[#002664] hover:bg-[#f0f4f9]'
                                }`}
                                onClick={() => handleSubscription(medicine)}
                                title={isSubscribed(medicine.tkSzam) ? "Leiratkozás" : "Értesítés kérése"}
                            >
                                <img
                                    src={isSubscribed(medicine.tkSzam) ? "/assets/figma/a490d8a3ba430f0d884765763912ceec677e0181.svg" : "/assets/figma/475a3a63bba1e5d0fe7309be1d8843540bbf7f88.svg"}
                                    alt="Értesítés"
                                    className="size-[24px] min-w-[24px] min-h-[24px] shrink-0 object-contain aspect-square"
                                />
                            </button>
                            <Link
                                href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(medicine.tkSzam)}`}
                                className="inline-flex items-center gap-[4px] text-[#002664] hover:text-[#378509] font-bold text-[14px] ml-1 transition-colors shrink-0 whitespace-nowrap"
                            >
                                <span>Részletek</span>
                                <img src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg" alt="" className="size-[20px] shrink-0" />
                            </Link>
                        </div>
                    </td>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12">
            <FavoriteRemovalModal
                isOpen={isRemovalWarningOpen}
                onClose={() => setIsRemovalWarningOpen(false)}
                onConfirm={confirmRemoval}
            />

            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-[42px] flex items-center justify-center shrink-0">
                        <img src="/assets/figma/38bf5ad3ce1d1b2b21785ece01507074f555c665.svg" alt="" className="size-[36px]" />
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[22px] md:text-[24px] font-bold text-[#002664] leading-[33px]">
                            Gyógyszerek
                        </h1>
                        <span className="text-xs font-semibold text-[#62788f] bg-[#f9f9fb] border border-[#d8d9e0] px-2.5 py-0.5 rounded-full">
                            {totalItems} termék
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-[16px]">
                    <label className="flex items-center gap-[8px] cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={favoritesOnly}
                            onChange={(e) => setFavoritesOnly(e.target.checked)}
                            className="size-[20px] rounded-[4px] border border-[#d8d9e0] accent-[#002664] cursor-pointer"
                        />
                        <span className="text-[#002664] text-[16px] font-normal">Csak mentett gyógyszerek</span>
                    </label>

                    <label className="flex items-center gap-[8px] cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={nearbyOnly}
                            onChange={(e) => setNearbyOnly(e.target.checked)}
                            className="size-[20px] rounded-[4px] border border-[#d8d9e0] accent-[#002664] cursor-pointer"
                        />
                        <span className="text-[#002664] text-[16px] font-normal">Közeli gyógyszertárban elérhető</span>
                    </label>

                    <div className="relative" ref={settingsRef}>
                        <button
                            className="border border-[#002664] bg-white text-[#002664] rounded-[8px] h-[36px] px-[12px] py-[6px] font-bold text-[14px] flex items-center gap-[8px] hover:bg-[#f0f4f9] transition-colors cursor-pointer"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            aria-label="Oszlopok beállítása"
                        >
                            <img src="/assets/figma/d8e1edbd1ae5ee135c9de7a0829d05e39cce802e.svg" alt="" className="size-[20px]" />
                            <span>Oszlopok</span>
                        </button>
                        {isSettingsOpen && (
                            <div
                                className="absolute right-0 top-full mt-2 z-[50] w-64 p-3 shadow-xl bg-white rounded-2xl border border-[#d8d9e0] overflow-y-auto max-h-[80vh]"
                            >
                                <ul className="menu menu-sm gap-1">
                                    <li className="menu-title px-2 font-bold text-[#002664]">Oszlopok megjelenítése</li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">TK szám</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.tkSzam} onChange={() => toggleTableColumn('tkSzam')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Hatóanyag</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.activeSubstance} onChange={() => toggleTableColumn('activeSubstance')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Kiszerelés</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.kiszereles} onChange={() => toggleTableColumn('kiszereles')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Gyártó</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.gyarto} onChange={() => toggleTableColumn('gyarto')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Csomagolás</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.packagingDetails} onChange={() => toggleTableColumn('packagingDetails')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Státusz</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.status} onChange={() => toggleTableColumn('status')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Közeli patika</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.nearbyPharmacyStock} onChange={() => toggleTableColumn('nearbyPharmacyStock')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Közeli patika frissítve</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.nearbyPharmacyLastUpdate} onChange={() => toggleTableColumn('nearbyPharmacyLastUpdate')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Kiadhatóság</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.dispensability} onChange={() => toggleTableColumn('dispensability')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Kiad. Alcsop.</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.dispensabilitySub} onChange={() => toggleTableColumn('dispensabilitySub')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Biztonsági Elemek</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.safetyFeatures} onChange={() => toggleTableColumn('safetyFeatures')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Engedély Dátuma</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.authorizationDate} onChange={() => toggleTableColumn('authorizationDate')} />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="label cursor-pointer hover:bg-base-200">
                                            <span className="label-text text-[#002664]">Utolsó frissítés</span>
                                            <input type="checkbox" className="checkbox checkbox-sm accent-[#002664]" checked={!!viewSettings.tableColumns.lastUpdate} onChange={() => toggleTableColumn('lastUpdate')} />
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {
                loading ? (
                    <div className="flex justify-center p-12" >
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-[#e7e8ec] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] overflow-hidden mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-0">
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
                                                <tr key={medicine.internalId} className="hover:bg-slate-50 transition-colors group">
                                                    {viewSettings.tableColumnOrder.map(col => renderDataCell(col, medicine))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={viewSettings.tableColumnOrder.filter(col => viewSettings.tableColumns[col] || col === 'actions').length} className="text-center py-12 text-[#62788f] text-[15px]">
                                                    Nem található a keresésnek megfelelő gyógyszer.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Bottom Row (Pagination + Items per page) */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-[16px] gap-4 border-t border-[#e7e8ec] bg-white">
                                {/* Pagination Numbers */}
                                <div className="flex items-center gap-[8px]">
                                    <button
                                        className="size-[44px] rounded-[8px] border border-[#d8d9e0] bg-white text-[#002664] flex items-center justify-center p-[10px] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        aria-label="Előző oldal"
                                    >
                                        <img src="/assets/figma/3b23203475136b257b7c1d04849a07d4c2d3b4cf.svg" alt="" className="size-[20px]" />
                                    </button>

                                    {/* Page number buttons */}
                                    <div className="flex items-center gap-[8px]">
                                        <button
                                            className={`size-[44px] rounded-[8px] text-[16px] text-center transition-colors cursor-pointer ${
                                                currentPage === 1
                                                    ? 'bg-[#002664] text-white font-medium'
                                                    : 'border border-[#d8d9e0] bg-white text-[#002664] hover:bg-slate-50'
                                            }`}
                                            onClick={() => handlePageChange(1)}
                                        >
                                            1
                                        </button>

                                        {currentPage > 3 && (
                                            <div className="size-[44px] flex items-center justify-center text-[#002664] text-[16px]">
                                                ...
                                            </div>
                                        )}

                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p !== 1 && p !== totalPages && Math.abs(currentPage - p) <= 1)
                                            .map(page => (
                                                <button
                                                    key={page}
                                                    className={`size-[44px] rounded-[8px] text-[16px] text-center transition-colors cursor-pointer ${
                                                        currentPage === page
                                                            ? 'bg-[#002664] text-white font-medium'
                                                            : 'border border-[#d8d9e0] bg-white text-[#002664] hover:bg-slate-50'
                                                    }`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))
                                        }

                                        {currentPage < totalPages - 2 && (
                                            <div className="size-[44px] flex items-center justify-center text-[#002664] text-[16px]">
                                                ...
                                            </div>
                                        )}

                                        {totalPages > 1 && (
                                            <button
                                                className={`size-[44px] rounded-[8px] text-[16px] text-center transition-colors cursor-pointer ${
                                                    currentPage === totalPages
                                                        ? 'bg-[#002664] text-white font-medium'
                                                        : 'border border-[#d8d9e0] bg-white text-[#002664] hover:bg-slate-50'
                                                }`}
                                                onClick={() => handlePageChange(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        className="size-[44px] rounded-[8px] border border-[#d8d9e0] bg-white text-[#002664] flex items-center justify-center p-[10px] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        aria-label="Következő oldal"
                                    >
                                        <img src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg" alt="" className="size-[20px]" />
                                    </button>
                                </div>

                                {/* Per Page Selector */}
                                <div className="relative" ref={perPageRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                                        className="bg-white border border-[#d8d9e0] rounded-[24px] px-[20px] py-[10px] flex items-center gap-[8px] text-[#002664] text-[16px] hover:border-[#002664] transition-colors cursor-pointer"
                                    >
                                        <span>{itemsPerPage} találat / oldal</span>
                                        <img src="/assets/figma/bbb8b289e0529c918f53d375fc26f245b777bd09.svg" alt="" className="size-[20px]" />
                                    </button>
                                    {isPerPageDropdownOpen && (
                                        <div className="absolute right-0 bottom-full mb-2 z-50 bg-white border border-[#d8d9e0] rounded-[16px] shadow-lg py-2 min-w-[160px]">
                                            {[10, 20, 50, 100].map(cnt => (
                                                <button
                                                    key={cnt}
                                                    type="button"
                                                    className={`w-full text-left px-4 py-2 text-[14px] hover:bg-slate-50 transition-colors cursor-pointer ${itemsPerPage === cnt ? 'font-bold text-[#002664] bg-slate-50' : 'text-[#62788f]'}`}
                                                    onClick={() => {
                                                        setItemsPerPage(cnt);
                                                        setCurrentPage(1);
                                                        setIsPerPageDropdownOpen(false);
                                                    }}
                                                >
                                                    {cnt} találat / oldal
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default function MedicinesPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        }>
            <MedicinesPageContent />
        </Suspense>
    );
}
