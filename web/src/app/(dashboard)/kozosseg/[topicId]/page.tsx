'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - TÉMA RÉSZLETEK OLDAL
 * ============================================================================
 * 
 * ÚTVONAL: /kozosseg/[topicId]
 * 
 * CÉL:
 * Egyetlen fórumtéma részletes megjelenítése hozzászólásokkal.
 * 
 * USER STORYK:
 * - Mint felhasználó, el szeretném olvasni a téma teljes leírását.
 * - Mint felhasználó, like/dislike-ot szeretnék adni a témára.
 * - Mint felhasználó, hozzászólásokat szeretnék olvasni és írni.
 * - Mint felhasználó, reakciókat szeretnék adni a hozzászólásokra.
 * 
 * LEHETŐSÉGEK AZ OLDALON:
 * - Vissza gomb a fórum listához
 * - Téma cím, leírás, szerző, dátum
 * - Szakterület és címke badge-ek
 * - Like/dislike gombok a témához
 * - Hozzászólások listája időrend szerint
 * - Új hozzászólás űrlap (anonim opcióval)
 * - Like/dislike a hozzászólásokon
 * 
 * ÜZLETI/MŰKÖDÉSI LOGIKA:
 * - Téma és kommentek localStorage-ból töltődnek
 * - Reakciók perzisztensen mentődnek
 * - Like és dislike kölcsönösen kizárja egymást
 * - Nem létező topicId esetén "nem található" üzenet
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    getTopic,
    getComments,
    addComment,
    toggleTopicLike,
    toggleTopicDislike,
    toggleCommentLike,
    toggleCommentDislike,
    getUserReactions,
} from '@/lib/forum-service';
import { ForumTopic, ForumComment, UserReactions } from '@/types/forum';
import { ReactionButtons, CommentSection } from '@/components/forum';

// Mock current user
const CURRENT_USER = { id: 'user_current', name: 'Dr. Teszt Felhasználó' };

