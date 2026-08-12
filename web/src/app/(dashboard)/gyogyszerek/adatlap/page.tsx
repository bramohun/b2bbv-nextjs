/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * HASZNÁLAT ÉS CÉL:
 * Ez az oldal jeleníti meg a kiválasztott gyógyszer részletes adatlapját a statikus
 * kiexportált prototípusban URL query paraméter alapján (`/gyogyszerek/adatlap?tk=...`).
 * Ez biztosítja, hogy mind a 41 000+ gyógyszer adatlapja 404-es webszerver hiba nélkül
 * elérhető legyen tetszőleges statikus tárhelyen (GitHub Pages / bvo.uneb.hu).
 * 
 * USER STORYK:
 * - Felhasználóként szeretném megtekinteni egy gyógyszer részletes adatlapját (név,
 *   törzskönyvi szám, hatóanyag, kiszerelés, gyártó, ATC kód, státusz), hogy teljes
 *   információval rendelkezzek a döntéshozatalhoz.
 * - Felhasználóként szeretném látni a készlethiány információit, a korábbi státuszváltások
 *   történetét és a közeli patika készletét.
 * - Felhasználóként szeretnék hasonló hatóanyagú, elérhető gyógyszereket találni.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - src/lib/static-fetch.ts: Gyógyszer adatok betöltése statikus JSON-ból (`fetchStaticData`)
 * - src/app/(dashboard)/gyogyszerek/page.tsx: Gyógyszerkereső listaoldal (honnan érkezik a felhasználó)
 * - src/components/medicines/MedicineDetailActions.tsx: Akciók (kedvenc, értesítés, nyomtatás)
 * - src/components/medicines/MedicineStockInfo.tsx: Készletinformációk
 * - src/components/medicines/MedicineStatusHistory.tsx: Státusztörténet
 * - src/components/medicines/NearbyPharmacyStockIndicator.tsx: Közeli patika készlet indikátor
 * - src/components/medicines/SimilarMedicines.tsx: Hasonló gyógyszerek ajánlója
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MedicineDetailActions } from '@/components/medicines/MedicineDetailActions';
import { MedicineStockInfo } from '@/components/medicines/MedicineStockInfo';
import { MedicineStatusHistory } from '@/components/medicines/MedicineStatusHistory';
import { NearbyPharmacyStockIndicator } from '@/components/medicines/NearbyPharmacyStockIndicator';
import { SimilarMedicines } from '@/components/medicines/SimilarMedicines';
import { fetchStaticData } from '@/lib/static-fetch';
import { formatDate } from '@/lib/utils';
import { Medicine } from '@/types';

function MedicineDetailContent() {
    const searchParams = useSearchParams();
    const tkParam = searchParams.get('tk') || '';

    const [medicine, setMedicine] = useState<Medicine | null | undefined>(undefined);
    const [similarMedicines, setSimilarMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            if (!tkParam) {
                if (isMounted) {
                    setMedicine(null);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                const decodedTk = decodeURIComponent(tkParam);
                const allMedicines = await fetchStaticData<Medicine[]>('/data/medicines.json');

                if (!isMounted) return;

                const foundMed = allMedicines.find(m => m.tkSzam === decodedTk);

                if (foundMed) {
                    setMedicine(foundMed);
                    if (foundMed.inn) {
                        const normalizedSubstance = foundMed.inn.toLowerCase().trim();
                        const similar = allMedicines.filter(m =>
                            m.tkSzam !== foundMed.tkSzam &&
                            m.inn &&
                            m.inn.toLowerCase().includes(normalizedSubstance) &&
                            m.status === 'Elérhető'
                        ).slice(0, 20);
                        setSimilarMedicines(similar);
                    }
                } else {
                    setMedicine(null);
                }
            } catch (err) {
                console.error("Hiba a gyógyszer adatlapjának betöltésekor:", err);
                if (isMounted) {
                    setMedicine(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [tkParam]);

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
            const inStock = Math.floor(Math.random() * (totalPharmacies * 0.4)) + 10;
            return {
                show: true,
                inStock,
                onOrder: 0,
                total: inStock,
                isLimited: true
            };
        }

        return { show: false, inStock: 0, onOrder: 0, total: 0, isLimited: false };
    };

    const generateMockHistory = (currentStatus: string, lastUpdateStr: string, tk: string) => {
        const history: { date: string; status: string }[] = [];
        const lastUpdateDate = new Date(lastUpdateStr);

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

        const count = Math.floor(seededVal(tk + "count") * 5) + 1;
        const spreadDays = 1500;
        const fourYearsAgo = new Date();
        fourYearsAgo.setDate(fourYearsAgo.getDate() - spreadDays);

        const activeStatuses = ['Elérhető', 'Készlethiány'];

        const dates = [lastUpdateDate];
        for (let i = 1; i < count; i++) {
            const randomTime = fourYearsAgo.getTime() + seededVal(tk + i) * (lastUpdateDate.getTime() - fourYearsAgo.getTime());
            dates.push(new Date(randomTime));
        }
        dates.sort((a, b) => b.getTime() - a.getTime());

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

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-gray-500 font-medium">Gyógyszer adatlapjának betöltése...</p>
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="card bg-base-100 shadow-xl border border-base-200 max-w-lg mx-auto p-8">
                    <span className="material-symbols-rounded text-6xl text-error mb-4">search_off</span>
                    <h1 className="text-2xl font-bold mb-2">Gyógyszer nem található</h1>
                    <p className="text-gray-600 mb-6">
                        A megadott törzskönyvi számmal ({tkParam || 'Nincs megadva'}) nem található gyógyszer az adatbázisban.
                    </p>
                    <Link href="/gyogyszerek" className="btn btn-primary">
                        <span className="material-symbols-rounded">arrow_back</span>
                        Vissza a gyógyszerek listájához
                    </Link>
                </div>
            </div>
        );
    }

    const stockInfo = getStockInfo(medicine.status);
    const statusHistory = generateMockHistory(medicine.status, medicine.lastUpdate, medicine.tkSzam);
    const latestHistoryDate = statusHistory.length > 0 ? new Date(statusHistory[0].date) : new Date(0);

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    let randomLastUpdate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
    const displayLastUpdate = randomLastUpdate > latestHistoryDate ? randomLastUpdate : latestHistoryDate;

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

export default function MedicineDetailPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-gray-500 font-medium">Betöltés...</p>
            </div>
        }>
            <MedicineDetailContent />
        </Suspense>
    );
}
