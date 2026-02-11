'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ============================================================================
 * FUNKCIÓS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném, ha a rendszer védett lenne, így csak az illetékesek
 * láthatnák a szenzitív adatokat. Egy egyszerű bejelentkező felületen keresztül
 * szeretnék belépni az email címemmel és egy fix jelszóval.
 * 
 * FUNKCIÓK:
 * - Bejelentkezési állapot kezelése (isAuthenticated).
 * - Bejelentkezés (login) és kijelentkezés (logout).
 * - Jelszó ellenőrzése (fix: "vény123").
 * - Adatok perzisztenciája (localStorage) a munkamenet megőrzéséhez.
 * - Automatikus átirányítás a bejelentkező oldalra, ha a felhasználó nincs belépve.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A bejelentkezési állapotot az 'auth_session' kulcs alatt tároljuk a localStorage-ban.
 * - Ha a felhasználó sikeresen megadja a jelszót, az `isAuthenticated` true lesz.
 * - A logout törli a munkamenetet és a kezdőoldalra/loginra irányít.
 */

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem('auth_session');
        if (session) {
            try {
                const data = JSON.parse(session);
                setIsAuthenticated(true);
                setUserEmail(data.email);
            } catch (e) {
                console.error('Session parse error', e);
                localStorage.removeItem('auth_session');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Ennél a prototípusnál fix jelszót használunk
        if (password === 'vény123') {
            setIsAuthenticated(true);
            setUserEmail(email);
            localStorage.setItem('auth_session', JSON.stringify({ email, timestamp: Date.now() }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        localStorage.removeItem('auth_session');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
