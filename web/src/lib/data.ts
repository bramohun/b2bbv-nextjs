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
 *   - MOCK ADATOK: Mivel a forrás CSV nem tartalmaz koordinátákat, a rendszer
 *     véletlenszerű koordinátákat generál Magyarország területén demonstrációs céllal.
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
    return medicines.find(m => m.tkSzam === tkSzam);
}

export async function getPharmacies(): Promise<Pharmacy[]> {
    if (pharmaciesCache) return pharmaciesCache;

    try {
        const filePath = path.join(DATA_DIR, 'benu_pharmacies.csv');
        try {
            await fs.access(filePath);
        } catch {
            console.warn('benu_pharmacies.csv not found');
            return [];
        }

        const fileContent = await fs.readFile(filePath, 'utf8');

        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ',',
            transformHeader: (header: string) => header.trim().replace(/^"|"$/g, '').replace(/^\ufeff/, '')
        });

        const uniquePharmaciesMap = new Map<string, Pharmacy>();

        parseResult.data.forEach((record: any, index: number) => {
            const get = (key: string) => {
                const val = record[key];
                return typeof val === 'string' ? val.trim() : '';
            };

            const id = get('BF kód') || index.toString();

            // Skip if ID already exists
            if (uniquePharmaciesMap.has(id)) {
                return;
            }

            const parseHours = (hoursStr: string) => {
                if (!hoursStr || hoursStr.toLowerCase() === 'zárva') return { open: '', close: '' };
                const parts = hoursStr.split('-').map(p => p.trim());
                if (parts.length === 2) {
                    return { open: parts[0], close: parts[1] };
                }
                return { open: hoursStr, close: '' };
            };

            const mon = parseHours(get('Hétfő'));
            const tue = parseHours(get('Kedd'));
            const wed = parseHours(get('Szerda'));
            const thu = parseHours(get('Csütörtök'));
            const fri = parseHours(get('Péntek'));
            const sat = parseHours(get('Szombat'));
            const sun = parseHours(get('Vasárnap'));

            let lat = parseFloat(get('Földrajzi szélesség').replace(',', '.'));
            let lng = parseFloat(get('Földrajzi hosszúság').replace(',', '.'));

            if (isNaN(lat) || isNaN(lng)) {
                lat = 0; lng = 0;
            }

            // Skip invalid entries
            const name = get('Név');
            if (!name || lat === 0) return;

            const pharmacy: Pharmacy = {
                id: id,
                nev: name,
                varmegye: '',
                cim: `${get('Utca, házszám')}`,
                telepules: get('Település'),
                irsz: get('Irsz.'),
                telefon: get('Telefon'),
                email: get('E-mail'),
                latitude: lat,
                longitude: lng,
                mondayOpen: mon.open, mondayClose: mon.close,
                tuesdayOpen: tue.open, tuesdayClose: tue.close,
                wednesdayOpen: wed.open, wednesdayClose: wed.close,
                thursdayOpen: thu.open, thursdayClose: thu.close,
                fridayOpen: fri.open, fridayClose: fri.close,
                saturdayOpen: sat.open, saturdayClose: sat.close,
                sundayOpen: sun.open, sundayClose: sun.close
            };

            uniquePharmaciesMap.set(id, pharmacy);
        });

        const pharmacies = Array.from(uniquePharmaciesMap.values());

        pharmaciesCache = pharmacies;
        return pharmacies;

    } catch (error) {
        console.error('Error reading pharmacies:', error);
        return [];
    }
}
