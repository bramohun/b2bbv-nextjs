'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném látni a kiválasztott gyógyszerrel megegyező
 * hatóanyagú, de jelenleg elérhető egyéb készítményeket, hogy készlethiány
 * esetén alternatívát találhassak, vagy összehasonlíthassam a lehetőségeket.
 * 
 * FUNKCIÓK:
 * - Hasonló termékek táblázatos megjelenítése.
 * - Csak az "Elérhető" státuszú termékek szűrése és megjelenítése.
 * - Gyors navigáció a helyettesítő termék adatlapjára.
 * - **KÖZELI PATIKA ELÉRHETŐSÉG**: Megmutatjuk, hogy az adott termék elérhető-e a felhasználó kedvenc patikájában.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A komponens kap egy hatóanyag nevet és egy előre leszűrt listát.
 * - Ha a lista üres, a komponens nem jelenik meg.
 * - Táblázatos elrendezés: Név, Kiszerelés, Gyártó, Státusz, Közeli patika, Művelet.
 * - A közeli patika státuszát az `isAvailableInPharmacy` függvény határozza meg.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/app/(dashboard)/gyogyszerek/[...id]/page.tsx: Felhasználó oldal
 * - src/lib/data.ts: Adatlekérdezés (getMedicinesBySubstance)
 */

import React from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { useNotification } from '@/context/NotificationContext';
import { useFavorite } from '@/context/FavoriteContext';
import { isAvailableInPharmacy } from '@/lib/utils';
import { FavoriteRemovalModal } from './FavoriteRemovalModal';

interface SimilarMedicinesProps {
    substance: string;
    medicines: Medicine[];
}

export function SimilarMedicines({ substance, medicines }: SimilarMedicinesProps) {
    const { nearbyPharmacy } = useNearbyPharmacy();
    const { isSubscribed, unsubscribe } = useNotification();
    const { isFavorite, addFavorite, removeFavorite } = useFavorite();
    const [pendingRemovalMed, setPendingRemovalMed] = React.useState<Medicine | null>(null);

    if (medicines.length === 0) return null;

    const handleFavoriteToggle = (med: Medicine) => {
        if (isFavorite(med.tkSzam)) {
            if (isSubscribed(med.tkSzam)) {
                setPendingRemovalMed(med);
            } else {
                removeFavorite(med.tkSzam);
            }
        } else {
            addFavorite(med);
        }
    };

    const confirmRemoval = () => {
        if (pendingRemovalMed) {
            removeFavorite(pendingRemovalMed.tkSzam);
            unsubscribe(pendingRemovalMed.tkSzam);
            setPendingRemovalMed(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'elérhető') return <span className="badge badge-success badge-sm">{status}</span>;
        if (s === 'készlethiány') return <span className="badge badge-warning badge-sm">{status}</span>;
        if (s === 'megszűnt') return <span className="badge badge-error badge-sm">{status}</span>;
        return <span className="badge badge-ghost badge-sm">{status}</span>;
    };

    const getPharmacyAvailabilityBadge = (med: Medicine) => {
        if (!nearbyPharmacy) {
            return <span className="text-gray-400 text-xs italic">Nincs patika beállítva</span>;
        }

        const available = isAvailableInPharmacy(med.tkSzam, nearbyPharmacy.id);

        return (
            <div className={`badge ${available ? 'badge-success' : 'badge-ghost'} badge-sm gap-1`}>
                <span className="material-symbols-rounded text-[10px]">
                    {available ? 'check_circle' : 'block'}
                </span>
                {available ? 'Elérhető' : 'Nem elérhető'}
            </div>
        );
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden mt-8">
            <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-rounded text-primary">Science</span>
                    <h2 className="card-title text-xl">
                        Elérhető termékek{' '}
                        <Link
                            href={`/gyogyszerek?search=${encodeURIComponent(substance)}&status=Elérhető`}
                            className="text-primary hover:underline"
                        >
                            {substance}
                        </Link>{' '}
                        hatóanyaggal
                    </h2>
                </div>

                <FavoriteRemovalModal
                    isOpen={!!pendingRemovalMed}
                    onClose={() => setPendingRemovalMed(null)}
                    onConfirm={confirmRemoval}
                />

                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th className="bg-base-200">Kedvenc</th>
                                <th className="bg-base-200">Név</th>
                                <th className="bg-base-200">Kiszerelés</th>
                                <th className="bg-base-200">Gyártó</th>
                                <th className="bg-base-200">Státusz</th>
                                <th className="bg-base-200">Közeli patika</th>
                                <th className="bg-base-200">Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((med) => (
                                <tr key={med.tkSzam} className="hover">
                                    <td>
                                        <button
                                            className={`btn btn-circle btn-ghost btn-xs ${isFavorite(med.tkSzam) ? 'text-warning' : 'text-gray-400'}`}
                                            onClick={() => handleFavoriteToggle(med)}
                                            title={isFavorite(med.tkSzam) ? "Eltávolítás a kedvencekből" : "Kedvencekhez"}
                                        >
                                            <span className={`material-symbols-rounded text-base ${isFavorite(med.tkSzam) ? 'fill-1' : ''}`}>star</span>
                                        </button>
                                    </td>
                                    <td className="font-medium">
                                        <Link href={`/gyogyszerek/${med.tkSzam}`} className="hover:text-primary transition-colors">
                                            {med.nev}
                                        </Link>
                                    </td>
                                    <td>{med.kiszereles}</td>
                                    <td>{med.gyarto}</td>
                                    <td>{getStatusBadge(med.status)}</td>
                                    <td>{getPharmacyAvailabilityBadge(med)}</td>
                                    <td>
                                        <Link
                                            href={`/gyogyszerek/${med.tkSzam}`}
                                            className="btn btn-ghost btn-xs text-primary gap-1"
                                        >
                                            Megtekintés
                                            <span className="material-symbols-rounded text-xs">arrow_forward</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
