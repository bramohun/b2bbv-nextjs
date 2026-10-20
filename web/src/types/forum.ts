/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez a modul és a kapcsolódó közösségi fórum típusok jelenleg NEM képezik a
 * fejlesztési scope részét. Kód- és felületi szinten kizárólag tervezetként
 * / koncepcióként van jelen a prototípusban, éles funkcióként még nem elérhető.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FÓRUM TÍPUSOK (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * CÉL:
 * TypeScript típusdefiníciók a közösségi fórum funkcióhoz.
 * 
 * USER STORYK:
 * - Mint felhasználó, témákat szeretnék létrehozni és böngészni.
 * - Mint felhasználó, hozzászólásokat szeretnék írni és reakciókat adni.
 * - Mint felhasználó, szakterület és címke alapján szeretnék szűrni.
 * 
 * ADATSTRUKTÚRÁK:
 * - ForumTopic: Fórumtéma összes adatával
 * - ForumComment: Hozzászólás adatai
 * - UserReactions: Felhasználói reakciók nyilvántartása
 * - TopicFilters: Szűrési beállítások
 * 
 * MŰKÖDÉSI LOGIKA:
 * - Minden adat localStorage-ban tárolódik
 * - A szakterületek fix listából választhatók
 * - Anonim hozzászólás esetén authorId null, authorName "Anonim"
 */

/**
 * Orvosi szakterületek konstans listája
 * A legacy rendszerrel kompatibilis értékek
 */
export const MEDICAL_SPECIALTIES = [
    'Háziorvos',
    'Belgyógyász',
    'Kardiológus',
    'Neurológus',
    'Pszichiáter',
    'Bőrgyógyász',
    'Szemész',
    'Fül-orr-gégész',
    'Nőgyógyász',
    'Urológus',
    'Ortopédus',
    'Reumatológus',
    'Endokrinológus',
    'Gasztroenterológus',
    'Tüdőgyógyász',
    'Allergológus',
    'Onkológus',
    'Hematológus',
    'Infektológus',
    'Gyermekgyógyász',
    'Geriáter',
    'Radiológus',
    'Aneszteziológus',
    'Sebész',
    'Traumatológus',
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];

/**
 * Fórumtéma típusa
 */
export interface ForumTopic {
    /** Egyedi azonosító (topic_1, topic_2, stb.) */
    id: string;
    /** Téma címe */
    title: string;
    /** Részletes leírás/tartalom */
    description: string;
    /** Címkék tömbje (pl. ['Kardiológia', 'Hipertónia']) */
    tags: string[];
    /** Érintett szakterületek tömbje */
    specialties: MedicalSpecialty[];
    /** Ha true, minden szakterületet érint (pl. adminisztráció) */
    isGeneral: boolean;
    /** Szerző felhasználói azonosítója (null ha anonim) */
    authorId: string | null;
    /** Szerző megjelenített neve (vagy "Anonim") */
    authorName: string;
    /** Anonim-e a bejegyzés */
    isAnonymous: boolean;
    /** Létrehozás időbélyege (timestamp) */
    createdAt: number;
    /** Kedvelések száma */
    likes: number;
    /** Nem kedvelések száma */
    dislikes: number;
    /** Hozzászólások száma */
    commentCount: number;
    /** Admin által elrejtve */
    isHidden?: boolean;
    /** Admin által lezárva (nem lehet kommentelni/reagálni) */
    isLocked?: boolean;
    /** Admin által anonimizált szerző */
    isAuthorAnonymized?: boolean;
}

/**
 * Hozzászólás típusa
 */
export interface ForumComment {
    /** Egyedi azonosító */
    id: string;
    /** Szülő téma azonosítója */
    topicId: string;
    /** Szerző felhasználói azonosítója (null ha anonim) */
    authorId: string | null;
    /** Szerző megjelenített neve (vagy "Anonim") */
    authorName: string;
    /** Anonim-e a hozzászólás */
    isAnonymous: boolean;
    /** Hozzászólás szövege */
    text: string;
    /** Létrehozás időbélyege */
    createdAt: number;
    /** Kedvelések száma */
    likes: number;
    /** Nem kedvelések száma */
    dislikes: number;
    /** Admin által elrejtve */
    isHidden?: boolean;
    /** Admin által anonimizált szerző */
    isAuthorAnonymized?: boolean;
}

/**
 * Felhasználói reakciók nyilvántartása
 * localStorage-ban tárolódik
 */
export interface UserReactions {
    /** Témákra adott like-ok (topicId -> boolean) */
    topicLikes: Record<string, boolean>;
    /** Témákra adott dislike-ok (topicId -> boolean) */
    topicDislikes: Record<string, boolean>;
    /** Kommentekre adott like-ok (commentId -> boolean) */
    commentLikes: Record<string, boolean>;
    /** Kommentekre adott dislike-ok (commentId -> boolean) */
    commentDislikes: Record<string, boolean>;
}

/**
 * Szűrési beállítások típusa
 */
export interface TopicFilters {
    /** Szöveges keresés */
    searchQuery: string;
    /** Keresés a tartalomban is (nem csak címben) */
    searchInContent: boolean;
    /** Kiválasztott címke (üres = mind) */
    selectedTag: string;
    /** Kiválasztott szakterületek */
    selectedSpecialties: MedicalSpecialty[];
    /** Saját szakterület szűrő aktív-e */
    filterByMySpecialty: boolean;
    /** Rendezés módja */
    sortBy: 'date-newest' | 'date-oldest' | 'title-az' | 'title-za';
}

/**
 * Új téma létrehozásához szükséges adatok
 */
export interface CreateTopicInput {
    title: string;
    description: string;
    tags: string[];
    specialties: MedicalSpecialty[];
    isGeneral: boolean;
    isAnonymous: boolean;
}

/**
 * Új hozzászólás létrehozásához szükséges adatok
 */
export interface CreateCommentInput {
    topicId: string;
    text: string;
    isAnonymous: boolean;
}
