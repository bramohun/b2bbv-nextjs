'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék egy központi navigációs sávot használni az oldalak
 * közötti váltáshoz, a kereséshez, a mentett gyógyszereim gyors eléréséhez 
 * és a profilbeállításaim kezeléséhez, valamint látni a számomra megjelölt
 * közeli gyógyszertárat.
 * 
 * FUNKCIÓK:
 * - Navigációs linkek: Irányítópult, Gyógyszerek, Gyógyszertárak, Közösség (ikonokkal ellátva).
 * - Gyorskereső gomb.
 * - Közeli gyógyszertár kijelzése: Név és cím megjelenítése a navigációs sávban.
 * - Mentett gyógyszerek dropdown: A mentettnek jelölt gyógyszerek gyorslistája.
 * - Felhasználói profil menü: Profil, Beállítások, Kijelentkezés.
 * 
 * ÜZLETI LOGIKA:
 * - A kedvencek száma dinamikusan frissül a FavoriteContext alapján.
 * - A közeli gyógyszertár adatai a NearbyPharmacyContext-ből érkeznek.
 * - Az értesítések kezelése kikerült a navigációs sávról.
 */

import Link from 'next/link';
import React from 'react';
import { createPortal } from 'react-dom';
import { useFavorite } from '@/context/FavoriteContext';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { useAuth } from '@/context/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { PharmacyFinder } from '../pharmacies/PharmacyFinder';

export const Navbar = () => {
    const { favorites } = useFavorite();
    const { nearbyPharmacy } = useNearbyPharmacy();
    const { logout, user } = useAuth();
    const [isPharmacyModalOpen, setIsPharmacyModalOpen] = React.useState(false);

    const isAdmin = user?.role === 'admin';

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
                        <li><Link href="/dashboard"><span className="material-symbols-rounded">dashboard</span>Irányítópult</Link></li>
                        <li><Link href="/gyogyszerek"><span className="material-symbols-rounded">medication</span>Gyógyszerek</Link></li>
                        <li><Link href="/gyogyszertarak"><span className="material-symbols-rounded">local_pharmacy</span>Gyógyszertárak</Link></li>
                        <li><Link href="/kepzesek"><span className="material-symbols-rounded">school</span>BENU Képzési Program</Link></li>
                        {isAdmin && (
                            <li className="border-t border-base-200 mt-2 pt-2">
                                <Link href="/admin/users" className="text-secondary font-bold">
                                    <span className="material-symbols-rounded">admin_panel_settings</span>Adminisztráció
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                <Link href="/dashboard" className="btn btn-ghost text-xl shrink-0">
                    <span className="font-bold text-primary">Orvosi Portál</span>
                </Link>

                <div className="ml-4 hidden lg:flex flex-1">
                    <ul className="menu menu-horizontal px-1 gap-1 flex-nowrap whitespace-nowrap">
                        <li><Link href="/dashboard" className="flex items-center gap-1.5"><span className="material-symbols-rounded text-xl">dashboard</span>Irányítópult</Link></li>
                        <li><Link href="/gyogyszerek" className="flex items-center gap-1.5"><span className="material-symbols-rounded text-xl">medication</span>Gyógyszerek</Link></li>
                        <li><Link href="/gyogyszertarak" className="flex items-center gap-1.5"><span className="material-symbols-rounded text-xl">local_pharmacy</span>Gyógyszertárak</Link></li>
                        <li><Link href="/kepzesek" className="flex items-center gap-1.5"><span className="material-symbols-rounded text-xl">school</span>BENU Képzési Program</Link></li>
                        {isAdmin && (
                            <li>
                                <Link href="/admin/users" className="text-secondary font-bold flex items-center gap-1.5">
                                    <span className="material-symbols-rounded text-xl">admin_panel_settings</span>Admin
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="navbar-end gap-2">
                {/* Nearby Pharmacy Info */}
                {nearbyPharmacy && (
                    <button
                        onClick={() => setIsPharmacyModalOpen(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-1 bg-base-200 border-l-4 border-primary rounded-md mr-1 max-w-[200px] hover:bg-base-300 transition-colors text-left"
                    >
                        <span className="material-symbols-rounded text-primary text-sm fill-1">location_on</span>
                        <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-[10px] text-base-content/60 font-bold uppercase tracking-tighter">Közeli patika</span>
                            <span className="text-xs font-bold text-primary truncate" title={nearbyPharmacy.nev}>
                                {nearbyPharmacy.nev}
                            </span>
                        </div>
                    </button>
                )}

                {/* Pharmacy Finder Modal - Teleport to body to avoid layout/stacking context issues */}
                {isPharmacyModalOpen && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[100] bg-base-100 flex flex-col animate-fade-in">
                        <PharmacyFinder
                            title="Közeli patika beállítása"
                            description="Válassz egy gyógyszertárat a térképről vagy a listából."
                            initialSelectedId={nearbyPharmacy?.id}
                            onClose={() => setIsPharmacyModalOpen(false)}
                        />
                    </div>,
                    document.body
                )}

                <GlobalSearch />

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <span className={`material-symbols-rounded ${favorites.length > 0 ? 'fill-1' : ''}`}>bookmarks</span>
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
                            <span className="text-lg font-bold">{favorites.length} mentett gyógyszer</span>
                            <div className="max-h-60 overflow-y-auto">
                                {favorites.length === 0 ? (
                                    <p className="text-sm text-gray-500">Nincs mentett gyógyszered.</p>
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
                            <span className="text-xs font-bold uppercase">
                                {user?.name?.substring(0, 2) || 'US'}
                            </span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="menu-title text-base-content/60 px-4 py-2">{user?.name}</li>
                        <li><Link href="/profile"><span className="material-symbols-rounded">account_circle</span>Profil beállítások</Link></li>
                        <li><button onClick={logout} className="text-error"><span className="material-symbols-rounded">logout</span>Kijelentkezés</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
