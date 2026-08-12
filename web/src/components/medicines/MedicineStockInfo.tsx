/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként látni szeretném a termék készletinformációit és a "Megnézem hol"
 * linkre kattintva egy térképes listát a patikákról.
 * 
 * FUNKCIÓK:
 * - Készlet / Rendelés információk megjelenítése.
 * - Modal megnyitása a megfelelő szűréssel.
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PharmacyStockModal } from '@/components/pharmacies/PharmacyStockModal';
import { fetchStaticData } from '@/lib/static-fetch';
import { Pharmacy } from '@/types';

interface MedicineStockInfoProps {
    medicineName: string;
    medicineId: string;
    stockInfo: {
        show: boolean;
        inStock: number;
        onOrder: number;
        total: number;
        isLimited: boolean;
    };
}

export const MedicineStockInfo: React.FC<MedicineStockInfoProps> = ({
    medicineName,
    medicineId,
    stockInfo
}) => {
    const [allPharmacyIds, setAllPharmacyIds] = useState<string[]>([]);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'stock' | 'order';
    }>({ isOpen: false, type: 'stock' });

    useEffect(() => {
        async function fetchIds() {
            try {
                const data = await fetchStaticData<Pharmacy[]>('/data/pharmacies.json');
                setAllPharmacyIds(data.map((p) => p.id));
            } catch (error) {
                console.error('Failed to fetch pharmacy IDs:', error);
            }
        }
        fetchIds();
    }, []);

    // Seeded pseudo-random generator
    const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Deterministic mock pharmacy IDs based on medicineId and type
    const getMockPharmacyIds = (type: 'stock' | 'order', count: number) => {
        if (allPharmacyIds.length === 0 || count <= 0) return [];

        // Base seed from medicineId
        const baseSeed = medicineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        // Different seeds for stock and order
        const typeSeed = baseSeed + (type === 'stock' ? 1000 : 2000);

        // Create a copy and shuffle it deterministically
        const shuffled = [...allPharmacyIds];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(typeSeed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Take the first 'count' items
        return shuffled.slice(0, count);
    };

    const stockPharmacyIds = useMemo(() =>
        getMockPharmacyIds('stock', stockInfo.inStock),
        [medicineId, stockInfo.inStock, allPharmacyIds]);

    const orderPharmacyIds = useMemo(() =>
        getMockPharmacyIds('order', stockInfo.onOrder),
        [medicineId, stockInfo.onOrder, allPharmacyIds]);

    if (!stockInfo.show) return null;

    return (
        <div className="mt-4 p-3 bg-base-200 rounded-lg text-sm">
            <PharmacyStockModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                medicineName={medicineName}
                statusType={modalConfig.type}
                filterIds={modalConfig.type === 'stock' ? stockPharmacyIds : orderPharmacyIds}
            />

            {stockInfo.isLimited ? (
                <div className="text-gray-600 flex items-center justify-between">
                    <span>Készleten: <strong>{stockInfo.inStock}</strong> gyógyszertárban</span>
                    <button
                        onClick={() => setModalConfig({ isOpen: true, type: 'stock' })}
                        className="btn btn-xs btn-outline btn-primary ml-2"
                    >
                        Megnézem hol
                    </button>
                </div>
            ) : (
                <>
                    <div className="font-semibold mb-1">
                        {stockInfo.total} gyógyszertárban elérhető:
                    </div>
                    <ul className="text-gray-600 space-y-1">
                        <li className="flex items-center justify-between">
                            <span>Készleten: <strong>{stockInfo.inStock}</strong> gyógyszertárban</span>
                            <button
                                onClick={() => setModalConfig({ isOpen: true, type: 'stock' })}
                                className="btn btn-xs btn-outline btn-primary ml-2"
                            >
                                Megnézem hol
                            </button>
                        </li>
                        <li className="flex items-center justify-between">
                            <span>Rendelésre 1-2 munkanapon belül: <strong>{stockInfo.onOrder}</strong> gyógyszertárban</span>
                            <button
                                onClick={() => setModalConfig({ isOpen: true, type: 'order' })}
                                className="btn btn-xs btn-outline btn-primary ml-2"
                            >
                                Megnézem hol
                            </button>
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
};
