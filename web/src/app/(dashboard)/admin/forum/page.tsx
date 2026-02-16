'use client';

import { useState, useEffect } from 'react';
import {
    getTopics,
    getComments,
    adminHideTopic,
    adminLockTopic,
    adminUpdateTopicText,
    adminAnonymizeTopic,
    adminHideComment,
    adminUpdateCommentText,
    adminAnonymizeComment
} from '@/lib/forum-service';
import { ForumTopic, ForumComment } from '@/types/forum';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FÓRUM MODERÁLÁS (ADMIN)
 * ============================================================================
 * 
 * ÚTVONAL: /admin/forum
 * 
 * CÉL:
 * Adminisztrációs felület a fórum bejegyzések és hozzászólások moderálására.
 * Ezen az oldalon az adminisztrátorok teljes körű ellenőrzést gyakorolhatnak
 * a felhasználói tartalmak felett.
 * 
 * USER STORYK (ADMIN):
 * - Mint admin, át szeretném tekinteni az összes fórum témát (beleértve a rejtetteket is).
 * - Mint admin, el szeretném rejteni/meg szeretném jeleníteni a nem megfelelő témákat/kommenteket.
 * - Mint admin, le szeretném zárni a vitákat (témákat), hogy ne lehessen tovább kommentelni.
 * - Mint admin, anonimizálni szeretném a szerzőket adatvédelmi vagy egyéb okokból.
 * - Mint admin, szerkeszteni szeretném a bejegyzések/kommentek szövegét moderálási céllal.
 * 
 * FUNKCIÓK:
 * - Témák listázása (szűrők nélkül, minden tartalom látható).
 * - Témák kezelése:
 *   - Elrejtés/Megjelenítés (isHidden toggle).
 *   - Lezárás/Feloldás (isLocked toggle).
 *   - Szöveg szerkesztése (description update).
 *   - Szerző anonimizálása (isAuthorAnonymized flag).
 * - Hozzászólások kezelése (téma lenyitása után):
 *   - Ugyanazok a funkciók, mint a témáknál (elrejtés, szerkesztés, anonimizálás).
 * 
 * DEPENDENCIÁK:
 * - forum-service.ts (admin műveletek).
 * - AuthContext (jogosultság ellenőrzés a layout szintjén).
 */

