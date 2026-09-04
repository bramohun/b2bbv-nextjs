'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - IRÁNYÍTÓPULT (DASHBOARD FŐOLDAL)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A portál bejelentkezést követő központi áttekintő felülete a legújabb Figma
 * tervek szerinti 2 oszlopos reszponzív elrendezéssel.
 * - Bal oszlop: Globális készletváltozás összesítő kártya és a legutóbbi 20
 *   készletváltozás részletes táblázata.
 * - Jobb oszlop: Közeli gyógyszertár kiválasztása nagy térképes modul, vagy
 *   amennyiben van kijelölt patika, annak helyi készletmozgási összesítője és táblázata.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként egy modern, fókuszált felületen szeretném azonnal látni a piaci
 *   hiányokat, megszűnéseket és a patikám készletének alakulását.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Időszakválasztó kapszula gomb (PeriodSelector)
 * - Globális készletösszesítő kártya (StockNotificationCard)
 * - Legutóbbi készletváltozások táblázat (StockChangesWidget)
 * - Közeli patika térkép és készlet modul (PharmacyStockWidget)
 * - Gyógyszertár kereső (/gyogyszertarak)
 * - Gyógyszer nyilvántartás (/gyogyszerek)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.1)
 * ============================================================================
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { StockNotificationCard } from '@/components/dashboard/StockNotificationCard';
import { StockChangesWidget } from '@/components/dashboard/StockChangesWidget';
import { PharmacyStockWidget } from '@/components/dashboard/PharmacyStockWidget';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { fetchStaticData } from '@/lib/static-fetch';
import { Pharmacy, Medicine } from '@/types';

function DashboardContent() {
    const searchParams = useSearchParams();
    const periodParam = searchParams.get('period');
    const period = parseInt(periodParam || '3', 10); // Matches Figma default "Elmúlt 3 nap"

    const [stockStats, setStockStats] = useState<{
        stats: { total: number; megszunt: number; hiany: number; elerheto: number };
        latestChanges: Medicine[];
    }>({
        stats: { total: 14, megszunt: 1, hiany: 12, elerheto: 1 }, // Default sample matching Figma 13334:18186
        latestChanges: []
    });

    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const [statsData, pharmData] = await Promise.all([
                    fetchStaticData<any>('/data/dashboard-stats.json'),
                    fetchStaticData<Pharmacy[]>('/data/pharmacies.json')
                ]);
                if (statsData) {
                    setStockStats({
                        stats: statsData.stats || { total: 14, megszunt: 1, hiany: 12, elerheto: 1 },
                        latestChanges: statsData.latestChanges || []
                    });
                }
                if (pharmData) setPharmacies(pharmData);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        }
        load();
    }, [period]);

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-6">
            {/* Fejléc Sáv: Cím + Időszak Választó */}
            <div className="flex flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <div className="size-[36px] relative shrink-0">
                        <Image
                            src="/assets/figma/fbac0194bef5cfd022a9163982735ef9952d202c.svg"
                            alt="Irányítópult"
                            width={36}
                            height={36}
                        />
                    </div>
                    <h1 className="text-[22px] md:text-[24px] font-bold text-[#002664]">
                        Irányítópult
                    </h1>
                </div>

                <PeriodSelector period={period} />
            </div>

            {/* 2 Oszlopos Tartalmi Rács (Figma 13334:18186 & 13334:18187 elrendezés) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* BAL OSZLOP: Globális Készletinformációk (~45-50% / 6 oszlop) */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                    {/* 1. Kártya: Globális készletváltozás értesítő/összesítő */}
                    <StockNotificationCard
                        type="global"
                        title="Globális készletváltozás"
                        period={period}
                        total={stockStats.stats.total || 14}
                        megszunt={stockStats.stats.megszunt || 1}
                        hiany={stockStats.stats.hiany || 12}
                        elerheto={stockStats.stats.elerheto || 1}
                    />

                    {/* 2. Kártya: Legutóbbi 20 készletváltozás táblázat */}
                    <StockChangesWidget
                        changes={stockStats.latestChanges}
                        title="Legutóbbi 20 készletváltozás"
                        subtitle="Élő készletinformációk és beérkező termékek állapota"
                    />
                </div>

                {/* JOBB OSZLOP: Patika Készlet / Interaktív Térkép (~50-55% / 6 oszlop) */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                    <PharmacyStockWidget
                        pharmacies={pharmacies}
                        period={period}
                    />
                </div>

            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-[#002664]"></span>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
