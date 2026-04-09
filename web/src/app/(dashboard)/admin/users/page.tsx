'use client';

import { useState, useEffect } from 'react';
import { User, UserService, UserRole, UserStatus, NewsletterConfig } from '@/lib/user-service';
import { useAuth } from '@/context/AuthContext';
import { MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FELHASZNÁLÓKEZELÉS ADMIN OLDAL
 * ============================================================================
 * 
 * USER STORY:
 * Adminisztrátorként szeretném kezelni a rendszer felhasználóit, hogy hozzáadhassak
 * új tagokat, módosíthassam adataikat (beleértve a profil és hírlevél beállításokat),
 * deaktiválhassam őket vagy jelszó emlékeztetőt küldhessek nekik.
 * 
 * FUNKCIÓK:
 * - Felhasználók listázása táblázatban.
 * - Új felhasználó hozzáadása (Modal).
 * - Meglévő felhasználó szerkesztése (Modal - Tabos elrendezés: Alapadatok, Profil, Hírlevél).
 * - Új jelszó küldése (Mock).
 * - Felhasználó kijelentkeztetése (sessionVersion növelés).
 * - Felhasználó deaktiválása/aktiválása.
 */

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [activeTab, setActiveTab] = useState<'basic' | 'profile' | 'newsletter'>('basic');
    const [newsletterTab, setNewsletterTab] = useState<'primary' | 'secondary'>('primary');

    const [confirmAction, setConfirmAction] = useState<{
        type: 'deactivate' | 'activate' | 'logout' | 'reset-pw';
        userId: string;
        userName: string;
    } | null>(null);

    const { user: currentUser } = useAuth();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        try {
            const loadedUsers = UserService.getUsers();
            // Ensure compatibility if local storage has old data format
            const sanitizedUsers = loadedUsers.map(u => ({
                ...u,
                specialties: u.specialties || [],
                newsletterSettings: u.newsletterSettings || {
                    primary: {
                        community: { subscribed: true, sendTime: 8, frequency: 'Napi', topic: 'Minden', ownTopicOnly: false },
                        stock: { subscribed: true, frequency: 'Heti', sendTime: 9, topics: ['Újra elérhető', 'Készlethiány'], scope: 'Szakterület + mentett gyógyszerek' }
                    },
                    secondary: {
                        community: { subscribed: false, sendTime: 8, frequency: 'Heti', topic: 'Csak szakterület', ownTopicOnly: true },
                        stock: { subscribed: false, frequency: 'Havi' as any, sendTime: 10, topics: [], scope: 'Csak szakterület' }
                    }
                }
            }));
            setUsers(sanitizedUsers);
        } catch (e) {
            console.error("Failed to load users", e);
            setUsers([]);
        }
    };

    const handleAddUser = () => {
        setEditingUser({
            name: '',
            email: '',
            role: 'user',
            status: 'active',
            specialties: [],
            // Default newsletter settings will be handled by service or init here if needed
            newsletterSettings: {
                primary: {
                    community: { subscribed: true, sendTime: 8, frequency: 'Napi', topic: 'Minden', ownTopicOnly: false },
                    stock: { subscribed: true, frequency: 'Heti', sendTime: 9, topics: ['Újra elérhető', 'Készlethiány'], scope: 'Szakterület + mentett gyógyszerek' }
                },
                secondary: {
                    community: { subscribed: false, sendTime: 8, frequency: 'Heti', topic: 'Csak szakterület', ownTopicOnly: true },
                    stock: { subscribed: false, frequency: 'Havi' as any, sendTime: 10, topics: [], scope: 'Csak szakterület' }
                }
            }
        });
        setActiveTab('basic');
        setIsEditModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        // Deep copy needed for nested objects like newsletterSettings to avoid mutation issues
        setEditingUser(JSON.parse(JSON.stringify(user)));
        setActiveTab('basic');
        setIsEditModalOpen(true);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            if (editingUser.id) {
                UserService.updateUser(editingUser.id, editingUser);
            } else {
                UserService.createUser(editingUser as any);
            }
            loadUsers();
            setIsEditModalOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Hiba történt a mentés során!');
        }
    };

    const updateNewsletter = (
        emailType: 'primary' | 'secondary',
        category: 'community' | 'stock',
        field: string,
        value: any
    ) => {
        if (!editingUser?.newsletterSettings) return;

        const newSettings = { ...editingUser.newsletterSettings };
        newSettings[emailType] = {
            ...newSettings[emailType],
            [category]: {
                ...newSettings[emailType][category],
                [field]: value
            }
        };
        setEditingUser({ ...editingUser, newsletterSettings: newSettings });
    };

    const openConfirm = (type: 'deactivate' | 'activate' | 'logout' | 'reset-pw', user: User) => {
        setConfirmAction({ type, userId: user.id, userName: user.name });
        setIsConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        const { type, userId } = confirmAction;

        if (type === 'deactivate') {
            UserService.updateUser(userId, { status: 'inactive' });
            UserService.revokeSessions(userId);
        } else if (type === 'activate') {
            UserService.updateUser(userId, { status: 'active' });
        } else if (type === 'logout') {
            UserService.revokeSessions(userId);
        } else if (type === 'reset-pw') {
            const u = UserService.getUser(userId);
            if (u) UserService.resetPassword(u.email);
        }

        loadUsers();
        setIsConfirmModalOpen(false);
        setConfirmAction(null);
    };

    const renderNewsletterForm = (type: 'primary' | 'secondary') => {
        const config = editingUser?.newsletterSettings?.[type];
        if (!config) return null;

        return (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div className="alert alert-info py-2 text-sm">
                    <span className="material-symbols-rounded">info</span>
                    Beállítások a(z) {type === 'primary' ? 'elsődleges' : 'másodlagos'} email címhez.
                </div>

                {/* Közösség Szekció */}
                <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-lg font-medium flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">forum</span>
                        Közösség, Fórum
                        <div className="ml-auto flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                className="toggle toggle-sm toggle-primary"
                                checked={config.community.subscribed}
                                onChange={(e) => updateNewsletter(type, 'community', 'subscribed', e.target.checked)}
                            />
                        </div>
                    </div>
                    {config.community.subscribed && (
                        <div className="collapse-content space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs">Kiküldés ideje (óra)</label>
                                    <input
                                        type="number" min="0" max="23" className="input input-sm input-bordered"
                                        value={config.community.sendTime}
                                        onChange={(e) => updateNewsletter(type, 'community', 'sendTime', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs">Rendszeresség</label>
                                    <select
                                        className="select select-sm select-bordered"
                                        value={config.community.frequency}
                                        onChange={(e) => updateNewsletter(type, 'community', 'frequency', e.target.value)}
                                    >
                                        <option>Napi</option><option>Heti</option><option>Havi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs">Téma</label>
                                <select
                                    className="select select-sm select-bordered"
                                    value={config.community.topic}
                                    onChange={(e) => updateNewsletter(type, 'community', 'topic', e.target.value)}
                                >
                                    <option>Minden</option><option>Csak szakterület</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-4">
                                    <span className="label-text text-xs">Csak saját témák</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-primary"
                                        checked={config.community.ownTopicOnly}
                                        onChange={(e) => updateNewsletter(type, 'community', 'ownTopicOnly', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Készletinfó Szekció */}
                <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-lg font-medium flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">inventory_2</span>
                        Készletinfó
                        <div className="ml-auto flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                className="toggle toggle-sm toggle-primary"
                                checked={config.stock.subscribed}
                                onChange={(e) => updateNewsletter(type, 'stock', 'subscribed', e.target.checked)}
                            />
                        </div>
                    </div>
                    {config.stock.subscribed && (
                        <div className="collapse-content space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs">Kiküldés ideje (óra)</label>
                                    <input
                                        type="number" min="0" max="23" className="input input-sm input-bordered"
                                        value={config.stock.sendTime}
                                        onChange={(e) => updateNewsletter(type, 'stock', 'sendTime', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs">Rendszeresség</label>
                                    <select
                                        className="select select-sm select-bordered"
                                        value={config.stock.frequency}
                                        onChange={(e) => updateNewsletter(type, 'stock', 'frequency', e.target.value)}
                                    >
                                        <option>Napi</option><option>Heti</option><option>Havi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs">Követett Témák</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Újra elérhető', 'Készlethiány', 'Megszűnt'].map(t => (
                                        <button
                                            key={t} type="button"
                                            className={`btn btn-xs ${config.stock.topics.includes(t) ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => {
                                                const newTopics = config.stock.topics.includes(t)
                                                    ? config.stock.topics.filter(x => x !== t)
                                                    : [...config.stock.topics, t];
                                                updateNewsletter(type, 'stock', 'topics', newTopics);
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs">Hatkör</label>
                                <select
                                    className="select select-sm select-bordered"
                                    value={config.stock.scope}
                                    onChange={(e) => updateNewsletter(type, 'stock', 'scope', e.target.value)}
                                >
                                    <option>Minden</option><option>Szakterület + mentett gyógyszerek</option><option>Csak szakterület</option><option>Csak mentett gyógyszer</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="card-title text-2xl">
                        <span className="material-symbols-rounded text-primary">group</span>
                        Felhasználók listája
                    </h2>
                    <button onClick={handleAddUser} className="btn btn-primary btn-sm">
                        <span className="material-symbols-rounded">person_add</span>
                        Új felhasználó
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Név / Email</th>
                                <th>Szerepkör</th>
                                <th>Státusz</th>
                                <th>Szakterületek</th>
                                <th className="text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className={u.id === currentUser?.id ? 'bg-primary/5' : ''}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{u.name}</span>
                                            <span className="text-xs text-base-content/60">{u.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm ${u.role === 'admin' ? 'badge-secondary' : 'badge-ghost text-base-content/60'}`}>
                                            {u.role === 'admin' ? 'Admin' : 'Orvos'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                            {u.status === 'active' ? 'Aktív' : 'Inaktív'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {u.specialties?.slice(0, 2).map(s => (
                                                <span key={s} className="badge badge-xs badge-outline">{s}</span>
                                            ))}
                                            {(u.specialties?.length || 0) > 2 && (
                                                <span className="badge badge-xs badge-ghost">+{u.specialties!.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="dropdown dropdown-left dropdown-end">
                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                                                <span className="material-symbols-rounded">more_vert</span>
                                            </div>
                                            <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
                                                <li>
                                                    <button onClick={() => handleEditUser(u)}>
                                                        <span className="material-symbols-rounded text-info text-sm">edit</span>Szerkesztés
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => openConfirm('reset-pw', u)}>
                                                        <span className="material-symbols-rounded text-warning text-sm">key</span>Új jelszó küldése
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => openConfirm('logout', u)}>
                                                        <span className="material-symbols-rounded text-error text-sm">logout</span>Kijelentkeztetés
                                                    </button>
                                                </li>
                                                {u.id !== currentUser?.id && (
                                                    <li>
                                                        {u.status === 'active' ? (
                                                            <button onClick={() => openConfirm('deactivate', u)} className="text-error">
                                                                <span className="material-symbols-rounded text-sm">block</span>Deaktiválás
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => openConfirm('activate', u)} className="text-success">
                                                                <span className="material-symbols-rounded text-sm">check_circle</span>Aktiválás
                                                            </button>
                                                        )}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Edit/Create Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl">
                        <button onClick={() => setIsEditModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <h3 className="font-bold text-lg mb-4">
                            {editingUser?.id ? 'Felhasználó szerkesztése' : 'Új felhasználó hozzáadása'}
                        </h3>

                        {/* Tabs */}
                        <div role="tablist" className="tabs tabs-boxed mb-4">
                            <a role="tab" className={`tab ${activeTab === 'basic' ? 'tab-active' : ''}`} onClick={() => setActiveTab('basic')}>Alapadatok</a>
                            <a role="tab" className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} onClick={() => setActiveTab('profile')}>Profil & Szakterületek</a>
                            <a role="tab" className={`tab ${activeTab === 'newsletter' ? 'tab-active' : ''}`} onClick={() => setActiveTab('newsletter')}>Hírlevél beállítások</a>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-4">

                            {/* TAB: BASIC */}
                            {activeTab === 'basic' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Teljes név</span></label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                value={editingUser?.name || ''}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Email cím</span></label>
                                            <input
                                                type="email"
                                                className="input input-bordered"
                                                value={editingUser?.email || ''}
                                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Szerepkör</span></label>
                                            <select
                                                className="select select-bordered"
                                                value={editingUser?.role || 'user'}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                                            >
                                                <option value="user">Orvos (User)</option>
                                                <option value="admin">Adminisztrátor</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Státusz</span></label>
                                            <select
                                                className="select select-bordered"
                                                value={editingUser?.status || 'active'}
                                                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                                            >
                                                <option value="active">Aktív</option>
                                                <option value="inactive">Inaktív</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PROFILE */}
                            {activeTab === 'profile' && (
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Másodlagos Email</span></label>
                                        <input
                                            type="email"
                                            className="input input-bordered"
                                            value={editingUser?.secondaryEmail || ''}
                                            onChange={(e) => setEditingUser({ ...editingUser, secondaryEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Szakterületek</span></label>
                                        <div className="h-60 overflow-y-auto border rounded-xl p-2 bg-base-200/30">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                {MEDICAL_SPECIALTIES.map(spec => (
                                                    <label key={spec} className="label cursor-pointer justify-start gap-3 hover:bg-base-200 px-3 rounded-md">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-primary checkbox-sm"
                                                            checked={editingUser?.specialties?.includes(spec) || false}
                                                            onChange={(e) => {
                                                                const current = editingUser?.specialties || [];
                                                                const newTask = e.target.checked
                                                                    ? [...current, spec]
                                                                    : current.filter(s => s !== spec);
                                                                setEditingUser({ ...editingUser, specialties: newTask });
                                                            }}
                                                        />
                                                        <span className="label-text text-sm">{spec}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: NEWSLETTER */}
                            {activeTab === 'newsletter' && (
                                <div>
                                    <div className="tabs tabs-lifted mb-4">
                                        <a className={`tab ${newsletterTab === 'primary' ? 'tab-active' : ''}`} onClick={() => setNewsletterTab('primary')}>Elsődleges Email</a>
                                        <a className={`tab ${newsletterTab === 'secondary' ? 'tab-active' : ''}`} onClick={() => setNewsletterTab('secondary')}>Másodlagos Email</a>
                                    </div>
                                    <div className="bg-base-100 p-1">
                                        {renderNewsletterForm(newsletterTab)}
                                    </div>
                                </div>
                            )}

                            <div className="modal-action">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Mégse</button>
                                <button type="submit" className="btn btn-primary">Mentés</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal - Unchanged but included for completeness */}
            {isConfirmModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error">Megerősítés szükséges</h3>
                        <p className="py-4">
                            {confirmAction?.type === 'deactivate' && `Biztosan deaktiválni szeretnéd ${confirmAction.userName} felhasználót?`}
                            {confirmAction?.type === 'activate' && `Biztosan aktiválni szeretnéd ${confirmAction.userName} felhasználót?`}
                            {confirmAction?.type === 'logout' && `Biztosan ki szeretnéd jelentkeztetni ${confirmAction.userName} felhasználót minden eszközről?`}
                            {confirmAction?.type === 'reset-pw' && `Biztosan küldesz egy új jelszót ${confirmAction.userName} részére?`}
                        </p>
                        <div className="modal-action">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="btn btn-ghost">Mégse</button>
                            <button onClick={handleConfirm} className="btn btn-error">Folytatás</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
