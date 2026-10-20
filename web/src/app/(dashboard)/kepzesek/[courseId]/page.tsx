/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez az útvonal és a kapcsolódó képzési funkciók jelenleg NEM képezik
 * a fejlesztési scope részét. Kód- és felületi szinten kizárólag tervezetként
 * / koncepcióként van jelen a prototípusban, a navigációból kivezetve.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - KÉPZÉS ADATLAP OLDAL (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * ÚTVONAL: /kepzesek/[courseId]
 */

import { COURSES } from '@/lib/training-data';
import CourseDetailClient from '@/components/training/CourseDetailClient';

export async function generateStaticParams() {
    return COURSES.map(course => ({
        courseId: course.id
    }));
}

export default function CourseDetailPage() {
    return <CourseDetailClient />;
}
