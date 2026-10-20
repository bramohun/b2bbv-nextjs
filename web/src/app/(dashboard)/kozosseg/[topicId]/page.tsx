/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez az útvonal és a kapcsolódó közösségi funkciók jelenleg NEM képezik
 * a fejlesztési scope részét. Kód- és felületi szinten kizárólag tervezetként
 * / koncepcióként van jelen a prototípusban, a navigációból kivezetve.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - TÉMA RÉSZLETEK OLDAL (INAKTÍV TERVEZET)
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
