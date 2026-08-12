'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - GLOBÁLIS KERESŐ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék egy központi keresőt a navigációs sávban, ahol
 * egyetlen keresőmezővel elérhetem a gyógyszereket, gyógyszertárakat és a
 * közösségi fórum témáit mind asztali (desktop), mind mobil kijelzőkön.
 * 
 * FUNKCIÓK:
 * - Reszponzív megjelenés:
 *   - Desktop (>=768px / md): Fejlécbe épített inline kereső sáv élő legördülő találati kártyával.
 *   - Mobil (<768px / md alatt): Nagyító gomb ikon a fejlécben, amelyre koppintva teljes képernyős
 *     kereső overlay (modális ablak) nyílik meg React Portal segítségével (z-[100]).
 * - Interaktív keresőmező: Gépelés közben azonnali találatokat ad. Automatikus fókusz mobilon.
 * - Kész kifejezés törlése: Egy-kattintásos (X) törlés gomb a beviteli mezőben.
 * - Kategóriákra bontott találati lista:
 *   - Minden találat: Összesített lista ikonokkal jelölve a forrást.
 *   - Gyógyszerek: Keresés névben és hatóanyagban.
 *   - Gyógyszertárak: Keresés névben, településben és címben.
 *   - Közösség: Keresés fórum témák címében.
 * - Automatikus bezárás: a listán kívülre kattintva, a vissza gombra nyomva vagy eredmény választásakor bezárul.
 * - Munkamenet és görgetés védelme: Nyitott mobil keresőnél a háttér görgetése letiltásra kerül.
 * 
 * ÜZLETI LOGIKA:
 * - A találatok az adatszolgáltatásokból (gyógyszerek, patikák és fórum) érkeznek.
 * - A keresés kis- és nagybetű érzéketlen.
 * - A találatok között a forrás (gyógyszer, patika, fórum) ikonnal van megkülönböztetve.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Medicine, Pharmacy } from '@/types';
import { getTopics } from '@/lib/forum-service';
import { ForumTopic } from '@/types/forum';
import { fetchStaticData } from '@/lib/static-fetch';

type SearchCategory = 'all' | 'medicines' | 'pharmacies' | 'community';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    type: 'medicine' | 'pharmacy' | 'forum';
    url: string;
}

