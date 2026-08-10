/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FELHASZNÁLÓKEZELÉS (MOCK)
 * ============================================================================
 * 
 * CÉL:
 * Központi szolgáltatás a felhasználói adatok kezeléséhez localStorage-alapon.
 * 
 * FUNKCIÓK:
 * - Felhasználók lekérése, létrehozása, szerkesztése.
 * - Bejelentkezés ellenőrzése (fix demo jelszóval: "vény123").
 * - Munkamenet érvénytelenítése (sessionVersion növelésével).
 * - Kezdeti adatok generálása (Seeding).
 */

import { MedicalSpecialty } from '@/types/forum';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface NewsletterConfig {
    community: {
        subscribed: boolean;
        sendTime: number;
        frequency: 'Napi' | 'Heti' | 'Mavi';
        topic: 'Minden' | 'Csak szakterület';
        ownTopicOnly: boolean;
    };
    stock: {
        subscribed: boolean;
        frequency: 'Napi' | 'Heti' | 'Mavi';
        sendTime: number;
        topics: string[];
        scope: 'Minden' | 'Szakterület + mentett gyógyszerek' | 'Csak szakterület' | 'Csak mentett gyógyszer';
    };
}

export interface PasskeyCredential {
    id: string;
    name: string;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    sessionVersion: number;
    lastLogin?: string;

    // Profile Fields
    secondaryEmail?: string;
    specialties?: MedicalSpecialty[];
    newsletterSettings?: {
        primary: NewsletterConfig;
        secondary: NewsletterConfig;
    };

    // 2FA and Security Fields
    twoFactorEnabled?: boolean;
    twoFactorType?: 'email' | 'sms' | 'totp';
    phoneNumber?: string;
    passkeys?: PasskeyCredential[];
    trustedDevices?: string[];
}

const STORAGE_KEY = 'portal_users';
const UNIVERSAL_PASSWORD = 'vény123';
const DEMO_OTP_CODE = '123456';

const DEFAULT_NEWSLETTER_SETTINGS: { primary: NewsletterConfig; secondary: NewsletterConfig } = {
    primary: {
        community: { subscribed: true, sendTime: 8, frequency: 'Napi', topic: 'Minden', ownTopicOnly: false },
        stock: { subscribed: true, frequency: 'Heti', sendTime: 9, topics: ['Újra elérhető', 'Készlethiány'], scope: 'Szakterület + mentett gyógyszerek' }
    },
    secondary: {
        community: { subscribed: false, sendTime: 8, frequency: 'Heti', topic: 'Csak szakterület', ownTopicOnly: true },
        stock: { subscribed: false, frequency: 'Havi' as any, sendTime: 10, topics: [], scope: 'Csak szakterület' }
    }
};

const DEFAULT_USERS: User[] = [
    {
        id: 'admin-1',
        name: 'Adminisztrátor',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        sessionVersion: 1,
        secondaryEmail: 'admin.backup@example.com',
        specialties: [],
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS,
        twoFactorEnabled: true,
        twoFactorType: 'email',
        phoneNumber: '+36301234567',
        passkeys: [
            { id: 'pk-1', name: 'Work Mac TouchID', createdAt: '2026-01-15' }
        ],
        trustedDevices: ['device-demo-1']
    },
    {
        id: 'user-1',
        name: 'Dr. Kovács István',
        email: 'demo@example.com',
        role: 'user',
        status: 'active',
        sessionVersion: 1,
        secondaryEmail: 'kovacs.istvan.private@email.hu',
        specialties: ['Háziorvos', 'Belgyógyász'],
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS,
        twoFactorEnabled: true,
        twoFactorType: 'email',
        phoneNumber: '+36209876543',
        passkeys: [],
        trustedDevices: []
    },
    {
        id: 'user-2',
        name: 'Dr. Teszt Szabolcs',
        email: 'teszt@example.com',
        role: 'user',
        status: 'inactive',
        sessionVersion: 1,
        secondaryEmail: '',
        specialties: ['Kardiológus'],
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS,
        twoFactorEnabled: false,
        twoFactorType: 'email',
        passkeys: [],
        trustedDevices: []
    }
];

export const UserService = {
    getUsers: (): User[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
            return DEFAULT_USERS;
        }
        return JSON.parse(stored);
    },

    getUser: (id: string): User | undefined => {
        return UserService.getUsers().find(u => u.id === id);
    },

    getUserByEmail: (email: string): User | undefined => {
        return UserService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    createUser: (userData: Omit<User, 'id' | 'sessionVersion'>): User => {
        const users = UserService.getUsers();
        const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            sessionVersion: 1,
            twoFactorEnabled: userData.twoFactorEnabled ?? false,
            twoFactorType: userData.twoFactorType ?? 'email',
            passkeys: userData.passkeys ?? [],
            trustedDevices: userData.trustedDevices ?? []
        };
        const updatedUsers = [...users, newUser];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
        return newUser;
    },

    updateUser: (id: string, data: Partial<Omit<User, 'id'>>): User => {
        const users = UserService.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');

        const updatedUser = { ...users[index], ...data };
        users[index] = updatedUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        return updatedUser;
    },

    validateCredentials: (email: string, password: string): User | null => {
        if (password !== UNIVERSAL_PASSWORD) return null;

        const user = UserService.getUserByEmail(email);
        if (!user || user.status !== 'active') return null;

        return user;
    },

    verifyOtpCode: (userId: string, code: string): boolean => {
        // Demóban 123456 a helyes kód
        return code.trim() === DEMO_OTP_CODE;
    },

    addPasskey: (userId: string, name: string): User => {
        const user = UserService.getUser(userId);
        if (!user) throw new Error('User not found');
        const passkeys = user.passkeys || [];
        const newPasskey: PasskeyCredential = {
            id: `pk-${Date.now()}`,
            name: name || 'Biometrikus kulcs',
            createdAt: new Date().toISOString().split('T')[0]
        };
        return UserService.updateUser(userId, { passkeys: [...passkeys, newPasskey] });
    },

    removePasskey: (userId: string, passkeyId: string): User => {
        const user = UserService.getUser(userId);
        if (!user) throw new Error('User not found');
        const passkeys = (user.passkeys || []).filter(p => p.id !== passkeyId);
        return UserService.updateUser(userId, { passkeys });
    },

    addTrustedDevice: (userId: string, deviceId: string): User => {
        const user = UserService.getUser(userId);
        if (!user) throw new Error('User not found');
        const trusted = user.trustedDevices || [];
        if (!trusted.includes(deviceId)) {
            return UserService.updateUser(userId, { trustedDevices: [...trusted, deviceId] });
        }
        return user;
    },

    isTrustedDevice: (userId: string, deviceId: string): boolean => {
        const user = UserService.getUser(userId);
        if (!user) return false;
        return (user.trustedDevices || []).includes(deviceId);
    },

    revokeSessions: (id: string): void => {
        const user = UserService.getUser(id);
        if (user) {
            UserService.updateUser(id, { sessionVersion: user.sessionVersion + 1 });
        }
    },

    resetPassword: async (email: string): Promise<boolean> => {
        const user = UserService.getUserByEmail(email);
        if (!user) return false;

        console.log(`[MOCK] Password reset email sent to ${email}`);
        return true;
    }
};

