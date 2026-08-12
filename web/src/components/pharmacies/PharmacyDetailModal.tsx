/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném megtekinteni egy kiválasztott gyógyszertár részletes
 * adatait (teljes heti nyitvatartási rend, elérhetőségek, cím), hogy pontos
 * információt kapjak a patika működéséről anélkül, hogy elhagynám a kereső oldalt.
 * 
 * FUNKCIÓK:
 * - Gyógyszertár részletes adatlapja modális ablakban (Modal).
 * - Heti nyitvatartási rend megjelenítése (Hétfőtől Vasárnapig) az aktuális nap kiemelésével.
 * - Kattintható elérhetőségek: Telefonszám (hívás indítása) és E-mail cím (levelező megnyitása).
 * - "Közeli patikának jelölöm" gomb (szinkronizálva a NearbyPharmacyContext-tel).
 * - "Mutasd térképen" gomb (a modal bezárása és a térkép fókuszálása az adott patikára).
 * - Reszponzív elrendezés mobilos és asztali kijelzőkre.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - Parent: PharmacyFinder
 * - Context: NearbyPharmacyContext
 * - Types: Pharmacy
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { Pharmacy } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { getPharmacyOpeningStatus } from '@/lib/pharmacy-utils';

interface PharmacyDetailModalProps {
    pharmacy: Pharmacy | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectOnMap?: (id: string) => void;
}

