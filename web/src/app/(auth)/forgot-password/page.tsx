'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * ============================================================================
 * FUNKCIÓS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként, ha elfelejtem a jelszavamat, szeretnék lehetőséget kapni a belépésre
 * egy egyszer használatos kód vagy mágikus link segítségével.
 * 
 * FUNKCIÓK:
 * - Email cím megadása.
 * - Mágikus link/kód küldésének szimulációja.
 * - Visszajelzés a felhasználónak a szimulált kiküldésről.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Mivel ez egy prototípus, valódi emailt nem küldünk.
 * - Gombnyomásra generálunk egy kódot (fix vagy véletlenszerű prototípus célra).
 * - Megjelenítjük a kódot a felületen, mintha az emailben érkezett volna meg.
 * - Visszalépési lehetőség a bejelentkezéshez.
 */

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [magicCode, setMagicCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Szimulált késleltetés és kód generálás
        setTimeout(() => {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setMagicCode(code);
            setIsSubmitted(true);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <span className="material-symbols-rounded text-4xl text-primary">
                                {isSubmitted ? 'mark_email_read' : 'lock_reset'}
                            </span>
                        </div>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <h2 className="text-2xl font-bold text-center text-primary mb-2">Elfelejtett jelszó</h2>
                            <p className="text-sm text-center text-base-content/60 mb-6">
                                Adja meg email címét, és küldünk egy belépési kódot.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Küldés...' : 'Belépési kód küldése'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-primary mb-2">Kód elküldve!</h2>
                            <p className="text-sm text-base-content/60 mb-6">
                                Prototípus mód: Mivel nem küldünk valódi emailt, itt láthatja a belépési kódot:
                            </p>

                            <div className="bg-base-200 py-4 px-6 rounded-lg mb-6 border-2 border-dashed border-primary/50">
                                <span className="text-3xl font-mono font-bold tracking-widest text-primary">
                                    {magicCode}
                                </span>
                            </div>

                            <div className="alert alert-info py-2 text-sm text-left mb-6">
                                <span className="material-symbols-rounded text-xl">info</span>
                                <span>A prototípusban ezzel a kóddal most nem tud továbblépni, kérjük használja a fix jelszót a belépéshez.</span>
                            </div>

                            <Link href="/login" className="btn btn-outline btn-primary w-full">
                                Vissza a bejelentkezéshez
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        {!isSubmitted && (
                            <Link href="/login" className="text-sm link link-hover text-base-content/60">
                                Mégis emlékszem a jelszavamra
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
