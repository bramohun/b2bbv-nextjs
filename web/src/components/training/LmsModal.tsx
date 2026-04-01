'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * LEÍRÁS:
 * Felugró ablak (Modal) a BENU LMS rendszer bemutatásához és a külső oldalra 
 * történő átirányításhoz.
 * 
 * USER STORY:
 * Felhasználóként szeretnék tájékoztatást kapni a képzési rendszerről, mielőtt 
 * átnavigálnék a külső tanulási felületre.
 */

import React from 'react';

interface LmsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LmsModal: React.FC<LmsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-base-100 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative border border-base-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 btn btn-circle btn-ghost btn-sm"
                >
                    <span className="material-symbols-rounded">close</span>
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-rounded text-primary text-4xl">school</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">
                                Ismerje meg a BENU LMS rendszerét
                            </h2>
                            <div className="h-1 w-20 bg-primary rounded-full mt-1"></div>
                        </div>
                    </div>

                    <div className="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
                        <p className="text-lg font-medium text-base-content mb-4 italic">
                            A szakmai fejlődés és a naprakész tudás központja.
                        </p>
                        <p>
                            A <strong>BENU Képzési program</strong> gyógyszerészek és orvosok számára kialakított továbbképzési rendszer, amely támogatja a szakmai fejlődést és a naprakész tudás megszerzését. 
                        </p>
                        <p>
                            Az e-learning felületen gyártói, eladásösztönző és akkreditált képzések érhetők el az expediálók, gyógyszerészek és szakasszisztensek számára, online formában. A résztvevők így nemcsak elmélyíthetik ismereteiket, hanem gyártói támogatású akkreditált képzéseken is részt vehetnek, amelyekkel kreditpontokat is gyűjthetnek.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <a 
                            href="#" 
                            onClick={(e) => e.preventDefault()}
                            className="btn btn-primary flex-1 gap-2 rounded-xl group"
                        >
                            Tovább a BENU LMS-re
                            <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">open_in_new</span>
                        </a>
                        <button 
                            onClick={onClose}
                            className="btn btn-ghost rounded-xl"
                        >
                            Bezárás
                        </button>
                    </div>
                </div>

                {/* Footer Decoration */}
                <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
            </div>
        </div>
    );
};