export default function TopicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.topicId as string;

    const [topic, setTopic] = useState<ForumTopic | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [userReactions, setUserReactions] = useState<UserReactions>({
        topicLikes: {},
        topicDislikes: {},
        commentLikes: {},
        commentDislikes: {},
    });
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Load data
    useEffect(() => {
        const loadedTopic = getTopic(topicId);
        if (!loadedTopic) {
            setNotFound(true);
            setIsLoading(false);
            return;
        }

        setTopic(loadedTopic);
        setComments(getComments(topicId));
        setUserReactions(getUserReactions());
        setIsLoading(false);
    }, [topicId]);

    // Handle topic reactions
    const handleTopicLike = () => {
        if (!topic) return;
        const result = toggleTopicLike(topic.id);
        setTopic({ ...topic, likes: result.likes, dislikes: result.dislikes });
        setUserReactions({
            ...userReactions,
            topicLikes: { ...userReactions.topicLikes, [topic.id]: result.liked },
            topicDislikes: { ...userReactions.topicDislikes, [topic.id]: false },
        });
    };

    const handleTopicDislike = () => {
        if (!topic) return;
        const result = toggleTopicDislike(topic.id);
        setTopic({ ...topic, likes: result.likes, dislikes: result.dislikes });
        setUserReactions({
            ...userReactions,
            topicDislikes: { ...userReactions.topicDislikes, [topic.id]: result.disliked },
            topicLikes: { ...userReactions.topicLikes, [topic.id]: false },
        });
    };

    // Handle comment operations
    const handleAddComment = (text: string, isAnonymous: boolean) => {
        const newComment = addComment(
            { topicId, text, isAnonymous },
            CURRENT_USER
        );
        setComments([...comments, newComment]);
        if (topic) {
            setTopic({ ...topic, commentCount: topic.commentCount + 1 });
        }
    };

    const handleCommentLike = (commentId: string) => {
        const result = toggleCommentLike(commentId);
        setComments(comments.map(c =>
            c.id === commentId
                ? { ...c, likes: result.likes, dislikes: result.dislikes }
                : c
        ));
        setUserReactions({
            ...userReactions,
            commentLikes: { ...userReactions.commentLikes, [commentId]: result.liked },
            commentDislikes: { ...userReactions.commentDislikes, [commentId]: false },
        });
    };

    const handleCommentDislike = (commentId: string) => {
        const result = toggleCommentDislike(commentId);
        setComments(comments.map(c =>
            c.id === commentId
                ? { ...c, likes: result.likes, dislikes: result.dislikes }
                : c
        ));
        setUserReactions({
            ...userReactions,
            commentDislikes: { ...userReactions.commentDislikes, [commentId]: result.disliked },
            commentLikes: { ...userReactions.commentLikes, [commentId]: false },
        });
    };

    // Format date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (notFound || !topic) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <span className="material-symbols-rounded text-6xl text-error">
                            error
                        </span>
                        <h2 className="text-xl font-semibold mt-4">Téma nem található</h2>
                        <p className="text-base-content/60">
                            A keresett téma nem létezik vagy törölve lett.
                        </p>
                        <Link href="/kozosseg" className="btn btn-primary mt-4">
                            <span className="material-symbols-rounded">arrow_back</span>
                            Vissza a fórumhoz
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
                href="/kozosseg"
                className="btn btn-ghost btn-sm gap-2 mb-4"
            >
                <span className="material-symbols-rounded">arrow_back</span>
                Vissza a fórumhoz
            </Link>

            {/* Topic Card */}
            <div className="card bg-base-100 shadow-lg mb-6">
                <div className="card-body">
                    {/* Specialty badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {topic.isGeneral ? (
                            <span
                                onClick={() => router.push('/kozosseg')}
                                className="badge badge-accent cursor-pointer hover:brightness-90 transition-all"
                            >
                                Általános
                            </span>
                        ) : (
                            topic.specialties.map((spec) => (
                                <span
                                    key={spec}
                                    onClick={() => router.push(`/kozosseg?specialty=${encodeURIComponent(spec)}`)}
                                    className="badge badge-primary cursor-pointer hover:brightness-90 transition-all"
                                >
                                    {spec}
                                </span>
                            ))
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold">{topic.title}</h1>

                    {/* Author and date */}
                    <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                        <span className="material-symbols-rounded text-sm">person</span>
                        <span className={`font-medium ${topic.isAnonymous ? 'text-base-content/50 italic' : ''}`}>
                            {topic.isAnonymous ? 'Anonim' : topic.authorName}
                        </span>
                        <span>•</span>
                        <span>{formatDate(topic.createdAt)}</span>
                    </div>

                    {/* Description */}
                    <div className="divider"></div>
                    <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{topic.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {topic.tags.map((tag) => (
                            <span
                                key={tag}
                                onClick={() => router.push(`/kozosseg?tag=${encodeURIComponent(tag)}`)}
                                className="badge badge-outline cursor-pointer hover:bg-base-200 transition-all"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Reactions */}
                    <div className="divider"></div>
                    <div className="flex items-center justify-between">
                        <ReactionButtons
                            likes={topic.likes}
                            dislikes={topic.dislikes}
                            isLiked={userReactions.topicLikes[topic.id] || false}
                            isDisliked={userReactions.topicDislikes[topic.id] || false}
                            onLike={handleTopicLike}
                            onDislike={handleTopicDislike}
                        />
                        <span className="text-sm text-base-content/60 flex items-center gap-1">
                            <span className="material-symbols-rounded text-sm">comment</span>
                            {comments.length} hozzászólás
                        </span>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <CommentSection
                comments={comments}
                userReactions={userReactions}
                onAddComment={handleAddComment}
                onLikeComment={handleCommentLike}
                onDislikeComment={handleCommentDislike}
            />
        </div>
    );
}
