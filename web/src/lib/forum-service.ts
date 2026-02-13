/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FÓRUM SZOLGÁLTATÁS
 * ============================================================================
 * 
 * CÉL:
 * Kliens oldali szolgáltatás a közösségi fórum adatkezeléséhez.
 * LocalStorage-alapú perzisztencia, mock adatok generálása.
 * 
 * USER STORYK:
 * - Mint felhasználó, témákat szeretnék létrehozni, olvasni és szűrni.
 * - Mint felhasználó, hozzászólásokat szeretnék írni témákhoz.
 * - Mint felhasználó, reakciókat szeretnék adni (like/dislike).
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Minden adat a böngésző localStorage-ában tárolódik
 * - Első betöltéskor mock adatok generálódnak
 * - A reakciók felhasználónként követhetők
 * 
 * STORAGE KULCSOK:
 * - 'forumTopics': ForumTopic[] - témák listája
 * - 'forumComments': ForumComment[] - összes hozzászólás
 * - 'forumUserReactions': UserReactions - reakciók
 * - 'forumDataVersion': string - verzió a frissítéshez
 */

import {
    ForumTopic,
    ForumComment,
    UserReactions,
    TopicFilters,
    CreateTopicInput,
    CreateCommentInput,
    MEDICAL_SPECIALTIES,
    MedicalSpecialty,
} from '@/types/forum';

const STORAGE_KEYS = {
    TOPICS: 'forumTopics',
    COMMENTS: 'forumComments',
    REACTIONS: 'forumUserReactions',
    VERSION: 'forumDataVersion',
} as const;

const DATA_VERSION = '2.0';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('localStorage write error:', error);
    }
}

// ============================================================================
// MOCK DATA GENERATION
// ============================================================================

const MOCK_AUTHORS = [
    'Dr. Kovács Anna',
    'Dr. Nagy Péter',
    'Dr. Szabó Éva',
    'Dr. Tóth János',
    'Dr. Horváth Mária',
    'Dr. Kiss László',
    'Dr. Varga Katalin',
];

