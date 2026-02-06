'use client';

import React, { useState, useEffect } from 'react';
import { Medicine } from '@/types';
import { MedicineCard } from '@/components/medicines/MedicineCard';

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        async function fetchMedicines() {
            try {
                const response = await fetch('/api/medicines');
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error('Failed to load medicines:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMedicines();
    }, []);

    const filteredMedicines = medicines.filter(medicine => {
        const matchesSearch =
            medicine.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.inn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.tkSzam.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || medicine.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Gyógyszerek</h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Keresés..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="material-symbols-rounded text-gray-400">search</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Minden státusz</option>
                        <option value="Elérhető">Elérhető</option>
                        <option value="Készlethiány">Készlethiány</option>
                        <option value="Megszűnt">Megszűnt</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((medicine) => (
                            <MedicineCard key={medicine.tkSzam} medicine={medicine} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            Nem található a keresésnek megfelelő gyógyszer.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
