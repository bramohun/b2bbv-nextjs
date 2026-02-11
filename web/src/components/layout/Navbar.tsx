'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék egy központi navigációs sávot használni az oldalak
 * közötti váltáshoz, a kereséshez, a kedvenc gyógyszereim gyors eléréséhez 
 * és a profilbeállításaim kezeléséhez, valamint látni a számomra megjelölt
 * közeli gyógyszertárat.
 * 
 * FUNKCIÓK:
 * - Navigációs linkek: Irányítópult, Gyógyszerek, Gyógyszertárak, Közösség.
 * - Gyorskereső gomb.
 * - Közeli gyógyszertár kijelzése: Név és cím megjelenítése a navigációs sávban.
 * - Kedvencek dropdown: A kedvencnek jelölt gyógyszerek gyorslistája.
 * - Felhasználói profil menü: Profil, Beállítások, Kijelentkezés.
 * 
 * ÜZLETI LOGIKA:
 * - A kedvencek száma dinamikusan frissül a FavoriteContext alapján.
 * - A közeli gyógyszertár adatai a NearbyPharmacyContext-ből érkeznek.
 * - Az értesítések kezelése kikerült a navigációs sávról.
 */

import Link from 'next/link';
import React from 'react';
import { useFavorite } from '@/context/FavoriteContext';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
    const { favorites } = useFavorite();
    const { nearbyPharmacy } = useNearbyPharmacy();
    const { logout } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <span className="material-symbols-rounded">menu</span>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li><Link href="/dashboard">Irányítópult</Link></li>
                        <li><Link href="/gyogyszerek">Gyógyszerek</Link></li>
                        <li><Link href="/gyogyszertarak">Gyógyszertárak</Link></li>
                        <li><Link href="/kozosseg">Közösség</Link></li>
                    </ul>
                </div>
                <Link href="/dashboard" className="btn btn-ghost text-xl">
                    <span className="font-bold text-primary">Orvosi Portál</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/dashboard">Irányítópult</Link></li>
                    <li><Link href="/gyogyszerek">Gyógyszerek</Link></li>
                    <li><Link href="/gyogyszertarak">Gyógyszertárak</Link></li>
                    <li><Link href="/kozosseg">Közösség</Link></li>
                </ul>
            </div>
            <div className="navbar-end gap-2">
                {/* Nearby Pharmacy Info */}
                {nearbyPharmacy && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-base-200 border-l-4 border-primary rounded-md mr-1 max-w-[200px]">
                        <span className="material-symbols-rounded text-primary text-sm fill-1">location_on</span>
                        <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-[10px] text-base-content/60 font-bold uppercase tracking-tighter">Közeli patika</span>
                            <span className="text-xs font-bold text-primary truncate" title={nearbyPharmacy.nev}>
                                {nearbyPharmacy.nev}
                            </span>
                        </div>
                    </div>
                )}

                <button className="btn btn-ghost btn-circle">
                    <span className="material-symbols-rounded">search</span>
                </button>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <span className="material-symbols-rounded">star</span>
                            {favorites.length > 0 && (
                                <span className="badge badge-xs badge-warning indicator-item">
                                    {favorites.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-80 shadow"
                    >
                        <div className="card-body">
                            <span className="text-lg font-bold">{favorites.length} kedvenc</span>
                            <div className="max-h-60 overflow-y-auto">
                                {favorites.length === 0 ? (
                                    <p className="text-sm text-gray-500">Nincs kedvencnek jelölt gyógyszer.</p>
                                ) : (
                                    <ul className="menu menu-sm bg-base-100 rounded-box p-0">
                                        {favorites.map((fav) => (
                                            <li key={fav.tkSzam} className="border-b border-base-200 last:border-none">
                                                <Link href={`/gyogyszerek/${fav.tkSzam}`} className="flex flex-col items-start py-2">
                                                    <span className="font-medium truncate w-full">{fav.name}</span>
                                                    <span className="text-xs text-gray-400">{fav.tkSzam}</span>
                                                    <span className={`badge badge-xs mt-1 ${fav.status === 'Elérhető' ? 'badge-success' :
                                                        fav.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'
                                                        }`}>
                                                        {fav.status}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="card-actions">
                                <Link href="/profile/favorites" className="btn btn-warning btn-block btn-sm">
                                    Összes megtekintése
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
                            <span className="text-xs font-bold uppercase">DR</span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/profile">Profil</Link></li>
                        <li><Link href="/settings">Beállítások</Link></li>
                        <li><button onClick={logout} className="text-error">Kijelentkezés</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
