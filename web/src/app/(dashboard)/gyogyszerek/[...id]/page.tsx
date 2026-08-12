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
 * - Közeli patika készletinformáció megjelenítése (NearbyPharmacyStockIndicator).
 * - Hasonló hatóanyagú, elérhető termékek listázása (SimilarMedicines).
 * - "Vissza a listához" navigáció.
 * - (Tervezett) Betegtájékoztató letöltése/megnyitása.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Az URL-ből kiolvassa a dinamikus ID-t (TK-szám, ami perjeleket is tartalmazhat).
 * - Szerver oldalon lekéri a gyógyszer adatait a `getMedicineByTk` függvénnyel.
 * - Ha a gyógyszer nem található, 404-es oldalra irányít.
 * - Reszponzív elrendezés: Egységes kártya nézet (Adatok teljes szélességben).
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/lib/data.ts: Adatlekérdezés
 * - src/app/(dashboard)/medicines/page.tsx: Szülő listaoldal
 */

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MedicineDetailActions } from '@/components/medicines/MedicineDetailActions';
import { MedicineStockInfo } from '@/components/medicines/MedicineStockInfo';
import { MedicineStatusHistory } from '@/components/medicines/MedicineStatusHistory';
import { NearbyPharmacyStockIndicator } from '@/components/medicines/NearbyPharmacyStockIndicator';
import { SimilarMedicines } from '@/components/medicines/SimilarMedicines';
import { getMedicineByTk, getMedicinesBySubstance, getMedicines } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
    const medicines = await getMedicines();
    return medicines.slice(0, 100).map((m) => ({
        id: m.tkSzam.split('/')
    }));
}

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

    const getStockInfo = (status: string) => {
        const totalPharmacies = 247;
        const s = status?.toLowerCase() || '';

        if (s === 'elérhető') {
            // Random split, ensuring total <= 247
            // Let's say 40-80% in stock, rest on order or neither
            const inStock = Math.floor(Math.random() * (totalPharmacies * 0.6)) + Math.floor(totalPharmacies * 0.1);
            const remaining = totalPharmacies - inStock;
            const onOrder = Math.floor(Math.random() * remaining);
            return {
                show: true,
                inStock,
                onOrder,
                total: inStock + onOrder,
                isLimited: false
            };
        }

        if (s === 'készlethiány') {
            // Only inStock, no onOrder
            const inStock = Math.floor(Math.random() * (totalPharmacies * 0.4)) + 10;
            return {
                show: true,
                inStock,
                onOrder: 0,
                total: inStock, // Total is just inStock for limited
                isLimited: true
            };
        }

        return { show: false, inStock: 0, onOrder: 0, total: 0, isLimited: false };
    };

    const stockInfo = getStockInfo(medicine.status);

    const generateMockHistory = (currentStatus: string, lastUpdateStr: string, tk: string) => {
        const history: { date: string; status: string }[] = [];
        const lastUpdateDate = new Date(lastUpdateStr);

        // Deterministic random using djb2 + xorshift (same as data.ts)
        const seededVal = (s: string) => {
            let h = 5381;
            for (let i = 0; i < s.length; i++) {
                h = ((h << 5) + h + s.charCodeAt(i)) | 0;
            }
            h ^= h >>> 16;
            h = Math.imul(h, 0x45d9f3b);
            h ^= h >>> 16;
            return (h >>> 0) / 4294967296;
        };

        const count = Math.floor(seededVal(tk + "count") * 5) + 1; // 1-5 entries
        const spreadDays = 1500;
        const fourYearsAgo = new Date();
        fourYearsAgo.setDate(fourYearsAgo.getDate() - spreadDays);

        const activeStatuses = ['Elérhető', 'Készlethiány'];
        const isDiscontinued = currentStatus === 'Megszűnt';

        // Generate random dates first to ensure order, seeded by TK
        const dates = [lastUpdateDate];
        for (let i = 1; i < count; i++) {
            const randomTime = fourYearsAgo.getTime() + seededVal(tk + i) * (lastUpdateDate.getTime() - fourYearsAgo.getTime());
            dates.push(new Date(randomTime));
        }
        dates.sort((a, b) => b.getTime() - a.getTime()); // Descending (newest first)

        for (let i = 0; i < dates.length; i++) {
            let status;

            if (i === 0) {
                status = currentStatus;
            } else {
                const prevStatus = history[history.length - 1].status;
                const options = activeStatuses.filter(s => s !== prevStatus);
                status = options.length > 0 ? options[Math.floor(seededVal(tk + "status" + i) * options.length)] : activeStatuses[0];
            }

            history.push({
                date: dates[i].toISOString(),
                status: status
            });
        }

        return history;
    };

    const statusHistory = generateMockHistory(medicine.status, medicine.lastUpdate, medicine.tkSzam);

    // Calculate consistent Last Update
    const latestHistoryDate = statusHistory.length > 0 ? new Date(statusHistory[0].date) : new Date(0);

    // Generate random date within last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    let randomLastUpdate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));

    // Ensure Last Update is not older than the latest status change
    const displayLastUpdate = randomLastUpdate > latestHistoryDate ? randomLastUpdate : latestHistoryDate;

    // Fetch similar products by INN
    const similarMedicines = await getMedicinesBySubstance(medicine.inn, medicine.tkSzam);

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-6">
                <Link href="/gyogyszerek" className="btn btn-ghost gap-2 pl-0 hover:bg-transparent hover:text-primary">
                    <span className="material-symbols-rounded">arrow_back</span>
                    Vissza a listához
                </Link>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                {/* Details */}
                <div className="card-body">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="card-title text-3xl mb-1 font-bold">{medicine.nev}</h1>
                            <p className="text-gray-500 font-mono text-sm">TK-szám: {medicine.tkSzam}</p>
                            <div className="mt-2 flex flex-col gap-1">
                                {getStatusBadge(medicine.status)}
                                <NearbyPharmacyStockIndicator medicineId={medicine.tkSzam} />
                            </div>

                            <MedicineStockInfo
                                medicineName={medicine.nev}
                                medicineId={medicine.tkSzam}
                                stockInfo={stockInfo}
                            />
                        </div>
                        <div className="mt-2 text-right">
                            <MedicineDetailActions medicine={medicine} />
                        </div>
                    </div>

                    {/* Shortage Block */}
                    {medicine.shortageInfo && (
                        <div className="mt-6 p-6 rounded-xl bg-amber-50 border border-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-amber-800">
                                <span className="material-symbols-rounded text-2xl">warning</span>
                                <h2 className="text-xl font-bold">Készlethiány Információ</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700/70">Hiány kezdete</h3>
                                    <p className="text-lg font-medium text-amber-900">{medicine.shortageInfo.start || 'Nincs adat'}</p>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700/70">Tervezett vége</h3>
                                    <p className="text-lg font-medium text-amber-900">{medicine.shortageInfo.end || 'Folyamatban'}</p>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700/70">A hiány oka</h3>
                                    <p className="text-amber-900 leading-relaxed font-medium">{medicine.shortageInfo.reason || 'Szakmai ok'}</p>
                                </div>

                                {medicine.shortageInfo.suggestion && (
                                    <div className="md:col-span-2 mt-2 p-4 rounded-lg bg-amber-100/50 border border-amber-200">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700/70 mb-2">Javaslat a hiánykészítmény pótlására</h3>
                                        <p className="text-amber-900 font-medium leading-relaxed">{medicine.shortageInfo.suggestion}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="divider"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-1">Hatóanyag (INN)</h3>
                            <div className="text-lg font-medium">
                                {medicine.inn ? (
                                    <Link
                                        href={`/gyogyszerek?search=${encodeURIComponent(medicine.inn)}`}
                                        className="text-primary hover:underline"
                                    >
                                        {medicine.inn}
                                    </Link>
                                ) : 'N/A'}
                            </div>
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
                                {formatDate(displayLastUpdate.toISOString())}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <SimilarMedicines substance={medicine.inn} medicines={similarMedicines} />

            <MedicineStatusHistory history={statusHistory} />
        </div>
    );
}
