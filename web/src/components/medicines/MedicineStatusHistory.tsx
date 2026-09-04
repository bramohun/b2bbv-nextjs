/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - GYÓGYSZER STÁTUSZVÁLTOZÁSOK TÖRTÉNET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Ez a komponens jeleníti meg egy adott készítmény korábbi készlet- és forgalmazási
 * státuszváltásainak időrendi naplóját (elérhető, hiánycikk, megszüntetett állapotok),
 * valamint az orvosi adatbázisból történt utolsó szinkronizáció időbélyegét.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Orvosként szeretném látni a gyógyszer korábbi ellátási ingadozásait és stabilitását,
 *   hogy megbízható terápiás tervet alakíthassak ki a páciens számára.
 * - Felhasználóként szeretném ellenőrizni, mikor történt a legutóbbi orvosi adatbázis-lekérdezés.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - src/app/(dashboard)/gyogyszerek/adatlap/page.tsx: Gyógyszer adatlap felület
 * ============================================================================
 */

import React from 'react';
import { formatDate } from '@/lib/utils';

export interface StatusChange {
    date: string;
    status: string;
}

interface MedicineStatusHistoryProps {
    history: StatusChange[];
}

export function MedicineStatusHistory({ history }: MedicineStatusHistoryProps) {
    return (
        <div className="bg-white border border-[#e7e8ec] rounded-[16px] shadow-[0px_14px_38px_0px_rgba(0,26,72,0.06)] overflow-hidden mt-6">
            <div className="p-[24px] pb-[16px]">
                <h2 className="font-bold text-[#002664] text-[22px]">
                    Státusz változások
                </h2>
            </div>

            <div className="bg-[#f9f9fb] px-[24px] py-[16px] flex items-center justify-between text-[#3a5876] text-[13px] uppercase font-bold border-y border-[#e7e8ec]">
                <span className="w-[120px]">Státusz</span>
                <span className="text-right">Dátum</span>
            </div>

            <div>
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className="px-[24px] py-[16px] flex items-center justify-between border-b border-[#e7e8ec] last:border-none hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-[120px]">
                                {item.status === 'Elérhető' && (
                                    <span className="inline-flex items-center gap-[8px] bg-[#e8f8e2] text-[#317907] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px]">
                                        <img src="/assets/figma/8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg" alt="" className="size-[16px]" />
                                        Elérhető
                                    </span>
                                )}
                                {item.status === 'Készlethiány' && (
                                    <span className="inline-flex items-center gap-[8px] bg-[#fff7ba] text-[#7a6c21] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px]">
                                        <img src="/assets/figma/95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg" alt="" className="size-[16px]" />
                                        Hiány
                                    </span>
                                )}
                                {item.status === 'Megszűnt' && (
                                    <span className="inline-flex items-center gap-[8px] bg-[#feeaed] text-[#b1174e] px-[8px] py-[3px] rounded-[4px] font-medium text-[14px]">
                                        <img src="/assets/figma/c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg" alt="" className="size-[16px]" />
                                        Megszűnt
                                    </span>
                                )}
                                {!['Elérhető', 'Készlethiány', 'Megszűnt'].includes(item.status) && (
                                    <span className="text-[14px] font-medium text-[#62788f]">
                                        {item.status}
                                    </span>
                                )}
                            </div>
                            <span className="text-[#62788f] text-[14px] text-right">
                                {formatDate(item.date)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="px-[24px] py-[24px] text-center text-[#62788f] text-[14px]">
                        Nincs elérhető előzmény.
                    </div>
                )}
            </div>

            <div className="px-[24px] py-[16px] bg-slate-50 text-[13px] text-[#62788f] border-t border-[#e7e8ec] flex items-center justify-between">
                <span>Utolsó lekérdezés orvosi adatbázisból:</span>
                <span className="font-bold text-[#002664]">
                    {history.length > 0 ? formatDate(history[0].date) : '2026.09.04 12:00'}
                </span>
            </div>
        </div>
    );
}
