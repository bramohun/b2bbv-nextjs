'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - IDŐSZAK VÁLASZTÓ (PeriodSelector)
 * ============================================================================
 * 
 * HASZNÁLAT ÉS CÉL:
 * Az Irányítópulton megjelenített készletváltozási statisztikák és listák
 * időintervallumának kiválasztására szolgál a Figma dizájn szerinti lekerekített
 * kapszula (pill) lenyíló gomb formájában (1 nap, 3 nap, 7 nap, 30 nap).
 * 
 * USER STORYK:
 * - Felhasználóként szeretném a fejlécből egy legördülő menüvel kiválasztani
 *   a vizsgált időszakot (pl. "Elmúlt 3 nap"), hogy a statisztikák ehhez igazodjanak.
 * 
 * KAPCSOLÓDÓ FELÜLETEK:
 * - Irányítópult (/dashboard)
 * - StockChangesWidget, PharmacyStockWidget
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.1.1)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export function PeriodSelector({ period }: { period: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: 1, label: 'Elmúlt 1 nap' },
        { value: 3, label: 'Elmúlt 3 nap' },
        { value: 7, label: 'Elmúlt 7 nap' },
        { value: 30, label: 'Elmúlt 30 nap' }
    ];

    const currentOption = options.find(o => o.value === period) || options[1]; // default 3 days if matching

    const handleSelect = (newPeriod: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('period', String(newPeriod));
        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    // Click outside listener (modal-and-dropdowns rule)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border border-[#d8d9e0] hover:border-[#002664] rounded-[24px] h-[38px] px-[20px] flex items-center gap-[10px] shadow-sm transition-colors"
                aria-label="Időszak választása"
            >
                <span className="text-[#002664] text-[15px] font-medium whitespace-nowrap">
                    {currentOption.label}
                </span>
                <div className="size-[16px] relative text-[#002664]">
                    <Image
                        src="/assets/figma/bbb8b289e0529c918f53d375fc26f245b777bd09.svg"
                        alt="Lenyitás"
                        width={16}
                        height={16}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[180px] bg-white border border-[#d8d9e0] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.12)] p-2 z-50">
                    <div className="flex flex-col gap-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    period === opt.value
                                        ? 'bg-[#002664] text-white font-bold'
                                        : 'text-[#002664] hover:bg-[#F9F9FB]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
