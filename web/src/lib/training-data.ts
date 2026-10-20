/**
 * ============================================================================
 * FIGYELEM: NEM FEJLESZTÉSI SCOPE RÉSZ / TERVEZET
 * ============================================================================
 * Ez a modul és a kapcsolódó képzési adatok jelenleg NEM képezik a fejlesztési
 * scope részét. Kód- és felületi szinten kizárólag tervezetként / koncepcióként
 * van jelen a prototípusban, éles funkcióként még nem elérhető.
 * ============================================================================
 * 
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - KÉPZÉSI ADATOK (INAKTÍV TERVEZET)
 * ============================================================================
 * 
 * LEÍRÁS:
 * Mock adatok és típusdefiníciók a BENU Képzési Program modulhoz. 
 * Tartalmazza a tanfolyamok adatait, kategóriáit és segédfüggvényeket.
 * 
 * USER STORY:
 * Felhasználóként (orvosként) szeretnék böngészni a számomra elérhető szakmai, 
 * gyártói és akkreditált képzések között.
 */

export type CourseCategory = 'Gyártói' | 'Eladásösztönző' | 'Akkreditált';
export type ContentType = 'video' | 'pdf';

export interface Course {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    durationMinutes: number;
    category: CourseCategory;
    contentType: ContentType;
    thumbnailUrl: string; // Placeholder or real URL
}

export const COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Új generációs SGLT2-gátlók a szívelégtelenség kezelésében',
        shortDescription: 'Átfogó áttekintés az SGLT2-gátlók legújabb klinikai eredményeiről és alkalmazásukról szívelégtelenségben szenvedő betegeknél.',
        longDescription: 'Ez a tanfolyam az SGLT2-gátlók hatásmechanizmusát, a legújabb klinikai vizsgálatok (DAPA-HF, EMPEROR-Reduced) eredményeit és a mindennapi klinikai gyakorlatba történő átültetésüket mutatja be. Különös hangsúlyt fektetünk a mellékhatás-profilra és a beteg-edukációra.',
        durationMinutes: 90,
        category: 'Akkreditált',
        contentType: 'video',
        thumbnailUrl: '',
    },
    {
        id: 'c2',
        title: 'Modern inhalációs terápiák COPD-ben',
        shortDescription: 'Ismerje meg a legújabb eszközöket és hatóanyag-kombinációkat a COPD hatékonyabb kontrollálásához.',
        longDescription: 'A tanfolyam bemutatja az új LAMA/LABA/ICS kombinációkat és az innovatív inhalációs eszközöket. Gyakorlati útmutatót ad az eszközhasználat helyes betanításához és a adherencia növeléséhez.',
        durationMinutes: 60,
        category: 'Gyártói',
        contentType: 'pdf',
        thumbnailUrl: '',
    },
    {
        id: 'c3',
        title: 'Vérnyomás-kontroll fix kombinációkkal',
        shortDescription: 'Miért választják a szakmai irányelvek egyre inkább a fix kombinációkat az induló hipertonia kezelésnél?',
        longDescription: 'A kurzus elemzi a fix dózisú kombinációk (FDC) előnyeit a betegek együttműködése és a célérték elérése szempontjából, összehasonlítva a monoterápiával vagy külön beadott szerekkel.',
        durationMinutes: 45,
        category: 'Eladásösztönző',
        contentType: 'video',
        thumbnailUrl: '',
    },
    {
        id: 'c4',
        title: 'Biológiai terápiák a bőrgyógyászatban: Psoriasis fókusz',
        shortDescription: 'Az IL-17 és IL-23 gátlók helye a terápiás algoritmusban a középsúlyos és súlyos psoriasis kezelése során.',
        longDescription: 'Mélyedjen el a legújabb biológiai terápiák világában. Áttekintjük a hatékonysági adatokat, a biztonságossági profilt és a finanszírozási protokollt.',
        durationMinutes: 120,
        category: 'Akkreditált',
        contentType: 'video',
        thumbnailUrl: '',
    },
    {
        id: 'c5',
        title: 'Antibiotikum stewardship a háziorvosi gyakorlatban',
        shortDescription: 'Hogyan csökkenthető a szükségtelen antibiotikum-felírás anélkül, hogy veszélyeztetnénk a betegbiztonságot?',
        longDescription: 'Gyakorlati szempontok az akut légúti fertőzések differenciáldiagnosztikájához és a "megfigyelés és várakozás" stratégia alkalmazásához.',
        durationMinutes: 75,
        category: 'Akkreditált',
        contentType: 'pdf',
        thumbnailUrl: '',
    },
    {
        id: 'c6',
        title: 'Új irányok a 2-es típusú diabétesz kezelésében - GLP-1 RA',
        shortDescription: 'A GLP-1 receptor agonisták kardioviszkuláris és súlycsökkentő előnyeinek maximalizálása.',
        longDescription: 'A tanfolyam részletesen bemutatja a GLP-1 analógok szerepét a testsúlycsökkentésben és a kardiovaszkuláris védelemben, kitekintéssel a legújabb heti egyszeri adagolású készítményekre.',
        durationMinutes: 90,
        category: 'Gyártói',
        contentType: 'video',
        thumbnailUrl: '',
    }
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