const PREDEFINED_TOPICS: Omit<ForumTopic, 'id' | 'authorId' | 'authorName' | 'isAnonymous' | 'createdAt' | 'likes' | 'dislikes' | 'commentCount'>[] = [
    {
        title: 'Új antihipertenzív terápia protokoll',
        description: 'Az új ESC irányelvek alapján szeretném megosztani tapasztalataimat a kombinált terápiával kapcsolatban. Milyen eredményeket látnak a kollégák a rezisztens hipertónia kezelésében?',
        tags: ['Kardiológia', 'Protokoll', 'Hipertónia'],
        specialties: ['Kardiológus', 'Háziorvos'],
        isGeneral: false,
    },
    {
        title: 'Pitvarfibrilláció antikoagulálása időskorban',
        description: 'A NOAC szerek dóziscsökkentésének gyakorlati szempontjai 80 év felett. Vesefunkció monitorozás gyakorisága.',
        tags: ['Kardiológia', 'Antikoagulálás', 'Geriátria'],
        specialties: ['Kardiológus', 'Háziorvos', 'Geriáter'],
        isGeneral: false,
    },
    {
        title: 'Immunterápia hatékonysága melanoma esetén',
        description: 'Checkpoint inhibitorok alkalmazása előrehaladott stádiumban. Mellékhatásprofil és betegkövetés.',
        tags: ['Onkológia', 'Bőrgyógyászat', 'Immunterápia'],
        specialties: ['Onkológus', 'Bőrgyógyász'],
        isGeneral: false,
    },
    {
        title: 'Általános gyógyszerhiány tájékoztató - 2026 február',
        description: 'Az OGYÉI aktuális készlethiány listája alapján összefoglalom a legfontosabb változásokat. Minden szakterületet érint!',
        tags: ['Készlethiány', 'Tájékoztató', 'OGYÉI'],
        specialties: [],
        isGeneral: true,
    },
    {
        title: 'EESZT frissítés és receptírás',
        description: 'A rendszerkarbantartás után tapasztalt lassulások és a felhő alapú receptírás új funkciói.',
        tags: ['EESZT', 'Recept', 'Informatika'],
        specialties: [],
        isGeneral: true,
    },
    {
        title: 'Gyermekgyógyászati lázcsillapítás protokollja',
        description: 'A metamizol vs. ibuprofen/paracetamol alkalmazása csecsemőkorban. Új ajánlások és tapasztalatok.',
        tags: ['Gyermekgyógyászat', 'Lázcsillapítás'],
        specialties: ['Gyermekgyógyász', 'Háziorvos'],
        isGeneral: false,
    },
    {
        title: 'Új gyógyszer a 2-es típusú cukorbetegség kezelésére',
        description: 'A GLP-1 agonisták és SGLT2 gátlók kombinációjának tapasztalatai. Milyen eredményeket látnak a kollégák a vércukor kontrollban és a testsúlycsökkenésben?',
        tags: ['Diabetológia', 'Endokrinológia', 'Új terápia'],
        specialties: ['Endokrinológus', 'Belgyógyász', 'Háziorvos'],
        isGeneral: false,
    },
    {
        title: 'Krónikus migrén profilaxisa',
        description: 'A CGRP-antagonisták elérhetősége és hatékonysága. Kinek javasoljuk és milyen finanszírozási lehetőségek vannak?',
        tags: ['Neurológia', 'Fájdalomkezelés', 'Migrén'],
        specialties: ['Neurológus', 'Háziorvos'],
        isGeneral: false,
    },
    {
        title: 'Biológiai terápia a rheumatoid arthritisben',
        description: 'A TNF-alfa gátlók és JAK-inhibitorok összehasonlítása. Mikor váltsunk terápiát?',
        tags: ['Reumatológia', 'Immunológia', 'Ízületi gyulladás'],
        specialties: ['Reumatológus', 'Belgyógyász'],
        isGeneral: false,
    },
    {
        title: 'Atópiás dermatitisz új szisztémás kezelései',
        description: 'A biológiai terápiák helye a súlyos atópiás ekcéma kezelésében felnőttkorban.',
        tags: ['Bőrgyógyászat', 'Allergológia', 'Ekcéma'],
        specialties: ['Bőrgyógyász', 'Allergológus'],
        isGeneral: false,
    },
];

function generateMockTopics(): ForumTopic[] {
    return PREDEFINED_TOPICS.map((topicData, index) => {
        // Deterministic randomization based on index
        const isAnonymous = index % 5 === 0;
        const authorName = isAnonymous
            ? 'Anonim'
            : MOCK_AUTHORS[index % MOCK_AUTHORS.length];

        // Distribution of dates: 
        // 0, 1 -> today/yesterday
        // 2, 3 -> within 7 days
        // others -> up to 60 days
        let daysAgo = 0;
        if (index === 0) daysAgo = 0;
        else if (index === 1) daysAgo = 1;
        else if (index < 4) daysAgo = index + 2;
        else daysAgo = (index * 7) % 60;

        return {
            ...topicData,
            id: `topic_${index + 1}`,
            authorId: isAnonymous ? null : `user_${index}`,
            authorName,
            authorNameLower: authorName.toLowerCase(), // In case this is used for sorting
            isAnonymous,
            createdAt: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
            likes: (index * 5) % 50,
            dislikes: index % 5,
            commentCount: (index * 3) % 20,
        };
    });
}

const MOCK_COMMENT_TEXTS = [
    'Köszönöm a hasznos információt! Én is hasonló tapasztalatokat szereztem.',
    'Érdekes megközelítés. Van valakinek más véleménye is?',
    'Egyetértek, ez egy fontos téma amit meg kell beszélnünk.',
    'Hasznos lenne több klinikai esetet is látni ezzel kapcsolatban.',
    'Köszönöm a megosztást, ez sokat segít a mindennapi gyakorlatomban.',
    'Van valakinek tapasztalata a hosszú távú alkalmazással?',
    'Figyelembe kell venni a mellékhatásokat is.',
    'Jó lenne több szakirodalmi hivatkozást is látni.',
    'Gyakorlati szempontból ez nagyon hasznos információ.',
    'Köszönöm, ezt kerestem!',
];

