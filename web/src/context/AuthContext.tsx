'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserService } from '@/lib/user-service';

/**
 * ============================================================================
 * FUNKCIÓS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném, ha a rendszer védett lenne, így csak az illetékesek
 * láthatnák a szenzitív adatokat. Egy egyszerű bejelentkező felületen keresztül
 * szeretnék belépni az email címemmel és jelszavammal.
 * 
 * FUNKCIÓK:
 * - Bejelentkezési állapot kezelése (isAuthenticated).
 * - Bejelentkezés (login) és kijelentkezés (logout).
 * - Felhasználói szerepkörök kezelése (UserRole).
 * - Munkamenet érvényességének ellenőrzése (sessionVersion).
 * - Adatok perzisztenciája (localStorage) a munkamenet megőrzéséhez.
 */

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const checkAuth = () => {
        const session = localStorage.getItem('auth_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                // Validate if user still exists and session version matches
                const currentUser = UserService.getUser(sessionData.id);

                if (currentUser &&
                    currentUser.status === 'active' &&
                    currentUser.sessionVersion === sessionData.sessionVersion) {
                    setUser(currentUser);
                } else {
                    // Session invalidated or user deactivated
                    logout();
                }
            } catch (e) {
                console.error('Session parse error', e);
                logout();
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const authenticatedUser = UserService.validateCredentials(email, password);

        if (authenticatedUser) {
            setUser(authenticatedUser);
            localStorage.setItem('auth_session', JSON.stringify({
                id: authenticatedUser.id,
                email: authenticatedUser.email,
                sessionVersion: authenticatedUser.sessionVersion,
                timestamp: Date.now()
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_session');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!user,
            user,
            isLoading,
            login,
            logout,
            checkAuth
        }}>
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
