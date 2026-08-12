'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - GLOBÁLIS KERESŐ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék egy központi keresőt a navigációs sávban, ahol
 * egyetlen keresőmezővel elérhetem a gyógyszereket, gyógyszertárakat és a
 * közösségi fórum témáit.
 * 
 * FUNKCIÓK:
 * - Interaktív keresőmező: gépelés közben azonnali találatokat ad.
 * - Kategóriákra bontott találati lista:
 *   - Minden találat: Összesített lista ikonokkal jelölve a forrást.
 *   - Gyógyszerek: Keresés névben és hatóanyagban.
 *   - Gyógyszertárak: Keresés névben, településben és címben.
 *   - Közösség: Keresés fórum témák címében.
 * - Automatikus bezárás: a listán kívülre kattintva vagy eredmény választásakor bezárul.
 * - Reszponzív megjelenés: mobil és asztali nézetben is jól használható.
 * 
 * ÜZLETI LOGIKA:
 * - A találatok az API végpontokról (/api/medicines, /api/pharmacies) és a 
 *   fórum szolgáltatásból érkeznek.
 * - A keresés kis- és nagybetű érzéketlen.
 * - A találatok között a forrás (gyógyszer, patika, fórum) ikonnal van megkülönböztetve.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial data load (could be optimized with SWR or similar if needed)
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

    // Click outside listener
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
                url: `/kozosseg` // Link to forum search or topic if possible
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

    return (
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
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
                                            onClick={() => setIsOpen(false)}
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
                    <div className="p-2 border-top border-base-200 bg-base-200/20 text-center">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                            Összes találat megtekintése
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