function generateMockComments(topicId: string): ForumComment[] {
    // Extract index from topic_1, topic_2
    const topicIdx = parseInt(topicId.split('_')[1]) || 0;
    const count = (topicIdx % 5) + 3;
    const comments: ForumComment[] = [];

    for (let i = 0; i < count; i++) {
        const isAnonymous = (topicIdx + i) % 4 === 0;
        const authorName = isAnonymous
            ? 'Anonim'
            : MOCK_AUTHORS[(topicIdx + i) % MOCK_AUTHORS.length];

        // Distribution of comment dates based on topic index and comment index
        // Some comments will be very recent
        let daysAgo = 0;
        if (i === 0) daysAgo = 0; // At least one very recent comment for some topics
        else daysAgo = (topicIdx + i) % 10;

        comments.push({
            id: `comment_${topicId}_${i + 1}`,
            topicId,
            authorId: isAnonymous ? null : `user_${i}`,
            authorName,
            isAnonymous,
            text: MOCK_COMMENT_TEXTS[(topicIdx + i) % MOCK_COMMENT_TEXTS.length],
            createdAt: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
            likes: (topicIdx + i) % 12,
            dislikes: (topicIdx + i) % 3,
        });
    }

    return comments.sort((a, b) => a.createdAt - b.createdAt);
}

// ============================================================================
// TOPIC OPERATIONS
// ============================================================================

export function getTopics(): ForumTopic[] {
    // Check data version and regenerate if needed
    const currentVersion = getFromStorage<string>(STORAGE_KEYS.VERSION, '');
    if (currentVersion !== DATA_VERSION) {
        const topics = generateMockTopics();
        setToStorage(STORAGE_KEYS.TOPICS, topics);
        setToStorage(STORAGE_KEYS.VERSION, DATA_VERSION);
        return topics;
    }

    const topics = getFromStorage<ForumTopic[]>(STORAGE_KEYS.TOPICS, []);
    if (topics.length === 0) {
        const newTopics = generateMockTopics();
        setToStorage(STORAGE_KEYS.TOPICS, newTopics);
        return newTopics;
    }

    return topics;
}

export function getTopic(id: string): ForumTopic | undefined {
    const topics = getTopics();
    return topics.find(t => t.id === id);
}

export function createTopic(input: CreateTopicInput, currentUser: { id: string; name: string }): ForumTopic {
    const topics = getTopics();

    const newTopic: ForumTopic = {
        id: `topic_${Date.now()}`,
        title: input.title,
        description: input.description,
        tags: input.tags,
        specialties: input.specialties,
        isGeneral: input.isGeneral,
        authorId: input.isAnonymous ? null : currentUser.id,
        authorName: input.isAnonymous ? 'Anonim' : currentUser.name,
        isAnonymous: input.isAnonymous,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
        commentCount: 0,
    };

    const updatedTopics = [newTopic, ...topics];
    setToStorage(STORAGE_KEYS.TOPICS, updatedTopics);

    return newTopic;
}

export function updateTopic(topic: ForumTopic): void {
    const topics = getTopics();
    const index = topics.findIndex(t => t.id === topic.id);
    if (index !== -1) {
        topics[index] = topic;
        setToStorage(STORAGE_KEYS.TOPICS, topics);
    }
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

export function getComments(topicId: string): ForumComment[] {
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);
    const topicComments = allComments.filter(c => c.topicId === topicId);

    // Generate mock comments if none exist for this topic
    if (topicComments.length === 0) {
        const mockComments = generateMockComments(topicId);
        const updatedComments = [...allComments, ...mockComments];
        setToStorage(STORAGE_KEYS.COMMENTS, updatedComments);
        return mockComments;
    }

    return topicComments.sort((a, b) => a.createdAt - b.createdAt);
}

