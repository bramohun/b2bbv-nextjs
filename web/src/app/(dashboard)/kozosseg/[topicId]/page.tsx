/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - TÉMA RÉSZLETEK OLDAL
 * ============================================================================
 * 
 * ÚTVONAL: /kozosseg/[topicId]
 */

import TopicDetailClient from '@/components/forum/TopicDetailClient';

export async function generateStaticParams() {
    return [
        { topicId: '1' },
        { topicId: '2' },
        { topicId: '3' },
        { topicId: 'topic_1' },
        { topicId: 'topic_2' },
    ];
}

export default function TopicDetailPage() {
    return <TopicDetailClient />;
}
