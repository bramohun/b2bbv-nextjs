'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - IRÁNYÍTÓPULT (GitHub Pages Statikus Nézet)
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként egy központi felületen szeretném látni a legfontosabb 
 * információkat (készletváltozások, közeli patika állapota, közösségi aktivitás), 
 * hogy gyorsan képet kapjak az aktuális helyzetről.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StockChangesWidget } from '@/components/dashboard/StockChangesWidget';
import { TrainingPromoWidget } from '@/components/dashboard/TrainingPromoWidget';
import { PharmacyStockWidget } from '@/components/dashboard/PharmacyStockWidget';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { fetchStaticData } from '@/lib/static-fetch';
import { Pharmacy, Medicine } from '@/types';

function DashboardContent() {
    const searchParams = useSearchParams();
    const periodParam = searchParams.get('period');
    const period = parseInt(periodParam || '1', 10);

    const [stockStats, setStockStats] = useState<{
        stats: { total: number; megszunt: number; hiany: number; elerheto: number };
        latestChanges: Medicine[];
    }>({
        stats: { total: 0, megszunt: 0, hiany: 0, elerheto: 0 },
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
                if (statsData) setStockStats(statsData);
                if (pharmData) setPharmacies(pharmData);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        }
        load();
    }, [period]);

    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-symbols-rounded text-primary text-4xl">dashboard</span>
                    Irányítópult
                </h1>

                <PeriodSelector period={period} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <StockChangesWidget
                        stats={stockStats.stats}
                        changes={stockStats.latestChanges}
                        period={period}
                    />
                </div>

                <div className="lg:col-span-1">
                    <PharmacyStockWidget
                        pharmacies={pharmacies}
                        period={period}
                    />
                </div>

                <div className="lg:col-span-1">
                    <TrainingPromoWidget />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><span className="loading loading-spinner text-primary"></span></div>}>
            <DashboardContent />
        </Suspense>
    );
}