export function addComment(input: CreateCommentInput, currentUser: { id: string; name: string }): ForumComment {
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);

    const newComment: ForumComment = {
        id: `comment_${input.topicId}_${Date.now()}`,
        topicId: input.topicId,
        authorId: input.isAnonymous ? null : currentUser.id,
        authorName: input.isAnonymous ? 'Anonim' : currentUser.name,
        isAnonymous: input.isAnonymous,
        text: input.text,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
    };

    allComments.push(newComment);
    setToStorage(STORAGE_KEYS.COMMENTS, allComments);

    // Update topic comment count
    const topic = getTopic(input.topicId);
    if (topic) {
        topic.commentCount = getComments(input.topicId).length;
        updateTopic(topic);
    }

    return newComment;
}

export function updateComment(comment: ForumComment): void {
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);
    const index = allComments.findIndex(c => c.id === comment.id);
    if (index !== -1) {
        allComments[index] = comment;
        setToStorage(STORAGE_KEYS.COMMENTS, allComments);
    }
}

// ============================================================================
// REACTION OPERATIONS
// ============================================================================

function getReactions(): UserReactions {
    return getFromStorage<UserReactions>(STORAGE_KEYS.REACTIONS, {
        topicLikes: {},
        topicDislikes: {},
        commentLikes: {},
        commentDislikes: {},
    });
}

function saveReactions(reactions: UserReactions): void {
    setToStorage(STORAGE_KEYS.REACTIONS, reactions);
}

export function toggleTopicLike(topicId: string): { liked: boolean; likes: number; dislikes: number } {
    const reactions = getReactions();
    const topic = getTopic(topicId);
    if (!topic) throw new Error('Topic not found');

    const wasLiked = reactions.topicLikes[topicId] || false;
    const wasDisliked = reactions.topicDislikes[topicId] || false;

    if (wasLiked) {
        // Remove like
        reactions.topicLikes[topicId] = false;
        topic.likes--;
    } else {
        // Add like
        reactions.topicLikes[topicId] = true;
        topic.likes++;
        // Remove dislike if present
        if (wasDisliked) {
            reactions.topicDislikes[topicId] = false;
            topic.dislikes--;
        }
    }

    saveReactions(reactions);
    updateTopic(topic);

    return { liked: !wasLiked, likes: topic.likes, dislikes: topic.dislikes };
}

export function toggleTopicDislike(topicId: string): { disliked: boolean; likes: number; dislikes: number } {
    const reactions = getReactions();
    const topic = getTopic(topicId);
    if (!topic) throw new Error('Topic not found');

    const wasLiked = reactions.topicLikes[topicId] || false;
    const wasDisliked = reactions.topicDislikes[topicId] || false;

    if (wasDisliked) {
        // Remove dislike
        reactions.topicDislikes[topicId] = false;
        topic.dislikes--;
    } else {
        // Add dislike
        reactions.topicDislikes[topicId] = true;
        topic.dislikes++;
        // Remove like if present
        if (wasLiked) {
            reactions.topicLikes[topicId] = false;
            topic.likes--;
        }
    }

    saveReactions(reactions);
    updateTopic(topic);

    return { disliked: !wasDisliked, likes: topic.likes, dislikes: topic.dislikes };
}

export function toggleCommentLike(commentId: string): { liked: boolean; likes: number; dislikes: number } {
    const reactions = getReactions();
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);
    const comment = allComments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const wasLiked = reactions.commentLikes[commentId] || false;
    const wasDisliked = reactions.commentDislikes[commentId] || false;

    if (wasLiked) {
        reactions.commentLikes[commentId] = false;
        comment.likes--;
    } else {
        reactions.commentLikes[commentId] = true;
        comment.likes++;
        if (wasDisliked) {
            reactions.commentDislikes[commentId] = false;
            comment.dislikes--;
        }
    }

    saveReactions(reactions);
    updateComment(comment);

    return { liked: !wasLiked, likes: comment.likes, dislikes: comment.dislikes };
}

