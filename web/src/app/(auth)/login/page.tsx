'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - BEJELENTKEZÉSI FELÜLET (LOGIN)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A BENU Vény Orvosi Portál egyszerűsített felhasználónév/jelszó bejelentkezési felülete.
 * 
 * FONTOS HATÓKÖRI (SCOPE) RENDELKEZÉS:
 * A felhasználók beléptetése, azonosítása és a jogosultságok kezelése a megrendelő
 * meglévő vagy külső orvosi azonosító / SSO infrastruktúráján (pl. központi orvosi
 * azonosító rendszer) keresztül történik, így az autentikációs háttérrendszer és a
 * komplex bejelentkezési mechanizmusok (biometrikus Passkey, e-mail Magic Code, 2FA OTP)
 * NEM KÉPEZIK a közvetlen fejlesztési scope részét.
 * 
 * A prototípus és a felületi specifikáció az egyszerű, letisztult e-mail/jelszó
 * bejelentkezési felületet biztosítja a rendszer zárt szakmai funkcióinak (Dashboard,
 * gyógyszer-nyilvántartás, patikakereső, adminisztráció) demonstrálására és tesztelésére.
 * A háttérben kód szintjén megőrizzük a meglévő autentikációs függvényeket a
 * visszafelé kompatibilitás és profil-interakciók támogatása érdekében.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként / szakmai felhasználóként szeretnék bejelentkezni a portálra a felhasználónevemmel/e-mail címemmel
 *   és jelszavammal.
 * - Felhasználóként elfelejtett jelszó esetén szeretnék jelszó-visszaállítást kezdeményezni.
 * - Felhasználóként látni szeretném az egyértelmű jelzést arra vonatkozóan, hogy a bejelentkezési
 *   rendszer egy tervezet (nem fejlesztési scope).
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Elfelejtett jelszó oldal: /forgot-password
 * - Irányítópult (Dashboard): /dashboard
 * - Hivatalos specifikáció: FUNCTIONAL_SPECS_WIKISPEC.md (4.5. fejezet)
 * ============================================================================
 */

export default function LoginPage() {
    const isDev = process.env.NODE_ENV === 'development';

    // Password form state (Egyszerű user/pass)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UX state
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Auth context háttérfüggvények megőrzése
    const { login, verify2FA, loginWithPasskey, sendMagicLink, pending2FA, cancel2FA } = useAuth();
    const router = useRouter();

    // Háttérfüggvények referenciáinak megőrzése (lint warning nélkül)
    void loginWithPasskey;
    void sendMagicLink;
    void pending2FA;
    void cancel2FA;

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

        if (result.success) {
            setIsLoading(false);
            router.push('/dashboard');
        } else if (result.require2FA) {
            // Prototípus környezetben automatikusan igazoljuk a demó 2FA kódot megbízható eszközként
            const verified = await verify2FA('123456', true);
            setIsLoading(false);
            if (verified) {
                router.push('/dashboard');
            } else {
                setError('Azonosítási hiba történt a belépés során.');
            }
        } else {
            setIsLoading(false);
            setError(result.error || 'Hibás e-mail cím vagy jelszó!');
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
                {/* Nem fejlesztési scope tájékoztató jelvény / figyelmeztetés */}
                <div className="bg-[#FFF8E6] border border-[#FFE082] text-[#8C5800] rounded-xl p-3 flex items-start gap-2.5 text-xs">
                    <span className="material-symbols-rounded text-lg text-[#F59E0B] shrink-0 mt-0.5">info</span>
                    <div>
                        <span className="font-bold block text-[#B45309]">Tervezet – Jelenleg nem fejlesztési scope</span>
                        <span>A bejelentkezési és hitelesítési rendszer meglévő orvosi azonosítóból / SSO-ból érkezik. A prototípus az egyszerű felhasználónév és jelszó alapú bejelentkezési felületet szemlélteti.</span>
                    </div>
                </div>

                {/* Kártya Cím */}
                <h1 className="font-bold text-[#002664] text-[22px] leading-[33px]">
                    Bejelentkezés
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

                {/* Egyszerű Jelszavas Bejelentkezés Űrlap */}
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="E-mail cím vagy felhasználónév"
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
            </div>
        </div>
    );
}

