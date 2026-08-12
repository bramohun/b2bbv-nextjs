'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - BEJELENTKEZÉSI FELÜLET (LOGIN)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A portál bejelentkezési felülete, amely lehetővé teszi a felhasználóknak a belépést
 * hagyományos jelszóval + 2FA-val (Email/SMS OTP), biometrikus Passkey-vel (TouchID/FaceID/Windows Hello),
 * vagy jelszó nélküli egyszeri e-mail kóddal (Magic Code).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Szakmai felhasználóként szeretnék bejelentkezni a rendszerbe jelszóval, Passkey-vel vagy e-mail kóddal.
 * - Felhasználóként a jelszó megadása után szeretném beírni a 6 jegyű 2FA kódomat az azonosítás befejezéséhez.
 * - Felhasználóként szeretném megjelölni az eszközömet megbízhatóként (30 napig), hogy ne kelljen újra 2FA kódot megadnom.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Elfelejtett jelszó oldal: https://bvorvosi.vercel.app/forgot-password
 * - Irányítópult (Dashboard): https://bvorvosi.vercel.app/dashboard
 * - Profil felület (2FA és Passkey beállítások): https://bvorvosi.vercel.app/profile
 * ============================================================================
 */

type AuthTab = 'password' | 'passkey' | 'magic';

