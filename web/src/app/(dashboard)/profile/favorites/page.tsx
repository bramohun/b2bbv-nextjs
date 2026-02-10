'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorite } from '@/context/FavoriteContext';

/**
 * User Story: Felhasználóként szeretném egy külön felületen látni az összes kedvencnek jelölt gyógyszeremet, 
 * hogy gyorsan elérhessem őket és szükség esetén eltávolíthassak elemeket a listából.
 * 
 * Funkciók:
 * - Kedvenc gyógyszerek listázása táblázatos formában.
 * - Közvetlen navigáció a gyógyszer adatlapjára.
 * - Eltávolítás a kedvencek közül egy kattintással.
 * - Üres állapot kezelése.
 */

export default function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorite();

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Kedvenc gyógyszerek</h1>

            <div className="bg-base-100 rounded-lg shadow border border-base-200">
                {favorites.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-rounded text-6xl mb-4 block opacity-20">star_outline</span>
                        <p className="text-lg">Jelenleg nincs kedvencnek jelölt gyógyszered.</p>
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
                                    <th>Hozzáadás ideje</th>
                                    <th className="text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favorites.map((fav) => (
                                    <tr key={fav.tkSzam} className="hover">
                                        <td>
                                            <Link href={`/gyogyszerek/${fav.tkSzam}`} className="font-bold hover:text-warning hover:underline">
                                                {fav.name}
                                            </Link>
                                        </td>
                                        <td className="font-mono text-sm opacity-70">{fav.tkSzam}</td>
                                        <td>
                                            <div className={`badge ${getStatusColor(fav.status)} badge-sm`}>
                                                {fav.status}
                                            </div>
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
                                                onClick={() => removeFavorite(fav.tkSzam)}
                                                title="Eltávolítás a kedvencekből"
                                            >
                                                <span className="material-symbols-rounded">star_half</span>
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
