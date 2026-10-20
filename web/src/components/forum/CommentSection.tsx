'use client';

/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez a komponens jelenleg NEM képezi a fejlesztési scope részét.
 * Kód- és felületi szinten kizárólag tervezetként / koncepcióként van jelen a prototípusban.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - HOZZÁSZÓLÁSOK SZEKCIÓ (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * CÉL:
 * Hozzászólások megjelenítése és új komment beküldése.
 * 
 * USER STORYK:
 * - Mint felhasználó, hozzá szeretnék szólni egy témához.
 * - Mint felhasználó, anonim módon szeretnék hozzászólni, hogy ne 
 *   látszódjon a nevem a kommentnél.
 * 
 * LEHETŐSÉGEK:
 * - Kommentek listájának megtekintése
 * - Új komment írása szöveges mezőben
 * - Anonim hozzászólás opció
 * - Kommentek kedvelése/nem kedvelése (ReactionButtons-on keresztül)
 * 
 * ADMIN KORLÁTOZÁSOK KEZELÉSE:
 * - Ha a téma lezárt (`isLocked` prop):
 *   - Új komment írása letiltva (info banner jelenik meg).
 *   - Reakció gombok letiltva.
 * - Ha a komment szerzője anonimizált (`isAuthorAnonymized`):
 *   - A név "Anonim"-ként jelenik meg.
 * - Rejtett (`isHidden`) kommentek kezelése (bár a service szűri, a komponens is fel vannak készítve rá).
 * 
 * ÜZLETI/MŰKÖDÉSI LOGIKA:
 * - Az anonim opció kiválasztásakor a komment beküldője "Anonim" néven jelenik meg.
 * - A lista időrendben (legrégebbi elöl) jeleníti meg a hozzászólásokat.
 */

import { useState } from 'react';
import { ForumComment, UserReactions } from '@/types/forum';
import { ReactionButtons } from './ReactionButtons';

interface CommentSectionProps {
    comments: ForumComment[];
    userReactions: UserReactions;
    onAddComment: (text: string, isAnonymous: boolean) => void;
    onLikeComment: (commentId: string) => void;
    onDislikeComment: (commentId: string) => void;
    isLocked?: boolean;
}

export function CommentSection({
    comments,
    userReactions,
    onAddComment,
    onLikeComment,
    onDislikeComment,
    isLocked = false,
}: CommentSectionProps) {
    const [commentText, setCommentText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        onAddComment(commentText.trim(), isAnonymous);
        setCommentText('');
        setIsAnonymous(false);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Comments List */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-xl">
                        Hozzászólások
                        <span className="badge badge-neutral">{comments.length}</span>
                    </h2>

                    {comments.length === 0 ? (
                        <div className="text-center py-8 text-base-content/60">
                            <span className="material-symbols-rounded text-4xl">comment</span>
                            <p className="mt-2">Még nincsenek hozzászólások. Legyen Ön az első!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="border border-base-300 rounded-lg p-4 bg-base-50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <span className="material-symbols-rounded text-xs">person</span>
                                                <span
                                                    className={`font-medium ${comment.isAnonymous || comment.isAuthorAnonymized ? 'text-base-content/50 italic' : ''}`}
                                                >
                                                    {comment.isAnonymous || comment.isAuthorAnonymized ? 'Anonim' : comment.authorName}
                                                </span>
                                                <span>•</span>
                                                <span>{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-base">{comment.text}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <ReactionButtons
                                            likes={comment.likes}
                                            dislikes={comment.dislikes}
                                            isLiked={userReactions.commentLikes[comment.id] || false}
                                            isDisliked={userReactions.commentDislikes[comment.id] || false}
                                            onLike={() => !isLocked && onLikeComment(comment.id)}
                                            onDislike={() => !isLocked && onDislikeComment(comment.id)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Comment Form */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-lg">Új hozzászólás</h3>

                    {isLocked ? (
                        <div className="alert alert-warning">
                            <span className="material-symbols-rounded">lock</span>
                            <span>Ez a téma le van zárva, nem lehet új hozzászólást írni.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <textarea
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Írja ide a hozzászólását..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                    />
                                    <span className="label-text">Anonim hozzászólás</span>
                                </label>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!commentText.trim()}
                                >
                                    <span className="material-symbols-rounded">send</span>
                                    Hozzászólás
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