export function toggleCommentDislike(commentId: string): { disliked: boolean; likes: number; dislikes: number } {
    const reactions = getReactions();
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);
    const comment = allComments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const wasLiked = reactions.commentLikes[commentId] || false;
    const wasDisliked = reactions.commentDislikes[commentId] || false;

    if (wasDisliked) {
        reactions.commentDislikes[commentId] = false;
        comment.dislikes--;
    } else {
        reactions.commentDislikes[commentId] = true;
        comment.dislikes++;
        if (wasLiked) {
            reactions.commentLikes[commentId] = false;
            comment.likes--;
        }
    }

    saveReactions(reactions);
    updateComment(comment);

    return { disliked: !wasDisliked, likes: comment.likes, dislikes: comment.dislikes };
}

export function getUserReactions(): UserReactions {
    return getReactions();
}

// ============================================================================
// FILTERING AND SORTING
// ============================================================================

export function filterTopics(topics: ForumTopic[], filters: TopicFilters): ForumTopic[] {
    let filtered = [...topics];

    // Search filter
    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(topic => {
            const titleMatch = topic.title.toLowerCase().includes(query);
            if (filters.searchInContent) {
                const descMatch = topic.description.toLowerCase().includes(query);
                return titleMatch || descMatch;
            }
            return titleMatch;
        });
    }

    // Tag filter
    if (filters.selectedTag) {
        filtered = filtered.filter(topic => topic.tags.includes(filters.selectedTag));
    }

    // Specialty filter
    if (filters.selectedSpecialties.length > 0 || filters.filterByMySpecialty) {
        const activeSpecs = [...filters.selectedSpecialties];
        // Note: filterByMySpecialty would need the user's specialty passed in
        // For now we just use selectedSpecialties

        if (activeSpecs.length > 0) {
            filtered = filtered.filter(topic => {
                const isGeneralTopic = topic.isGeneral;
                const matchesAnySpecialty = topic.specialties.some(spec =>
                    activeSpecs.includes(spec as MedicalSpecialty)
                );
                return matchesAnySpecialty || isGeneralTopic;
            });
        }
    }

    // Sorting
    switch (filters.sortBy) {
        case 'title-az':
            filtered.sort((a, b) => a.title.localeCompare(b.title, 'hu'));
            break;
        case 'title-za':
            filtered.sort((a, b) => b.title.localeCompare(a.title, 'hu'));
            break;
        case 'date-oldest':
            filtered.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 'date-newest':
        default:
            filtered.sort((a, b) => b.createdAt - a.createdAt);
            break;
    }

    return filtered;
}


export function getAllTags(topics: ForumTopic[]): string[] {
    const tags = new Set<string>();
    topics.forEach(topic => {
        topic.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'hu'));
}

export function getForumStats(periodDays: number = 1): { newTopics: number; newComments: number } {
    const now = Date.now();
    const startDate = now - periodDays * 24 * 60 * 60 * 1000;

    const topics = getTopics();
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);

    // Ensure mock comments exist for all topics
    topics.forEach(topic => {
        const hasComments = allComments.some(c => c.topicId === topic.id);
        if (!hasComments) {
            const mockComments = generateMockComments(topic.id);
            allComments.push(...mockComments);
        }
    });

    const newTopics = topics.filter(t => t.createdAt >= startDate).length;
    const newComments = allComments.filter(c => c.createdAt >= startDate).length;

    return { newTopics, newComments };
}

export function getLatestForumActivity(limit: number = 10): ForumTopic[] {
    const topics = getTopics();
    const allComments = getFromStorage<ForumComment[]>(STORAGE_KEYS.COMMENTS, []);

    // Map to track latest activity timestamp for each topic
    const latestActivityMap = new Map<string, number>();

    topics.forEach(topic => {
        // Start with topic creation time
        let latest = topic.createdAt;

        // Check all comments for this topic
        allComments.forEach(comment => {
            if (comment.topicId === topic.id && comment.createdAt > latest) {
                latest = comment.createdAt;
            }
        });

        latestActivityMap.set(topic.id, latest);
    });

    // Sort topics by the latest activity timestamp
    return [...topics]
        .sort((a, b) => {
            const timeA = latestActivityMap.get(a.id) || a.createdAt;
            const timeB = latestActivityMap.get(b.id) || b.createdAt;
            return timeB - timeA;
        })
        .slice(0, limit);
}

