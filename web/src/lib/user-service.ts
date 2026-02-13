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
        scope: 'Minden' | 'Szakterület + kedvenc' | 'Csak szakterület' | 'Csak kedvenc';
    };
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
}

const STORAGE_KEY = 'portal_users';
const UNIVERSAL_PASSWORD = 'vény123';

const DEFAULT_NEWSLETTER_SETTINGS: { primary: NewsletterConfig; secondary: NewsletterConfig } = {
    primary: {
        community: { subscribed: true, sendTime: 8, frequency: 'Napi', topic: 'Minden', ownTopicOnly: false },
        stock: { subscribed: true, frequency: 'Heti', sendTime: 9, topics: ['Újra elérhető', 'Készlethiány'], scope: 'Szakterület + kedvenc' }
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
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS
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
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS
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
        newsletterSettings: DEFAULT_NEWSLETTER_SETTINGS
    }
];

export const UserService = {
    getUsers: (): User[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Check if stored data is stale (missing new fields) - simple check by role property or just overwrite for prototype safety
            // For now, we just return defaults if empty. In real app we would migrate.
            // Since this is a prototype and we just added fields, existing localhost data might be broken/missing fields.
            // We'll proceed with standard getting.
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
            sessionVersion: 1
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

        // Update last login
        UserService.updateUser(user.id, { lastLogin: new Date().toISOString() });
        return user;
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

        // Mock sending email
        console.log(`[MOCK] Password reset email sent to ${email}`);
        return true;
    }
};