export default function LoginPage() {
    const isDev = process.env.NODE_ENV === 'development';
    const [activeTab, setActiveTab] = useState<AuthTab>('password');

    // Password form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // OTP / 2FA state
    const [otpCode, setOtpCode] = useState('');
    const [rememberDevice, setRememberDevice] = useState(true);

    // UX state
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login, verify2FA, loginWithPasskey, sendMagicLink, pending2FA, cancel2FA } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isDev) {
            setEmail('demo@example.com');
            setPassword('vény123');
        }
    }, [isDev]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        const result = await login(email, password);

        setIsLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else if (result.require2FA) {
            setOtpCode('');
            // 2FA modal will be rendered via pending2FA state
        } else {
            setError(result.error || 'Hibás e-mail cím vagy jelszó!');
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const success = await verify2FA(otpCode, rememberDevice);

        setIsLoading(false);
        if (success) {
            router.push('/dashboard');
        } else {
            setError('Hibás 6-jegyű ellenőrző kód! Próbálja újra (Demó kód: 123456).');
        }
    };

    const handlePasskeySubmit = async () => {
        setError(null);
        setIsLoading(true);

        const success = await loginWithPasskey(email || undefined);

        setIsLoading(false);
        if (success) {
            router.push('/dashboard');
        } else {
            setError('Biometrikus Passkey azonosítás nem sikerült.');
        }
    };

    const handleMagicLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        const result = await sendMagicLink(email);

        setIsLoading(false);
        if (result.success) {
            setSuccessMsg('Kiküldtük a 6-jegyű bejelentkező kódot az e-mail címére!');
        } else {
            setError(result.error || 'A kód küldése nem sikerült.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 relative">
                <div className="card-body p-6">
                    {/* Header */}
                    <div className="flex justify-center mb-4">
                        <img src="/logo-icon.png" alt="BENUvény Logo" className="h-16 w-16 object-contain" />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-primary mb-1">
                        Szakmai Bejelentkezés
                    </h2>
                    <p className="text-sm text-center text-base-content/70 mb-6 font-medium">
                        BENUvény Orvosi Portál
                    </p>

                    {/* Notification alerts */}
                    {error && (
                        <div className="alert alert-error text-sm py-2.5 mb-4 shadow-sm">
                            <span className="material-symbols-rounded text-xl">error</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className="alert alert-success text-sm py-2.5 mb-4 shadow-sm text-success-content">
                            <span className="material-symbols-rounded text-xl">check_circle</span>
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Main Tabs */}
                    {!pending2FA && (
                        <div className="tabs tabs-boxed mb-6 grid grid-cols-3 bg-base-200 p-1">
                            <button
                                type="button"
                                className={`tab text-xs font-semibold ${activeTab === 'password' ? 'tab-active bg-primary text-primary-content shadow' : ''}`}
                                onClick={() => setActiveTab('password')}
                            >
                                Jelszó
                            </button>
                            <button
                                type="button"
                                className={`tab text-xs font-semibold ${activeTab === 'passkey' ? 'tab-active bg-primary text-primary-content shadow' : ''}`}
                                onClick={() => setActiveTab('passkey')}
                            >
                                Passkey
                            </button>
                            <button
                                type="button"
                                className={`tab text-xs font-semibold ${activeTab === 'magic' ? 'tab-active bg-primary text-primary-content shadow' : ''}`}
                                onClick={() => setActiveTab('magic')}
                            >
                                E-mail Kód
                            </button>
                        </div>
                    )}

                    {/* TAB 1: Password Form */}
                    {!pending2FA && activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-xs">E-mail cím</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="orvos@orvos.hu"
                                    className="input input-bordered focus:input-primary text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-xs">Jelszó</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered focus:input-primary text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className="label py-1">
                                    <Link
                                        href="/forgot-password"
                                        className="label-text-alt link link-primary text-xs"
                                    >
                                        Elfelejtett jelszó?
                                    </Link>
                                </label>
                            </div>

                            <div className="form-control mt-4">
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Azonosítás...' : 'Bejelentkezés'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: Passkey Form */}
                    {!pending2FA && activeTab === 'passkey' && (
                        <div className="space-y-4 text-center py-2">
                            <div className="p-4 bg-base-200/60 rounded-xl border border-base-300">
                                <span className="material-symbols-rounded text-5xl text-primary mb-2 block">
                                    fingerprint
                                </span>
                                <h3 className="font-bold text-base text-base-content mb-1">
                                    Gyors belépés Biometriával
                                </h3>
                                <p className="text-xs text-base-content/70 mb-4">
                                    Belépés Touch ID, Face ID vagy Windows Hello segítségével kódok beírása nélkül.
                                </p>

                                <div className="form-control mb-4">
                                    <input
                                        type="email"
                                        placeholder="orvos@orvos.hu (opcionális azonosító)"
                                        className="input input-bordered input-sm focus:input-primary text-xs"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePasskeySubmit}
                                    className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    <span className="material-symbols-rounded text-lg">fingerprint</span>
                                    {isLoading ? 'Biometria ellenőrzése...' : 'Belépés Passkey-vel'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Magic Code / Passwordless */}
                    {!pending2FA && activeTab === 'magic' && (
                        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                            <p className="text-xs text-base-content/70">
                                Adja meg e-mail címét, és küldünk egy 6 jegyű belépési kódot jelszó használata nélkül.
                            </p>
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-xs">E-mail cím</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="orvos@orvos.hu"
                                    className="input input-bordered focus:input-primary text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                <span className="material-symbols-rounded text-lg">mail</span>
                                {isLoading ? 'Kód küldése...' : 'Egyszeri belépőkód küldése'}
                            </button>
                        </form>
                    )}

                    {/* 2FA / OTP STEP (WHEN PENDING 2FA IS ACTIVE) */}
                    {pending2FA && (
                        <form onSubmit={handle2FASubmit} className="space-y-4 animate-fade-in">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
                                <span className="material-symbols-rounded text-4xl text-primary mb-1 block">
                                    verified_user
                                </span>
                                <h3 className="font-bold text-base text-base-content mb-1">
                                    Kétfaktoros Azonosítás (2FA)
                                </h3>
                                <p className="text-xs text-base-content/70">
                                    Elküldtük a 6 jegyű kódot a(z) <span className="font-semibold text-primary">{pending2FA.email}</span> címre.
                                </p>
                            </div>

                            <div className="form-control text-center">
                                <label className="label justify-center py-1">
                                    <span className="label-text font-bold text-xs">6-jegyű OTP kód</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="123456"
                                    className="input input-bordered text-center text-2xl tracking-[0.5em] font-mono focus:input-primary font-bold"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-control">
                                <label className="cursor-pointer label justify-start gap-2 py-1">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm"
                                        checked={rememberDevice}
                                        onChange={(e) => setRememberDevice(e.target.checked)}
                                    />
                                    <span className="label-text text-xs">
                                        Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={cancel2FA}
                                    className="btn btn-ghost btn-sm flex-1 text-xs"
                                >
                                    Vissza
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary btn-sm flex-1 text-xs ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading || otpCode.length < 6}
                                >
                                    {isLoading ? 'Ellenőrzés...' : 'Kód igazolása'}
                                </button>
                            </div>

                            {/* Demo helper */}
                            <div className="mt-3 p-2 bg-base-200 rounded text-center">
                                <span className="text-[11px] text-base-content/60">
                                    💡 <strong>Tesztelési segédlet:</strong> A demo 2FA kód: <code className="font-bold text-primary">123456</code>
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

