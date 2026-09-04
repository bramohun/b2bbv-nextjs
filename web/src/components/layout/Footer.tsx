'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GLOBÁLIS LÁBLÉC (FOOTER)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A BENUvény Orvosi Portál egységes alsó sávja (Footer), amely a Figma tervek
 * szerinti sötétkék (#002664) háttérrel jelenik meg minden oldalon. Megjeleníti
 * a szerzői jogi nyilatkozatot és a hivatalos készítői megjelölést.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném a lap alján látni a hivatalos jogi információkat
 *   és a rendszer készítői védjegyét.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Globális layout (DashboardLayout, AuthLayout)
 * - Funkcionális specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md: 4.0.2)
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';

export const APP_VERSION = '6.1.0';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#002664] text-white mt-auto py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px]">
      <div className="flex items-center gap-3">
        <p className="leading-[21px] text-white/90">
          Minden jog fenntartva. © 2026 BENU Magyarország Zrt
        </p>
        <span className="text-white/40 text-xs font-mono">v{APP_VERSION}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-white/80 text-sm">Created by:</span>
        <div className="h-[28px] w-[40px] relative shrink-0">
          <Image
            src="/assets/figma/color-and-code-logo.svg"
            alt="Color and Code"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
};
