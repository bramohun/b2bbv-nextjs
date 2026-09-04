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
 * A BENU Vény Orvosi Portál hivatalos bejelentkezési felülete a legújabb Figma tervek
 * (Desktop / Bejelentkezés - 13334:18188) alapján. Lehetővé teszi az orvosok és szakmai
 * partnerek számára az azonosítást jelszóval, kétfaktoros hitelesítéssel (2FA OTP),
 * biometrikus Passkey-vel (Touch ID, Face ID, Windows Hello) vagy egyszeri jelszómentes
 * e-mail kóddal (Magic Code).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként / szakmai felhasználóként szeretnék bejelentkezni a portálra a hitelesítő
 *   adataimmal, vagy biometrikus azonosítással / e-mail kóddal.
 * - Felhasználóként a jelszó megadása után szeretném beírni a 6 jegyű 2FA kódomat a
 *   biztonságos belépéshez.
 * - Felhasználóként szeretném megjelölni az eszközömet megbízhatóként (30 napig), hogy ne
 *   kelljen minden alkalommal 2FA kódot megadnom.
 * - Felhasználóként szeretnék elfelejtett jelszó esetén jelszó-visszaállítást kezdeményezni.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Elfelejtett jelszó oldal: /forgot-password
 * - Irányítópult (Dashboard): /dashboard
 * - Profil felület (2FA és Passkey beállítások): /profile
 * - Hivatalos specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (1.0 Felhasználó-kezelés és Authentikáció)
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
            {/* Header: BENU Vény logo + Orvosoknak felirat (Figma: 13300:27275) */}
            <div className="flex flex-col items-center justify-center gap-2 mb-6 text-center">
                <div className="h-[33px] w-[214px] relative">
                    <img
                        src="/assets/figma/benu-veny-logo.png"
                        alt="BENU VÉNY"
                        className="w-full h-full object-contain"
                    />
                </div>
                <h2 className="font-bold text-[#002664] text-[22px] leading-[33px]">
                    Orvosoknak
                </h2>
            </div>

            {/* Bejelentkezési Kártya (Figma: 13300:27205 - Desktop / BENU vény steps) */}
            <div className="bg-[#F9F9FB] w-[479px] max-w-full rounded-[16px] p-6 md:p-[24px] flex flex-col gap-4 border border-[#EBECEF] shadow-xs">
                {/* Kártya Cím */}
                <h1 className="font-bold text-[#002664] text-[22px] leading-[33px]">
                    {pending2FA ? 'Kétfaktoros Azonosítás' : 'Bejelentkezés'}
                </h1>

                {/* Hiba- és sikeres üzenetek */}
                {error && (
                    <div className="bg-[#FEEAED] border border-[#F5C2C7] text-[#842029] text-xs py-2.5 px-3 rounded-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-base shrink-0">error</span>
                        <span>{error}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-[#E8F8E2] border border-[#C4EDB6] text-[#317907] text-xs py-2.5 px-3 rounded-lg flex items-center gap-2">
                        <span className="material-symbols-rounded text-base shrink-0">check_circle</span>
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Bejelentkezési Módok Fülei (Csak ha nincs aktív 2FA) */}
                {!pending2FA && (
                    <div className="flex p-1 bg-[#EBECEF] rounded-lg gap-1">
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                activeTab === 'password'
                                    ? 'bg-[#002664] text-white shadow-xs'
                                    : 'text-[#62788F] hover:text-[#002664]'
                            }`}
                            onClick={() => setActiveTab('password')}
                        >
                            Jelszó
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                activeTab === 'passkey'
                                    ? 'bg-[#002664] text-white shadow-xs'
                                    : 'text-[#62788F] hover:text-[#002664]'
                            }`}
                            onClick={() => setActiveTab('passkey')}
                        >
                            Passkey
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                activeTab === 'magic'
                                    ? 'bg-[#002664] text-white shadow-xs'
                                    : 'text-[#62788F] hover:text-[#002664]'
                            }`}
                            onClick={() => setActiveTab('magic')}
                        >
                            E-mail Kód
                        </button>
                    </div>
                )}

                {/* TAB 1: Jelszavas Bejelentkezés (Figma: 13300:27216, 27217, 27218, 27219) */}
                {!pending2FA && activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="E-mail cím"
                                className="h-[56px] w-full bg-white border border-[#D8D9E0] rounded-[8px] px-[15px] py-[16px] text-[16px] text-[#002664] placeholder:text-[#62788F] focus:outline-none focus:border-[#002664] transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Jelszó"
                                className="h-[56px] w-full bg-white border border-[#D8D9E0] rounded-[8px] px-[15px] py-[16px] text-[16px] text-[#002664] placeholder:text-[#62788F] focus:outline-none focus:border-[#002664] transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Bejelentkezés gomb jobbra mutató nyíllal */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-[56px] w-full bg-[#002664] hover:bg-[#001F52] text-white rounded-[8px] font-bold text-[16px] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 mt-1"
                        >
                            <span>{isLoading ? 'Azonosítás...' : 'Bejelentkezés'}</span>
                            <img
                                src="/assets/figma/926ab808af433eb226b2264ddd3c32d57123262d.svg"
                                alt=""
                                className="size-[24px]"
                            />
                        </button>

                        {/* Elfelejtett jelszó link */}
                        <div className="flex items-center justify-start pt-1">
                            <Link
                                href="/forgot-password"
                                className="text-[#002664] font-bold text-[14px] leading-[21px] hover:underline"
                            >
                                Elfelejtett jelszó
                            </Link>
                        </div>
                    </form>
                )}

                {/* TAB 2: Passkey Biometrikus Belépés */}
                {!pending2FA && activeTab === 'passkey' && (
                    <div className="flex flex-col gap-4 text-center py-2">
                        <div className="p-5 bg-white rounded-xl border border-[#D8D9E0] flex flex-col items-center">
                            <span className="material-symbols-rounded text-5xl text-[#002664] mb-2 block">
                                fingerprint
                            </span>
                            <h3 className="font-bold text-base text-[#002664] mb-1">
                                Gyors belépés Biometriával
                            </h3>
                            <p className="text-xs text-[#62788F] mb-4 max-w-xs">
                                Belépés Touch ID, Face ID vagy Windows Hello segítségével kódok beírása nélkül.
                            </p>

                            <input
                                type="email"
                                placeholder="orvos@orvos.hu (opcionális azonosító)"
                                className="h-[48px] w-full bg-white border border-[#D8D9E0] rounded-[8px] px-3 py-2 text-sm text-[#002664] placeholder:text-[#62788F] focus:outline-none focus:border-[#002664] mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={handlePasskeySubmit}
                                disabled={isLoading}
                                className="h-[56px] w-full bg-[#002664] hover:bg-[#001F52] text-white rounded-[8px] font-bold text-[16px] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <span className="material-symbols-rounded text-xl">fingerprint</span>
                                <span>{isLoading ? 'Biometria ellenőrzése...' : 'Belépés Passkey-vel'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 3: E-mail Kód (Magic Code) */}
                {!pending2FA && activeTab === 'magic' && (
                    <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-3">
                        <p className="text-xs text-[#62788F]">
                            Adja meg e-mail címét, és küldünk egy 6 jegyű belépési kódot jelszó használata nélkül.
                        </p>
                        <input
                            type="email"
                            placeholder="E-mail cím"
                            className="h-[56px] w-full bg-white border border-[#D8D9E0] rounded-[8px] px-[15px] py-[16px] text-[16px] text-[#002664] placeholder:text-[#62788F] focus:outline-none focus:border-[#002664] transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-[56px] w-full bg-[#002664] hover:bg-[#001F52] text-white rounded-[8px] font-bold text-[16px] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 mt-1"
                        >
                            <span className="material-symbols-rounded text-xl">mail</span>
                            <span>{isLoading ? 'Kód küldése...' : 'Egyszeri belépőkód küldése'}</span>
                        </button>
                    </form>
                )}

                {/* 2FA / OTP Belépési lépés (Ha pending2FA aktív) */}
                {pending2FA && (
                    <form onSubmit={handle2FASubmit} className="flex flex-col gap-4">
                        <div className="p-4 bg-white rounded-xl border border-[#D8D9E0] text-center">
                            <span className="material-symbols-rounded text-4xl text-[#002664] mb-1 block">
                                verified_user
                            </span>
                            <p className="text-xs text-[#62788F]">
                                Elküldtük a 6 jegyű kódot a(z) <span className="font-semibold text-[#002664]">{pending2FA.email}</span> címre.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-[#002664] text-center">
                                6-jegyű OTP kód
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                className="h-[56px] w-full bg-white border border-[#D8D9E0] rounded-[8px] text-center text-2xl tracking-[0.5em] font-mono font-bold text-[#002664] focus:outline-none focus:border-[#002664]"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <label className="cursor-pointer flex items-center gap-2 py-1">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm rounded"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                            />
                            <span className="text-xs text-[#62788F]">
                                Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)
                            </span>
                        </label>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={cancel2FA}
                                className="h-[48px] flex-1 bg-white border border-[#D8D9E0] hover:bg-slate-50 text-[#002664] font-bold text-sm rounded-[8px] transition-colors"
                            >
                                Vissza
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || otpCode.length < 6}
                                className="h-[48px] flex-1 bg-[#002664] hover:bg-[#001F52] text-white font-bold text-sm rounded-[8px] transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Ellenőrzés...' : 'Kód igazolása'}
                            </button>
                        </div>

                        {/* Demo segédlet */}
                        <div className="p-2.5 bg-[#EFF0F3] rounded-lg text-center">
                            <span className="text-[11px] text-[#62788F]">
                                💡 <strong>Tesztelési segédlet:</strong> A demo 2FA kód: <code className="font-bold text-[#002664]">123456</code>
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

