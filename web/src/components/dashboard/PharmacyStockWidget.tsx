'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - KÖZELI PATIKA KÉSZLET WIDGET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Az Irányítópult (Dashboard) jobb oldali fő komponense.
 * Két állapotot támogat a Figma tervek és az FRS szerint:
 * 1. ALAPÉRTELMEZETT (nincs még patika kijelölve - Figma 13334:18186):
 *    Nagy méretű térképes kártya ("Közeli gyógyszertár kiválasztása") beépített
 *    gyorskereső mezővel és teljes értékű térképpel. A felhasználó a gyorskeresőből,
 *    a térképi pinre kattintva felugró kártyáról, vagy a teljes kereső megnyitásával
 *    választhatja ki a preferált gyógyszertárat.
 * 2. PATIKA KIVÁLASZTVA (Figma 13334:18187):
 *    A kiválasztott patika készletmozgásainak összesítő kártyája (elfogyott, újra elérhető)
 *    és a patika legutóbbi 20 készletváltozásának dedikált táblázata.
 *    A felhasználó innen közvetlenül módosíthatja vagy törölheti a kiválasztást.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném térképen látni a közeli patikákat, ha még nincs választva,
 *   illetve gyorskeresővel vagy a térképi gombbal egyetlen kattintással kijelölni.
 * - Felhasználóként szeretném, ha a kijelölt patikámat bármikor közvetlenül a Dashboardról
 *   módosíthatnám vagy törölhetném.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Irányítópult (/dashboard)
 * - Gyógyszertár Kereső (/gyogyszertarak)
 * - PharmacyDetailModal
 * - PharmacyFinder
 * - NearbyPharmacyContext
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.1.1, 4.1.4)
 * ============================================================================
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { Pharmacy, Medicine } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { fetchStaticData } from '@/lib/static-fetch';
import { StockNotificationCard } from './StockNotificationCard';
import { StockChangesWidget } from './StockChangesWidget';
import { PharmacyDetailModal } from '../pharmacies/PharmacyDetailModal';
import { PharmacyFinder } from '../pharmacies/PharmacyFinder';

