'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - KÉSZLETVÁLTOZÁSOK TÁBLÁZAT WIDGET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Az Irányítópult (Dashboard) bal oldali fő táblázat komponense, amely a legutóbbi
 * 20 készletváltozást jeleníti meg a Figma tervek szerinti kártyában (fehér háttér,
 * 16px lekerekítés, 38px enyhe árnyék, szürke oszlopfejléc, színkódolt státuszjelvények).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként időrendben szeretném látni a legfrissebb gyógyszerkészlet-változásokat
 *   (újra elérhető, készlethiány, megszűnt), és egy kattintással elérni a gyógyszer adatlapját.
 * - Felhasználóként az "Összes változás" gombra kattintva át szeretnék navigálni a teljes
 *   gyógyszerlistára a legutóbb frissültek szerint rendezve.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Irányítópult (/dashboard)
 * - Gyógyszer adatlap (/gyogyszerek/adatlap?tk=...)
 * - Gyógyszerek teljes listaoldala (/gyogyszerek?sort=lastUpdate&order=desc)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.1.3)
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Medicine } from '@/types';
import { formatDate } from '@/lib/utils';

interface StockChangesWidgetProps {
    changes: Medicine[];
    title?: string;
    subtitle?: string;
    showViewAllButton?: boolean;
    viewAllUrl?: string;
}

export function StockChangesWidget({
    changes,
    title = 'Legutóbbi 20 készletváltozás',
    subtitle = 'Élő készletinformációk és beérkező termékek állapota',
    showViewAllButton = true,
    viewAllUrl = '/gyogyszerek?sort=lastUpdate&order=desc'
}: StockChangesWidgetProps) {
    const renderStatusBadge = (status: string) => {
        if (status === 'Elérhető') {
            return (
                <div className="bg-[#E8F8E2] text-[#317907] border border-[#C4EDB6] rounded-[4px] px-[8px] py-[3px] flex items-center gap-[6px] shrink-0">
                    <div className="size-[16px] relative shrink-0">
                        <Image
                            src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg"
                            alt="Elérhető"
                            width={16}
                            height={16}
                        />
                    </div>
                    <span className="text-[13px] font-medium leading-none">Elérhető</span>
                </div>
            );
        }
        if (status === 'Készlethiány' || status === 'Hiány') {
            return (
                <div className="bg-[#FFF7BA] text-[#7A6C21] border border-[#F5E68C] rounded-[4px] px-[8px] py-[3px] flex items-center gap-[6px] shrink-0">
                    <div className="size-[16px] relative shrink-0">
                        <Image
                            src="/assets/figma/95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg"
                            alt="Hiány"
                            width={16}
                            height={16}
                        />
                    </div>
                    <span className="text-[13px] font-medium leading-none">Hiány</span>
                </div>
            );
        }
        return (
            <div className="bg-[#FEEAED] text-[#B1174E] border border-[#FBCED6] rounded-[4px] px-[8px] py-[3px] flex items-center gap-[6px] shrink-0">
                <div className="size-[16px] relative shrink-0">
                    <Image
                        src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg"
                        alt="Megszűnt"
                        width={16}
                        height={16}
                    />
                </div>
                <span className="text-[13px] font-medium leading-none">Megszűnt</span>
            </div>
        );
    };

    return (
        <div className="bg-white border border-[#E7E8EC] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] overflow-hidden w-full flex flex-col">
            {/* Fejléc */}
            <div className="pt-[24px] pb-[16px] px-[24px] flex flex-col gap-[4px]">
                <h2 className="text-[20px] md:text-[22px] font-bold text-[#002664] leading-tight">
                    {title}
                </h2>
                <p className="text-[13px] md:text-[14px] text-[#62788f]">
                    {subtitle}
                </p>
            </div>

            <div className="h-px bg-[#E7E8EC] w-full" />

            {/* Táblázat Oszlopfejlécek */}
            <div className="bg-[#F9F9FB] px-[24px] py-[12px] flex items-center gap-[16px] text-[#3A5876] text-[12px] md:text-[13px] font-bold uppercase tracking-wider border-b border-[#E7E8EC]">
                <span className="w-[104px] shrink-0">Státusz</span>
                <span className="flex-1 min-w-0">Termék neve</span>
                <span className="w-[140px] shrink-0 text-right">Dátum</span>
            </div>

            {/* Sorok listája */}
            <div className="divide-y divide-[#E7E8EC] flex-1">
                {changes.length > 0 ? (
                    changes.slice(0, 20).map((med) => (
                        <div
                            key={med.internalId || med.tkSzam}
                            className="px-[24px] py-[14px] flex items-center gap-[16px] hover:bg-[#F9F9FB] transition-colors group"
                        >
                            {/* Státusz oszlop */}
                            <div className="w-[104px] shrink-0 flex items-center">
                                {renderStatusBadge(med.status)}
                            </div>

                            {/* Terméknév oszlop */}
                            <div className="flex-1 min-w-0 pr-2">
                                <Link
                                    href={`/gyogyszerek/adatlap?tk=${encodeURIComponent(med.tkSzam)}`}
                                    className="text-[15px] md:text-[16px] font-medium text-[#002664] hover:text-[#378509] hover:underline block truncate"
                                    title={med.nev}
                                >
                                    {med.nev}
                                </Link>
                            </div>

                            {/* Dátum oszlop */}
                            <div className="w-[140px] shrink-0 text-right text-[13px] md:text-[14px] text-[#62788f] whitespace-nowrap">
                                {formatDate(med.lastUpdate)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-sm text-[#62788f]">
                        Nincs megjeleníthető készletváltozás az adott időszakban.
                    </div>
                )}
            </div>

            {/* Lábléc gomb */}
            {showViewAllButton && (
                <div className="pt-[16px] pb-[24px] px-[24px] border-t border-[#E7E8EC] mt-auto">
                    <Link
                        href={viewAllUrl}
                        className="inline-flex items-center gap-[8px] text-[#002664] hover:text-[#378509] text-[14px] font-bold transition-colors"
                    >
                        <span>Összes változás</span>
                        <div className="size-[20px] relative">
                            <Image
                                src="/assets/figma/6facf09639ce8f21ae7716fe32dc70d4159927dc.svg"
                                alt="Nyíl"
                                width={20}
                                height={20}
                            />
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
