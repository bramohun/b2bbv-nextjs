'use client';

/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez a komponens jelenleg NEM képezi a fejlesztési scope részét.
 * Kód- és felületi szinten kizárólag tervezetként / koncepcióként van jelen a prototípusban.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - TÉMA KÁRTYA (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * CÉL:
 * Fórumtéma összefoglaló megjelenítése a listában.
 * 
 * USER STORYK:
 * - Mint felhasználó, át szeretném tekinteni a fórum témákat.
 * - Mint felhasználó, látni szeretném, ha egy bejegyzés anonim módon készült.
 * 
 * LEHETŐSÉGEK:
 * - Kattintás a kártyára a részletek megtekintéséhez
 * - Szakterület és címke badge-ek megjelenítése
 * - Szerző, dátum és reakció statisztikák (like, dislike, komment szám)
 * 
 * ADMIN FUNKCIÓK MEGJELENÍTÉSE:
 * - "Lezárt" badge megjelenítése, ha a téma admin által le lett zárva (`isLocked`).
 * - "Anonim" szerző megjelenítése, ha admin által anonimizálva lett (`isAuthorAnonymized`).
 * 
 * ÜZLETI/MŰKÖDÉSI LOGIKA:
 * - Anonim szerző esetén a név mellett vizuális megkülönböztetés alkalmazandó (dőlt betű, halványabb szín).
 * - A leírásból csak egy rövidített előnézet jelenik meg.
 */

import { useRouter } from 'next/navigation';
import { ForumTopic, MedicalSpecialty } from '@/types/forum';

interface TopicCardProps {
    topic: ForumTopic;
}

export function TopicCard({ topic }: TopicCardProps) {
    const router = useRouter();

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

    const handleCardClick = () => {
        router.push(`/kozosseg/${topic.id}`);
    };

    const handleSpecialtyClick = (e: React.MouseEvent, specialty: MedicalSpecialty | 'general') => {
        e.stopPropagation();
        if (specialty === 'general') {
            router.push('/kozosseg'); // Or specific general logic if needed
        } else {
            router.push(`/kozosseg?specialty=${encodeURIComponent(specialty)}`);
        }
    };

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.stopPropagation();
        router.push(`/kozosseg?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="card-body">
                {/* Specialty badges */}
                <div className="flex flex-wrap gap-2 mb-1">
                    {topic.isGeneral ? (
                        <span
                            onClick={(e) => handleSpecialtyClick(e, 'general')}
                            className="badge badge-accent badge-sm hover:brightness-90 transition-all"
                        >
                            Általános
                        </span>
                    ) : (
                        topic.specialties.slice(0, 3).map((spec) => (
                            <span
                                key={spec}
                                onClick={(e) => handleSpecialtyClick(e, spec)}
                                className="badge badge-primary badge-sm hover:brightness-90 transition-all"
                            >
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
                    <span className={`font-medium ${topic.isAnonymous || topic.isAuthorAnonymized ? 'text-base-content/50 italic' : ''}`}>
                        {topic.isAnonymous || topic.isAuthorAnonymized ? 'Anonim' : topic.authorName}
                    </span>
                    <span className="mx-2">•</span>
                    {formattedDate}
                </p>

                {/* Description preview */}
                <p className="text-sm text-base-content/80 mt-2">{descriptionPreview}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {topic.tags.map((tag) => (
                        <span
                            key={tag}
                            onClick={(e) => handleTagClick(e, tag)}
                            className="badge badge-outline badge-sm hover:bg-base-200 transition-all"
                        >
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
                    {topic.isLocked && (
                        <span className="badge badge-warning badge-sm gap-1 ml-auto">
                            <span className="material-symbols-rounded text-xs">lock</span>
                            Lezárt
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
