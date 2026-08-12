'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - LÁBLÉC (FOOTER)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A BENUvény Orvosi Portál központi lábléce (Footer), amely minden bejelentkezett
 * és nyilvános felület alján megjelenik. Biztosítja az alkalmazás aktuális verziószámának
 * kijelzését, a fő modulok navigációját, valamint a jogi nyilatkozatokat.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként szeretném a láblécben gyorsan ellenőrizni a weboldal aktuális verziószámát.
 * - Felhasználóként szeretnék gyors hivatkozásokat kapni a portál főbb moduljaihoz.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Globális elrendezés (DashboardLayout, RootLayout)
 * - WikiSpec Funkcionális Specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md)
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';

export const APP_VERSION = '6.1.0';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-100 border-t border-base-300 text-base-content mt-auto py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Oszlop: Rendszer azonosító & Verzió info */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-primary text-2xl">local_pharmacy</span>
            <span className="font-bold text-lg text-primary tracking-tight">BENUvény Orvosi Portál</span>
          </div>
          <p className="text-xs text-base-content/70 leading-relaxed max-w-md">
            Orvosi és Gyógyszerészeti Készlet- és Információs Portál. Professzionális támogatás egészségügyi szakemberek számára.
          </p>
          
          {/* Egyszerű Verzió Kijelző Badge */}
          <div className="flex items-center gap-2 pt-1">
            <span className="badge badge-sm badge-outline badge-primary font-mono text-xs gap-1.5 py-2 px-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              v{APP_VERSION}
            </span>
          </div>
        </div>

        {/* 2. Oszlop: Gyors hivatkozások */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">Modulok</h4>
          <ul className="space-y-1.5 text-xs font-medium">
            <li>
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[14px]">dashboard</span> Irányítópult
              </Link>
            </li>
            <li>
              <Link href="/gyogyszerek" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[14px]">medication</span> Gyógyszerkereső
              </Link>
            </li>
            <li>
              <Link href="/gyogyszertarak" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[14px]">store</span> Gyógyszertárak
              </Link>
            </li>
            <li>
              <Link href="/kepzesek" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[14px]">school</span> BENU Képzés
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Alsó sáv */}
      <div className="max-w-7xl mx-auto border-t border-base-200 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-2">
        <div>
          © 2026 BENUvény Orvosi Portál. Minden jog fenntartva.
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-base-content/50">
          <span>Verzió: v{APP_VERSION}</span>
        </div>
      </div>
    </footer>
  );
};

