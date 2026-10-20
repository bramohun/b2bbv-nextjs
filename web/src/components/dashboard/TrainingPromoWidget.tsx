'use client';

/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez a modul és a képzési promóciós widget jelenleg NEM képezi a fejlesztési
 * scope részét. Kód- és felületi szinten kizárólag tervezetként van jelen,
 * az éles irányítópulton nincs használatban.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - KÉPZÉS PROMÓ WIDGET (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * LEÍRÁS:
 * Dashboard widget a BENU Képzési Program legújabb tanfolyamainak népszerűsítésére.
 * 
 * USER STORY:
 * Felhasználóként szeretném gyorsan áttekinteni a legújabb elérhető képzéseket 
 * az irányítópulton, hogy naprakész maradjak a szakmai fejlődésemben.
 */

import React from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/training-data';

export function TrainingPromoWidget() {
    // Show top 5-6 courses
    const featuredCourses = COURSES.slice(0, 6);

    return (
        <div className="card bg-white shadow-benu-card border border-benu rounded-2xl h-full overflow-hidden">
            <div className="card-body p-0">
                {/* Header */}
                <div className="p-4 bg-[#F9F9FB] border-b border-benu">
                    <h2 className="card-title text-base font-bold text-[#002664] flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary text-xl filled">school</span>
                        Képzési Program
                    </h2>
                    <p className="text-[11px] text-[#62788F] font-bold uppercase tracking-wider">
                        Legújabb szakmai anyagok
                    </p>
                </div>

                <div className="p-4 space-y-3">
                    {featuredCourses.map((course) => (
                        <Link 
                            key={course.id} 
                            href={`/kepzesek/${course.id}`}
                            className="group flex gap-3 items-start p-2 rounded-xl hover:bg-[#F9F9FB] transition-all border border-transparent hover:border-benu"
                        >
                            {/* Video/PDF Thumbnail Placeholder */}
                            <div className="relative w-18 h-13 rounded-lg bg-[#EFF0F3] flex-shrink-0 overflow-hidden flex items-center justify-center">
                                <span className="material-symbols-rounded text-[#62788F]/50 text-2xl group-hover:scale-110 transition-transform">
                                    {course.contentType === 'video' ? 'play_circle' : 'picture_as_pdf'}
                                </span>
                                {/* Category indicator line */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                                    course.category === 'Akkreditált' ? 'bg-[#378509]' : 
                                    course.category === 'Gyártói' ? 'bg-[#002664]' : 'bg-[#DBC51D]'
                                }`}></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-bold text-[#002664] group-hover:text-primary transition-colors truncate">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase border ${
                                        course.category === 'Akkreditált' ? 'bg-[#E8F8E2] text-[#317907] border-[#C4EDB6]' : 
                                        course.category === 'Gyártói' ? 'bg-blue-50 text-[#002664] border-blue-200' : 
                                        'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>
                                        {course.category}
                                    </span>
                                    <span className="text-[10px] text-[#62788F] flex items-center gap-0.5 font-mono">
                                        <span className="material-symbols-rounded text-xs">timer</span>
                                        {course.durationMinutes} perc
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="p-4 mt-auto border-t border-benu bg-[#F9F9FB]">
                    <Link 
                        href="/kepzesek" 
                        className="btn btn-ghost btn-sm w-full rounded-lg text-primary font-bold gap-2 hover:bg-white"
                    >
                        Összes képzés megtekintése
                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
