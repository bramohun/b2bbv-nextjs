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
 * - Kijelentkezés gomb.
 * 
 * ÜZLETI LOGIKA:
 * - A név és az email címek a prototípus szintjén nem módosíthatók.
 * - A szakterületek a fórummal konzekvens `MEDICAL_SPECIALTIES` listából választhatók.
 * - A kijelentkezés az AuthContext-et használva törli a munkamenetet.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';

export default function ProfilePage() {
    const { userEmail, logout } = useAuth();

    // Mock adatok a profilhoz - a valódi alkalmazásban ezek API-ból érkeznének
    const [profileData, setProfileData] = useState({
        name: 'Dr. Kovács István',
        email: userEmail || 'dr.kovacs@u-nebuah.hu',
        secondaryEmail: 'kovacs.istvan.private@email.hu',
        specialties: ['Háziorvos', 'Belgyógyász'] as MedicalSpecialty[]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempSpecialties, setTempSpecialties] = useState<MedicalSpecialty[]>(profileData.specialties);
    const [specialtySearch, setSpecialtySearch] = useState('');

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
        </div>
    );
}