export const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Body scroll lock on mobile search overlay
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileOpen]);

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [medData, pharmData] = await Promise.all([
                    fetchStaticData<Medicine[]>('/data/medicines.json'),
                    fetchStaticData<Pharmacy[]>('/data/pharmacies.json')
                ]);
                setMedicines(medData);
                setPharmacies(pharmData);
                setForumTopics(getTopics());
            } catch (error) {
                console.error('Error loading search data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Click outside listener for desktop dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const results = useMemo(() => {
        if (!searchTerm.trim()) return { medicines: [], pharmacies: [], community: [], all: [] };

        const query = searchTerm.toLowerCase();

        const filteredMedicines: SearchResult[] = medicines
            .filter(m => m.nev.toLowerCase().includes(query) || m.activeSubstance.toLowerCase().includes(query))
            .slice(0, 5)
            .map(m => ({
                id: m.tkSzam,
                title: m.nev,
                subtitle: m.activeSubstance,
                type: 'medicine',
                url: `/gyogyszerek/adatlap?tk=${encodeURIComponent(m.tkSzam)}`
            }));

        const filteredPharmacies: SearchResult[] = pharmacies
            .filter(p => p.nev.toLowerCase().includes(query) || p.telepules.toLowerCase().includes(query) || p.cim.toLowerCase().includes(query))
            .slice(0, 5)
            .map(p => ({
                id: p.id,
                title: p.nev,
                subtitle: `${p.telepules}, ${p.cim}`,
                type: 'pharmacy',
                url: `/gyogyszertarak?id=${encodeURIComponent(p.id)}`
            }));

        const filteredForum: SearchResult[] = forumTopics
            .filter(t => t.title.toLowerCase().includes(query))
            .slice(0, 5)
            .map(t => ({
                id: t.id,
                title: t.title,
                type: 'forum',
                url: `/kozosseg`
            }));

        return {
            medicines: filteredMedicines,
            pharmacies: filteredPharmacies,
            community: filteredForum,
            all: [...filteredMedicines, ...filteredPharmacies, ...filteredForum].slice(0, 10)
        };
    }, [searchTerm, medicines, pharmacies, forumTopics]);

    const displayResults = useMemo(() => {
        switch (activeCategory) {
            case 'medicines': return results.medicines;
            case 'pharmacies': return results.pharmacies;
            case 'community': return results.community;
            case 'all': default: return results.all;
        }
    }, [activeCategory, results]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'medicine': return 'medication';
            case 'pharmacy': return 'local_pharmacy';
            case 'forum': return 'groups';
            default: return 'search';
        }
    };

    const handleSelectResult = () => {
        setIsOpen(false);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* 1. MOBIL KERESŐ GOMBA NAVIGÁCIÓS SÁVBAN (<768px / md alatt) */}
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="btn btn-ghost btn-circle md:hidden text-base-content/80 hover:text-primary transition-colors"
                aria-label="Kereső megnyitása"
                title="Keresés"
            >
                <span className="material-symbols-rounded text-2xl">search</span>
            </button>

            {/* 2. DESKTOP INLINE KERESŐ MEZŐ (>=768px / md felett) */}
            <div className="hidden md:block relative w-full max-w-sm" ref={dropdownRef}>
                <div className={`flex items-center gap-2 px-3 py-1 bg-base-200 rounded-full border transition-all duration-200 ${isOpen ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-transparent'}`}>
                    <span className={`material-symbols-rounded text-xl ${isOpen ? 'text-primary' : 'text-base-content/40'}`}>search</span>
                    <input
                        type="text"
                        placeholder="Keresés..."
                        className="bg-transparent border-none outline-none w-full text-sm py-1"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-base-content/40 hover:text-base-content p-0.5"
                            aria-label="Keresés törlése"
                        >
                            <span className="material-symbols-rounded text-base">close</span>
                        </button>
                    )}
                </div>

                {isOpen && searchTerm.trim() && (
                    <div className="absolute top-full right-0 mt-2 w-[400px] bg-base-100 rounded-box shadow-2xl border border-base-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Tabs */}
                        <div className="flex border-b border-base-200 bg-base-200/50 p-1">
                            {[
                                { id: 'all', label: 'Minden' },
                                { id: 'medicines', label: 'Gyógyszerek' },
                                { id: 'pharmacies', label: 'Patikák' },
                                { id: 'community', label: 'Közösség' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id as SearchCategory)}
                                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all ${activeCategory === cat.id ? 'bg-base-100 shadow-sm text-primary' : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Results List */}
                        <div className="max-h-[70vh] overflow-y-auto p-2">
                            {loading && (
                                <div className="flex flex-col items-center justify-center p-8 text-base-content/40">
                                    <span className="loading loading-spinner loading-md mb-2"></span>
                                    <span className="text-xs">Keresés...</span>
                                </div>
                            )}

                            {!loading && displayResults.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-8 text-base-content/40 text-center">
                                    <span className="material-symbols-rounded text-4xl mb-2 opacity-20">search_off</span>
                                    <p className="text-sm">Nincs találat a következőre: <span className="italic font-medium">"{searchTerm}"</span></p>
                                </div>
                            )}

                            {!loading && displayResults.length > 0 && (
                                <ul className="menu menu-sm p-0 gap-1">
                                    {displayResults.map((res) => (
                                        <li key={`${res.type}-${res.id}`}>
                                            <Link
                                                href={res.url}
                                                className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg active:bg-primary/10 transition-colors"
                                                onClick={handleSelectResult}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${res.type === 'medicine' ? 'bg-blue-100 text-blue-600' :
                                                        res.type === 'pharmacy' ? 'bg-green-100 text-green-600' :
                                                            'bg-purple-100 text-purple-600'
                                                    }`}>
                                                    <span className="material-symbols-rounded text-lg">{getIcon(res.type)}</span>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-sm truncate leading-tight">{res.title}</span>
                                                    {res.subtitle && <span className="text-[10px] text-base-content/50 truncate uppercase tracking-wider">{res.subtitle}</span>}
                                                </div>
                                                <span className="material-symbols-rounded ms-auto text-base-content/20 group-hover:text-primary transition-colors">chevron_right</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-base-200 bg-base-200/20 text-center">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                                Összes találat megtekintése
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. MOBIL FULLSCREEN OVERLAY MODAL (React Portal document.body-ra TELEPORTÁLVA) */}
            {isMobileOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[100] bg-base-100 flex flex-col animate-in fade-in duration-200 md:hidden">
                    {/* Header: Arrow Back + Input + Clear */}
                    <div className="flex items-center gap-2 p-3 border-b border-base-200 bg-base-100 shadow-sm">
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="btn btn-ghost btn-circle btn-sm text-base-content/70"
                            aria-label="Vissza"
                        >
                            <span className="material-symbols-rounded text-xl">arrow_back</span>
                        </button>

                        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-full border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <span className="material-symbols-rounded text-xl text-primary">search</span>
                            <input
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Gyógyszer, patika, fórum keresése..."
                                className="bg-transparent border-none outline-none w-full text-sm py-0.5 text-base-content"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-base-content/40 hover:text-base-content p-0.5"
                                    aria-label="Keresés törlése"
                                >
                                    <span className="material-symbols-rounded text-lg">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Kategória fülek */}
                    <div className="flex border-b border-base-200 bg-base-200/40 p-1.5 gap-1 overflow-x-auto shrink-0">
                        {[
                            { id: 'all', label: 'Minden' },
                            { id: 'medicines', label: 'Gyógyszerek' },
                            { id: 'pharmacies', label: 'Patikák' },
                            { id: 'community', label: 'Közösség' }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as SearchCategory)}
                                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-base-100 shadow-sm text-primary font-bold' : 'text-base-content/60 hover:text-base-content'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Találati lista */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {!searchTerm.trim() && (
                            <div className="flex flex-col items-center justify-center p-8 text-base-content/40 text-center">
                                <span className="material-symbols-rounded text-5xl mb-3 opacity-20">search</span>
                                <p className="text-sm font-medium">Írj be egy keresőkifejezést!</p>
                                <p className="text-xs text-base-content/50 mt-1">Gyógyszerekre, gyógyszertárakra és közösségi témákra kereshetsz.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center p-8 text-base-content/40">
                                <span className="loading loading-spinner loading-md mb-2 text-primary"></span>
                                <span className="text-xs">Találatok betöltése...</span>
                            </div>
                        )}

                        {!loading && searchTerm.trim() && displayResults.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 text-base-content/40 text-center">
                                <span className="material-symbols-rounded text-4xl mb-2 opacity-20">search_off</span>
                                <p className="text-sm">Nincs találat a következőre: <span className="italic font-medium">"{searchTerm}"</span></p>
                            </div>
                        )}

                        {!loading && searchTerm.trim() && displayResults.length > 0 && (
                            <ul className="menu menu-md p-0 gap-1.5">
                                {displayResults.map((res) => (
                                    <li key={`mobile-${res.type}-${res.id}`}>
                                        <Link
                                            href={res.url}
                                            className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl active:bg-primary/10 transition-colors border border-base-200/50"
                                            onClick={handleSelectResult}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${res.type === 'medicine' ? 'bg-blue-100 text-blue-600' :
                                                    res.type === 'pharmacy' ? 'bg-green-100 text-green-600' :
                                                        'bg-purple-100 text-purple-600'
                                                }`}>
                                                <span className="material-symbols-rounded text-xl">{getIcon(res.type)}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-bold text-sm truncate leading-snug">{res.title}</span>
                                                {res.subtitle && <span className="text-xs text-base-content/50 truncate mt-0.5">{res.subtitle}</span>}
                                            </div>
                                            <span className="material-symbols-rounded text-base-content/30">chevron_right</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
