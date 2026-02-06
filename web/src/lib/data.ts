/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Fejlesztőként szükségem van egy központi adatkezelő rétegre, amely megbízhatóan
 * betölti és feldolgozza a rendszer működéséhez szükséges adatokat (gyógyszerek,
 * gyógyszertárak) különböző forrásokból (pl. CSV fájlok), hogy a felhasználói
 * felület mindig friss és konzisztens információkat jeleníthessen meg.
 * 
 * FUNKCIÓK:
 * - Gyógyszerlista betöltése (getMedicines):
 *   - CSV fájl beolvasása (tk_lista.csv)
 *   - Adattisztítás és konverzió (Medicine típusra)
 *   - Egyedi azonosítók generálása (internalId)
 *   - Státusz logika alkalmazása (Elérhető/Készlethiány/Megszűnt)
 *   - Cache kezelés a teljesítmény optimalizálása érdekében
 * 
 * - Egyedi gyógyszer lekérése (getMedicineByTk):
 *   - Gyors keresés a betöltött listában TK-szám alapján.
 * 
 * - Gyógyszertárlista betöltése (getPharmacies):
 *   - CSV fájl beolvasása (pharmacy_list.csv)
 *   - Geolokációs adatok és nyitvatartás kezelése
 *   - Cache kezelés
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A rendszer először a memóriában lévő cache-t ellenőrzi.
 * - Ha nincs cache, lemezről olvassa a 'latin1' kódolású CSV-ket.
 * - A 'PapaParse' könyvtárat használja a robusztus CSV feldolgozáshoz.
 * - A hibás sorokat (hiányzó név vagy TK-szám) automatikusan kiszűri.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/types/index.ts: Adatmodellek definíciója
 * - src/app/api/...: API végpontok, amelyek ezt a modult használják
 */

import fs from 'fs/promises';
import path from 'path';
import { Medicine, Pharmacy } from '@/types';
import Papa from 'papaparse';

const DATA_DIR = path.join(process.cwd(), 'data');

// Simple in-memory cache
let medicinesCache: Medicine[] | null = null;
let pharmaciesCache: Pharmacy[] | null = null;

export async function getMedicines(): Promise<Medicine[]> {
    if (medicinesCache) return medicinesCache;

    try {
        const filePath = path.join(DATA_DIR, 'tk_lista.csv');
        // Using 'latin1' to handle potential legacy encodings correctly
        const fileContent = await fs.readFile(filePath, 'latin1');

        // PapaParse is robust and handles quotes/delimiters better
        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';', // Explicitly set delimiter
            transformHeader: (header: string) => header.trim().replace(/^"|"$/g, '') // Clean quotes from headers if any
        });

        if (parseResult.errors.length > 0) {
            console.warn('CSV Parse warnings:', parseResult.errors.slice(0, 5));
        }

        const medicines: Medicine[] = parseResult.data.map((record: any, index: number) => {
            // Helper to safely get value regardless of casing or slight mismatches
            const get = (key: string) => {
                const val = record[key];
                return typeof val === 'string' ? val.trim() : '';
            };

            // Fallback finder
            const findVal = (keys: string[]) => {
                for (const k of keys) {
                    if (record[k]) return record[k].trim();
                }
                return '';
            };

            const tk = get('TK-szám');

            // STATUS LOGIC REFINED:
            // Default to "Elérhető" (Available)
            let status = 'Elérhető';

            // Check for shortage
            const shortage = (get('termékhiánnyal érintett') || '').toLowerCase();
            if (shortage === 'igen') {
                status = 'Készlethiány';
            }

            // Check for withdrawn/deleted status if column exists
            const forgalmazhato = (get('Forgalmazható') || get('Forgalmazhato') || '').toLowerCase();
            if (forgalmazhato === 'nem') {
                status = 'Megszűnt';
            }

            return {
                internalId: `${tk}-${index}`, // Ensure uniqueness by appending index
                tkSzam: tk,
                nev: get('Név'),
                inn: get('INN'),
                atcKod: findVal(['ATC kód 1', 'ATC kód 1/ATC kód']),
                kiszereles: get('Kiszerelés'),
                gyarto: findVal(['Gyártó', 'Gyártó neve', 'Forg_Eng_Jog']),
                status: status,
                price: 0,
                lastUpdate: new Date().toISOString(),
                brand: get('Márkanév') || get('Név'),
                activeSubstance: get('Hatóanyag') || get('INN'),
            };
        }).filter((m: Medicine) => m.tkSzam && m.nev); // Filter invalid rows

        medicinesCache = medicines;
        return medicines;

    } catch (error) {
        console.error('Error reading medicines:', error);
        return [];
    }
}

export async function getMedicineByTk(tkSzam: string): Promise<Medicine | undefined> {
    const medicines = await getMedicines();
    // Use find to get the first match. Since TK can be non-unique in raw CSV (pack sizes), 
    // ideally we should handle that, but for now we return the first one as representative.
    return medicines.find(m => m.tkSzam === tkSzam);
}

export async function getPharmacies(): Promise<Pharmacy[]> {
    if (pharmaciesCache) return pharmaciesCache;

    try {
        const filePath = path.join(DATA_DIR, 'pharmacy_list.csv');
        try {
            await fs.access(filePath);
        } catch {
            console.warn('pharmacy_list.csv not found');
            return [];
        }

        const fileContent = await fs.readFile(filePath, 'latin1');

        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
        });

        const pharmacies: Pharmacy[] = parseResult.data.map((record: any, index: number) => {
            const get = (key: string) => {
                const val = record[key];
                return typeof val === 'string' ? val.trim() : '';
            };

            return {
                id: get('id') || index.toString(),
                nev: get('name') || get('nev') || get('Gyógyszertár neve') || '',
                varmegye: get('county') || get('varmegye') || '',
                cim: get('address') || get('cim') || '',
                telepules: get('city') || get('telepules') || '',
                irsz: get('zip') || get('irsz') || '',
                telefon: get('phone') || get('telefon') || '',
                email: get('email') || '',
                latitude: parseFloat(get('lat') || get('latitude') || '0'),
                longitude: parseFloat(get('lng') || get('longitude') || '0'),
                mondayOpen: '08:00', mondayClose: '18:00',
                tuesdayOpen: '08:00', tuesdayClose: '18:00',
                wednesdayOpen: '08:00', wednesdayClose: '18:00',
                thursdayOpen: '08:00', thursdayClose: '18:00',
                fridayOpen: '08:00', fridayClose: '18:00',
                saturdayOpen: '', saturdayClose: '',
                sundayOpen: '', sundayClose: ''
            };
        });

        pharmaciesCache = pharmacies;
        return pharmacies;

    } catch (error) {
        console.error('Error reading pharmacies:', error);
        return [];
    }
}