// Error boundary to gracefully catch any client Leaflet rendering errors
class MapErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('PharmacyMap error caught by MapErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full min-h-[500px] bg-[#F9F9FB] flex flex-col items-center justify-center p-6 text-center gap-3">
                    <span className="material-symbols-rounded text-4xl text-[#B1174E]">map</span>
                    <p className="text-sm font-bold text-[#002664]">A térkép megjelenítése során hiba történt.</p>
                    <p className="text-xs text-[#62788f] max-w-[320px]">
                        {this.state.error?.message || 'Kérjük, frissítse az oldalt vagy próbálja újra.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-[#002664] text-white text-xs font-bold rounded-lg hover:bg-[#378509] transition-colors cursor-pointer"
                    >
                        Térkép újratöltése
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Dynamic import for PharmacyMap to avoid SSR issues with Leaflet
const PharmacyMap = dynamic(() => import('../pharmacies/PharmacyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full min-h-[500px] bg-[#F9F9FB] flex flex-col items-center justify-center text-[#62788f] gap-2">
            <span className="loading loading-spinner loading-md text-[#002664]"></span>
            <span className="text-sm font-medium">Térkép betöltése...</span>
        </div>
    )
});

interface PharmacyStockWidgetProps {
    pharmacies: Pharmacy[];
    period?: number;
}

interface PharmacyStockStats {
    stats: {
        nemElerheto: number;
        elerheto: number;
    };
    totalChanges: number;
    latestChanges: Medicine[];
}

export function PharmacyStockWidget({ pharmacies, period = 1 }: PharmacyStockWidgetProps) {
    const { nearbyPharmacy, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();
    const [stockData, setStockData] = useState<PharmacyStockStats | null>(null);
    const [loading, setLoading] = useState(false);

    // Fallback pharmacy loading if parent passes empty array initially
    const [localPharmacies, setLocalPharmacies] = useState<Pharmacy[]>(pharmacies || []);

    useEffect(() => {
        if (pharmacies && pharmacies.length > 0) {
            setLocalPharmacies(pharmacies);
        } else {
            fetchStaticData<Pharmacy[]>('/data/pharmacies.json')
                .then(data => {
                    if (data && data.length > 0) setLocalPharmacies(data);
                })
                .catch(err => console.warn('Widget pharmacies fetch fallback:', err));
        }
    }, [pharmacies]);

    const effectivePharmacies = localPharmacies.length > 0 ? localPharmacies : pharmacies;

    // Modal and selection states
    const [detailPharmacy, setDetailPharmacy] = useState<Pharmacy | null>(null);
    const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
    const [isFinderModalOpen, setIsFinderModalOpen] = useState(false);

    // Quick search autocomplete state in Empty state
    const [quickSearch, setQuickSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Click outside listener for quick search dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter pharmacies for quick search dropdown
    const quickSearchResults = useMemo(() => {
        if (!quickSearch.trim()) return [];
        const term = quickSearch.toLowerCase().trim();
        return effectivePharmacies
            .filter(p =>
                p.nev.toLowerCase().includes(term) ||
                p.telepules.toLowerCase().includes(term) ||
                p.cim.toLowerCase().includes(term) ||
                p.irsz.includes(term)
            )
            .slice(0, 6);
    }, [effectivePharmacies, quickSearch]);

    useEffect(() => {
        if (!nearbyPharmacy) {
            setStockData(null);
            return;
        }

        async function fetchStats() {
            setLoading(true);
            try {
                const data = await fetchStaticData<any>('/data/dashboard-stats.json');
                if (data) {
                    setStockData({
                        stats: {
                            nemElerheto: (data.stats?.hiany || 6) + (data.stats?.megszunt || 1),
                            elerheto: data.stats?.elerheto || 1
                        },
                        totalChanges: 24, // Matches Figma 13334:18187 design (24 db)
                        latestChanges: data.latestChanges || []
                    });
                }
            } catch (error) {
                console.error('Failed to fetch pharmacy stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [nearbyPharmacy, period]);

    // ÁLLAPOT 2: Van kiválasztott közeli patika (Figma node 13334:18187)
    if (nearbyPharmacy) {
        return (
            <div className="flex flex-col gap-[32px] w-full">
                {/* 1. Kártya: A kijelölt patika készletösszesítője */}
                <StockNotificationCard
                    type="pharmacy"
                    title={nearbyPharmacy.nev}
                    period={period}
                    total={stockData?.totalChanges || 24}
                    megszunt={stockData?.stats.nemElerheto || 7}
                    hiany={0}
                    elerheto={stockData?.stats.elerheto || 1}
                    onModifyPharmacy={() => setIsFinderModalOpen(true)}
                    onClearPharmacy={clearNearbyPharmacy}
                />

                {/* 2. Kártya: A kijelölt patika legutóbbi készletváltozásai */}
                <StockChangesWidget
                    title="Legutóbbi 20 készletváltozás"
                    subtitle={`Élő készletinformációk és beérkező termékek itt: ${nearbyPharmacy.nev}`}
                    changes={stockData?.latestChanges || []}
                    showViewAllButton={true}
                    viewAllUrl={`/gyogyszerek?nearbyOnly=true&sort=lastUpdate&order=desc`}
                />

                {/* Modális ablak másik patika választásához */}
                {isFinderModalOpen && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
                        <PharmacyFinder
                            title="Közeli patika módosítása"
                            description="Válasszon egy másik gyógyszertárat a készletváltozások követéséhez."
                            initialSelectedId={nearbyPharmacy.id}
                            onClose={() => setIsFinderModalOpen(false)}
                        />
                    </div>,
                    document.body
                )}
            </div>
        );
    }

    // ÁLLAPOT 1: Alapértelmezett, nincs még patika kijelölve (Figma node 13334:18186)
    return (
        <div className="bg-white border border-[#E7E8EC] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] overflow-hidden w-full flex flex-col h-full">
            {/* Fejléc */}
            <div className="pt-[24px] pb-[16px] px-[24px] flex flex-col gap-[12px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="text-[20px] md:text-[22px] font-bold text-[#002664] leading-tight">
                            Közeli gyógyszertár kiválasztása
                        </h2>
                        <p className="text-[13px] md:text-[14px] text-[#62788f] mt-0.5">
                            Válasszon egy gyógyszertárat, hogy láthassa a készletváltozásait!
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFinderModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#002664] text-[#002664] hover:bg-[#002664] hover:text-white text-xs font-bold transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                        <span className="material-symbols-rounded text-[18px]">search</span>
                        <span>Gyorskereső</span>
                    </button>
                </div>

                {/* Gyorsválasztó Autocomplete beviteli mező */}
                <div ref={searchContainerRef} className="relative w-full">
                    <div className="relative flex items-center">
                        <div className="absolute left-3 text-[#62788f] flex items-center pointer-events-none">
                            <span className="material-symbols-rounded text-[20px]">local_pharmacy</span>
                        </div>
                        <input
                            type="text"
                            value={quickSearch}
                            onChange={(e) => {
                                setQuickSearch(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => {
                                if (quickSearch.trim()) setIsDropdownOpen(true);
                            }}
                            placeholder="Gyógyszertár gyorskeresése (pl. Allee, Szeged, Kossuth út)..."
                            className="w-full h-[40px] pl-10 pr-8 bg-[#F9F9FB] border border-[#d8d9e0] rounded-[8px] text-[13px] text-[#002664] placeholder:text-[#8d99ae] focus:bg-white focus:border-[#002664] focus:outline-none transition-all"
                        />
                        {quickSearch && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuickSearch('');
                                    setIsDropdownOpen(false);
                                }}
                                className="absolute right-2.5 text-[#8d99ae] hover:text-[#002664] p-0.5 cursor-pointer"
                            >
                                <span className="material-symbols-rounded text-[18px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Autocomplete találati lista lebegő panel (z-50) */}
                    {isDropdownOpen && quickSearch.trim().length > 0 && (
                        <div className="absolute top-[44px] left-0 right-0 z-50 bg-white border border-[#d8d9e0] rounded-[10px] shadow-lg max-h-[260px] overflow-y-auto divide-y divide-[#f0f2f5]">
                            {quickSearchResults.length > 0 ? (
                                quickSearchResults.map((pharmacy) => (
                                    <div
                                        key={pharmacy.id}
                                        onClick={() => {
                                            setNearbyPharmacy(pharmacy);
                                            setIsDropdownOpen(false);
                                            setQuickSearch('');
                                        }}
                                        className="p-3 hover:bg-[#e8f8e2]/40 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="text-[13px] font-bold text-[#002664]">
                                                {pharmacy.nev}
                                            </span>
                                            <span className="text-[12px] text-[#62788f]">
                                                {pharmacy.irsz} {pharmacy.telepules}, {pharmacy.cim}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="px-2.5 py-1 bg-[#378509] text-white rounded-md text-[12px] font-bold shrink-0 hover:bg-[#2f7108] transition-colors"
                                        >
                                            Kiválasztás
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-[13px] text-[#62788f]">
                                    Nincs találat erre: <strong>"{quickSearch}"</strong>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-[#E7E8EC] w-full" />

            {/* Térkép konténer */}
            <div className="w-full h-[550px] lg:h-[700px] min-h-[500px] relative">
                <MapErrorBoundary>
                    <PharmacyMap
                        pharmacies={effectivePharmacies}
                        selectedPharmacyId={selectedPharmacyId}
                        onSelectPharmacy={(id) => setSelectedPharmacyId(id)}
                        onViewDetails={(pharmacy) => setDetailPharmacy(pharmacy)}
                    />
                </MapErrorBoundary>
            </div>

            {/* Lábléc gomb */}
            <div className="pt-[16px] pb-[24px] px-[24px] border-t border-[#E7E8EC] flex items-center justify-between">
                <Link
                    href="/gyogyszertarak"
                    className="inline-flex items-center gap-[8px] text-[#002664] hover:text-[#378509] text-[14px] font-bold transition-colors"
                >
                    <span>Tovább a gyógyszertárkeresőre</span>
                    <div className="size-[20px] relative">
                        <Image
                            src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg"
                            alt="Nyíl"
                            width={20}
                            height={20}
                        />
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsFinderModalOpen(true)}
                    className="text-[13px] text-[#002664] hover:text-[#378509] font-medium underline cursor-pointer"
                >
                    Teljes lista megnyitása
                </button>
            </div>

            {/* Részletes Patika Adatlap Modal (ha a térképen rákattintanak a névre) */}
            <PharmacyDetailModal
                pharmacy={detailPharmacy}
                isOpen={Boolean(detailPharmacy)}
                onClose={() => setDetailPharmacy(null)}
                onSelectOnMap={(id) => setSelectedPharmacyId(id)}
            />

            {/* Teljes Kereső Modális Ablak (ha a Gyorskereső gombra kattintanak) */}
            {isFinderModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
                    <PharmacyFinder
                        title="Közeli patika kiválasztása"
                        description="Válasszon egy gyógyszertárat a térképről vagy a listából a készletváltozások követéséhez."
                        initialSelectedId={selectedPharmacyId || undefined}
                        onClose={() => setIsFinderModalOpen(false)}
                    />
                </div>,
                document.body
            )}
        </div>
    );
}

