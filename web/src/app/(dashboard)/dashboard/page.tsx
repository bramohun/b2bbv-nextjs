/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként egy központi felületen szeretném látni a legfontosabb 
 * információkat (készletváltozások, közeli patika állapota, közösségi aktivitás), 
 * hogy gyorsan képet kapjak az aktuális helyzetről.
 * 
 * FUNKCIÓK:
 * - Összegző nézet: Három fő szekció (Készletváltozások, Közeli patika, Közösség).
 * - Adatkezelés: Server Component adatlekérdezés (kivéve patika specifikus adatok).
 * - Reszponzivitás: 
 *   - Asztali nézet (lg): 3 oszlopos grid elrendezés.
 *   - Tablet/Mobil nézet: 1 oszlopos elrendezés (stacking).
 * - Fluid Layout: A felület kitölti a rendelkezésre álló szélességet.
 * - Időszak választó: URL alapú állapotkezelés.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/components/dashboard/StockChangesWidget.tsx
 * - src/components/dashboard/PharmacyStockWidget.tsx
 * - src/components/dashboard/CommunityActivityWidget.tsx
 */

import React from 'react';
import { getGlobalStockStats, getPharmacies } from '@/lib/data';
import { getLatestForumActivity, getForumStats } from '@/lib/forum-service';
import { StockChangesWidget } from '@/components/dashboard/StockChangesWidget';
import { CommunityActivityWidget } from '@/components/dashboard/CommunityActivityWidget';
import { PharmacyStockWidget } from '@/components/dashboard/PharmacyStockWidget';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
    const { period: periodParam } = await searchParams;
    const period = parseInt(periodParam || '1', 10);

    // Fetch data in parallel on the server
    const [stockStats, pharmacies, forumActivity, forumStats] = await Promise.all([
        getGlobalStockStats(period),
        getPharmacies(),
        getLatestForumActivity(10),
        getForumStats(period)
    ]);

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
                {/* Left Column: Medicine Stock Changes */}
                <div className="lg:col-span-1">
                    <StockChangesWidget
                        stats={stockStats.stats}
                        changes={stockStats.latestChanges}
                        period={period}
                    />
                </div>

                {/* Middle Column: Pharmacy Activity */}
                <div className="lg:col-span-1">
                    <PharmacyStockWidget
                        pharmacies={pharmacies}
                        period={period}
                    />
                </div>

                {/* Right Column: Community Activity */}
                <div className="lg:col-span-1">
                    <CommunityActivityWidget
                        activities={forumActivity}
                        stats={forumStats}
                        period={period}
                    />
                </div>
            </div>
        </div>
    );
}
