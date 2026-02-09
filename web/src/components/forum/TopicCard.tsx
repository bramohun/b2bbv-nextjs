'use client';

/**
 * ============================================================================
 * TÉMA KÁRTYA KOMPONENS
 * ============================================================================
 * 
 * Fórumtéma megjelenítése kártya formátumban a listában.
 * Tartalmazza: cím, leírás előnézet, szerző, dátum, címkék, reakciók.
 */

import Link from 'next/link';
import { ForumTopic } from '@/types/forum';

interface TopicCardProps {
    topic: ForumTopic;
}

export function TopicCard({ topic }: TopicCardProps) {
    const date = new Date(topic.createdAt);
    const formattedDate = date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    // Truncate description for preview
    const descriptionPreview = topic.description.length > 150
        ? topic.description.substring(0, 150) + '...'
        : topic.description;

    return (
        <Link href={`/kozosseg/${topic.id}`}>
            <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="card-body">
                    {/* Specialty badges */}
                    <div className="flex flex-wrap gap-2 mb-1">
                        {topic.isGeneral ? (
                            <span className="badge badge-accent badge-sm">Általános</span>
                        ) : (
                            topic.specialties.slice(0, 3).map((spec) => (
                                <span key={spec} className="badge badge-primary badge-sm">
                                    {spec}
                                </span>
                            ))
                        )}
                        {topic.specialties.length > 3 && (
                            <span className="badge badge-outline badge-sm">
                                +{topic.specialties.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-lg">{topic.title}</h3>

                    {/* Author and date */}
                    <p className="text-sm text-base-content/70">
                        <span className="material-symbols-rounded text-xs align-middle mr-1">
                            person
                        </span>
                        <span className={topic.isAnonymous ? 'opacity-60' : ''}>
                            {topic.authorName}
                        </span>
                        <span className="mx-2">•</span>
                        {formattedDate}
                    </p>

                    {/* Description preview */}
                    <p className="text-sm text-base-content/80 mt-2">{descriptionPreview}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {topic.tags.map((tag) => (
                            <span key={tag} className="badge badge-outline badge-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-base-content/70">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-rounded text-sm">thumb_up</span>
                            {topic.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-rounded text-sm">thumb_down</span>
                            {topic.dislikes}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-rounded text-sm">comment</span>
                            {topic.commentCount}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
