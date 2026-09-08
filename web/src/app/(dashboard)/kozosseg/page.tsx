'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - FÓRUM FŐOLDAL [HASZNÁLATON KÍVÜL]
 * ============================================================================
 * 
 * FIGYELEM: Ez az oldal jelenleg nincs hivatkozva a navigációban.
 * A funkcióját a BENU Képzési Program (/kepzesek) vette át.
 * 
 * ÚTVONAL: /kozosseg
 * 
 * CÉL:
 * Közösségi fórum főoldala, ahol a felhasználók témákat böngészhetnek,
 * szűrhetnek és új témát hozhatnak létre.
 * 
 * USER STORYK:
 * - Mint felhasználó, látni szeretném az összes fórumtémát.
 * - Mint felhasználó, keresni szeretnék témák között cím és tartalom alapján.
 * - Mint felhasználó, szűrni szeretnék szakterület és címke alapján.
 * - Mint felhasználó, új témát szeretnék létrehozni.
 * 
 * LEHETŐSÉGEK AZ OLDALON:
 * - Témák kártya nézetben megjelenítve
 * - Szöveges keresés (cím + opcionálisan tartalom)
 * - Címke dropdown szűrő
 * - Szakterület multi-select szűrő
 * - Rendezési opciók (dátum, ABC)
 * - "Új téma" gomb -> modal megnyitása
 * - Kártyára kattintva navigálás a téma részletekhez
 * 
 * ÜZLETI/MŰKÖDÉSI LOGIKA:
 * - LocalStorage-ból töltődnek a témák
 * - Első betöltéskor mock adatok generálódnak
 * - A szűrés kliens oldalon történik valós időben
 * - "Általános" témák minden szakterületi szűrőnél megjelennek
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    TopicCard,
    TopicFiltersComponent,
    CreateTopicModal,
} from '@/components/forum';
import {
    getTopics,
    filterTopics,
    getAllTags,
    createTopic,
} from '@/lib/forum-service';
import { ForumTopic, TopicFilters, CreateTopicInput, MedicalSpecialty } from '@/types/forum';

// Mock current user (in real app this would come from auth)
const CURRENT_USER = { id: 'user_current', name: 'Dr. Teszt Felhasználó' };

export default function ForumPage() {
    const searchParams = useSearchParams();
    const [topics, setTopics] = useState<ForumTopic[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<TopicFilters>({
        searchQuery: '',
        searchInContent: false,
        selectedTag: '',
        selectedSpecialties: [],
        filterByMySpecialty: false,
        sortBy: 'date-newest',
    });

    // Load topics on mount
    useEffect(() => {
        const loadedTopics = getTopics();
        setTopics(loadedTopics);
        setIsLoading(false);
    }, []);

    // Handle search params for initial filtering
    useEffect(() => {
        const tag = searchParams.get('tag');
        const specialty = searchParams.get('specialty');

        if (tag || specialty) {
            setFilters(prev => ({
                ...prev,
                selectedTag: tag || prev.selectedTag,
                selectedSpecialties: specialty
                    ? [specialty as MedicalSpecialty]
                    : prev.selectedSpecialties
            }));
        }
    }, [searchParams]);

    // Get all available tags
    const availableTags = useMemo(() => getAllTags(topics), [topics]);

    // Filter topics
    const filteredTopics = useMemo(
        () => filterTopics(topics, filters),
        [topics, filters]
    );

    // Handle new topic creation
    const handleCreateTopic = (input: CreateTopicInput) => {
        const newTopic = createTopic(input, CURRENT_USER);
        setTopics([newTopic, ...topics]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="size-[36px] rounded-lg bg-[#002664] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-rounded text-2xl">forum</span>
                        </div>
                        <h1 className="text-[22px] md:text-[24px] font-bold text-[#002664] leading-[33px]">
                            Közösség
                        </h1>
                    </div>
                    <p className="text-[#62788f] text-[15px] mt-1">
                        Szakmai beszélgetések és tapasztalatcsere orvosok között
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className="material-symbols-rounded">add</span>
                    Új téma
                </button>
            </div>

            {/* Filters */}
            <TopicFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                availableTags={availableTags}
            />

            {/* Results count */}
            <div className="mb-4 text-sm text-base-content/70">
                {filteredTopics.length} téma találva
                {filters.searchQuery && ` a "${filters.searchQuery}" keresésre`}
            </div>

            {/* Topics Grid */}
            {filteredTopics.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <span className="material-symbols-rounded text-6xl text-base-content/30">
                            search_off
                        </span>
                        <h3 className="text-lg font-semibold mt-2">Nincs találat</h3>
                        <p className="text-base-content/60">
                            Próbáljon meg más keresési kifejezést vagy szűrőt használni.
                        </p>
                        <button
                            className="btn btn-outline btn-sm mt-4"
                            onClick={() =>
                                setFilters({
                                    searchQuery: '',
                                    searchInContent: false,
                                    selectedTag: '',
                                    selectedSpecialties: [],
                                    filterByMySpecialty: false,
                                    sortBy: 'date-newest',
                                })
                            }
                        >
                            Szűrők törlése
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredTopics.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
            )}

            {/* Create Topic Modal */}
            <CreateTopicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTopic}
            />
        </div>
    );
}
