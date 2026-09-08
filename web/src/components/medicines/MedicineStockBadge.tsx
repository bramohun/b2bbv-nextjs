/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZER KÉSZLET STÁTUSZ JELVÉNY (BADGE)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez a komponens jeleníti meg a gyógyszerek és patikák készletelérhetőségi
 * állapotát jelző hivatalos arculati jelvényeket (badge) a Figma tervek
 * (BENU-Ui #13376:10063, #13376:4482, #13376:9909, #13376:4494, #13377:4483, #13376:9971)
 * pontos méretei, ikonarányai és vektoros formái alapján.
 * 
 * NÉGY ALAPVETŐ KÉSZLETSTÁTUSZ ÉS IKONOK:
 * 1. Készleten: Halványzöld háttér (#E8F8E2), sötétzöld (#317907) szöveg és
 *    16x16 zöld körben fehér pipa ikon.
 * 2. Korlátozottan: Melegsárga háttér (#FFF5B8), olíva/arany (#7A6C21) szöveg és
 *    16x16 olíva/arany körben fehér pipa ikon.
 * 3. Rendelésre: Halványsárga háttér (#FFF7C7), olíva/arany (#7A6C21) szöveg és
 *    16x16 finom vonalas homokóra ikon lepergő homokszemmel.
 * 4. Nem elérhető: Világosszürke háttér (#F2F4F7), palaszürke (#62788F) szöveg és
 *    16x16 palaszürke körben fehér mínusz ikon.
 * 
 * PONTOS ARÁNYOK ÉS MÉRETEK (Figma specifikáció):
 * - Badge magasság: 24px (h-[24px])
 * - Lekerekítés: 4px (rounded-[4px])
 * - Párnázás: px-[8px] py-[3px] gap-[8px]
 * - Ikon méret: pontosan 16x16px (size-[16px])
 * - Tipográfia: 14px, 500-as súly (font-medium text-[14px])
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként és gyógyszerészként egyetlen pillantással szeretném látni a készítmény
 *   pontos patikai és nagykereskedelmi elérhetőségét.
 * - Felhasználóként a Figma dizájnnal 100%-ban megegyező, esztétikus és arányos
 *   státuszjelvényeket szeretnék látni a felületen.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Gyógyszer Adatlap (/gyogyszerek/adatlap): BENU Gyógyszertárak és Közeli Gyógyszertár készletsorok
 * - Gyógyszer Kereső és Lista (/gyogyszerek)
 * - Helyettesítő Gyógyszerek Táblázata (SimilarMedicines)
 * ============================================================================
 */

import React from 'react';

export type MedicineStockStatusType = 'keszleten' | 'korlatozottan' | 'rendelesre' | 'nem-elerheto';

interface MedicineStockBadgeProps {
    status: MedicineStockStatusType | string;
    className?: string;
    showIcon?: boolean;
}

export const MedicineStockBadge: React.FC<MedicineStockBadgeProps> = ({
    status,
    className = '',
    showIcon = true
}) => {
    const normalized = (status || '').toLowerCase().trim();

    // 1. Készleten: Zöld teli kör (16x16), finom fehér pipa
    if (normalized === 'keszleten' || normalized === 'készleten') {
        return (
            <span
                className={`inline-flex items-center gap-[8px] h-[24px] px-[8px] py-[3px] rounded-[4px] bg-[#e8f8e2] text-[#317907] font-medium text-[14px] leading-none whitespace-nowrap select-none ${className}`}
            >
                {showIcon && (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-[16px] shrink-0"
                    >
                        <circle cx="8" cy="8" r="6.66667" fill="#317907" />
                        <path
                            d="M5.33334 8.00008L7.11112 9.77786L10.6667 6.22229"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                <span>Készleten</span>
            </span>
        );
    }

    // 2. Korlátozottan: Melegsárga / olíva teli kör (16x16), finom fehér pipa
    if (normalized === 'korlatozottan' || normalized === 'korlátozottan') {
        return (
            <span
                className={`inline-flex items-center gap-[8px] h-[24px] px-[8px] py-[3px] rounded-[4px] bg-[#fff5b8] text-[#7a6c21] font-medium text-[14px] leading-none whitespace-nowrap select-none ${className}`}
            >
                {showIcon && (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-[16px] shrink-0"
                    >
                        <circle cx="8" cy="8" r="6.66667" fill="#7a6c21" />
                        <path
                            d="M5.33334 8.00008L7.11112 9.77786L10.6667 6.22229"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                <span>Korlátozottan</span>
            </span>
        );
    }

    // 3. Rendelésre: Figma homokóra ikon (16x16) (#7a6c21)
    if (normalized === 'rendelesre' || normalized === 'rendelésre') {
        return (
            <span
                className={`inline-flex items-center gap-[8px] h-[24px] px-[8px] py-[3px] rounded-[4px] bg-[#fff7c7] text-[#7a6c21] font-medium text-[14px] leading-none whitespace-nowrap select-none ${className}`}
            >
                {showIcon && (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-[16px] shrink-0"
                    >
                        <path
                            d="M3 2.5H13M3 13.5H13M3.7 2.7C3.7 2.7 4 6.8 7.3 7.8C7.6 7.9 7.8 8 8 8C8.2 8 8.4 7.9 8.7 7.8C12 6.8 12.3 2.7 12.3 2.7M3.7 13.3C3.7 13.3 4 9.2 7.3 8.2C7.6 8.1 7.8 8 8 8C8.2 8 8.4 8.1 8.7 8.2C12 9.2 12.3 13.3 12.3 13.3"
                            stroke="#7a6c21"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <line
                            x1="8"
                            y1="5.2"
                            x2="8"
                            y2="7.2"
                            stroke="#7a6c21"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="8"
                            cy="11.2"
                            r="0.75"
                            fill="#7a6c21"
                        />
                    </svg>
                )}
                <span>Rendelésre</span>
            </span>
        );
    }

    // 4. Nem elérhető: Palaszürke teli kör (16x16), fehér vízszintes mínusz vonal
    return (
        <span
            className={`inline-flex items-center gap-[8px] h-[24px] px-[8px] py-[3px] rounded-[4px] bg-[#f2f4f7] text-[#62788f] font-medium text-[14px] leading-none whitespace-nowrap select-none ${className}`}
        >
            {showIcon && (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-[16px] shrink-0"
                >
                    <circle cx="8" cy="8" r="6.66667" fill="#62788f" />
                    <line
                        x1="5.33334"
                        y1="8"
                        x2="10.6667"
                        y2="8"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            )}
            <span>Nem elérhető</span>
        </span>
    );
};
