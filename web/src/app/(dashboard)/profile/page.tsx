'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - FELHASZNÁLÓI PROFIL ÉS BIZTONSÁG
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A bejelentkezett szakmai felhasználó saját adatlapja, ahol kezeli alapadatait,
 * szakterületeit, preferált gyógyszertárát, hírlevél beállításait, valamint a
 * fiók biztonsági funkcióit (2FA bekapcsolása/csatornája, Passkey biometrikus kulcsok
 * hozzáadása/törlése, megbízható eszközök kezelése).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném megtekinteni és módosítani a szakterületeimet és patikámat.
 * - Felhasználóként szeretném bekapcsolni a kétfaktoros azonosítást (Email/SMS OTP).
 * - Felhasználóként szeretnék új biometrikus Passkey-t hozzáadni az eszközömhöz (TouchID/Windows Hello).
 * - Felhasználóként szeretném törölni a megbízható eszközeimet, ha elhagyom a munkaterületet.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Bejelentkezés oldal: https://bvorvosi.vercel.app/login
 * - Irányítópult: https://bvorvosi.vercel.app/dashboard
 * - Gyógyszertár kereső: https://bvorvosi.vercel.app/gyogyszertarak
 * ============================================================================
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';
import { UserService, PasskeyCredential } from '@/lib/user-service';

const PharmacyFinder = dynamic(() => import('@/components/pharmacies/PharmacyFinder').then(mod => mod.PharmacyFinder), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-base-200 animate-pulse flex items-center justify-center text-gray-400">Patika kereső betöltése...</div>
});

