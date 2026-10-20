'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - FEJLÉC ÉS NAVIGÁCIÓS SÁV (NAVBAR)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A BENUvény Orvosi Portál központi felső navigációs sávja a legújabb Figma
 * tervek szerinti felépítéssel. Magában foglalja a hivatalos BENU VÉNY logót,
 * a központi intelligens keresőt, a kijelölt közeli patika indikátort, valamint
 * az ikonos vertikális menüpontokat (Irányítópult, Gyógyszer, Gyógyszertár, Mentett, Profil).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként egy modern, átlátható fejlécből szeretném elérni a portál
 *   összes fő funkcióját, látni a mentett gyógyszereim számát, és gyorsan
 *   patikát választani.
 * - Felhasználóként a mentett gyógyszerek gyorslistájából az "Összes" gombra kattintva
 *   azonnal a gyógyszerlista oldalra szeretnék navigálni, a listát kizárólag a mentett kedvenceimre szűrve.
 * - Orvosként mobil eszközön a bal oldali hamburger menüből szeretném elérni a navigációs útvonalakat,
 *   a mentett gyógyszereimet dinamikus darabszámmal, valamint a közeli gyógyszertáram adatait és közvetlen módosítását.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Globális keresés (GlobalSearch)
 * - Patikaválasztó modális ablak (PharmacyFinder)
 * - Mentett kedvencek gyorslista és kezelés (FavoriteContext)
 * - Felhasználói munkamenet és profil (AuthContext)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.0.1, 4.0.5)
 * ============================================================================
 */

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useFavorite } from '@/context/FavoriteContext';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { useAuth } from '@/context/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { PharmacyFinder } from '../pharmacies/PharmacyFinder';

