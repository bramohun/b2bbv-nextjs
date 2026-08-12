'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorite } from '@/context/FavoriteContext';
import { useNotification } from '@/context/NotificationContext';

/**
 * User Story: Felhasználóként szeretném egy külön felületen látni az összes kedvencnek jelölt gyógyszeremet, 
 * hogy gyorsan elérhessem őket és szükség esetén eltávolíthassak elemeket a listából, 
 * illetve feliratkozhassak értesítésekre a kedvenc termékeimnél.
 * 
 * Funkciók:
 * - Mentett gyógyszerek listázása táblázatos formában.
 * - Közvetlen navigáció a gyógyszer adatlapjára.
 * - Eltávolítás a mentett gyógyszerek közül egy kattintással.
 * - Mentett gyógyszer eltávolítása esetén figyelmeztetés, ha értesítés is aktív.
 * - Értesítésre feliratkozás és leiratkozás.
 * - Üres állapot kezelése.
 */

import { FavoriteRemovalModal } from '@/components/medicines/FavoriteRemovalModal';

export default function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorite();
    const { isSubscribed, subscribe, unsubscribe } = useNotification();
    const [pendingRemovalTkSzam, setPendingRemovalTkSzam] = React.useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    const handleSubscription = (medicine: any) => {
        if (isSubscribed(medicine.tkSzam)) {
            unsubscribe(medicine.tkSzam);
        } else {
            subscribe(medicine);
        }
    };

    const handleRemoveClick = (tkSzam: string) => {
        if (isSubscribed(tkSzam)) {
            setPendingRemovalTkSzam(tkSzam);
        } else {
            removeFavorite(tkSzam);
        }
    };

    const confirmRemoval = () => {
        if (pendingRemovalTkSzam) {
            removeFavorite(pendingRemovalTkSzam);
            unsubscribe(pendingRemovalTkSzam);
            setPendingRemovalTkSzam(null);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <FavoriteRemovalModal
                isOpen={pendingRemovalTkSzam !== null}
                onClose={() => setPendingRemovalTkSzam(null)}
                onConfirm={confirmRemoval}
            />
            <h1 className="text-3xl font-bold mb-6">Mentett gyógyszerek</h1>

            {/* Explanation Section */}
            <div className="card bg-primary/5 border border-primary/10 mb-8 overflow-hidden">
                <div className="card-body p-6">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                        <div className="flex-1 flex gap-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-rounded text-primary text-2xl">bookmarks</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-1">Mentett gyógyszerek</h3>
                                <p className="text-sm text-base-content/70 leading-relaxed">
                                    A könyvjelzővel megjelölt gyógyszerek ezen a listán gyűlnek, így bármikor gyorsan elérheted őket anélkül, hogy újra rájuk kellene keresned.
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px bg-primary/10 h-full"></div>

                        <div className="flex-1 flex gap-4">
                            <div className="bg-warning/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-rounded text-warning text-2xl">notifications</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-warning mb-1">Értesítések kérése</h3>
                                <p className="text-sm text-base-content/70 leading-relaxed">
                                    Ha bekapcsolod az értesítést (harang ikon), a rendszer automatikusan jelezni fog neked, ha a gyógyszer készlete vagy elérhetősége megváltozik.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-base-100 rounded-lg shadow border border-base-200">
                {favorites.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-rounded text-6xl mb-4 block opacity-20">bookmarks</span>
                        <p className="text-lg">Jelenleg nincs mentett gyógyszered.</p>
                        <Link href="/gyogyszerek" className="btn btn-warning mt-4">
                            Gyógyszerek böngészése
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Gyógyszer neve</th>
                                    <th>TK-szám</th>
                                    <th>Státusz</th>
                                    <th>Értesítés</th>
                                    <th>Hozzáadás ideje</th>
                                    <th className="text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favorites.map((fav) => (
                                    <tr key={fav.tkSzam} className="hover">
                                        <td>
                                            <Link href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(fav.tkSzam)}`} className="font-bold hover:text-warning hover:underline">
                                                {fav.name}
                                            </Link>
                                        </td>
                                        <td className="font-mono text-sm opacity-70">{fav.tkSzam}</td>
                                        <td>
                                            <div className={`badge ${getStatusColor(fav.status)} badge-sm`}>
                                                {fav.status}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm btn-circle ${isSubscribed(fav.tkSzam) ? 'btn-primary' : 'btn-ghost text-gray-400'}`}
                                                onClick={() => handleSubscription(fav)}
                                                title={isSubscribed(fav.tkSzam) ? 'Leiratkozás' : 'Értesítés kérése'}
                                            >
                                                <span className="material-symbols-rounded">
                                                    {isSubscribed(fav.tkSzam) ? 'notifications_active' : 'notifications'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="text-sm">
                                            {fav.addedAt ? new Date(fav.addedAt).toLocaleDateString('hu-HU', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                                                onClick={() => handleRemoveClick(fav.tkSzam)}
                                                title="Eltávolítás a mentettek közül"
                                            >
                                                <span className="material-symbols-rounded">bookmark_remove</span>
                                                <span className="hidden sm:inline ml-1">Eltávolítás</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
