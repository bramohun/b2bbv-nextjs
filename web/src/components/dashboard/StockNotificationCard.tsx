'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - KÉSZLETVÁLTOZÁS ÖSSZESÍTŐ KÁRTYA
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Az Irányítópulton kiemelt krémsárga (#FFFCE9) összesítő kártya, amely a kiválasztott
 * időszakra vonatkozó globális készletmozgások (vagy egy adott patika készletmozgásai)
 * darabszámát és státusz szerinti megoszlását mutatja a Figma tervek szerint.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként egyetlen pillantással szeretném látni a piac összesített változásait,
 *   és a címkékre kattintva a gyógyszerlistára szűrni.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Irányítópult (/dashboard)
 * - Gyógyszerek szűrt listaoldala (/gyogyszerek?status=...)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.1.2)
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';

interface StockNotificationCardProps {
    type?: 'global' | 'pharmacy';
    title?: string;
    period: number;
    total: number;
    megszunt: number;
    hiany: number;
    elerheto: number;
    onModifyPharmacy?: () => void;
    onClearPharmacy?: () => void;
}

export const StockNotificationCard: React.FC<StockNotificationCardProps> = ({
    type = 'global',
    title = 'Globális készletváltozás',
    period,
    total,
    megszunt,
    hiany,
    elerheto,
    onModifyPharmacy,
    onClearPharmacy
}) => {
    const isPharmacy = type === 'pharmacy';

    return (
        <div className="bg-[#FFFCE9] rounded-[12px] p-[24px] flex flex-col items-center justify-center gap-[16px] w-full text-center border border-[#F5EFC2]">
            {/* Cím és időszak */}
            <div className="flex flex-col items-center leading-[21px] text-[#62788f] text-[14px]">
                <p className="font-bold text-[#002664] text-[16px]">
                    {title}
                </p>
                <p className="font-medium text-[#62788f]">
                    elmúlt {period} nap változása
                </p>
                {isPharmacy && (onModifyPharmacy || onClearPharmacy) && (
                    <div className="flex items-center gap-3 pt-1.5 text-xs">
                        {onModifyPharmacy && (
                            <button
                                type="button"
                                onClick={onModifyPharmacy}
                                className="text-[#002664] hover:text-[#378509] font-medium underline cursor-pointer transition-colors"
                            >
                                Másik patika választása
                            </button>
                        )}
                        {onModifyPharmacy && onClearPharmacy && (
                            <span className="text-[#c4c7d0]">•</span>
                        )}
                        {onClearPharmacy && (
                            <button
                                type="button"
                                onClick={onClearPharmacy}
                                className="text-[#b1174e] hover:underline font-medium cursor-pointer transition-colors"
                            >
                                Kijelölés törlése
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Nagy darabszám számláló */}
            <div className="flex items-center justify-center">
                <p className="font-bold text-[40px] text-[#002664] leading-[48px]">
                    {total} db
                </p>
            </div>

            {/* Státusz bontás címkék */}
            <div className="flex flex-wrap items-center justify-center gap-[16px] pt-1">
                {/* Megszűnt / Elfogyott */}
                <div className="flex items-center gap-[8px]">
                    <div className="size-[32px] rounded-full bg-[#FEEAED] flex items-center justify-center shrink-0">
                        <Image
                            src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg"
                            alt="Megszűnt"
                            width={16}
                            height={16}
                        />
                    </div>
                    <span className="font-bold text-[14px] md:text-[15px] text-[#002664] whitespace-nowrap">
                        {megszunt} db {isPharmacy ? 'elfogyott' : 'megszűnt'}
                    </span>
                </div>

                {/* Készlethiány (ha nem csak patikai hiány) */}
                {!isPharmacy && (
                    <div className="flex items-center gap-[8px]">
                        <div className="size-[32px] rounded-full bg-[#FFF7BA] flex items-center justify-center shrink-0">
                            <Image
                                src="/assets/figma/95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg"
                                alt="Készlethiány"
                                width={16}
                                height={16}
                            />
                        </div>
                        <span className="font-bold text-[14px] md:text-[15px] text-[#002664] whitespace-nowrap">
                            {hiany} db készlethiány
                        </span>
                    </div>
                )}

                {/* Újra elérhető */}
                <div className="flex items-center gap-[8px]">
                    <div className="size-[32px] rounded-full bg-[#E8F8E2] flex items-center justify-center shrink-0">
                        <Image
                            src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg"
                            alt="Elérhető"
                            width={16}
                            height={16}
                        />
                    </div>
                    <span className="font-bold text-[14px] md:text-[15px] text-[#002664] whitespace-nowrap">
                        {elerheto} db újra elérhető
                    </span>
                </div>
            </div>
        </div>
    );
};

