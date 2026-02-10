import React from 'react';
import { formatDate } from '@/lib/utils';

export interface StatusChange {
    date: string;
    status: string;
}

interface MedicineStatusHistoryProps {
    history: StatusChange[];
}

export function MedicineStatusHistory({ history }: MedicineStatusHistoryProps) {
    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'elérhető') return <span className="badge badge-success badge-sm">{status}</span>;
        if (s === 'készlethiány') return <span className="badge badge-warning badge-sm">{status}</span>;
        if (s === 'megszűnt') return <span className="badge badge-error badge-sm">{status}</span>;
        return <span className="badge badge-ghost badge-sm">{status}</span>;
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden mt-6">
            <div className="card-body">
                <h2 className="card-title text-xl mb-4">Státusz-változások</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th className="bg-base-200">Dátum + Idő</th>
                                <th className="bg-base-200">Státusz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <tr key={index} className="hover">
                                        <td>{formatDate(item.date)}</td>
                                        <td>{getStatusBadge(item.status)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center text-gray-500 py-4">
                                        Nincs elérhető előzmény.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
