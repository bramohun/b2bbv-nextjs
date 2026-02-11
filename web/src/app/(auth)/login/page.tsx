'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * ============================================================================
 * FUNKCIÓS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék bejelentkezni a rendszerbe az email címemmel és
 * jelszavammal, hogy hozzáférjek a belső funkciókhoz.
 * 
 * FUNKCIÓK:
 * - Email és jelszó mezők megjelenítése.
 * - Bejelentkezés gomb.
 * - Hibaüzenet megjelenítése sikertelen belépés esetén.
 * - Fejlesztői környezetben automatikus kitöltés a gyorsabb teszteléshez.
 * - Elfelejtett jelszó link.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A `useAuth` login függvényét hívjuk meg a beküldéskor.
 * - Sikeres belépés után a kezdőoldalra (dashboard) irányítunk.
 * - Fejlesztői környezetben (`process.env.NODE_ENV === 'development'`) az adatok
 *   előre ki vannak töltve.
 */

export default function LoginPage() {
    const isDev = process.env.NODE_ENV === 'development';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isDev) {
            setEmail('demo@example.com');
            setPassword('vény123');
        }
    }, [isDev]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            router.push('/dashboard');
        } else {
            setError('Hibás email cím vagy jelszó!');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="flex justify-center mb-6">
                        <img src="/logo-icon.png" alt="Logo" className="h-16 w-16" />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-primary mb-2">Bejelentkezés</h2>
                    <p className="text-sm text-center text-base-content/60 mb-6">
                        Kérjük, adja meg adatait a belépéshez.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="alert alert-error text-sm py-2">
                                <span className="material-symbols-rounded text-xl">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email cím</span>
                            </label>
                            <input
                                type="email"
                                placeholder="pelda@email.hu"
                                className="input input-bordered focus:input-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Jelszó</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered focus:input-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label py-1">
                                <Link
                                    href="/forgot-password"
                                    className="label-text-alt link link-primary hover:text-primary-focus"
                                >
                                    Elfelejtett jelszó?
                                </Link>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Belépés folyamatban...' : 'Bejelentkezés'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
