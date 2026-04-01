'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
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
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full overflow-hidden">
            <div className="card-body p-0">
                {/* Header with gradient */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-200">
                    <h2 className="card-title text-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary filled">school</span>
                        Képzési Program
                    </h2>
                    <p className="text-[11px] text-base-content/60 font-bold uppercase tracking-wider">
                        Legújabb szakmai anyagok
                    </p>
                </div>

                <div className="p-4 space-y-4">
                    {featuredCourses.map((course) => (
                        <Link 
                            key={course.id} 
                            href={`/kepzesek/${course.id}`}
                            className="group flex gap-3 items-start p-2 rounded-xl hover:bg-base-200/50 transition-all border border-transparent hover:border-base-200"
                        >
                            {/* Video/PDF Thumbnail Placeholder */}
                            <div className="relative w-20 h-14 rounded-lg bg-base-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                <span className="material-symbols-rounded text-base-content/30 text-2xl group-hover:scale-110 transition-transform">
                                    {course.contentType === 'video' ? 'play_circle' : 'picture_as_pdf'}
                                </span>
                                {/* Category indicator */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                                    course.category === 'Akkreditált' ? 'bg-success' : 
                                    course.category === 'Gyártói' ? 'bg-info' : 'bg-warning'
                                }`}></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-base-content group-hover:text-primary transition-colors truncate">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                                        course.category === 'Akkreditált' ? 'bg-success/10 text-success border-success/20' : 
                                        course.category === 'Gyártói' ? 'bg-info/10 text-info border-info/20' : 
                                        'bg-warning/10 text-warning border-warning/20'
                                    }`}>
                                        {course.category}
                                    </span>
                                    <span className="text-[10px] text-base-content/50 flex items-center gap-0.5">
                                        <span className="material-symbols-rounded text-xs">timer</span>
                                        {course.durationMinutes} perc
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="p-4 mt-auto border-t border-base-200 bg-base-200/20">
                    <Link 
                        href="/kepzesek" 
                        className="btn btn-ghost btn-sm w-full text-primary gap-2 hover:bg-primary/10"
                    >
                        Összes képzés megtekintése
                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
