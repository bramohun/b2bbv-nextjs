/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném megtekinteni egy kiválasztott gyógyszer részletes
 * adatait, beleértve a kiszerelést, hatóanyagot, gyártót és az aktuális státuszt,
 * hogy minden szükséges információ birtokában legyek a rendeléshez vagy tájékoztatáshoz.
 * 
 * FUNKCIÓK:
 * - Részletes adatok megjelenítése: Név, TK-szám, Hatóanyag, ATC kód, Kiszerelés, Gyártó.
 * - Státusz vizuális jelzése (Badge + Színkód).
 * - "Vissza a listához" navigáció.
 * - (Tervezett) Helyettesítő termékek ajánlása.
 * - (Tervezett) Betegtájékoztató letöltése/megnyitása.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Az URL-ből kiolvassa a dinamikus ID-t (TK-szám, ami perjeleket is tartalmazhat).
 * - Szerver oldalon lekéri a gyógyszer adatait a `getMedicineByTk` függvénnyel.
 * - Ha a gyógyszer nem található, 404-es oldalra irányít.
 * - Reszponzív elrendezés: Mobilon egymás alatt, Desktopon kétoszlopos nézet (Kép + Adatok).
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/lib/data.ts: Adatlekérdezés
 * - src/app/(dashboard)/medicines/page.tsx: Szülő listaoldal
 */

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMedicineByTk } from '@/lib/data';
import { MedicineDetailActions } from '@/components/medicines/MedicineDetailActions';
import { formatDate } from '@/lib/utils';

interface PageProps {
    params: Promise<{ id: string[] }>;
}

export default async function MedicineDetailPage({ params }: PageProps) {
    // Await params correctly in Next.js 15+ / 16
    const { id } = await params;

    // Reconstruct TK-szám from the catch-all segements
    // e.g., /medicines/OGYI-T-23654/01 -> ['OGYI-T-23654', '01'] -> "OGYI-T-23654/01"
    const tkSzam = id.map(segment => decodeURIComponent(segment)).join('/');

    const medicine = await getMedicineByTk(tkSzam);

    if (!medicine) {
        notFound();
    }

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'elérhető') return <span className="badge badge-success badge-lg">{status}</span>;
        if (s === 'készlethiány') return <span className="badge badge-warning badge-lg">{status}</span>;
        if (s === 'megszűnt') return <span className="badge badge-error badge-lg">{status}</span>;
        return <span className="badge badge-ghost badge-lg">{status}</span>;
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-6">
                <Link href="/gyogyszerek" className="btn btn-ghost gap-2 pl-0 hover:bg-transparent hover:text-primary">
                    <span className="material-symbols-rounded">arrow_back</span>
                    Vissza a listához
                </Link>
            </div>

            <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                {/* Left Side: Image Placeholder */}
                <figure className="lg:w-1/3 bg-base-200/50 min-h-[300px] flex items-center justify-center relative">
                    <span className="text-9xl opacity-20 select-none">💊</span>
                    {/* Status Overlay on Mobile */}
                    <div className="absolute top-4 right-4 lg:hidden">
                        {getStatusBadge(medicine.status)}
                    </div>
                </figure>

                {/* Right Side: Details */}
                <div className="card-body lg:w-2/3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="card-title text-3xl mb-2 font-bold">{medicine.nev}</h1>
                            <p className="text-gray-500 font-mono text-sm mb-4">TK-szám: {medicine.tkSzam}</p>
                        </div>
                        <div className="hidden lg:block">
                            {getStatusBadge(medicine.status)}
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Hatóanyag (INN)</h3>
                            <p className="text-lg font-medium">{medicine.inn || 'N/A'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Márkanév</h3>
                            <p className="text-lg">{medicine.brand || medicine.nev}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">ATC Kód</h3>
                            <div className="badge badge-outline font-mono">{medicine.atcKod || 'N/A'}</div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Gyártó</h3>
                            <p className="text-lg">{medicine.gyarto || 'N/A'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Kiszerelés</h3>
                            <p className="text-lg">{medicine.kiszereles}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Utolsó frissítés</h3>
                            <p className="text-sm text-gray-400">
                                {formatDate(medicine.lastUpdate)}
                            </p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <MedicineDetailActions medicine={medicine} />
                </div>
            </div>
        </div>
    );
}
