'use client';

import React from 'react';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék figyelmeztetést kapni, ha egy olyan terméket veszek ki
 * a mentett gyógyszerek közül, amelyre értesítést kértem, mert az értesítés is meg fog szűnni.
 * 
 * FUNKCIÓK:
 * - Figyelmeztető üzenet megjelenítése.
 * - Megerősítés (Mentett gyógyszer + Értesítés eltávolítása).
 * - Megszakítás (Visszatérés az eredeti állapothoz).
 * 
 * ÜZLETI/MŰKÖDÉSI LOGIKA:
 * - Ha a termék mentett ÉS van rá aktív értesítés feliratkozás, akkor
 *   a mentés eltávolítása gombra kattintva ez a modal jelenik meg.
 * - "Mégsem" a nézet elsődleges gombja (visszavonás).
 * - "Igen, biztosan" az eltávolítást hajtja végre.
 */

interface FavoriteRemovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const FavoriteRemovalModal: React.FC<FavoriteRemovalModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open z-[100]">
            <div className="modal-box shadow-2xl border border-base-300">
                <div className="flex items-center gap-3 text-error mb-4">
                    <span className="material-symbols-rounded text-3xl">warning</span>
                    <h3 className="font-bold text-xl">Értesítés is megszűnik!</h3>
                </div>

                <div className="py-2 space-y-4">
                    <p className="font-semibold text-lg leading-tight">
                        Ha kiveszi a mentett gyógyszerek közül a terméket, nem kap több értesítést!
                    </p>
                    <p className="text-base-content/70">
                        Biztosan szeretné kivenni a mentett gyógyszerek közül és ezzel nem kap a termékről több értesítést sem?
                    </p>
                </div>

                <div className="modal-action flex flex-row-reverse gap-3 mt-8">
                    <button
                        className="btn btn-primary px-8"
                        onClick={onClose}
                        autoFocus
                    >
                        Mégsem
                    </button>
                    <button
                        className="btn btn-ghost text-error hover:bg-error/10"
                        onClick={onConfirm}
                    >
                        Igen, biztosan
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
                <button onClick={onClose}>bezárás</button>
            </form>
        </dialog>
    );
};
