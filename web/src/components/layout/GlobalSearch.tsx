'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GLOBÁLIS KERESŐ (AUTOCOMPLETE)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A navigációs sávba épített központi keresőmező és autocomplete réteg, amely
 * a Figma tervek szerinti füles legördülő panelt (Minden, Gyógyszerek, Patikák)
 * és egyedi ikonozást biztosít a gyors navigációhoz.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként a fejlécből szeretnék azonnal gépeléssel keresni a gyógyszerek
 *   és patikák között, és a találatokból egy kattintással az adatlapra jutni.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Globális navigációs sáv (Navbar)
 * - Gyógyszer adatlap (/gyogyszerek/adatlap?tk=...)
 * - Gyógyszertár kereső (/gyogyszertarak?id=...)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.5)
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Medicine, Pharmacy } from '@/types';
import { fetchStaticData } from '@/lib/static-fetch';

type SearchCategory = 'all' | 'medicines' | 'pharmacies';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    type: 'medicine' | 'pharmacy';
    url: string;
}

export const GlobalSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [medData, pharmData] = await Promise.all([
                    fetchStaticData<Medicine[]>('/data/medicines.json'),
                    fetchStaticData<Pharmacy[]>('/data/pharmacies.json')
                ]);
                if (medData) setMedicines(medData);
                if (pharmData) setPharmacies(pharmData);
            } catch (error) {
                console.error('Error loading search data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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
        if (!searchTerm.trim()) return { medicines: [], pharmacies: [], all: [] };

        const query = searchTerm.toLowerCase();

        const filteredMedicines: SearchResult[] = medicines
            .filter(m => m.nev.toLowerCase().includes(query) || m.activeSubstance.toLowerCase().includes(query))
            .slice(0, 6)
            .map(m => ({
                id: m.tkSzam,
                title: m.nev,
                subtitle: m.activeSubstance,
                type: 'medicine',
                url: `/gyogyszerek/adatlap?tk=${encodeURIComponent(m.tkSzam)}`
            }));

        const filteredPharmacies: SearchResult[] = pharmacies
            .filter(p => p.nev.toLowerCase().includes(query) || p.telepules.toLowerCase().includes(query) || p.cim.toLowerCase().includes(query))
            .slice(0, 6)
            .map(p => ({
                id: p.id,
                title: p.nev,
                subtitle: `${p.telepules}, ${p.cim}`,
                type: 'pharmacy',
                url: `/gyogyszertarak?id=${encodeURIComponent(p.id)}`
            }));

        return {
            medicines: filteredMedicines,
            pharmacies: filteredPharmacies,
            all: [...filteredMedicines, ...filteredPharmacies].slice(0, 8)
        };
    }, [searchTerm, medicines, pharmacies]);

    const displayResults = useMemo(() => {
        switch (activeCategory) {
            case 'medicines': return results.medicines;
            case 'pharmacies': return results.pharmacies;
            case 'all': default: return results.all;
        }
    }, [activeCategory, results]);

    const handleSelectResult = () => {
        setIsOpen(false);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobil kereső gomb (<768px) */}
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="btn btn-ghost btn-circle md:hidden text-[#002664]"
                aria-label="Kereső megnyitása"
            >
                <span className="material-symbols-rounded text-2xl">search</span>
            </button>

            {/* Desktop kereső mező (>=768px) a Figma tervek szerint */}
            <div className="hidden md:block relative w-full max-w-[340px] lg:max-w-[420px]" ref={dropdownRef}>
                <div className={`bg-white border ${isOpen ? 'border-[#002664] ring-2 ring-[#002664]/10' : 'border-[#d8d9e0]'} rounded-[8px] flex items-center px-[15px] py-[10px] transition-all duration-200`}>
                    <input
                        type="text"
                        placeholder="Keresés..."
                        className="bg-transparent border-none outline-none w-full text-[15px] text-[#002664] placeholder-[#62788f] font-['Ubuntu',sans-serif]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    <div className="relative shrink-0 size-[20px] text-[#62788f] flex items-center justify-center">
                        {searchTerm ? (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-[#62788f] hover:text-[#002664]"
                            >
                                <span className="material-symbols-rounded text-base">close</span>
                            </button>
                        ) : (
                            <Image
                                src="/assets/figma/a94814c8cc379f7e9d54fbad6c622dd9b41b6087.svg"
                                alt="Keresés"
                                width={20}
                                height={20}
                            />
                        )}
                    </div>
                </div>

                {/* Autocomplete lenyíló ablak (Figma: dropdown-container) */}
                {isOpen && searchTerm.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#d8d9e0] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.12)] overflow-hidden z-50">
                        {/* Tabs container */}
                        <div className="flex gap-[10px] items-center p-3 border-b border-[#e7e8ec] bg-white">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-3 py-1.5 text-[13px] font-bold rounded-[8px] transition-colors ${
                                    activeCategory === 'all'
                                        ? 'bg-[#002664] text-white border border-[#002664]'
                                        : 'bg-white text-[#002664] border border-[#002664] hover:bg-slate-50'
                                }`}
                            >
                                Minden ({results.all.length})
                            </button>
                            <button
                                onClick={() => setActiveCategory('medicines')}
                                className={`px-3 py-1.5 text-[13px] font-bold rounded-[8px] transition-colors ${
                                    activeCategory === 'medicines'
                                        ? 'bg-[#002664] text-white border border-[#002664]'
                                        : 'bg-white text-[#002664] border border-[#002664] hover:bg-slate-50'
                                }`}
                            >
                                Gyógyszerek ({results.medicines.length})
                            </button>
                            <button
                                onClick={() => setActiveCategory('pharmacies')}
                                className={`px-3 py-1.5 text-[13px] font-bold rounded-[8px] transition-colors ${
                                    activeCategory === 'pharmacies'
                                        ? 'bg-[#002664] text-white border border-[#002664]'
                                        : 'bg-white text-[#002664] border border-[#002664] hover:bg-slate-50'
                                }`}
                            >
                                Gyógyszertárak ({results.pharmacies.length})
                            </button>
                        </div>

                        {/* Results list */}
                        <div className="max-h-[380px] overflow-y-auto">
                            {loading && (
                                <div className="flex items-center justify-center p-6 text-sm text-[#62788f]">
                                    <span className="loading loading-spinner loading-sm mr-2 text-[#002664]"></span>
                                    Keresés...
                                </div>
                            )}

                            {!loading && displayResults.length === 0 && (
                                <div className="p-6 text-center text-sm text-[#62788f]">
                                    Nincs találat a következőre: <span className="font-bold">"{searchTerm}"</span>
                                </div>
                            )}

                            {!loading && displayResults.length > 0 && (
                                <div className="divide-y divide-[#e7e8ec]">
                                    {displayResults.map((res) => (
                                        <Link
                                            key={`${res.type}-${res.id}`}
                                            href={res.url}
                                            onClick={handleSelectResult}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9FB] transition-colors"
                                        >
                                            <div className={`size-[38px] rounded-full flex items-center justify-center shrink-0 ${
                                                res.type === 'pharmacy' ? 'bg-[#E8F8E2]' : 'bg-[#E9F3FF]'
                                            }`}>
                                                {res.type === 'pharmacy' ? (
                                                    <div className="size-[24px] relative">
                                                        <Image
                                                            src="/assets/figma/c5cba43ddc5c0f652c0f9fe15ea05bf4b1cd49f3.svg"
                                                            alt="Patika"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="size-[24px] relative">
                                                        <Image
                                                            src="/assets/figma/be56dbd4d5465997bcb8e07e286d5004c737eb55.svg"
                                                            alt="Gyógyszer"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className={`text-[14px] font-bold truncate leading-tight ${
                                                    res.type === 'pharmacy' ? 'text-[#378509]' : 'text-[#002664]'
                                                }`}>
                                                    {res.title}
                                                </span>
                                                {res.subtitle && (
                                                    <span className="text-[12px] text-[#62788f] truncate font-medium mt-0.5">
                                                        {res.subtitle}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobil fullscreen overlay */}
            {isMobileOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden animate-fade-in">
                    <div className="flex items-center gap-2 p-3 border-b border-[#e7e8ec]">
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="btn btn-ghost btn-circle btn-sm text-[#002664]"
                        >
                            <span className="material-symbols-rounded">arrow_back</span>
                        </button>
                        <input
                            autoFocus
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Keresés..."
                            className="flex-1 bg-[#F9F9FB] border border-[#d8d9e0] rounded-[8px] px-3 py-2 text-sm text-[#002664] outline-none"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#e7e8ec]">
                        {displayResults.map((res) => (
                            <Link
                                key={`m-${res.type}-${res.id}`}
                                href={res.url}
                                onClick={handleSelectResult}
                                className="flex items-center gap-3 py-3"
                            >
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-bold text-[#002664]">{res.title}</span>
                                    {res.subtitle && <span className="text-xs text-[#62788f]">{res.subtitle}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
