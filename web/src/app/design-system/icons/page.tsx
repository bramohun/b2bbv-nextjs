'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * LEÍRÁS:
 * Ikon regiszter a projektben használt Google Material Symbols ikonokhoz.
 * Segít a következetes ikonhasználatban és dokumentációban.
 * 
 * USER STORY:
 * Fejlesztőként szeretném látni a projektben használt összes ikont, azok célját
 * és elhelyezkedését, hogy elkerüljem a duplikációkat és inkonzisztenciákat.
 */

const projectIcons = [
    { name: 'dashboard', purpose: 'Irányítópult főoldal navigáció', context: 'Navbar, Dashboard fejléc' },
    { name: 'medication', purpose: 'Gyógyszerkereső és gyógyszerlisták', context: 'Navbar, Gyógyszer kártyák' },
    { name: 'local_pharmacy', purpose: 'Gyógyszertár kereső és listák', context: 'Navbar, Patika widget' },
    { name: 'school', purpose: 'BENU Képzési Program (korábban Közösség helyén)', context: 'Navbar, Dashboard, Képzési felületek' },
    { name: 'groups', purpose: 'Közösség modul (használaton kívül)', context: 'Navbar (régi)' },
    { name: 'bookmarks', purpose: 'Mentett gyógyszerek gyorselérése', context: 'Navbar dropdown' },
    { name: 'bookmark_add', purpose: 'Gyógyszer mentése a listához', context: 'Gyógyszer kártya, Adatlap' },
    { name: 'bookmark_added', purpose: 'Már mentett gyógyszer jelölése', context: 'Gyógyszer kártya, Adatlap' },
    { name: 'star', purpose: 'Általános kedvenc jelölése (kivezetés alatt)', context: 'Régi komponensek' },
    { name: 'location_on', purpose: 'Helymeghatározás, közeli patika', context: 'Navbar patika sáv' },
    { name: 'search', purpose: 'Globális és lokális keresés', context: 'Search inputok' },
    { name: 'play_circle', purpose: 'Videó tartalom jelölés', context: 'Képzési kártyák, Tanfolyam adatlap' },
    { name: 'timer', purpose: 'Időtartam jelölése', context: 'Képzési kártyák, Tanfolyam adatlap' },
    { name: 'picture_as_pdf', purpose: 'PDF formátumú tananyag jelölése', context: 'Képzési kártyák' },
    { name: 'open_in_new', purpose: 'Külső hivatkozás (LMS rendszer)', context: 'Képzési felületek popup' },
    { name: 'arrow_back', purpose: 'Visszanavigálás', context: 'Adatlap fejléc' },
    { name: 'logout', purpose: 'Kijelentkezés', context: 'User profil dropdown' },
    { name: 'account_circle', purpose: 'Profil kezelés', context: 'User profil dropdown' },
];

export default function IconSystemPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Ikon Regisztráció</h1>
            <p className="text-base-content/70 mb-8">Google Material Symbols Rounded használata a projektben</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectIcons.map((icon) => (
                    <div key={icon.name} className="card bg-base-100 shadow border border-base-200">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="material-symbols-rounded text-4xl text-primary">{icon.name}</span>
                                <code className="bg-base-200 px-2 py-1 rounded text-sm text-primary font-bold">
                                    {icon.name}
                                </code>
                            </div>
                            <h3 className="font-bold text-lg">{icon.purpose}</h3>
                            <p className="text-sm opacity-70">
                                <strong>Hol használjuk:</strong> {icon.context}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
