'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * ÚTVONAL: /kepzesek/[courseId]
 * 
 * CÉL:
 * Egy konkrét tanfolyam részletes adatlapja, bevezető videóval és leírással.
 * 
 * USER STORYK:
 * - Mint felhasználó, el szeretném olvasni a tanfolyam teljes leírását.
 * - Mint felhasználó, meg akarom nézni a bevezető videót (placeholder).
 * - Mint felhasználó, jelentkezni szeretnék a tanfolyamra (popup).
 */

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCourseById } from '@/lib/training-data';
import { LmsModal } from '@/components/training/LmsModal';

export default function CourseDetailClient() {
    const params = useParams();
    const courseId = params.courseId as string;
    const course = getCourseById(courseId);
    
    const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);

    if (!course) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <span className="material-symbols-rounded text-6xl text-error mb-4">error</span>
                <h1 className="text-2xl font-bold">Tanfolyam nem található</h1>
                <p className="text-base-content/60 mb-6">A keresett képzés nem létezik vagy eltávolították.</p>
                <Link href="/kepzesek" className="btn btn-primary rounded-xl">
                    <span className="material-symbols-rounded">arrow_back</span>
                    Vissza a listához
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12">
            {/* Navigation Back */}
            <Link 
                href="/kepzesek" 
                className="btn btn-ghost btn-sm gap-2 mb-6 hover:bg-base-300 rounded-lg group"
            >
                <span className="material-symbols-rounded group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Vissza a képzésekhez
            </Link>

            {/* Main Content Card */}
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl">
                {/* Introduction Video Placeholder Section */}
                <div className="relative aspect-video bg-neutral flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)]"></div>
                    
                    <div className="z-10 flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500 cursor-pointer shadow-2xl">
                            <span className="material-symbols-rounded text-6xl text-white ml-2">play_arrow</span>
                        </div>
                        <p className="text-white/60 font-black tracking-widest text-xs uppercase">Bevezető videó megtekintése</p>
                    </div>

                    <div className="absolute top-6 right-6">
                        <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl ${
                            course.category === 'Akkreditált' ? 'bg-success text-white' : 
                            course.category === 'Gyártói' ? 'bg-info text-white' : 'bg-warning text-black'
                        }`}>
                            {course.category}
                        </span>
                    </div>
                </div>

                <div className="card-body p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-primary leading-tight mb-4 uppercase tracking-tighter italic">
                                {course.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 items-center text-sm text-base-content/60 font-medium">
                                <span className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded-full">
                                    <span className="material-symbols-rounded text-sm">timer</span>
                                    Várható idő: {course.durationMinutes} perc
                                </span>
                                <span className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded-full uppercase tracking-tighter">
                                    <span className="material-symbols-rounded text-sm">
                                        {course.contentType === 'video' ? 'play_circle' : 'picture_as_pdf'}
                                    </span>
                                    {course.contentType === 'video' ? 'Videó alapú képzés' : 'PDF dia sorozat'}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsLmsModalOpen(true)}
                            className="btn btn-primary btn-lg rounded-2xl gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg group"
                        >
                            Érdekel
                            <span className="material-symbols-rounded animate-pulse">check_circle</span>
                        </button>
                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-4">
                        <div className="lg:col-span-3">
                            <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
                                <span className="material-symbols-rounded text-primary">description</span>
                                Tanfolyam részletei
                            </h3>
                            <div className="prose prose-lg max-w-none text-base-content/80 leading-relaxed italic">
                                <p className="mb-6 whitespace-pre-wrap">{course.longDescription}</p>
                            </div>

                            <div className="mt-12 bg-base-200/50 p-6 rounded-3xl border border-dashed border-base-300">
                                <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-4">Tartalmi elemek</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm hover:translate-x-2 transition-transform cursor-pointer border border-base-200 group">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-rounded">play_circle</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">Modul 1: Alapfogalmak és patológia</p>
                                            <p className="text-[10px] opacity-60">VIDEÓ | 15:40</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm hover:translate-x-2 transition-transform cursor-pointer border border-base-200 group">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-rounded">picture_as_pdf</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">Modul 2: Klinikai vizsgálatok részletesen</p>
                                            <p className="text-[10px] opacity-60">PDF | 24 dia</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm opacity-50 cursor-not-allowed">
                                        <div className="w-10 h-10 rounded-lg bg-base-200 text-base-content flex items-center justify-center">
                                            <span className="material-symbols-rounded text-sm">lock</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">Modul 3: Záróteszt és Akkreditáció</p>
                                            <p className="text-[10px] opacity-60">A tartalom eléréséhez lépjen be a BENU LMS rendszerbe</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="p-6 bg-gradient-to-br from-primary to-primary-focus rounded-3xl text-white shadow-xl">
                                    <span className="material-symbols-rounded text-4xl mb-4">stars</span>
                                    <h4 className="font-black text-xl mb-2 italic">Akkreditált pontok</h4>
                                    <p className="text-sm text-white/80 leading-tight">
                                        Ezen tanfolyam sikeres elvégzéséért <strong>2 kreditpont</strong> jár szakgyógyszerészek és orvosok számára.
                                    </p>
                                    <button 
                                        onClick={() => setIsLmsModalOpen(true)}
                                        className="btn btn-white btn-sm mt-6 w-full rounded-xl text-primary font-black"
                                    >
                                        Pontszerzés
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LmsModal 
                isOpen={isLmsModalOpen} 
                onClose={() => setIsLmsModalOpen(false)} 
            />
        </div>
    );
}
