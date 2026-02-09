import Link from 'next/link';
import React from 'react';

export const Navbar = () => {
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
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <span className="material-symbols-rounded">notifications</span>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
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
