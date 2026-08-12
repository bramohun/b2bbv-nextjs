'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - LÁBLÉC (FOOTER)
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A weboldal központi lábléce (Footer), amely minden bejelentkezett és nyilvános
 * felület alján megjelenik. Biztosítja az alkalmazás és a Funkcionális Specifikáció
 * (FSR) verziójának konzekvens, transzparens kijelzését, a rendszerinformációk
 * elérését, valamint az alapvető navigációs és jogi nyilatkozatokat.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Felhasználóként és tesztelőként szeretném a láblécben egyértelműen látni a weboldal
 *   aktuális verziószámát és a hozzá tartozó funkcionális specifikáció (FSR) verzióját,
 *   hogy azonosítani tudjam a specifikációhoz képest meglévő funkcionális lefedettséget.
 * - Felhasználóként szeretnék gyors hivatkozásokat kapni a főbb modulokhoz és a 
 *   funkcionális specifikáció részleteihez.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Globális elrendezés (DashboardLayout, RootLayout)
 * - WikiSpec Funkcionális Specifikáció (FUNCTIONAL_SPECS_WIKISPEC.md)
 * - Verzió Információs Modal (Controlled React state modal explicit backdrop-pal)
 * ============================================================================
 */

import React, { useState } from 'react';
import Link from 'next/link';

export const APP_VERSION = '6.1.0';
export const SPEC_VERSION = '6.1';
export const SPEC_STATUS = 'Szinkronizált';

export const Footer: React.FC = () => {
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-base-100 border-t border-base-300 text-base-content mt-auto py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Oszlop: Rendszer azonosító & Verzió info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-primary text-2xl">local_pharmacy</span>
              <span className="font-bold text-lg text-primary tracking-tight">BENU B2B Betegútvezérlő</span>
            </div>
            <p className="text-xs text-base-content/70 leading-relaxed max-w-md">
              Orvosi és Gyógyszerészeti Készlet- és Információs Portál. Professzionális támogatás egészségügyi szakemberek számára.
            </p>
            
            {/* Verzió Kijelző Badge Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(true)}
                className="btn btn-xs btn-outline btn-primary gap-1.5 font-mono text-xs normal-case rounded-full hover:shadow-sm transition-all"
                title="Részletes verzióinformációk megtekintése"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>App v{APP_VERSION}</span>
                <span className="opacity-40">|</span>
                <span>Spec v{SPEC_VERSION}</span>
                <span className="material-symbols-rounded text-[14px]">info</span>
              </button>

              <span className="badge badge-sm badge-success gap-1 text-[11px] font-medium">
                <span className="material-symbols-rounded text-[13px]">check_circle</span>
                {SPEC_STATUS}
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

          {/* 3. Oszlop: Specifikáció & Doksi */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">Specifikáció & Verzió</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button 
                  type="button"
                  onClick={() => setIsVersionModalOpen(true)}
                  className="hover:text-primary transition-colors flex items-center gap-1.5 text-left"
                >
                  <span className="material-symbols-rounded text-[14px]">description</span> Specifikáció Szinkron (v{SPEC_VERSION})
                </button>
              </li>
              <li>
                <span className="text-base-content/60 block text-[11px] pt-1">
                  Utolsó szinkronizáció: 2026.08.12.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Alsó szerkeszthető sáv */}
        <div className="max-w-7xl mx-auto border-t border-base-200 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-2">
          <div>
            © 2026 BENU B2B Betegútvezérlő Portál. Minden jog fenntartva.
          </div>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-rounded text-[14px]">verified</span> Verziózási Mátrix
            </button>
          </div>
        </div>
      </footer>

      {/* Controlled Version Modal per modal-and-dropdowns.md rule */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-base-100 rounded-xl shadow-2xl border border-base-300 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Fejléc */}
            <div className="bg-primary/5 p-4 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-primary text-xl">verified</span>
                <h3 className="font-bold text-base text-base-content">Verzió & Specifikáció Szinkron</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            {/* Modal Tartalom */}
            <div className="p-5 space-y-4 overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-base-200/50 rounded-lg border border-base-300">
                <div>
                  <div className="text-xs text-base-content/60 uppercase font-semibold">Weboldal Verzió</div>
                  <div className="font-mono font-bold text-primary text-base">v{APP_VERSION}</div>
                  <div className="text-[11px] text-base-content/70">MAJOR.MINOR.PATCH</div>
                </div>
                <div>
                  <div className="text-xs text-base-content/60 uppercase font-semibold">FSR Specifikáció</div>
                  <div className="font-mono font-bold text-secondary text-base">v{SPEC_VERSION}</div>
                  <div className="text-[11px] text-base-content/70">MAJOR.MINOR Szinkron</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-base-content/70">Verziózási Működés:</h4>
                <ul className="space-y-2 text-xs text-base-content/80 list-disc pl-4">
                  <li>
                    <strong className="text-base-content">MAJOR ({APP_VERSION.split('.')[0]}.x):</strong> Mérföldkőnek számító teljes modulcsoport vagy struktúra megújulás.
                  </li>
                  <li>
                    <strong className="text-base-content">MINOR ({APP_VERSION.split('.')[0]}.{APP_VERSION.split('.')[1]}):</strong> Funkcionális változások. A weboldal és a specifikáció MINOR verziója szigorúan megegyezik.
                  </li>
                  <li>
                    <strong className="text-base-content">PATCH ({APP_VERSION.split('.')[2]}):</strong> Kódszintű technikai hibajavítások és UI finomítások az alkalmazásban, amelyek a leírt üzleti specifikációt nem módosítják.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <span className="material-symbols-rounded text-emerald-500 text-lg shrink-0 mt-0.5">check_circle</span>
                <div>
                  <strong>Státusz: Szinkronizált (v{SPEC_VERSION})</strong>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    A weboldalon elérhető funkciók 100%-ban lefedik a <code className="bg-base-100 px-1 py-0.5 rounded border border-base-300 font-mono">FUNCTIONAL_SPECS_WIKISPEC.md</code> v{SPEC_VERSION} dokumentumban foglalt működést.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Lábléc */}
            <div className="p-3 bg-base-200/30 border-t border-base-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="btn btn-sm btn-primary"
              >
                Rendben
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
