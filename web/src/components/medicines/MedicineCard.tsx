import React from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';

interface MedicineCardProps {
    medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
    const isDeprecated = medicine.status === "Megszűnt";
    const statusColor =
        medicine.status === "Elérhető" ? "badge-success" :
            medicine.status === "Készlethiány" ? "badge-error" :
                "badge-ghost";

    return (
        <div className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow ${isDeprecated ? 'opacity-70' : ''}`}>
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`card-title text-lg ${isDeprecated ? 'line-through text-gray-500' : ''}`}>
                            {medicine.nev}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono">{medicine.tkSzam}</p>
                    </div>
                    <div className={`badge ${statusColor} text-xs font-semibold`}>
                        {medicine.status}
                    </div>
                </div>

                <div className="text-sm mt-2 space-y-1">
                    <p><span className="font-semibold text-gray-500">Hatóanyag:</span> {medicine.inn}</p>
                    <p><span className="font-semibold text-gray-500">Gyártó:</span> {medicine.gyarto}</p>
                    <p><span className="font-semibold text-gray-500">Kiszerelés:</span> {medicine.kiszereles}</p>
                </div>

                <div className="card-actions justify-end mt-4 items-center">
                    <button className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-error" aria-label="Kedvencekhez adás">
                        <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>favorite</span>
                    </button>
                    <button className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-info" aria-label="Értesítés kérése">
                        <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>notifications</span>
                    </button>
                    <Link href={`/medicines/${medicine.tkSzam}`} className="btn btn-sm btn-primary ml-2">
                        Részletek
                    </Link>
                </div>
            </div>
        </div>
    );
};
