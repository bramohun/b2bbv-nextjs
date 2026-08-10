'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserService } from '@/lib/user-service';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - HITELESÍTÉSI KONTEXTUS ÉS MUNKAMENET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A portál központi auth állapotkezelője, amely kezeli a bejelentkezett felhasználót,
 * a több-lépcsős 2FA (Email, SMS, TOTP) igazolási állapotot, a Passkey alapú 1-kattintásos
 * azonosítást, a jelszó nélküli Magic Link/Code belépést, és a megbízható eszközök kezelését.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Szakmai felhasználóként szeretnék gyorsan és biztonságosan bejelentkezni Passkey-vel (TouchID / FaceID / Windows Hello).
 * - Felhasználóként szeretném, ha a jelszavas belépést 2FA (e-mail vagy SMS OTP) védené az illetéktelenek ellen.
 * - Felhasználóként szeretném megjegyezni a saját megbízható eszközömet 30 napra, hogy ne kelljen minden nap 2FA kódot beírnom.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Bejelentkezési oldal: https://bvorvosi.vercel.app/login
 * - Felhasználói Profil oldal: https://bvorvosi.vercel.app/profile
 * - Irányítópult (Dashboard): https://bvorvosi.vercel.app/dashboard
 * ============================================================================
 */

export interface Pending2FAState {
    user: User;
    email: string;
    type: 'email' | 'sms' | 'totp';
    isMagicLink?: boolean;
}

export interface LoginResult {
    success: boolean;
    require2FA?: boolean;
    type?: 'email' | 'sms' | 'totp';
    error?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    pending2FA: Pending2FAState | null;
    login: (email: string, password: string, deviceId?: string) => Promise<LoginResult>;
    verify2FA: (code: string, rememberDevice?: boolean, deviceId?: string) => Promise<boolean>;
    loginWithPasskey: (email?: string) => Promise<boolean>;
    sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
    cancel2FA: () => void;
    logout: () => void;
    checkAuth: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [pending2FA, setPending2FA] = useState<Pending2FAState | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const checkAuth = () => {
        const session = localStorage.getItem('auth_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const currentUser = UserService.getUser(sessionData.id);

                if (currentUser &&
                    currentUser.status === 'active' &&
                    currentUser.sessionVersion === sessionData.sessionVersion) {
                    setUser(currentUser);
                } else {
                    logout();
                }
            } catch (e) {
                console.error('Session parse error', e);
                logout();
            }
        }
        setIsLoading(false);
    };

    const refreshUser = () => {
        if (user) {
            const updated = UserService.getUser(user.id);
            if (updated) setUser(updated);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const finalizeLogin = (authenticatedUser: User) => {
        setUser(authenticatedUser);
        UserService.updateUser(authenticatedUser.id, { lastLogin: new Date().toISOString() });
        localStorage.setItem('auth_session', JSON.stringify({
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            sessionVersion: authenticatedUser.sessionVersion,
            timestamp: Date.now()
        }));
        setPending2FA(null);
    };

    const login = async (email: string, password: string, deviceId: string = 'device-demo-1'): Promise<LoginResult> => {
        const authenticatedUser = UserService.validateCredentials(email, password);

        if (!authenticatedUser) {
            return { success: false, error: 'Érvénytelen e-mail cím vagy jelszó.' };
        }

        // Check if 2FA is enabled AND device is NOT trusted
        const isTrusted = UserService.isTrustedDevice(authenticatedUser.id, deviceId);

        if (authenticatedUser.twoFactorEnabled && !isTrusted) {
            const type = authenticatedUser.twoFactorType || 'email';
            setPending2FA({
                user: authenticatedUser,
                email: authenticatedUser.email,
                type
            });
            return { success: false, require2FA: true, type };
        }

        // Direct login
        finalizeLogin(authenticatedUser);
        return { success: true };
    };

    const verify2FA = async (code: string, rememberDevice: boolean = false, deviceId: string = 'device-demo-1'): Promise<boolean> => {
        if (!pending2FA) return false;

        const isValid = UserService.verifyOtpCode(pending2FA.user.id, code);
        if (isValid) {
            let currentUser = pending2FA.user;
            if (rememberDevice) {
                currentUser = UserService.addTrustedDevice(currentUser.id, deviceId);
            }
            finalizeLogin(currentUser);
            return true;
        }
        return false;
    };

    const loginWithPasskey = async (email?: string): Promise<boolean> => {
        // Find user by email or pick default active user with passkeys
        let targetUser: User | undefined;
        if (email) {
            targetUser = UserService.getUserByEmail(email);
        } else {
            const users = UserService.getUsers();
            targetUser = users.find(u => u.status === 'active' && u.passkeys && u.passkeys.length > 0) || users[0];
        }

        if (!targetUser || targetUser.status !== 'active') return false;

        // Biometric Passkey simulation delay
        await new Promise(res => setTimeout(res, 800));

        finalizeLogin(targetUser);
        return true;
    };

    const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
        const targetUser = UserService.getUserByEmail(email);
        if (!targetUser || targetUser.status !== 'active') {
            return { success: false, error: 'A megadott e-mail címmel nem található aktív fiók.' };
        }

        setPending2FA({
            user: targetUser,
            email: targetUser.email,
            type: 'email',
            isMagicLink: true
        });

        return { success: true };
    };

    const cancel2FA = () => {
        setPending2FA(null);
    };

    const logout = () => {
        setUser(null);
        setPending2FA(null);
        localStorage.removeItem('auth_session');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!user,
            user,
            isLoading,
            pending2FA,
            login,
            verify2FA,
            loginWithPasskey,
            sendMagicLink,
            cancel2FA,
            logout,
            checkAuth,
            refreshUser
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

