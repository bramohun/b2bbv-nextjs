/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZER RÉSZLETES ADATLAP
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez az oldal jeleníti meg a kiválasztott gyógyszer átfogó, orvosi döntéstámogató
 * adatlapját URL query paraméter alapján (`/gyogyszerek/adatlap?tk=...`).
 * Biztosítja a forgalomban lévő, hiánycikk és megszűnt státuszú készítmények
 * azonosítóinak, kiszerelésének, árainak, patikai elérhetőségének és
 * helyettesíthetőségének részletes bemutatását.
 * 
 * KÉSZLETSTÁTUSZ LOGIKA ÉS JELVÉNYEK (Figma #13376:10063, #13376:4482, #13331:14965):
 * - Készleten: Gyógyszertárban elérhető és a nagykerben is van.
 * - Korlátozottan: Termékhiányos készítmény még fellelhető a gyógyszertárban.
 * - Rendelésre: Nagykerben elérhető készítmény a patikában fizikailag nincs készleten,
 *   de 1-2 munkanap alatt megrendelhető.
 * - Nem elérhető: Nagykerben nincs (hiány vagy megszűnt), és a gyógyszertárban
 *   sincs raktáron.
 * - Két külön blokk: BENU GYÓGYSZERTÁRAK (hálózati összesítés) és KÖZELI GYÓGYSZERTÁR.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként szeretném megtekinteni a gyógyszer pontos törzskönyvi adatait, gyártóját,
 *   támogatási kategóriáját, publikus fogyasztói árát és becsült térítési díját.
 * - Orvosként készlethiány esetén látni szeretném a hiány kezdetét, tervezett végét és
 *   szakmai okát, valamint a javasolt helyettesítő készítményeket.
 * - Felhasználóként látni szeretném a hálózati (BENU gyógyszertárak) és a kijelölt
 *   közeli gyógyszertár aktuális készletstátuszát (Készleten, Korlátozottan, Rendelésre, Nem elérhető).
 * - Felhasználóként a közeli patika nevére kattintva szeretném megnyitni a gyógyszertár
 *   részletes adatait (nyitvatartás, elérhetőségek) felugró modális ablakban.
 * - Felhasználóként egyetlen kattintással szeretném a gyógyszert kedvencnek jelölni vagy
 *   értesítést kérni a státuszváltozásairól.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - /gyogyszerek: Gyógyszerkereső lista (visszanavigálás a "Részletek" gombbal)
 * - /gyogyszertarak: Patikakereső
 * - MedicineStockBadge: Hivatalos 4 állapotú készletstátusz jelvény
 * - PharmacyDetailModal: Patika részletes adatlap modális ablak
 * - MedicineDetailActions: Kedvenc és értesítéskezelés
 * - MedicineStatusHistory: Státuszváltozási napló
 * - SimilarMedicines: Elérhető helyettesítő készítmények táblázata
 * ============================================================================
 */

'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MedicineDetailActions } from '@/components/medicines/MedicineDetailActions';
import { MedicineStatusHistory } from '@/components/medicines/MedicineStatusHistory';
import { SimilarMedicines } from '@/components/medicines/SimilarMedicines';
import { MedicineStockBadge } from '@/components/medicines/MedicineStockBadge';
import { PharmacyDetailModal } from '@/components/pharmacies/PharmacyDetailModal';
import { fetchStaticData } from '@/lib/static-fetch';
import { formatDate, isAvailableInPharmacy, getMedicinePharmacyStockStatus } from '@/lib/utils';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { Medicine } from '@/types';

function MedicineDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tkParam = searchParams.get('tk') || '';
    const { nearbyPharmacy } = useNearbyPharmacy();

    const [medicine, setMedicine] = useState<Medicine | null | undefined>(undefined);
    const [similarMedicines, setSimilarMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);

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

    const stockInfo = useMemo(() => {
        if (!medicine) return { inStock: 0, orderable: 0, unavailable: 0, total: 250 };
        const totalPharmacies = 250;
        const s = medicine.status?.toLowerCase() || '';

        // Determinisztikus értékek a törzskönyvi szám alapján
        let hash = 0;
        const str = medicine.tkSzam || medicine.nev;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        const abs = Math.abs(hash);

        if (s === 'elérhető' || s === 'elerheto') {
            const inStock = (abs % 41) + 180; // 180-220 közötti érték
            const orderable = totalPharmacies - inStock;
            return {
                inStock,
                orderable,
                unavailable: 0,
                total: totalPharmacies
            };
        }

        if (s === 'készlethiány' || s === 'keszlethiany') {
            const inStock = (abs % 31) + 30; // 30-60 patikában van még készlet
            const unavailable = totalPharmacies - inStock;
            return {
                inStock,
                orderable: 0,
                unavailable,
                total: totalPharmacies
            };
        }

        // Megszűnt termék
        const inStock = abs % 4 === 0 ? (abs % 25) + 10 : 0;
        const unavailable = totalPharmacies - inStock;
        return {
            inStock,
            orderable: 0,
            unavailable,
            total: totalPharmacies
        };
    }, [medicine]);

    const nearbyStockStatus = useMemo(() => {
        if (!medicine || !nearbyPharmacy) return null;
        const inPharmacy = isAvailableInPharmacy(medicine.tkSzam, nearbyPharmacy.id);
        return getMedicinePharmacyStockStatus(medicine.status, inPharmacy);
    }, [medicine, nearbyPharmacy]);

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

        const count = Math.floor(seededVal(tk + "count") * 4) + 1;
        const spreadDays = 1200;
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

    const estimatedPrices = useMemo(() => {
        if (!medicine) return { publicPrice: '4 825 Ft', reimbursedPrice: '2 171 Ft' };
        let hash = 0;
        const str = medicine.tkSzam || medicine.nev;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        const abs = Math.abs(hash);
        const publicPriceNum = (abs % 6500) + 1500;
        const publicPrice = `${publicPriceNum.toLocaleString('hu-HU')} Ft`;
        const reimbursedPriceNum = Math.round(publicPriceNum * 0.45);
        const reimbursedPrice = `${reimbursedPriceNum.toLocaleString('hu-HU')} Ft`;
        return { publicPrice, reimbursedPrice };
    }, [medicine]);

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-[#62788f] font-medium">Gyógyszer adatlapjának betöltése...</p>
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="bg-white rounded-[16px] shadow-lg border border-[#e7e8ec] max-w-lg mx-auto p-8">
                    <span className="material-symbols-rounded text-6xl text-error mb-4">search_off</span>
                    <h1 className="text-2xl font-bold text-[#002664] mb-2">Gyógyszer nem található</h1>
                    <p className="text-[#62788f] mb-6">
                        A megadott törzskönyvi számmal ({tkParam || 'Nincs megadva'}) nem található gyógyszer az adatbázisban.
                    </p>
                    <Link href="/gyogyszerek" className="btn bg-[#002664] text-white hover:bg-[#001f52]">
                        Vissza a gyógyszerek listájához
                    </Link>
                </div>
            </div>
        );
    }

    const statusHistory = generateMockHistory(medicine.status, medicine.lastUpdate, medicine.tkSzam);

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12 flex flex-col gap-[24px]">
            {/* Back Link Row */}
            <div>
                <Link
                    href="/gyogyszerek"
                    className="h-[36px] px-[12px] py-[6px] border border-[#002664] rounded-[8px] inline-flex items-center gap-[8px] font-bold text-[14px] text-[#002664] bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <img src="/assets/figma/3b23203475136b257b7c1d04849a07d4c2d3b4cf.svg" alt="" className="size-[20px]" />
                    <span>Részletek</span>
                </Link>
            </div>

            {/* Product Profile Card */}
            <div className="bg-white border border-[#e7e8ec] rounded-[16px] p-[32px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] flex flex-col gap-[24px]">
                {/* Primary Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex flex-col gap-[8px]">
                        <h1 className="font-bold text-[#002664] text-[28px] leading-tight">
                            {medicine.nev}
                        </h1>
                        <p className="text-[#62788f] text-[16px]">
                            Hatóanyag: {medicine.inn || medicine.activeSubstance || 'Nincs adat'} | ATC Kód: {medicine.atcKod || 'Nincs adat'}
                        </p>
                    </div>
                    <MedicineDetailActions medicine={medicine} />
                </div>

                {/* Status Notice Banner for Shortage */}
                {medicine.status === 'Készlethiány' && (
                    <div className="bg-[#fffce9] rounded-[12px] p-[24px] flex flex-col gap-[16px] border border-[#f5e8a3]">
                        <div className="flex items-center gap-[8px]">
                            <img src="/assets/figma/1386f8d8a3f5265277c4d30ddd24ddd9380bbe73.svg" alt="" className="size-[24px]" />
                            <h2 className="font-bold text-[#002664] text-[22px]">Készlethiány</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                            <div>
                                <p className="font-bold text-[#62788f]">Készlethiány kezdete</p>
                                <p className="font-medium text-[#002664]">{medicine.shortageInfo?.start || '2026.01.01.'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-[#62788f]">Tervezett vége</p>
                                <p className="font-medium text-[#002664]">{medicine.shortageInfo?.end || '2026.12.31.'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-[#62788f]">Hiány oka</p>
                                <p className="font-medium text-[#002664]">{medicine.shortageInfo?.reason || 'Gyártási kapacitáshiány'}</p>
                            </div>
                        </div>
                        {medicine.shortageInfo?.suggestion && (
                            <div className="pt-2 border-t border-[#f5e8a3] text-[14px] text-[#62788f]">
                                <span className="font-bold text-[#002664]">Javaslat a pótlásra: </span>
                                <span>{medicine.shortageInfo.suggestion}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Status Notice Banner for Discontinued */}
                {medicine.status === 'Megszűnt' && (
                    <div className="bg-[#fef7f8] rounded-[12px] p-[24px] flex flex-col gap-[16px] border border-[#fbd3db]">
                        <div className="flex items-center gap-[8px]">
                            <img src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg" alt="" className="size-[24px]" />
                            <h2 className="font-bold text-[#002664] text-[22px]">Megszűnt termék</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                            <div>
                                <p className="font-bold text-[#62788f]">Ideje</p>
                                <p className="font-medium text-[#002664]">{medicine.lastUpdate ? formatDate(medicine.lastUpdate) : '2026.01.01.'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-[#62788f]">Megszűnés oka</p>
                                <p className="font-medium text-[#002664]">Forgalmazási engedély visszavonása / Forgalomból kivonva</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* BENU gyógyszertárak készlet státusz */}
                <div className="flex flex-col gap-[8px]">
                    <span className="text-[#62788f] text-[12px] font-medium uppercase tracking-wider">BENU GYÓGYSZERTÁRAK</span>
                    <div className="flex flex-col gap-[8px]">
                        {(medicine.status === 'Elérhető' || (!medicine.status.includes('hiány') && !medicine.status.includes('Megszűnt') && !medicine.status.includes('Hiány'))) ? (
                            <>
                                <div className="flex items-center gap-[12px]">
                                    <MedicineStockBadge status="keszleten" />
                                    <Link href="/gyogyszertarak" className="text-[#002664] text-[16px] underline hover:text-[#378509] transition-colors">
                                        {stockInfo.inStock} db BENU Gyógyszertárban
                                    </Link>
                                </div>
                                <div className="flex items-center gap-[12px]">
                                    <MedicineStockBadge status="rendelesre" />
                                    <p className="text-[#002664] text-[16px]">
                                        <Link href="/gyogyszertarak" className="text-[#002664] underline hover:text-[#378509] transition-colors">
                                            {stockInfo.orderable} db BENU Gyógyszertárban
                                        </Link>
                                        <span> (1-2 munkanap)</span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {stockInfo.inStock > 0 && (
                                    <div className="flex items-center gap-[12px]">
                                        <MedicineStockBadge status="korlatozottan" />
                                        <Link href="/gyogyszertarak" className="text-[#002664] text-[16px] underline hover:text-[#378509] transition-colors">
                                            {stockInfo.inStock} db BENU Gyógyszertárban
                                        </Link>
                                    </div>
                                )}
                                <div className="flex items-center gap-[12px]">
                                    <MedicineStockBadge status="nem-elerheto" />
                                    <span className="text-[#002664] text-[16px]">
                                        {stockInfo.unavailable} gyógyszertárban
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Közeli gyógyszertár készlet státusz */}
                <div className="flex flex-col gap-[8px]">
                    <span className="text-[#62788f] text-[12px] font-medium uppercase tracking-wider">KÖZELI GYÓGYSZERTÁR</span>
                    {nearbyPharmacy && nearbyStockStatus ? (
                        <div className="flex items-center gap-[12px]">
                            <MedicineStockBadge status={nearbyStockStatus} />
                            <p className="text-[#002664] text-[16px]">
                                <button
                                    type="button"
                                    onClick={() => setIsPharmacyModalOpen(true)}
                                    className="text-[#002664] underline hover:text-[#378509] transition-colors cursor-pointer text-left font-normal"
                                    title="Patika részleteinek megtekintése"
                                >
                                    {nearbyPharmacy.nev}
                                </button>
                                {nearbyStockStatus === 'rendelesre' && (
                                    <span> (1-2 munkanap)</span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-[12px]">
                            <span className="text-sm text-[#62788f] italic">
                                Nincs beállítva közeli gyógyszertár.
                            </span>
                            <Link
                                href="/gyogyszertarak"
                                className="text-sm text-[#002664] underline hover:text-[#378509] font-medium transition-colors"
                            >
                                Gyógyszertár kiválasztása
                            </Link>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#e7e8ec] w-full" />

                {/* Specs & Attributes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[16px]">
                    {/* Col 1 */}
                    <div className="flex flex-col gap-[16px]">
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">FORGALMAZÓ / GYÁRTÓ</p>
                            <p className="text-[#002664] font-bold text-[16px]">{medicine.gyarto || 'KRKA, d.d., Novo mesto (Szlovénia)'}</p>
                        </div>
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">KISZERELÉS MÉRETE</p>
                            <p className="text-[#002664] font-bold text-[16px]">{medicine.kiszereles || '90x - buborékcsomagolásban'}</p>
                        </div>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-[16px]">
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">TÁMOGATÁSI KATEGÓRIA</p>
                            <p className="text-[#002664] font-bold text-[16px]">
                                {medicine.dispensability ? `${medicine.dispensability} (55%)` : 'Kiemelt támogatásban részesülő (55%)'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">EKVIVALENCIA CSOPORT</p>
                            <p className="text-[#002664] font-bold text-[16px]">
                                {medicine.inn ? 'Helyettesíthető bázisgyógyszer' : 'Referencia készítmény'}
                            </p>
                        </div>
                    </div>

                    {/* Col 3 */}
                    <div className="flex flex-col gap-[16px]">
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">PUBLIKUS FOGYASZTÓI ÁR</p>
                            <p className="text-[#b1174e] font-bold text-[20px]">
                                {estimatedPrices.publicPrice}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#62788f] text-[12px] uppercase font-medium mb-1">TÉRÍTÉSI DÍJ (BECSÜLT)</p>
                            <p className="text-[#002664] font-bold text-[16px]">
                                {estimatedPrices.reimbursedPrice}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar / Substitute Medicines Table */}
            <SimilarMedicines substance={medicine.inn || medicine.activeSubstance || ''} medicines={similarMedicines} />

            {/* Status History Card */}
            <MedicineStatusHistory history={statusHistory} />

            {/* Közeli Patika Részletek Modális Ablak */}
            {nearbyPharmacy && (
                <PharmacyDetailModal
                    pharmacy={nearbyPharmacy}
                    isOpen={isPharmacyModalOpen}
                    onClose={() => setIsPharmacyModalOpen(false)}
                    onSelectOnMap={(id) => {
                        setIsPharmacyModalOpen(false);
                        router.push(`/gyogyszertarak?id=${id}`);
                    }}
                />
            )}
        </div>
    );
}

export default function MedicineDetailPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-[#62788f] font-medium">Betöltés...</p>
            </div>
        }>
            <MedicineDetailContent />
        </Suspense>
    );
}
