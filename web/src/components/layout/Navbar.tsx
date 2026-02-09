'use client';

import Link from 'next/link';
import React from 'react';
import { useNotification } from '@/context/NotificationContext';

export const Navbar = () => {
    const { subscriptions } = useNotification();
    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <span className="material-symbols-rounded">menu</span>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li><Link href="/dashboard">Irányítópult</Link></li>
                        <li><Link href="/gyogyszerek">Gyógyszerek</Link></li>
                        <li><Link href="/gyogyszertarak">Gyógyszertárak</Link></li>
                        <li><Link href="/kozosseg">Közösség</Link></li>
                    </ul>
                </div>
                <Link href="/dashboard" className="btn btn-ghost text-xl">
                    {/* Placeholder for Logo - In legacy it was an IMG */}
                    <span className="font-bold text-primary">Orvosi Portál</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/dashboard">Irányítópult</Link></li>
                    <li><Link href="/gyogyszerek">Gyógyszerek</Link></li>
                    <li><Link href="/gyogyszertarak">Gyógyszertárak</Link></li>
                    <li><Link href="/kozosseg">Közösség</Link></li>
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <button className="btn btn-ghost btn-circle">
                    <span className="material-symbols-rounded">search</span>
                </button>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <span className="material-symbols-rounded">notifications</span>
                            {subscriptions.length > 0 && (
                                <span className="badge badge-xs badge-primary indicator-item">
                                    {subscriptions.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-80 shadow"
                    >
                        <div className="card-body">
                            <span className="text-lg font-bold">{subscriptions.length} feliratkozás</span>
                            <div className="max-h-60 overflow-y-auto">
                                {subscriptions.length === 0 ? (
                                    <p className="text-sm text-gray-500">Nincs aktív értesítés kérés.</p>
                                ) : (
                                    <ul className="menu menu-sm bg-base-100 rounded-box p-0">
                                        {subscriptions.map((sub) => (
                                            <li key={sub.tkSzam} className="border-b border-base-200 last:border-none">
                                                <Link href={`/gyogyszerek/${sub.tkSzam}`} className="flex flex-col items-start py-2">
                                                    <span className="font-medium truncate w-full">{sub.name}</span>
                                                    <span className="text-xs text-gray-400">{sub.tkSzam}</span>
                                                    <span className={`badge badge-xs mt-1 ${sub.status === 'Elérhető' ? 'badge-success' :
                                                        sub.status === 'Készlethiány' ? 'badge-warning' : 'badge-error'
                                                        }`}>
                                                        {sub.status}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="card-actions">
                                <Link href="/profile/notifications" className="btn btn-primary btn-block btn-sm">
                                    Összes megtekintése
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span>DR</span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/profile">Profil</Link></li>
                        <li><Link href="/settings">Beállítások</Link></li>
                        <li><Link href="/logout">Kijelentkezés</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
