'use client';

import React from 'react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';

export default function NotificationsPage() {
    const { subscriptions, unsubscribe } = useNotification();

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'elérhető': return 'badge-success';
            case 'készlethiány': return 'badge-warning';
            case 'megszűnt': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-[36px] rounded-lg bg-[#002664] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-2xl">notifications</span>
                </div>
                <h1 className="text-[22px] md:text-[24px] font-bold text-[#002664] leading-[33px]">
                    Értesítés kezelés
                </h1>
            </div>

            <div className="bg-base-100 rounded-lg shadow border border-base-200">
                {subscriptions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-rounded text-6xl mb-4 block opacity-20">notifications_off</span>
                        <p className="text-lg">Jelenleg nincs aktív értesítés kérése.</p>
                        <Link href="/gyogyszerek" className="btn btn-primary mt-4">
                            Gyógyszerek böngészése
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Gyógyszer neve</th>
                                    <th>TK-szám</th>
                                    <th>Státusz</th>
                                    <th>Feliratkozás ideje</th>
                                    <th className="text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((sub) => (
                                    <tr key={sub.tkSzam} className="hover">
                                        <td>
                                            <Link href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(sub.tkSzam)}`} className="font-bold hover:text-primary hover:underline">
                                                {sub.name}
                                            </Link>
                                        </td>
                                        <td className="font-mono text-sm opacity-70">{sub.tkSzam}</td>
                                        <td>
                                            <div className={`badge ${getStatusColor(sub.status)} badge-sm`}>
                                                {sub.status}
                                            </div>
                                        </td>
                                        <td className="text-sm">
                                            {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('hu-HU', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                                                onClick={() => unsubscribe(sub.tkSzam)}
                                                title="Leiratkozás"
                                            >
                                                <span className="material-symbols-rounded">notifications_off</span>
                                                <span className="hidden sm:inline ml-1">Leiratkozás</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