export const Navbar: React.FC = () => {
    const pathname = usePathname();
    const { favorites } = useFavorite();
    const { nearbyPharmacy } = useNearbyPharmacy();
    const { logout, user } = useAuth();

    // Controlled state for modals and dropdowns (modal-and-dropdowns rule)
    const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const favoritesRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.role === 'admin';

    // Click outside listener for controlled dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (favoritesRef.current && !favoritesRef.current.contains(target)) {
                setIsFavoritesOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white drop-shadow-[0px_14px_19px_rgba(0,26,72,0.06)] sticky top-0 z-50 w-full">
            <div className="w-full px-4 md:px-12 py-3 flex items-center justify-between gap-4">
                
                {/* 1. BAL OLDAL: Logo & Mobil Menü Gomb */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-[#002664] hover:bg-slate-100 rounded-lg"
                        aria-label="Menü"
                    >
                        <span className="material-symbols-rounded text-2xl">menu</span>
                    </button>

                    <Link href="/dashboard" className="flex items-center shrink-0">
                        <div className="h-[34px] w-[180px] md:w-[214px] relative">
                            <Image
                                src="/assets/figma/benu-veny-logo.png"
                                alt="BENU VÉNY"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* 2. KÖZÉP: Intelligens Kereső (Desktop) */}
                <div className="flex-1 max-w-xl mx-2 hidden md:flex justify-center">
                    <GlobalSearch />
                </div>

                {/* 3. JOBB OLDAL: Közeli Patika + Vertikális Akciógombok */}
                <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                    
                    {/* Mobil Kereső Ikon (<768px) */}
                    <div className="md:hidden">
                        <GlobalSearch />
                    </div>

                    {/* Közeli Patika Indikátor & Kiválasztó */}
                    <div
                        onClick={() => setIsPharmacyModalOpen(true)}
                        className="hidden sm:flex flex-col items-start justify-center cursor-pointer group text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors"
                        title="Közeli patika kiválasztása"
                    >
                        <span className="text-[13px] font-medium text-[#002664] leading-tight">
                            Közeli gyógyszertár
                        </span>
                        <span className="text-[14px] font-bold text-[#378509] underline truncate max-w-[160px] leading-tight">
                            {nearbyPharmacy ? nearbyPharmacy.nev : 'Válasszon gyógyszertárat'}
                        </span>
                    </div>

                    {/* Vertikális Akció Menü (Figma szerinti ikonok és feliratok) */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {/* Irányítópult */}
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center justify-center w-[74px] py-1 rounded-lg transition-colors group ${
                                pathname === '/dashboard' ? 'bg-[#F0F4FA]' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="size-[28px] relative mb-1">
                                <Image
                                    src="/assets/figma/fbac0194bef5cfd022a9163982735ef9952d202c.svg"
                                    alt="Irányítópult"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className={`text-[12px] font-medium leading-none ${
                                pathname === '/dashboard' ? 'text-[#002664] font-bold' : 'text-[#002664]'
                            }`}>
                                Irányítópult
                            </span>
                        </Link>

                        {/* Gyógyszer */}
                        <Link
                            href="/gyogyszerek"
                            className={`flex flex-col items-center justify-center w-[74px] py-1 rounded-lg transition-colors group ${
                                pathname?.startsWith('/gyogyszerek') ? 'bg-[#F0F4FA]' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="size-[28px] relative mb-1">
                                <Image
                                    src="/assets/figma/38bf5ad3ce1d1b2b21785ece01507074f555c665.svg"
                                    alt="Gyógyszer"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className={`text-[12px] font-medium leading-none ${
                                pathname?.startsWith('/gyogyszerek') ? 'text-[#002664] font-bold' : 'text-[#002664]'
                            }`}>
                                Gyógyszer
                            </span>
                        </Link>

                        {/* Gyógyszertár */}
                        <Link
                            href="/gyogyszertarak"
                            className={`flex flex-col items-center justify-center w-[74px] py-1 rounded-lg transition-colors group ${
                                pathname === '/gyogyszertarak' ? 'bg-[#F0F4FA]' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="size-[28px] relative mb-1">
                                <Image
                                    src="/assets/figma/b939d063c8680f9b8b986be7e1dede9d5990461e.svg"
                                    alt="Gyógyszertár"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className={`text-[12px] font-medium leading-none ${
                                pathname === '/gyogyszertarak' ? 'text-[#002664] font-bold' : 'text-[#002664]'
                            }`}>
                                Gyógyszertár
                            </span>
                        </Link>

                        {/* Mentett (Könyvjelzők számlálóval és controlled dropdownnal) */}
                        <div className="relative" ref={favoritesRef}>
                            <button
                                type="button"
                                onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                                className={`flex flex-col items-center justify-center w-[74px] py-1 rounded-lg transition-colors relative group ${
                                    isFavoritesOpen ? 'bg-[#F0F4FA]' : 'hover:bg-slate-50'
                                }`}
                                aria-label="Mentett gyógyszerek"
                            >
                                <div className="size-[28px] relative mb-1">
                                    <Image
                                        src="/assets/figma/114e1e05e928444fa85b729449a28d0644a58c6a.svg"
                                        alt="Mentett"
                                        fill
                                        className="object-contain"
                                    />
                                    {favorites.length > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-[#002664] text-white text-[10px] font-bold rounded-full size-[18px] flex items-center justify-center border border-white">
                                            {favorites.length}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[12px] font-medium leading-none text-[#002664]">
                                    Mentett
                                </span>
                            </button>

                            {/* Mentett Gyorslista Dropdown */}
                            {isFavoritesOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#d8d9e0] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.12)] p-3 z-50">
                                    <div className="flex items-center justify-between pb-2 border-b border-[#e7e8ec]">
                                        <span className="text-[14px] font-bold text-[#002664]">
                                            {favorites.length} mentett gyógyszer
                                        </span>
                                        <Link
                                            href="/gyogyszerek?onlyFavorites=true"
                                            onClick={() => {
                                                setIsFavoritesOpen(false);
                                                if (typeof window !== 'undefined') {
                                                    window.dispatchEvent(new CustomEvent('filter-favorites'));
                                                }
                                            }}
                                            className="text-[12px] text-[#378509] font-bold hover:underline cursor-pointer"
                                        >
                                            Összes
                                        </Link>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-[#e7e8ec] py-1">
                                        {favorites.length === 0 ? (
                                            <p className="text-xs text-[#62788f] py-4 text-center">
                                                Nincs még mentett gyógyszered.
                                            </p>
                                        ) : (
                                            favorites.map((fav) => (
                                                <Link
                                                    key={fav.tkSzam}
                                                    href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(fav.tkSzam)}`}
                                                    onClick={() => setIsFavoritesOpen(false)}
                                                    className="flex flex-col py-2 px-1 hover:bg-[#F9F9FB] rounded transition-colors"
                                                >
                                                    <span className="text-xs font-bold text-[#002664] truncate">
                                                        {fav.name}
                                                    </span>
                                                    <div className="flex items-center justify-between mt-1 text-[11px]">
                                                        <span className="text-[#62788f]">{fav.tkSzam}</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                            fav.status === 'Elérhető' ? 'bg-[#E8F8E2] text-[#317907]' :
                                                            fav.status === 'Készlethiány' ? 'bg-[#FFF7BA] text-[#7A6C21]' :
                                                            'bg-[#FEEAED] text-[#B1174E]'
                                                        }`}>
                                                            {fav.status}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profil Menü (Controlled dropdown) */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex flex-col items-center justify-center w-[74px] py-1 rounded-lg transition-colors group ${
                                    isProfileOpen ? 'bg-[#F0F4FA]' : 'hover:bg-slate-50'
                                }`}
                                aria-label="Profil menü"
                            >
                                <div className="size-[28px] relative mb-1">
                                    <Image
                                        src="/assets/figma/0d0588996ac27669b9b31a8f76daf50d5aa19634.svg"
                                        alt="Profil"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-[12px] font-medium leading-none text-[#002664]">
                                    Profil
                                </span>
                            </button>

                            {/* Profil Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#d8d9e0] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.12)] p-2 z-50">
                                    <div className="px-3 py-2 border-b border-[#e7e8ec]">
                                        <p className="text-xs text-[#62788f]">Bejelentkezve mint:</p>
                                        <p className="text-sm font-bold text-[#002664] truncate">
                                            {user?.name || 'Egészségügyi Szakember'}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#002664] hover:bg-[#F9F9FB] rounded transition-colors"
                                        >
                                            <span className="material-symbols-rounded text-lg">person</span>
                                            Profil beállítások
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                href="/admin/users"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#002664] font-bold hover:bg-[#F9F9FB] rounded transition-colors"
                                            >
                                                <span className="material-symbols-rounded text-lg text-primary">admin_panel_settings</span>
                                                Adminisztráció
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-[#B1174E] hover:bg-[#FEEAED] rounded transition-colors mt-1"
                                        >
                                            <span className="material-symbols-rounded text-lg">logout</span>
                                            Kijelentkezés
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobil lenyíló menü */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-[#e7e8ec] bg-white p-4 space-y-2">
                    <div
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsPharmacyModalOpen(true);
                        }}
                        className="p-3 bg-[#F9F9FB] rounded-lg border border-[#d8d9e0] mb-3 cursor-pointer flex items-center justify-between hover:bg-[#f0f4f9] transition-colors"
                    >
                        <div className="truncate">
                            <span className="text-xs text-[#62788f] font-medium block">Közeli gyógyszertár:</span>
                            <span className="text-sm font-bold text-[#378509] block truncate">
                                {nearbyPharmacy ? nearbyPharmacy.nev : 'Válasszon gyógyszertárat!'}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-[#002664] underline shrink-0 ml-2">Módosítás</span>
                    </div>

                    <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2 text-sm font-bold text-[#002664] hover:bg-slate-50 rounded-lg"
                    >
                        <span className="material-symbols-rounded">dashboard</span>
                        Irányítópult
                    </Link>
                    <Link
                        href="/gyogyszerek"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2 text-sm font-bold text-[#002664] hover:bg-slate-50 rounded-lg"
                    >
                        <span className="material-symbols-rounded">medication</span>
                        Gyógyszerek
                    </Link>
                    <Link
                        href="/gyogyszerek?status=saved"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (pathname === '/gyogyszerek') {
                                window.dispatchEvent(new CustomEvent('filter-favorites'));
                            }
                        }}
                        className="flex items-center justify-between p-2 text-sm font-bold text-[#002664] hover:bg-slate-50 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-rounded">bookmark</span>
                            <span>Mentett gyógyszerek</span>
                        </div>
                        {favorites.length > 0 && (
                            <span className="bg-[#002664] text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/gyogyszertarak"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2 text-sm font-bold text-[#002664] hover:bg-slate-50 rounded-lg"
                    >
                        <span className="material-symbols-rounded">local_pharmacy</span>
                        Gyógyszertárak
                    </Link>
                    <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2 text-sm font-bold text-[#002664] hover:bg-slate-50 rounded-lg"
                    >
                        <span className="material-symbols-rounded">person</span>
                        Profilom
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin/users"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2 text-sm font-bold text-primary hover:bg-slate-50 rounded-lg border-t border-slate-100 pt-2"
                        >
                            <span className="material-symbols-rounded">admin_panel_settings</span>
                            Adminisztráció
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            logout();
                        }}
                        className="w-full text-left flex items-center gap-3 p-2 text-sm font-bold text-[#B1174E] hover:bg-red-50 rounded-lg border-t border-slate-100 pt-2"
                    >
                        <span className="material-symbols-rounded">logout</span>
                        Kijelentkezés
                    </button>
                </div>
            )}

            {/* Közeli Patika Választó Modális Ablak (React Portal-lal) */}
            {isPharmacyModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
                    <PharmacyFinder
                        title="Közeli patika beállítása"
                        description="Válasszon egy gyógyszertárat a térképről vagy a listából a készletváltozások követéséhez."
                        initialSelectedId={nearbyPharmacy?.id}
                        onClose={() => setIsPharmacyModalOpen(false)}
                    />
                </div>,
                document.body
            )}
        </header>
    );
};