export const PharmacyDetailModal: React.FC<PharmacyDetailModalProps> = ({
    pharmacy,
    isOpen,
    onClose,
    onSelectOnMap
}) => {
    const { isNearby, setNearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const markedNearby = useMemo(() => {
        return pharmacy ? isNearby(pharmacy.id) : false;
    }, [pharmacy, isNearby]);

    const openingStatus = useMemo(() => {
        return pharmacy ? getPharmacyOpeningStatus(pharmacy) : null;
    }, [pharmacy]);

    if (!isOpen || !pharmacy) return null;

    const daysList = [
        { name: 'Hétfő', open: pharmacy.mondayOpen, close: pharmacy.mondayClose, dayIndex: 1 },
        { name: 'Kedd', open: pharmacy.tuesdayOpen, close: pharmacy.tuesdayClose, dayIndex: 2 },
        { name: 'Szerda', open: pharmacy.wednesdayOpen, close: pharmacy.wednesdayClose, dayIndex: 3 },
        { name: 'Csütörtök', open: pharmacy.thursdayOpen, close: pharmacy.thursdayClose, dayIndex: 4 },
        { name: 'Péntek', open: pharmacy.fridayOpen, close: pharmacy.fridayClose, dayIndex: 5 },
        { name: 'Szombat', open: pharmacy.saturdayOpen, close: pharmacy.saturdayClose, dayIndex: 6 },
        { name: 'Vasárnap', open: pharmacy.sundayOpen, close: pharmacy.sundayClose, dayIndex: 0 },
    ];

    const currentDayIndex = new Date().getDay();

    const handleShowOnMap = () => {
        if (onSelectOnMap && pharmacy) {
            onSelectOnMap(pharmacy.id);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            {/* Click outside backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-base-200">
                {/* Header */}
                <div className="p-4 sm:p-5 bg-base-200/50 border-b border-base-200 flex justify-between items-start gap-3">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-base-content leading-tight">{pharmacy.nev}</h2>
                            {pharmacy.id.startsWith('BF') && (
                                <span className="badge badge-neutral text-xs font-mono">{pharmacy.id}</span>
                            )}
                        </div>
                        {markedNearby && (
                            <span className="inline-flex items-center text-xs text-primary font-bold tracking-wider uppercase gap-1">
                                <span className="material-symbols-rounded text-sm">home</span>
                                Közeli gyógyszertár
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-ghost btn-sm text-gray-500 hover:bg-base-300 flex-none"
                        aria-label="Bezárás"
                    >
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1">
                    {/* Status & Quick Info */}
                    <div className="bg-base-200/30 rounded-xl p-4 space-y-3 border border-base-200">
                        {openingStatus && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">Jelenlegi státusz:</span>
                                {openingStatus.status === 'open' ? (
                                    <div className="badge badge-success badge-sm font-bold gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        Nyitva
                                    </div>
                                ) : openingStatus.status === 'closing_soon' ? (
                                    <div className="badge badge-warning badge-sm font-bold gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        Hamarosan zár
                                    </div>
                                ) : (
                                    <div className="badge badge-error badge-sm font-bold">Zárva</div>
                                )}
                                <span className="text-xs text-gray-500 font-medium ml-auto">
                                    {openingStatus.hoursDisplay}
                                </span>
                            </div>
                        )}

                        <div className="space-y-2 text-sm text-base-content/80 pt-1">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-rounded text-primary text-lg flex-none mt-0.5">location_on</span>
                                <div>
                                    <div className="font-semibold text-base-content">Cím</div>
                                    <div>{pharmacy.irsz} {pharmacy.telepules}, {pharmacy.cim}</div>
                                </div>
                            </div>

                            {pharmacy.telefon && (
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-rounded text-primary text-lg flex-none mt-0.5">call</span>
                                    <div>
                                        <div className="font-semibold text-base-content">Telefon</div>
                                        <a href={`tel:${pharmacy.telefon.replace(/\s+/g, '')}`} className="text-primary hover:underline font-medium">
                                            {pharmacy.telefon}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {pharmacy.email && (
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-rounded text-primary text-lg flex-none mt-0.5">mail</span>
                                    <div>
                                        <div className="font-semibold text-base-content">E-mail cím</div>
                                        <a href={`mailto:${pharmacy.email}`} className="text-primary hover:underline font-medium break-all">
                                            {pharmacy.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Opening Hours */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="material-symbols-rounded text-lg text-primary">schedule</span>
                            Heti nyitvatartási rend
                        </h3>

                        <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden divide-y divide-base-200">
                            {daysList.map((day) => {
                                const isToday = day.dayIndex === currentDayIndex;
                                const isOpenDay = Boolean(day.open && day.close);

                                return (
                                    <div
                                        key={day.name}
                                        className={`flex justify-between items-center px-4 py-2.5 text-sm transition-colors ${
                                            isToday ? 'bg-primary/10 font-semibold' : 'hover:bg-base-200/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{day.name}</span>
                                            {isToday && (
                                                <span className="badge badge-primary badge-xs font-normal">Ma</span>
                                            )}
                                        </div>

                                        <div className="font-mono text-xs sm:text-sm">
                                            {isOpenDay ? (
                                                <span className={isToday ? 'text-primary font-bold' : 'text-base-content/80'}>
                                                    {day.open} - {day.close}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic font-sans">ZÁRVA</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-base-200/50 border-t border-base-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                    <button
                        className={`btn btn-sm ${markedNearby ? 'btn-outline btn-primary' : 'btn-primary'} flex-1 sm:flex-initial`}
                        onClick={() => {
                            if (markedNearby) {
                                clearNearbyPharmacy();
                            } else {
                                setNearbyPharmacy(pharmacy);
                            }
                        }}
                    >
                        <span className={`material-symbols-rounded text-lg ${markedNearby ? 'fill-1' : ''}`}>
                            {markedNearby ? 'home' : 'add_location'}
                        </span>
                        {markedNearby ? 'Közeli jelölés eltávolítása' : 'Közeli patikának jelölöm'}
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                        <button
                            className="btn btn-sm btn-ghost text-primary gap-1 flex-1 sm:flex-initial"
                            onClick={handleShowOnMap}
                        >
                            <span className="material-symbols-rounded text-lg">map</span>
                            Mutasd térképen
                        </button>

                        <button
                            className="btn btn-sm btn-neutral flex-1 sm:flex-initial"
                            onClick={onClose}
                        >
                            Bezárás
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