export default function ProfilePage() {
    const { user, logout, refreshUser } = useAuth();

    // Mock adatok a profilhoz - a valódi alkalmazásban ezek API-ból érkeznének
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Dr. Kovács István',
        email: user?.email || 'demo@example.com',
        secondaryEmail: user?.secondaryEmail || 'kovacs.istvan.private@email.hu',
        specialties: (user?.specialties as MedicalSpecialty[]) || ['Háziorvos', 'Belgyógyász']
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempSpecialties, setTempSpecialties] = useState<MedicalSpecialty[]>(profileData.specialties);
    const [specialtySearch, setSpecialtySearch] = useState('');

    // Security state
    const [newPasskeyName, setNewPasskeyName] = useState('');
    const [showPasskeyModal, setShowPasskeyModal] = useState(false);
    const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

    const { nearbyPharmacy, clearNearbyPharmacy } = useNearbyPharmacy();
    const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);

    // Hírlevél beállítások típusai és állapota
    type NewsletterConfig = {
        training: {
            subscribed: boolean;
            topics: string[]; // Akkreditált, Gyártói, Eladásösztönző
        };
        stock: {
            subscribed: boolean;
            frequency: 'Napi' | 'Heti' | 'Mavi';
            sendTime: number;
            topics: string[]; // Újra elérhető, Készlethiány, Megszűnt
            scope: 'Minden' | 'Szakterület + mentett gyógyszerek' | 'Csak szakterület' | 'Csak mentett gyógyszer';
        };
    };

    const [newsletterSettings, setNewsletterSettings] = useState<{ primary: NewsletterConfig; secondary: NewsletterConfig }>({
        primary: {
            training: { subscribed: true, topics: ['Akkreditált', 'Gyártói'] },
            stock: { subscribed: true, frequency: 'Heti', sendTime: 9, topics: ['Újra elérhető', 'Készlethiány'], scope: 'Szakterület + mentett gyógyszerek' }
        },
        secondary: {
            training: { subscribed: false, topics: [] },
            stock: { subscribed: false, frequency: 'Havi' as any, sendTime: 10, topics: [], scope: 'Csak szakterület' }
        }
    });

    const updateNewsletter = (
        emailType: 'primary' | 'secondary',
        category: 'training' | 'stock',
        field: string,
        value: any
    ) => {
        setNewsletterSettings(prev => ({
            ...prev,
            [emailType]: {
                ...prev[emailType],
                [category]: {
                    ...prev[emailType][category],
                    [field]: value
                }
            }
        }));
    };

    const toggleTrainingTopic = (emailType: 'primary' | 'secondary', topic: string) => {
        const currentTopics = newsletterSettings[emailType].training.topics;
        const newTopics = currentTopics.includes(topic)
            ? currentTopics.filter(t => t !== topic)
            : [...currentTopics, topic];
        updateNewsletter(emailType, 'training', 'topics', newTopics);
    };

    const toggleStockTopic = (emailType: 'primary' | 'secondary', topic: string) => {
        const currentTopics = newsletterSettings[emailType].stock.topics;
        const newTopics = currentTopics.includes(topic)
            ? currentTopics.filter(t => t !== topic)
            : [...currentTopics, topic];
        updateNewsletter(emailType, 'stock', 'topics', newTopics);
    };

    // 2FA & Security actions
    const handleToggle2FA = (enabled: boolean) => {
        if (!user) return;
        UserService.updateUser(user.id, { twoFactorEnabled: enabled });
        refreshUser();
        setSecuritySuccess(enabled ? 'Kétfaktoros azonosítás (2FA) bekapcsolva!' : 'Kétfaktoros azonosítás kikapcsolva.');
        setTimeout(() => setSecuritySuccess(null), 3000);
    };

    const handleChange2FAType = (type: 'email' | 'sms' | 'totp') => {
        if (!user) return;
        UserService.updateUser(user.id, { twoFactorType: type });
        refreshUser();
        setSecuritySuccess(`2FA csatorna átállítva: ${type.toUpperCase()}`);
        setTimeout(() => setSecuritySuccess(null), 3000);
    };

    const handleAddPasskey = () => {
        if (!user || !newPasskeyName.trim()) return;
        UserService.addPasskey(user.id, newPasskeyName.trim());
        setNewPasskeyName('');
        setShowPasskeyModal(false);
        refreshUser();
        setSecuritySuccess('Új Passkey sikeresen regisztrálva!');
        setTimeout(() => setSecuritySuccess(null), 3000);
    };

    const handleRemovePasskey = (passkeyId: string) => {
        if (!user) return;
        UserService.removePasskey(user.id, passkeyId);
        refreshUser();
        setSecuritySuccess('Passkey törölve.');
        setTimeout(() => setSecuritySuccess(null), 3000);
    };

    const handleClearTrustedDevices = () => {
        if (!user) return;
        UserService.updateUser(user.id, { trustedDevices: [] });
        refreshUser();
        setSecuritySuccess('Összes megbízható eszköz elfelejtve.');
        setTimeout(() => setSecuritySuccess(null), 3000);
    };

    const renderNewsletterSection = (emailType: 'primary' | 'secondary', emailAddress: string, label: string) => (
        <div key={emailType} className="space-y-6">
            <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-lg self-start">
                <span className="material-symbols-rounded text-primary text-xl">alternate_email</span>
                <span className="font-bold text-primary">{label}:</span>
                <span className="text-primary/70">{emailAddress}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BENU Képzési Program kártya */}
                <div className="card bg-base-200/50 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-lg text-primary">
                                <span className="material-symbols-rounded">school</span>
                                BENU Képzési Program
                            </h3>
                            <div className="form-control">
                                <label className="label cursor-pointer p-0 gap-2">
                                    <span className="label-text font-medium">{newsletterSettings[emailType].training.subscribed ? 'Feliratkozva' : 'Leiratkozva'}</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary toggle-sm"
                                        checked={newsletterSettings[emailType].training.subscribed}
                                        onChange={(e) => updateNewsletter(emailType, 'training', 'subscribed', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        {newsletterSettings[emailType].training.subscribed && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-base-content/60">Értesítést kérek az új képzésekről a megjelölt témakörökben.</p>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs uppercase tracking-wider">Érdekelt képzési témakörök</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {['Akkreditált', 'Gyártói', 'Eladásösztönző'].map(topic => (
                                            <button
                                                key={topic}
                                                onClick={() => toggleTrainingTopic(emailType, topic)}
                                                className={`btn btn-sm rounded-xl px-4 normal-case font-bold transition-all ${newsletterSettings[emailType].training.topics.includes(topic)
                                                    ? 'btn-primary shadow-md'
                                                    : 'btn-outline border-base-300 hover:bg-base-300 hover:border-transparent'
                                                    }`}
                                            >
                                                {topic}
                                                {newsletterSettings[emailType].training.topics.includes(topic) && (
                                                    <span className="material-symbols-rounded text-sm ml-2">check_circle</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Készletinfó kártya */}
                <div className="card bg-base-200/50 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-lg text-primary">
                                <span className="material-symbols-rounded">inventory_2</span>
                                Készletinfó
                            </h3>
                            <div className="form-control">
                                <label className="label cursor-pointer p-0 gap-2">
                                    <span className="label-text font-medium">{newsletterSettings[emailType].stock.subscribed ? 'Feliratkozva' : 'Leiratkozva'}</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary toggle-sm"
                                        checked={newsletterSettings[emailType].stock.subscribed}
                                        onChange={(e) => updateNewsletter(emailType, 'stock', 'subscribed', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        {newsletterSettings[emailType].stock.subscribed && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-bold">Rendszeresség</span>
                                        </label>
                                        <select
                                            className="select select-bordered select-sm w-full"
                                            value={newsletterSettings[emailType].stock.frequency}
                                            onChange={(e) => updateNewsletter(emailType, 'stock', 'frequency', e.target.value)}
                                        >
                                            <option>Napi</option>
                                            <option>Heti</option>
                                            <option>Havi</option>
                                        </select>
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-bold">Kiküldés ideje</span>
                                        </label>
                                        <div className="join">
                                            <input
                                                type="number"
                                                min="0"
                                                max="23"
                                                className="input input-bordered input-sm w-full join-item"
                                                value={newsletterSettings[emailType].stock.sendTime}
                                                onChange={(e) => updateNewsletter(emailType, 'stock', 'sendTime', parseInt(e.target.value))}
                                            />
                                            <span className="btn btn-sm join-item pointer-events-none">óra</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Téma (multiselect)</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Újra elérhető', 'Készlethiány', 'Megszűnt'].map(topic => (
                                            <button
                                                key={topic}
                                                onClick={() => toggleStockTopic(emailType, topic)}
                                                className={`btn btn-xs rounded-full px-3 ${newsletterSettings[emailType].stock.topics.includes(topic) ? 'btn-primary' : 'btn-outline border-base-300'}`}
                                            >
                                                {topic}
                                                {newsletterSettings[emailType].stock.topics.includes(topic) && <span className="material-symbols-rounded text-xs ml-1">check</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Téma kör</span>
                                    </label>
                                    <select
                                        className="select select-bordered select-sm w-full"
                                        value={newsletterSettings[emailType].stock.scope}
                                        onChange={(e) => updateNewsletter(emailType, 'stock', 'scope', e.target.value)}
                                    >
                                        <option>Minden</option>
                                        <option>Szakterület + mentett gyógyszerek</option>
                                        <option>Csak szakterület</option>
                                        <option>Csak mentett gyógyszer</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleSave = () => {
        setProfileData({ ...profileData, specialties: tempSpecialties });
        setIsEditing(false);
    };

    const toggleSpecialty = (spec: MedicalSpecialty) => {
        if (tempSpecialties.includes(spec)) {
            setTempSpecialties(tempSpecialties.filter(s => s !== spec));
        } else {
            setTempSpecialties([...tempSpecialties, spec]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <span className="material-symbols-rounded text-4xl text-primary">account_circle</span>
                    Felhasználói profil
                </h1>
                <p className="text-base-content/60 mt-2">Kezelje személyes adatait és szakmai beállításait.</p>
            </header>

            {securitySuccess && (
                <div className="alert alert-success text-sm mb-6 shadow text-success-content">
                    <span className="material-symbols-rounded">check_circle</span>
                    <span>{securitySuccess}</span>
                </div>
            )}

            <div className="grid gap-8">
                {/* Alapadatok Szekció */}
                <section className="card bg-base-100 shadow-xl border border-base-200 overflow-visible">
                    <div className="card-body">
                        <h2 className="card-title mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">person</span>
                            Alapadatok
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control w-full flex flex-col">
                                <label className="label pb-1">
                                    <span className="label-text font-bold">Név</span>
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                    readOnly
                                />
                                <label className="label pt-1">
                                    <span className="label-text-alt text-base-content/50 italic">Szerkesztéséhez keresse az adminisztrációt.</span>
                                </label>
                            </div>

                            <div className="form-control w-full flex flex-col">
                                <label className="label pb-1">
                                    <span className="label-text font-bold">E-mail cím</span>
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                    readOnly
                                />
                                <label className="label pt-1">
                                    <span className="label-text-alt text-base-content/50 italic">Az elsődleges bejelentkezési azonosító nem módosítható.</span>
                                </label>
                            </div>

                            <div className="form-control w-full flex flex-col">
                                <label className="label pb-1">
                                    <span className="label-text font-bold">Másodlagos e-mail cím</span>
                                </label>
                                <input
                                    type="email"
                                    value={profileData.secondaryEmail}
                                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                    readOnly
                                />
                                <label className="label pt-1">
                                    <span className="label-text-alt text-base-content/50 italic">Biztonsági mentés vagy értesítések céljára.</span>
                                </label>
                            </div>

                            <div className="form-control w-full overflow-visible flex flex-col">
                                <label className="label pb-1">
                                    <span className="label-text font-bold">Szakterület(ek)</span>
                                </label>
                                <div className="relative w-full">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <span className="material-symbols-rounded text-base-content/40">search</span>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="Keressen a szakterületek között..."
                                                        value={specialtySearch}
                                                        onChange={(e) => setSpecialtySearch(e.target.value)}
                                                        className="input input-bordered w-full pl-10"
                                                    />
                                                </div>
                                                <button onClick={handleSave} className="btn btn-primary" title="Mentés">
                                                    <span className="material-symbols-rounded">save</span>
                                                    Mentés
                                                </button>
                                            </div>

                                            <div className="max-h-48 overflow-y-auto p-2 border rounded-lg bg-base-200/30 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                {[...MEDICAL_SPECIALTIES]
                                                    .sort((a, b) => a.localeCompare(b, 'hu'))
                                                    .filter(s => s.toLowerCase().includes(specialtySearch.toLowerCase()))
                                                    .map(spec => (
                                                        <label key={spec} className="label cursor-pointer justify-start gap-3 hover:bg-base-200 px-3 rounded-md transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={tempSpecialties.includes(spec)}
                                                                onChange={() => toggleSpecialty(spec)}
                                                                className="checkbox checkbox-primary checkbox-sm"
                                                            />
                                                            <span className="label-text text-sm">{spec}</span>
                                                        </label>
                                                    ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-base-100 min-h-[3rem]">
                                            {profileData.specialties.length > 0 ? (
                                                profileData.specialties.map(spec => (
                                                    <span key={spec} className="badge badge-primary badge-outline gap-1">
                                                        {spec}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-base-content/40 italic">Nincs megadva szakterület</span>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setTempSpecialties(profileData.specialties);
                                                    setIsEditing(true);
                                                }}
                                                className="btn btn-ghost btn-xs btn-circle ml-auto"
                                                title="Szerkesztés"
                                            >
                                                <span className="material-symbols-rounded text-sm">edit</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Közeli Patika Szekció */}
                <section className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title flex items-center gap-2">
                                <span className="material-symbols-rounded text-primary">home_pin</span>
                                Közeli Patikám
                            </h2>
                            <button
                                onClick={() => setIsPharmacyModalOpen(true)}
                                className="btn btn-primary btn-sm gap-2"
                            >
                                <span className="material-symbols-rounded text-sm">edit_location_alt</span>
                                {nearbyPharmacy ? 'Módosítás' : 'Beállítás'}
                            </button>
                        </div>

                        {nearbyPharmacy ? (
                            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-primary/5 rounded-2xl gap-4 border border-primary/10">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                        <span className="material-symbols-rounded text-3xl">local_pharmacy</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{nearbyPharmacy.nev}</h3>
                                        <p className="text-sm opacity-70 flex items-center gap-1">
                                            <span className="material-symbols-rounded text-xs">location_on</span>
                                            {nearbyPharmacy.irsz} {nearbyPharmacy.telepules}, {nearbyPharmacy.cim}
                                        </p>
                                        <p className="text-sm opacity-70 flex items-center gap-1 mt-1">
                                            <span className="material-symbols-rounded text-xs">call</span>
                                            {nearbyPharmacy.telefon}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => clearNearbyPharmacy()}
                                        className="btn btn-ghost btn-sm text-error hover:bg-error/10 w-full md:w-auto"
                                        title="Kijelölés eltávolítása"
                                    >
                                        <span className="material-symbols-rounded text-sm">delete</span>
                                        Törlés
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-base-200/30 rounded-2xl border border-dashed border-base-300 text-center">
                                <div className="bg-base-200 p-4 rounded-full mb-4 text-base-content/30">
                                    <span className="material-symbols-rounded text-4xl">add_location</span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">Nincs beállítva közeli patika</h3>
                                <p className="text-sm opacity-60 max-w-sm">
                                    Jelölje meg az Ön számára legfontosabb patikát, hogy a készletinformációkat azonnal láthassa!
                                </p>
                                <button
                                    onClick={() => setIsPharmacyModalOpen(true)}
                                    className="btn btn-primary mt-4 gap-2"
                                >
                                    <span className="material-symbols-rounded">location_searching</span>
                                    Patika keresése
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Hírlevél Beállítások Szekció */}
                <section className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title mb-6 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">mail</span>
                            Hírlevél beállítások
                        </h2>

                        <div className="space-y-12">
                            {renderNewsletterSection('primary', profileData.email, 'Elsődleges e-mail cím')}

                            <div className="divider opacity-50"></div>

                            {renderNewsletterSection('secondary', profileData.secondaryEmail, 'Másodlagos e-mail cím')}
                        </div>
                    </div>
                </section>

                {/* BIZTONSÁG ÉS KÉTFAKTOROS HITELESÍTÉS (2FA / PASSKEY) SZEKCIÓ */}
                <section className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title mb-6 flex items-center gap-2 text-primary">
                            <span className="material-symbols-rounded text-primary text-3xl">shield_lock</span>
                            Biztonság és Azonosítás
                        </h2>

                        <div className="space-y-6">
                            {/* 2FA Toggle & Settings */}
                            <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-base flex items-center gap-2">
                                            <span className="material-symbols-rounded text-primary">verified_user</span>
                                            Kétfaktoros Azonosítás (2FA)
                                        </h3>
                                        <p className="text-xs text-base-content/70 mt-0.5">
                                            Magasabb szintű védelem 6-jegyű egyszeri kóddal a jelszavas belépés után.
                                        </p>
                                    </div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer gap-3 p-0">
                                            <span className="label-text font-semibold text-xs">
                                                {user?.twoFactorEnabled ? 'Aktív' : 'Kikapcsolva'}
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={!!user?.twoFactorEnabled}
                                                onChange={(e) => handleToggle2FA(e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {user?.twoFactorEnabled && (
                                    <div className="pt-3 border-t border-base-300 space-y-4">
                                        <div className="form-control">
                                            <label className="label py-1">
                                                <span className="label-text font-semibold text-xs">2FA Csatorna választás</span>
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                <label className="flex items-center gap-2 cursor-pointer bg-base-100 px-3 py-2 rounded-lg border border-base-300 text-xs font-medium">
                                                    <input
                                                        type="radio"
                                                        name="2fa-type"
                                                        className="radio radio-primary radio-xs"
                                                        checked={user?.twoFactorType === 'email'}
                                                        onChange={() => handleChange2FAType('email')}
                                                    />
                                                    <span>E-mail OTP (alapértelmezett)</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer bg-base-100 px-3 py-2 rounded-lg border border-base-300 text-xs font-medium">
                                                    <input
                                                        type="radio"
                                                        name="2fa-type"
                                                        className="radio radio-primary radio-xs"
                                                        checked={user?.twoFactorType === 'sms'}
                                                        onChange={() => handleChange2FAType('sms')}
                                                    />
                                                    <span>SMS OTP ({user?.phoneNumber || '+36...'})</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer bg-base-100 px-3 py-2 rounded-lg border border-base-300 text-xs font-medium">
                                                    <input
                                                        type="radio"
                                                        name="2fa-type"
                                                        className="radio radio-primary radio-xs"
                                                        checked={user?.twoFactorType === 'totp'}
                                                        onChange={() => handleChange2FAType('totp')}
                                                    />
                                                    <span>Hitelesítő App (TOTP)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Passkeys Management */}
                            <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <h3 className="font-bold text-base flex items-center gap-2">
                                            <span className="material-symbols-rounded text-primary">fingerprint</span>
                                            Passkey Kulcsok (Biometria)
                                        </h3>
                                        <p className="text-xs text-base-content/70 mt-0.5">
                                            Touch ID, Face ID vagy Windows Hello azonosítás regisztrált eszközein.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasskeyModal(true)}
                                        className="btn btn-primary btn-sm text-xs gap-1"
                                    >
                                        <span className="material-symbols-rounded text-base">add_fingerprint</span>
                                        Új Passkey
                                    </button>
                                </div>

                                {user?.passkeys && user.passkeys.length > 0 ? (
                                    <div className="space-y-2 mt-3">
                                        {user.passkeys.map((pk: PasskeyCredential) => (
                                            <div key={pk.id} className="flex justify-between items-center bg-base-100 p-3 rounded-xl border border-base-300 text-xs">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-rounded text-primary text-xl">devices</span>
                                                    <div>
                                                        <span className="font-bold text-base-content block">{pk.name}</span>
                                                        <span className="text-[11px] text-base-content/60">Hozzáadva: {pk.createdAt}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemovePasskey(pk.id)}
                                                    className="btn btn-ghost btn-xs text-error"
                                                    title="Passkey törlése"
                                                >
                                                    <span className="material-symbols-rounded text-base">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-base-content/50 italic mt-2">
                                        Még nincs regisztrált Passkey ehhez a fiókhoz.
                                    </p>
                                )}
                            </div>

                            {/* Trusted Devices Management */}
                            <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-base flex items-center gap-2">
                                            <span className="material-symbols-rounded text-primary">laptop_mac</span>
                                            Megbízható Eszközök (30 nap)
                                        </h3>
                                        <p className="text-xs text-base-content/70 mt-0.5">
                                            Aktív megbízható munkamenetek száma: <span className="font-bold text-primary">{user?.trustedDevices?.length || 0}</span>
                                        </p>
                                    </div>
                                    {(user?.trustedDevices?.length || 0) > 0 && (
                                        <button
                                            onClick={handleClearTrustedDevices}
                                            className="btn btn-outline btn-error btn-xs text-xs"
                                        >
                                            Eszközök elfelejtése
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Kijelentkezés Szekció */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={logout}
                        className="btn btn-error btn-outline shadow-md gap-2"
                    >
                        <span className="material-symbols-rounded">logout</span>
                        Kijelentkezés a rendszerből
                    </button>
                </div>
            </div>

            {/* Új Passkey Regisztrációs Modal */}
            {showPasskeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-base-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-base-300">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-primary mb-2">
                            <span className="material-symbols-rounded">fingerprint</span>
                            Új Passkey Regisztrálása
                        </h3>
                        <p className="text-xs text-base-content/70 mb-4">
                            Adjon nevet az eszköznek (pl. MacBook Pro TouchID vagy Rendelői PC Windows Hello).
                        </p>

                        <div className="form-control mb-4">
                            <input
                                type="text"
                                placeholder="Eszköz neve..."
                                className="input input-bordered input-sm focus:input-primary text-xs"
                                value={newPasskeyName}
                                onChange={(e) => setNewPasskeyName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowPasskeyModal(false)}
                                className="btn btn-ghost btn-sm text-xs"
                            >
                                Mégse
                            </button>
                            <button
                                type="button"
                                onClick={handleAddPasskey}
                                className="btn btn-primary btn-sm text-xs"
                                disabled={!newPasskeyName.trim()}
                            >
                                Kulcs Hozzáadása
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patika Választó Modal */}
            {isPharmacyModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-base-100 rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden relative border border-base-300 flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100 flex-none">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                                <span className="material-symbols-rounded">add_location_alt</span>
                                Közeli patika kiválasztása
                            </h3>
                            <button
                                onClick={() => setIsPharmacyModalOpen(false)}
                                className="btn btn-circle btn-ghost btn-sm"
                            >
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            <PharmacyFinder
                                title="Válassza ki közeli patikáját"
                                description="Kattintson a ház ikonra a patika kártyáján a beállításhoz."
                                initialSelectedId={nearbyPharmacy?.id}
                                onClose={() => setIsPharmacyModalOpen(false)}
                            />
                        </div>

                        {/* Footer Notification */}
                        <div className="p-3 bg-primary/5 text-xs text-center font-medium text-primary border-t border-primary/10">
                            A kiválasztott patikát a rendszer automatikusan menti. A bezáráshoz kattintson a jobb felső sarokban lévő gombra.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

