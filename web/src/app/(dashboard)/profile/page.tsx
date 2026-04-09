'use client';

/**
 * ============================================================================
 * FUNKCIÓS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretném megtekinteni és kezelni a saját profiladataimat,
 * hogy naprakészen tarthassam az adataimat, valamint biztonsági és kényelmi
 * funkciókat érhessek el (jelszókezelés, kijelentkezés).
 * 
 * FUNKCIÓK:
 * - Alapadatok megjelenítése (Név, E-mail, Másodlagos e-mail).
 * - Szakterületek módosítása (több is választható egy fix listából).
 * - Jelszó módosítási szekció.
 * - Hírlevél beállítások kezelése (Közösség/Fórum és Készletinfó témakörökben).
 * - Kijelentkezés gomb.
 * 
 * ÜZLETI LOGIKA:
 * - A név és az email címek a prototípus szintjén nem módosíthatók.
 * - A szakterületek a fórummal konzekvens `MEDICAL_SPECIALTIES` listából választhatók.
 * - A hírlevél beállítások külön-külön kezelhetők az elsődleges és a másodlagos e-mail címre.
 * - Ha egy kategóriában a felhasználó leiratkozik, a részletes beállítások elrejtésre kerülnek.
 * - A kijelentkezés az AuthContext-et használva törli a munkamenetet.
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useNearbyPharmacy } from '@/context/NearbyPharmacyContext';
import { MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';

const PharmacyFinder = dynamic(() => import('@/components/pharmacies/PharmacyFinder').then(mod => mod.PharmacyFinder), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-base-200 animate-pulse flex items-center justify-center text-gray-400">Patika kereső betöltése...</div>
});

export default function ProfilePage() {
    const { user, logout } = useAuth();

    // Mock adatok a profilhoz - a valódi alkalmazásban ezek API-ból érkeznének
    const [profileData, setProfileData] = useState({
        name: 'Dr. Kovács István',
        email: user?.email || 'dr.kovacs@u-nebuah.hu',
        secondaryEmail: 'kovacs.istvan.private@email.hu',
        specialties: ['Háziorvos', 'Belgyógyász'] as MedicalSpecialty[]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempSpecialties, setTempSpecialties] = useState<MedicalSpecialty[]>(profileData.specialties);
    const [specialtySearch, setSpecialtySearch] = useState('');

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
                                                className={`btn btn-sm rounded-xl px-4 normal-case font-bold transition-all ${
                                                    newsletterSettings[emailType].training.topics.includes(topic) 
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

                {/* Biztonsági Szekció */}
                <section className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title mb-4 flex items-center gap-2 text-warning">
                            <span className="material-symbols-rounded">security</span>
                            Biztonság
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-base-200/50 rounded-lg gap-4 border border-warning/20">
                            <div className="flex gap-4 items-center">
                                <div className="bg-warning/10 p-3 rounded-full">
                                    <span className="material-symbols-rounded text-warning">vpn_key</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Jelszó módosítás</h3>
                                    <p className="text-sm opacity-70">A fiókja biztonsága érdekében javasoljuk a jelszó rendszeres megváltoztatását.</p>
                                </div>
                            </div>
                            <button className="btn btn-warning w-full md:w-auto shadow-sm">
                                <span className="material-symbols-rounded">key</span>
                                Jelszó kezelése
                            </button>
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
