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
 * - Aktivitási lista: A legutóbbi 10 fórumtéma megjelenítése.
 * - Téma részletek: Cím, létrehozó neve, és formázott időbélyeg.
 * - Kategória jelölés: Specializáció badge-ek (pl. "Belgyógyászat").
 * - Interakciós adatok: Hozzászólások számának kijelzése.
 * - Navigáció: Linkek az egyes fórumtémák részletes nézetéhez.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/app/(dashboard)/kozosseg/page.tsx
 * - src/types/forum.ts
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ForumTopic } from '@/types/forum';
import { formatDate } from '@/lib/utils';

interface CommunityActivityWidgetProps {
    activities: ForumTopic[];
}

export function CommunityActivityWidget({ activities }: CommunityActivityWidgetProps) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">forum</span>
                        Közösségi aktivitások
                    </h2>
                </div>

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
