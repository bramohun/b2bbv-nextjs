/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * ÚTVONAL: /kepzesek/[courseId]
 * 
 * CÉL:
 * Egy konkrét tanfolyam részletes adatlapja (Server Component wrapper a statikus generáláshoz).
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
