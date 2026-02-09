'use client';

/**
 * ============================================================================
 * TÉMA SZŰRŐ KOMPONENS
 * ============================================================================
 * 
 * Keresés, címke szűrés, szakterület szűrés és rendezés.
 */

import { useState, useEffect } from 'react';
import { TopicFilters, MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';

interface TopicFiltersProps {
    filters: TopicFilters;
    onFiltersChange: (filters: TopicFilters) => void;
    availableTags: string[];
}

export function TopicFiltersComponent({
    filters,
    onFiltersChange,
    availableTags,
}: TopicFiltersProps) {
    const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
    const [specialtySearch, setSpecialtySearch] = useState('');

    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, searchQuery: value });
    };

    const handleSearchInContentChange = (checked: boolean) => {
        onFiltersChange({ ...filters, searchInContent: checked });
    };

    const handleTagChange = (value: string) => {
        onFiltersChange({ ...filters, selectedTag: value });
    };

    const handleSortChange = (value: TopicFilters['sortBy']) => {
        onFiltersChange({ ...filters, sortBy: value });
    };

    const toggleSpecialty = (specialty: MedicalSpecialty) => {
        const current = filters.selectedSpecialties;
        const updated = current.includes(specialty)
            ? current.filter((s) => s !== specialty)
            : [...current, specialty];
        onFiltersChange({ ...filters, selectedSpecialties: updated });
    };

    const getSpecialtyLabel = () => {
        const count = filters.selectedSpecialties.length;
        if (count === 0) return 'Összes szakterület';
        if (count === 1) return filters.selectedSpecialties[0];
        return `${count} szakterület`;
    };

    return (
        <div className="card bg-base-100 shadow mb-6 overflow-visible">
            <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <div className="form-control md:col-span-2">
                        <label className="label">
                            <span className="label-text">Keresés</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Keresés témák között..."
                            className="input input-bordered w-full"
                            value={filters.searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <label className="label cursor-pointer justify-start gap-2 mt-2">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={filters.searchInContent}
                                onChange={(e) => handleSearchInContentChange(e.target.checked)}
                            />
                            <span className="label-text">Keresés a leírásban is</span>
                        </label>
                    </div>

                    {/* Tag Filter */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Címke</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.selectedTag}
                            onChange={(e) => handleTagChange(e.target.value)}
                        >
                            <option value="">Összes címke</option>
                            {availableTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Rendezés</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.sortBy}
                            onChange={(e) => handleSortChange(e.target.value as TopicFilters['sortBy'])}
                        >
                            <option value="date-newest">Dátum (legújabb)</option>
                            <option value="date-oldest">Dátum (legrégebbi)</option>
                            <option value="title-az">Cím (A-Z)</option>
                            <option value="title-za">Cím (Z-A)</option>
                        </select>
                    </div>

                    {/* Specialty Filter */}
                    <div className="form-control md:col-span-2 lg:col-span-4">
                        <label className="label">
                            <span className="label-text">Szakterület szűrő</span>
                        </label>
                        <div className="relative w-full">
                            <button
                                type="button"
                                className="btn btn-bordered w-full justify-between normal-case font-normal bg-base-100 border-base-300 relative z-30"
                                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                            >
                                <span>{getSpecialtyLabel()}</span>
                                <span className="material-symbols-rounded">expand_more</span>
                            </button>
                            {isSpecialtyDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20 cursor-default"
                                        onClick={() => setIsSpecialtyDropdownOpen(false)}
                                        aria-hidden="true"
                                    ></div>
                                    <div
                                        className="absolute top-full left-0 z-30 card card-compact bg-base-100 w-full shadow-lg border border-base-300 mt-1"
                                    >
                                        <div className="p-2 border-b border-base-200">
                                            <input
                                                type="text"
                                                placeholder="Szakterület keresése..."
                                                className="input input-sm input-bordered w-full"
                                                value={specialtySearch}
                                                onChange={(e) => setSpecialtySearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="card-body max-h-64 overflow-y-auto p-2">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                                {[...MEDICAL_SPECIALTIES]
                                                    .sort((a, b) => a.localeCompare(b, 'hu'))
                                                    .filter(spec => spec.toLowerCase().includes(specialtySearch.toLowerCase()))
                                                    .map((spec) => (
                                                        <label
                                                            key={spec}
                                                            className="label cursor-pointer justify-start gap-2 p-2 hover:bg-base-200 rounded"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox checkbox-sm checkbox-primary"
                                                                checked={filters.selectedSpecialties.includes(spec)}
                                                                onChange={() => toggleSpecialty(spec)}
                                                            />
                                                            <span className="label-text text-sm">{spec}</span>
                                                        </label>
                                                    ))}
                                            </div>
                                            {[...MEDICAL_SPECIALTIES].filter(spec => spec.toLowerCase().includes(specialtySearch.toLowerCase())).length === 0 && (
                                                <div className="text-center text-sm text-base-content/60 py-2">
                                                    Nincs találat
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {filters.selectedSpecialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filters.selectedSpecialties.map((spec) => (
                                    <span
                                        key={spec}
                                        className="badge badge-primary gap-1 cursor-pointer"
                                        onClick={() => toggleSpecialty(spec)}
                                    >
                                        {spec}
                                        <span className="material-symbols-rounded text-xs">close</span>
                                    </span>
                                ))}
                                <button
                                    className="btn btn-xs btn-ghost"
                                    onClick={() => onFiltersChange({ ...filters, selectedSpecialties: [] })}
                                >
                                    Összes törlése
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
