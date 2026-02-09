'use client';

/**
 * ============================================================================
 * REAKCIÓ GOMBOK KOMPONENS
 * ============================================================================
 * 
 * Like/dislike gombok újrafelhasználható komponense.
 * Témákhoz és hozzászólásokhoz egyaránt használható.
 */

import { useState } from 'react';

interface ReactionButtonsProps {
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    onLike: () => void;
    onDislike: () => void;
    size?: 'sm' | 'md';
}

export function ReactionButtons({
    likes,
    dislikes,
    isLiked,
    isDisliked,
    onLike,
    onDislike,
    size = 'md',
}: ReactionButtonsProps) {
    const buttonClass = size === 'sm' ? 'btn btn-xs btn-ghost gap-1' : 'btn btn-sm btn-ghost gap-2';
    const iconClass = size === 'sm' ? 'text-sm' : '';

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onLike}
                className={`${buttonClass} ${isLiked ? 'btn-primary' : ''}`}
                aria-label={isLiked ? 'Kedvelés visszavonása' : 'Kedvelés'}
            >
                <span
                    className={`material-symbols-rounded ${iconClass} ${isLiked ? 'filled' : ''}`}
                >
                    thumb_up
                </span>
                <span>{likes}</span>
            </button>
            <button
                onClick={onDislike}
                className={`${buttonClass} ${isDisliked ? 'btn-error' : ''}`}
                aria-label={isDisliked ? 'Nem kedvelés visszavonása' : 'Nem kedvelem'}
            >
                <span
                    className={`material-symbols-rounded ${iconClass} ${isDisliked ? 'filled' : ''}`}
                >
                    thumb_down
                </span>
                <span>{dislikes}</span>
            </button>
        </div>
    );
}
