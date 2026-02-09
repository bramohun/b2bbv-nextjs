'use client';

/**
 * ============================================================================
 * ÚJ TÉMA LÉTREHOZÁSA MODAL
 * ============================================================================
 * 
 * Modal ablak új fórumtéma létrehozásához.
 * Mezők: cím, leírás, címkék, szakterületek, anonim opció.
 */

import { useState } from 'react';
import { CreateTopicInput, MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/forum';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: CreateTopicInput) => void;
}

export function CreateTopicModal({ isOpen, onClose, onSubmit }: CreateTopicModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<MedicalSpecialty[]>([]);
    const [isGeneral, setIsGeneral] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { title?: string; description?: string } = {};
        if (!title.trim()) newErrors.title = 'A cím megadása kötelező';
        if (!description.trim()) newErrors.description = 'A leírás megadása kötelező';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Parse tags
        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            tags,
            specialties: isGeneral ? [] : selectedSpecialties,
            isGeneral,
            isAnonymous,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setTagsInput('');
        setSelectedSpecialties([]);
        setIsGeneral(false);
        setIsAnonymous(false);
        setErrors({});
        onClose();
    };

    const toggleSpecialty = (specialty: MedicalSpecialty) => {
        setSelectedSpecialties((prev) =>
            prev.includes(specialty)
                ? prev.filter((s) => s !== specialty)
                : [...prev, specialty]
        );
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg mb-4">Új téma létrehozása</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Cím <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="Adja meg a téma címét..."
                            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.title}</span>
                            </label>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Leírás <span className="text-error">*</span>
                            </span>
                        </label>
                        <textarea
                            placeholder="Írja le részletesen a témát..."
                            className={`textarea textarea-bordered h-32 w-full ${errors.description ? 'textarea-error' : ''}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.description}</span>
                            </label>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Címkék</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Címkék vesszővel elválasztva (pl. Kardiológia, Készlethiány)"
                            className="input input-bordered w-full"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                        <label className="label">
                            <span className="label-text-alt">Vesszővel válassza el a címkéket</span>
                        </label>
                    </div>

                    {/* Specialties */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Szakterületek{' '}
                                <span className="text-base-content/60 font-normal">(opcionális)</span>
                            </span>
                        </label>
                        <div className="bg-base-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                                {MEDICAL_SPECIALTIES.map((spec) => (
                                    <label
                                        key={spec}
                                        className={`label cursor-pointer justify-start gap-2 py-1 ${isGeneral ? 'opacity-50' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={selectedSpecialties.includes(spec)}
                                            onChange={() => toggleSpecialty(spec)}
                                            disabled={isGeneral}
                                        />
                                        <span className="label-text text-sm">{spec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <label className="label cursor-pointer justify-start gap-2 mt-2 bg-accent/10 rounded-lg px-3 py-2">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-accent"
                                checked={isGeneral}
                                onChange={(e) => setIsGeneral(e.target.checked)}
                            />
                            <span className="label-text">
                                <strong>Általános</strong> (minden szakterületet érint)
                            </span>
                        </label>
                    </div>

                    {/* Anonymous */}
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <span className="label-text">Anonim hozzászólás</span>
                        </label>
                        <label className="label">
                            <span className="label-text-alt">
                                Ha bejelöli, a neve nem jelenik meg a témánál
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Mégse
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <span className="material-symbols-rounded">add</span>
                            Téma létrehozása
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