export default function AdminForumPage() {
    const [topics, setTopics] = useState<ForumTopic[]>([]);
    const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
    const [topicComments, setTopicComments] = useState<ForumComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Action states
    const [confirmAction, setConfirmAction] = useState<{
        type: 'hide-topic' | 'show-topic' | 'lock-topic' | 'unlock-topic' | 'anonymize-topic' | 'hide-comment' | 'show-comment' | 'anonymize-comment';
        id: string;
        title?: string;
    } | null>(null);

    const [editAction, setEditAction] = useState<{
        type: 'topic' | 'comment';
        id: string;
        text: string;
    } | null>(null);

    // Initial load
    useEffect(() => {
        loadTopics();
    }, []);

    // Load comments when a topic is expanded
    useEffect(() => {
        if (expandedTopicId) {
            loadComments(expandedTopicId);
        } else {
            setTopicComments([]);
        }
    }, [expandedTopicId]);

    const loadTopics = () => {
        setIsLoading(true);
        // Pass true to include hidden topics
        const allTopics = getTopics(true);
        setTopics(allTopics);
        setIsLoading(false);
    };

    const loadComments = (topicId: string) => {
        // Pass true to include hidden comments
        const comments = getComments(topicId, true);
        setTopicComments(comments);
    };

    const handleExpandTopic = (topicId: string) => {
        if (expandedTopicId === topicId) {
            setExpandedTopicId(null);
        } else {
            setExpandedTopicId(topicId);
        }
    };

    // --- Action Handlers ---

    const openConfirm = (type: typeof confirmAction.type, id: string, title?: string) => {
        setConfirmAction({ type, id, title });
        setIsConfirmModalOpen(true);
    };

    const openEdit = (type: 'topic' | 'comment', id: string, text: string) => {
        setEditAction({ type, id, text });
        setIsEditModalOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        const { type, id } = confirmAction;

        switch (type) {
            case 'hide-topic':
                adminHideTopic(id, true);
                break;
            case 'show-topic':
                adminHideTopic(id, false);
                break;
            case 'lock-topic':
                adminLockTopic(id, true);
                break;
            case 'unlock-topic':
                adminLockTopic(id, false);
                break;
            case 'anonymize-topic':
                adminAnonymizeTopic(id);
                break;
            case 'hide-comment':
                adminHideComment(id, true);
                break;
            case 'show-comment':
                adminHideComment(id, false);
                break;
            case 'anonymize-comment':
                adminAnonymizeComment(id);
                break;
        }

        // Refresh data
        loadTopics();
        if (expandedTopicId) loadComments(expandedTopicId);

        setIsConfirmModalOpen(false);
        setConfirmAction(null);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editAction) return;

        if (editAction.type === 'topic') {
            adminUpdateTopicText(editAction.id, editAction.text);
            loadTopics();
        } else {
            adminUpdateCommentText(editAction.id, editAction.text);
            if (expandedTopicId) loadComments(expandedTopicId);
        }

        setIsEditModalOpen(false);
        setEditAction(null);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading && topics.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="card-title text-2xl">
                        <span className="material-symbols-rounded text-primary">forum</span>
                        Fórum Moderálás
                    </h2>
                    <div className="badge badge-neutral">{topics.length} téma</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra table-pin-rows">
                        <thead>
                            <tr>
                                <th className="w-10"></th>
                                <th>Téma / Leírás</th>
                                <th>Szerző</th>
                                <th>Státusz</th>
                                <th className="text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((topic) => (
                                <>
                                    <tr key={topic.id} className={expandedTopicId === topic.id ? 'bg-base-200' : ''}>
                                        <td>
                                            <button
                                                className="btn btn-ghost btn-xs btn-circle"
                                                onClick={() => handleExpandTopic(topic.id)}
                                            >
                                                <span className="material-symbols-rounded">
                                                    {expandedTopicId === topic.id ? 'expand_less' : 'expand_more'}
                                                </span>
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1 max-w-md">
                                                <span className="font-bold cursor-pointer hover:text-primary" onClick={() => handleExpandTopic(topic.id)}>
                                                    {topic.title}
                                                </span>
                                                <span className="text-xs text-base-content/60 truncate">
                                                    {topic.description}
                                                </span>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="badge badge-xs badge-outline">{formatDate(topic.createdAt)}</span>
                                                    <span className="badge badge-xs badge-ghost">{topic.commentCount} hozzászólás</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className={`${topic.isAuthorAnonymized ? 'text-base-content/50 italic' : ''}`}>
                                                    {topic.isAuthorAnonymized ? 'Anonim' : topic.authorName}
                                                </span>
                                                {topic.isAuthorAnonymized && <span className="text-[10px] uppercase font-bold text-warning">Anonimizálva</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                {topic.isHidden && <span className="badge badge-sm badge-error">Rejtett</span>}
                                                {topic.isLocked && <span className="badge badge-sm badge-warning">Lezárt</span>}
                                                {!topic.isHidden && !topic.isLocked && <span className="badge badge-sm badge-success">Aktív</span>}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-left dropdown-end">
                                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                                                    <span className="material-symbols-rounded">more_vert</span>
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
                                                    <li>
                                                        <button onClick={() => openEdit('topic', topic.id, topic.description)}>
                                                            <span className="material-symbols-rounded text-info text-sm">edit</span>
                                                            Szöveg szerkesztése
                                                        </button>
                                                    </li>
                                                    <li>
                                                        {topic.isLocked ? (
                                                            <button onClick={() => openConfirm('unlock-topic', topic.id, topic.title)}>
                                                                <span className="material-symbols-rounded text-success text-sm">lock_open</span>
                                                                Feloldás
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => openConfirm('lock-topic', topic.id, topic.title)}>
                                                                <span className="material-symbols-rounded text-warning text-sm">lock</span>
                                                                Lezárás
                                                            </button>
                                                        )}
                                                    </li>
                                                    <li>
                                                        {topic.isHidden ? (
                                                            <button onClick={() => openConfirm('show-topic', topic.id, topic.title)}>
                                                                <span className="material-symbols-rounded text-success text-sm">visibility</span>
                                                                Megjelenítés
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => openConfirm('hide-topic', topic.id, topic.title)}>
                                                                <span className="material-symbols-rounded text-error text-sm">visibility_off</span>
                                                                Elrejtés
                                                            </button>
                                                        )}
                                                    </li>
                                                    {!topic.isAuthorAnonymized && (
                                                        <li>
                                                            <button onClick={() => openConfirm('anonymize-topic', topic.id, topic.title)}>
                                                                <span className="material-symbols-rounded text-base-content/70 text-sm">person_off</span>
                                                                Anonimizálás
                                                            </button>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded Comments View */}
                                    {expandedTopicId === topic.id && (
                                        <tr>
                                            <td colSpan={5} className="bg-base-200/50 p-0">
                                                <div className="p-4 pl-12">
                                                    <h4 className="font-bold text-sm mb-3 text-base-content/70">Hozzászólások ({topicComments.length})</h4>

                                                    {topicComments.length === 0 ? (
                                                        <p className="text-sm italic text-base-content/50">Nincsenek hozzászólások.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {topicComments.map(comment => (
                                                                <div key={comment.id} className="card bg-base-100 border border-base-300 shadow-sm p-3">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 text-xs mb-1">
                                                                                <span className={`font-medium ${comment.isAuthorAnonymized ? 'text-base-content/50 italic' : ''}`}>
                                                                                    {comment.isAuthorAnonymized ? 'Anonim' : comment.authorName}
                                                                                </span>
                                                                                <span className="text-base-content/40">• {formatDate(comment.createdAt)}</span>
                                                                                {comment.isHidden && <span className="badge badge-xs badge-error">Rejtett</span>}
                                                                                {comment.isAuthorAnonymized && <span className="badge badge-xs badge-warning badge-outline">Anonimizált</span>}
                                                                            </div>
                                                                            <p className="text-sm">{comment.text}</p>
                                                                        </div>

                                                                        <div className="dropdown dropdown-end">
                                                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                                                                                <span className="material-symbols-rounded text-base-content/50">more_horiz</span>
                                                                            </div>
                                                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48 text-xs border border-base-200">
                                                                                <li>
                                                                                    <button onClick={() => openEdit('comment', comment.id, comment.text)}>
                                                                                        Szöveg szerkesztése
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    {comment.isHidden ? (
                                                                                        <button onClick={() => openConfirm('show-comment', comment.id)}>
                                                                                            Megjelenítés
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button onClick={() => openConfirm('hide-comment', comment.id)} className="text-error">
                                                                                            Elrejtés
                                                                                        </button>
                                                                                    )}
                                                                                </li>
                                                                                {!comment.isAuthorAnonymized && (
                                                                                    <li>
                                                                                        <button onClick={() => openConfirm('anonymize-comment', comment.id)}>
                                                                                            Anonimizálás
                                                                                        </button>
                                                                                    </li>
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-warning mb-2">Megerősítés szükséges</h3>
                        <p className="py-4">
                            {confirmAction?.type === 'hide-topic' && `Biztosan elrejted a(z) "${confirmAction.title}" témát? A felhasználók nem fogják látni.`}
                            {confirmAction?.type === 'show-topic' && `Biztosan megjeleníted újra a(z) "${confirmAction.title}" témát?`}
                            {confirmAction?.type === 'lock-topic' && `Biztosan lezárod a(z) "${confirmAction.title}" témát? Nem lehet majd új hozzászólást írni.`}
                            {confirmAction?.type === 'unlock-topic' && `Biztosan feloldod a(z) "${confirmAction.title}" témát?`}
                            {confirmAction?.type === 'anonymize-topic' && `Biztosan anonimizálod a(z) "${confirmAction.title}" szerzőjét? Ez a művelet nem visszavonható!`}
                            {confirmAction?.type === 'hide-comment' && `Biztosan elrejted ezt a hozzászólást?`}
                            {confirmAction?.type === 'show-comment' && `Biztosan megjeleníted újra ezt a hozzászólást?`}
                            {confirmAction?.type === 'anonymize-comment' && `Biztosan anonimizálod a hozzászólás szerzőjét? Ez a művelet nem visszavonható!`}
                        </p>
                        <div className="modal-action">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="btn btn-ghost">Mégse</button>
                            <button onClick={handleConfirm} className="btn btn-primary">Megerősítés</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Text Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">
                            {editAction?.type === 'topic' ? 'Bejegyzés szerkesztése' : 'Hozzászólás szerkesztése'}
                        </h3>
                        <form onSubmit={handleSaveEdit}>
                            <textarea
                                className="textarea textarea-bordered w-full h-48"
                                value={editAction?.text || ''}
                                onChange={(e) => setEditAction(editAction ? { ...editAction, text: e.target.value } : null)}
                                placeholder="Írja ide a szöveget..."
                            ></textarea>
                            <div className="modal-action">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Mégse</button>
                                <button type="submit" className="btn btn-primary">Mentés</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
