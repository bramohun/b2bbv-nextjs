'use client';

/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez az oldal és a kapcsolódó képzési program funkciók jelenleg NEM képezik
 * a fejlesztési scope részét. Kód- és felületi szinten kizárólag tervezetként
 * / koncepcióként van jelen a prototípusban, a navigációból kivezetve.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - KÉPZÉSEK FŐOLDAL (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * ÚTVONAL: /kepzesek
 * 
 * CÉL:
 * A BENU Képzési Program főoldala, ahol az orvosok böngészhetnek a 
 * rendelkezésre álló szakmai és akkreditált képzések között.
 * 
 * USER STORYK:
 * - Mint felhasználó, látni szeretném az elérhető képzések listáját.
 * - Mint felhasználó, szűrni szeretném a képzéseket kategória szerint.
 * - Mint felhasználó, el szeretném indítani az érdeklődési folyamatot (popup).
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { COURSES, CourseCategory } from '@/lib/training-data';
import { LmsModal } from '@/components/training/LmsModal';

export default function TrainingListPage() {
    const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All');
    const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);

    const categories: (CourseCategory | 'All')[] = ['All', 'Akkreditált', 'Gyártói', 'Eladásösztönző'];

    const filteredCourses = useMemo(() => {
        if (selectedCategory === 'All') return COURSES;
        return COURSES.filter(c => c.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12">
            {/* Tervezet figyelmeztető banner */}
            <div className="alert alert-warning shadow-md rounded-2xl mb-6 border border-amber-300 bg-amber-50 text-amber-900 flex items-center gap-3 p-4">
                <span className="material-symbols-rounded text-2xl text-amber-600 shrink-0">warning</span>
                <div>
                    <span className="font-bold block text-sm">Tervezet – Jelenleg nem fejlesztési scope</span>
                    <span className="text-xs text-amber-800">Ez a képzési felület és a kapcsolódó képzési rendszer jelenleg nem képezi a fejlesztési scope részét, kizárólag felületi koncepcióként tekinthető meg.</span>
                </div>
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="size-[36px] rounded-lg bg-[#002664] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-rounded text-2xl">school</span>
                        </div>
                        <h1 className="text-[22px] md:text-[24px] font-bold text-[#002664] leading-[33px]">
                            Képzési program
                        </h1>
                    </div>
                    <p className="text-[#62788f] text-[15px] mt-2 max-w-2xl font-normal">
                        Szakmai fejlődés, naprakész tudás és akkreditált pontgyűjtés egy helyen. 
                        Böngésszen orvosoknak és gyógyszerészeknek szánt anyagaink között.
                    </p>
                </div>

                <div className="flex bg-base-100 p-1 rounded-2xl shadow-sm border border-base-200">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                selectedCategory === cat 
                                ? 'bg-primary text-white shadow-md' 
                                : 'hover:bg-base-200 text-base-content/70'
                            }`}
                        >
                            {cat === 'All' ? 'Összes' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <div 
                        key={course.id} 
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-200 group overflow-hidden"
                    >
                        {/* Course Thumbnail */}
                        <div className="relative aspect-video bg-base-300 flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-rounded text-6xl text-base-content/10 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-500">
                                {course.contentType === 'video' ? 'play_circle' : 'picture_as_pdf'}
                            </span>
                            
                            {/* Overlay Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                    course.category === 'Akkreditált' ? 'bg-success text-white' : 
                                    course.category === 'Gyártói' ? 'bg-info text-white' : 'bg-warning text-black'
                                }`}>
                                    {course.category}
                                </span>
                            </div>

                            {/* Duration Badge */}
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-rounded text-sm">timer</span>
                                {course.durationMinutes} perc
                            </div>
                        </div>

                        <div className="card-body p-6">
                            <h2 className="card-title text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                                {course.title}
                            </h2>
                            <p className="text-sm text-base-content/70 line-clamp-3 mb-6 leading-relaxed">
                                {course.shortDescription}
                            </p>
                            
                            <div className="card-actions flex-col gap-3 mt-auto">
                                <Link 
                                    href={`/kepzesek/${course.id}`}
                                    className="btn btn-outline btn-primary w-full rounded-xl border-2"
                                >
                                    Részletek
                                </Link>
                                <button 
                                    onClick={() => setIsLmsModalOpen(true)}
                                    className="btn btn-primary w-full rounded-xl gap-2 shadow-lg shadow-primary/20"
                                >
                                    Érdekel
                                    <span className="material-symbols-rounded text-sm">info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-rounded text-4xl text-base-content/30">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold">Nincs találat</h3>
                    <p className="text-base-content/60">Ebben a kategóriában jelenleg nincsenek elérhető képzések.</p>
                </div>
            )}

            {/* Lms Modal */}
            <LmsModal 
                isOpen={isLmsModalOpen} 
                onClose={() => setIsLmsModalOpen(false)} 
            />
        </div>
    );
}
