/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném látni egy konkrét termék elérhetőségét (készlet vagy
 * rendelés) gyógyszertárakra lebontva, térképes és listás nézetben egy modalban.
 * 
 * FUNKCIÓK:
 * - Teljes képernyős modal.
 * - Bezárás gomb.
 * - `PharmacyFinder` beágyazása a termék-specifikus szűréssel.
 */

'use client';

import React from 'react';
import { PharmacyFinder } from './PharmacyFinder';

interface PharmacyStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    medicineName: string;
    statusType: 'stock' | 'order';
    filterIds: string[];
}

export const PharmacyStockModal: React.FC<PharmacyStockModalProps> = ({
    isOpen,
    onClose,
    medicineName,
    statusType,
    filterIds
}) => {
    if (!isOpen) return null;

    const title = statusType === 'stock'
        ? `${medicineName} készleten az alábbi gyógyszertárakban`
        : `${medicineName} rendelésre az alábbi gyógyszertárakban`;

    return (
        <div className="fixed inset-0 z-[60] bg-base-100 flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex-none p-4 flex justify-between items-center bg-primary text-primary-content shadow-lg z-[70]">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-rounded">local_pharmacy</span>
                    <h2 className="text-xl font-bold line-clamp-1">{title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="btn btn-ghost btn-circle text-primary-content hover:bg-primary-focus"
                >
                    <span className="material-symbols-rounded">close</span>
                </button>
            </div>

            {/* Modal Content - The Finder */}
            <div className="flex-1 overflow-hidden">
                <PharmacyFinder
                    filterIds={filterIds}
                    title="" // Title is handled by modal header
                    description={statusType === 'stock' ? "Kizárólag a készlettel rendelkező patikák láthatóak." : "Kizárólag a rendelést fogadó patikák láthatóak."}
                />
            </div>
        </div>
    );
};
