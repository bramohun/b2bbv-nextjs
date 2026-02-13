/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném látni a közösségi fórum legfrissebb aktivitásait, 
 * hogy bekapcsolódhassak a beszélgetésekbe és tájékozódjak a közösségi témákról.
 * 
 * FUNKCIÓK:
 * - Statisztikai összesítő: A beállított időszak alapján új bejegyzések és kommentek száma.
 * - Aktivitási lista: A legutóbbi 10 fórumtéma megjelenítése.
 * - Téma részletek: Cím, létrehozó neve, és formázott időbélyeg.
 * - Kategória jelölés: Specializáció badge-ek (pl. "Belgyógyászat").
 * - Interakciós adatok: Hozzászólások számának kijelzése.
 * - Navigáció: Linkek az egyes fórumtémák részletes nézetéhez.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/app/(dashboard)/kozosseg/page.tsx
 * - src/types/forum.ts
 * - src/app/api/forum/stats/route.ts
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ForumTopic } from '@/types/forum';
import { formatDate } from '@/lib/utils';

interface CommunityActivityWidgetProps {
    activities: ForumTopic[];
    period?: number;
}

interface ForumStats {
    newTopics: number;
    newComments: number;
}

export function CommunityActivityWidget({ activities, period = 1 }: CommunityActivityWidgetProps) {
    const [stats, setStats] = useState<ForumStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(`/api/forum/stats?period=${period}`);
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (error) {
                console.error('Failed to fetch forum stats:', error);
            }
        }
        fetchStats();
    }, [period]);

    const periodLabel = period === 1 ? 'MAI NAP' : `ELMÚLT ${period} NAP`;
    const totalChanges = stats ? stats.newTopics + stats.newComments : 0;

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">forum</span>
                        Közösségi aktivitások
                    </h2>
                </div>

                {/* Summary Stats */}
                {stats && (
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <div className="bg-info/10 border border-info/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-info/70 uppercase tracking-widest mb-1 leading-none">
                                {periodLabel} aktivitásai
                            </span>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-2xl font-black text-info italic tracking-tight">{totalChanges}</span>
                                <span className="text-[10px] font-bold text-info/60 uppercase">db változás</span>
                            </div>

                            <div className="flex justify-center gap-4 text-[11px] font-bold text-info">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-info/10 border border-info/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse"></span>
                                    {stats.newTopics} új bejegyzés
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-info/10 border border-info/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-info/60"></span>
                                    {stats.newComments} új komment
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {activities.length > 0 ? (
                        activities.map((topic) => (
                            <div key={topic.id} className="group flex flex-col p-2 rounded-lg hover:bg-base-200/50 transition-colors border border-transparent hover:border-base-200">
                                <Link
                                    href={`/kozosseg/${topic.id}`}
                                    className="font-semibold text-sm group-hover:text-primary mb-1 line-clamp-1"
                                >
                                    {topic.title}
                                </Link>
                                <div className="flex items-center justify-between text-[11px] text-base-content/60">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-0.5">
                                            <span className="material-symbols-rounded text-[14px]">person</span>
                                            {topic.authorName}
                                        </span>
                                        <span className="flex items-center gap-0.5">
                                            <span className="material-symbols-rounded text-[14px]">chat_bubble_outline</span>
                                            {topic.commentCount}
                                        </span>
                                    </div>
                                    <span className="italic">
                                        {formatDate(new Date(topic.createdAt).toISOString())}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-base-content/50">
                            Nincs legutóbbi aktivitás.
                        </div>
                    )}
                </div>

                <div className="card-actions justify-start mt-4 pt-4 border-t border-base-200">
                    <Link href="/kozosseg" className="btn btn-ghost btn-sm text-primary gap-1">
                        Tovább a Közösség oldalra
                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
