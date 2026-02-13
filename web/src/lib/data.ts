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
 * - Hasonló hatóanyagú termékek lekérése (getMedicinesBySubstance):
 *   - Szűrés hatóanyag (INN) és "Elérhető" státusz alapján.
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
import { unstable_cache } from 'next/cache';
import { isAvailableInPharmacy } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');

// Cache keys
const MEDICINES_CACHE_KEY = 'medicines-data';
const PHARMACIES_CACHE_KEY = 'pharmacies-data';

// Internal function to read and parse medicines
async function fetchMedicines(): Promise<Medicine[]> {

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

        // Load shortage data
        let shortagesMap = new Map<string, any>();
        try {
            const shortagePath = path.join(process.cwd(), '..', '.brief', 'data-brief', 'shortage_lista 20260212.csv');
            const shortageContent = await fs.readFile(shortagePath, 'latin1');
            const shortageResult = Papa.parse(shortageContent, {
                header: true,
                skipEmptyLines: true,
                delimiter: ';',
                transformHeader: (header: string) => header.trim().replace(/^"|"$/g, '')
            });

            shortageResult.data.forEach((row: any) => {
                const tk = (row['TK szám'] || '').trim();
                if (tk) {
                    shortagesMap.set(tk, {
                        start: row['A hiány kezdete'],
                        end: row['A hiány tervezett vége'],
                        reason: row['A hiány oka'],
                        suggestion: row['Javaslat a hiánykészítmény pótlására']
                    });
                }
            });
        } catch (err) {
            console.error('Error loading shortage list:', err);
        }

        const medicines = parseResult.data.map((record: any, index: number) => {
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

            let tk = get('TK-szám');

            // STATUS LOGIC REFINED:
            // Default to "Elérhető" (Available)
            let status = 'Elérhető';

            // Check for shortage
            const shortage = (get('termékhiánnyal érintett') || '').toLowerCase();
            if (shortage === 'igen' || shortagesMap.has(tk)) {
                status = 'Készlethiány';
            }

            // Check for withdrawn/deleted status if column exists
            const forgalmazhato = (get('Forgalmazható') || get('Forgalmazhato') || '').toLowerCase();
            if (forgalmazhato === 'nem') {
                status = 'Megszűnt';
            }

            let lastUpdate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();

            // MOCK DATA for Dashboard demonstration: 
            // Force some specific items to be "Today" or "Yesterday" changes
            if (index < 20) {
                tk = `MOCK-${String(index).padStart(3, '0')}`;

                const now = new Date();
                if (index < 3) {
                    // Today, Készlethiány
                    status = 'Készlethiány';
                    lastUpdate = now.toISOString();
                } else if (index < 6) {
                    // Today, Megszűnt
                    status = 'Megszűnt';
                    lastUpdate = now.toISOString();
                } else if (index < 12) {
                    // Yesterday, Készlethiány
                    status = 'Készlethiány';
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    lastUpdate = yesterday.toISOString();
                } else if (index < 16) {
                    // Yesterday, Megszűnt
                    status = 'Megszűnt';
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    lastUpdate = yesterday.toISOString();
                } else {
                    // Others in top 20: Available
                    status = 'Elérhető';
                    // Just recent date
                    const recent = new Date(now);
                    recent.setDate(now.getDate() - 2);
                    lastUpdate = recent.toISOString();
                }
            }

            const medicineBase = {
                internalId: `${tk}-${index}`, // Ensure uniqueness by appending index
                tkSzam: tk,
                nev: get('Név'),
                inn: get('INN'),
                atcKod: findVal(['ATC kód 1', 'ATC kód 1/ATC kód']),
                kiszereles: get('Kiszerelés'),
                gyarto: findVal(['Gyártó', 'Gyártó neve', 'Forg_Eng_Jog']),
                status: status,
                price: 0,
                lastUpdate: lastUpdate,
                brand: get('Márkanév') || get('Név'),
                activeSubstance: get('Hatóanyag') || get('INN'),
                packagingDetails: get('Csomagolás részletezése'),
                dispensability: get('Kiadhatóság'),
                dispensabilitySub: get('Kiad_alcsop'),
                safetyFeatures: get('Biztonsági elemek'),
                authorizationDate: get('TK dátum'),
            };

            // Match shortage info: exact first, then by base TK
            let shortageInfo = shortagesMap.get(tk);
            if (!shortageInfo && tk.includes('/')) {
                const baseTk = tk.split('/')[0];
                // Look for any variant in the shortage map that starts with this base TK
                // (Since shortagesMap keys are full TKs, we need to find one that matches)
                for (const [key, value] of shortagesMap.entries()) {
                    if (key.startsWith(baseTk + '/')) {
                        shortageInfo = value;
                        break;
                    }
                }
            }

            return {
                ...medicineBase,
                status: (medicineBase.status === 'Készlethiány' || shortageInfo) ? 'Készlethiány' : medicineBase.status,
                shortageInfo
            };
        }).filter((m: Medicine) => m.tkSzam && m.nev); // Filter invalid rows

        return medicines;

    } catch (error) {
        console.error('Error reading medicines:', error);
        return [];
    }
}

// Cached version of getMedicines
export const getMedicines = unstable_cache(
    async () => fetchMedicines(),
    [MEDICINES_CACHE_KEY],
    { revalidate: 3600 } // Cache for 1 hour
);

export async function getMedicineByTk(tkSzam: string): Promise<Medicine | undefined> {
    const medicines = await getMedicines();
    return medicines.find(m => m.tkSzam === tkSzam);
}

export async function getMedicinesBySubstance(substance: string, excludeTk: string, limit: number = 20): Promise<Medicine[]> {
    if (!substance) return [];

    const medicines = await getMedicines();
    const normalizedSubstance = substance.toLowerCase().trim();

    const allMatches = medicines.filter(m =>
        m.tkSzam !== excludeTk &&
        m.inn &&
        m.inn.toLowerCase().includes(normalizedSubstance) &&
        m.status === 'Elérhető'
    );

    if (allMatches.length <= limit) return allMatches;

    // Diversity logic: Group by brand/family
    const groups = new Map<string, Medicine[]>();
    allMatches.forEach(m => {
        // Fallback to name-based family if brand is missing or too generic
        const brandOrFamily = m.brand || m.nev.split(' ')[0] || 'Ismeretlen';
        if (!groups.has(brandOrFamily)) groups.set(brandOrFamily, []);
        groups.get(brandOrFamily)!.push(m);
    });

    const result: Medicine[] = [];
    const brandKeys = Array.from(groups.keys());
    let i = 0;

    // Round-robin selection from groups
    while (result.length < limit && brandKeys.length > 0) {
        const brandIndex = i % brandKeys.length;
        const brand = brandKeys[brandIndex];
        const group = groups.get(brand)!;

        if (group.length > 0) {
            result.push(group.shift()!);
        } else {
            // Remove empty group and don't increment i so we check the 'next' brand in the updated array
            brandKeys.splice(brandIndex, 1);
            continue;
        }
        i++;
    }

    return result;
}

// Internal function to read and parse pharmacies
async function fetchPharmacies(): Promise<Pharmacy[]> {

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
        return pharmacies;

    } catch (error) {
        console.error('Error reading pharmacies:', error);
        return [];
    }
}

// Cached version of getPharmacies
export const getPharmacies = unstable_cache(
    async () => fetchPharmacies(),
    [PHARMACIES_CACHE_KEY],
    { revalidate: 3600 }
);

/**
 * Returns aggregated stock statistics and recent changes for the dashboard.
 * Designed to be called from a Server Component to avoid sending all data to client.
 */
export async function getGlobalStockStats(periodDays: number) {
    const medicines = await getMedicines();
    const now = new Date();

    // Calculate start date based on period
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - periodDays);
    startDate.setHours(0, 0, 0, 0);

    // Filter medicines updated within the period
    const recentMedicines = medicines.filter(med => {
        const updateDate = new Date(med.lastUpdate);
        return updateDate >= startDate;
    });

    const stats = recentMedicines.reduce((acc, med) => {
        // Count statuses in the filtered list
        if (med.status === 'Megszűnt') acc.megszunt++;
        if (med.status === 'Készlethiány') acc.hiany++;
        if (med.status === 'Elérhető') acc.elerheto++;

        acc.total++;
        return acc;
    }, { total: 0, megszunt: 0, hiany: 0, elerheto: 0 });

    const latestChanges = [...medicines]
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 20);

    return {
        stats,
        latestChanges
    };
}

/**
 * Returns stock statistics for a specific pharmacy.
 */
export async function getPharmacyStockStats(pharmacyId: string, periodDays: number) {
    const medicines = await getMedicines();
    const now = new Date();

    // Calculate start date based on period
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - periodDays);
    startDate.setHours(0, 0, 0, 0);

    const pharmacyMedicines = medicines.filter(m =>
        isAvailableInPharmacy(m.tkSzam, pharmacyId) || m.tkSzam.startsWith('MOCK-')
    );

    // Filter by date
    const recentPharmacyMedicines = pharmacyMedicines.filter(med => {
        const updateDate = new Date(med.lastUpdate);
        return updateDate >= startDate;
    });

    const stats = recentPharmacyMedicines.reduce((acc, med) => {
        if (med.status === 'Elérhető') {
            acc.elerheto++;
        } else if (med.status === 'Készlethiány' || med.status === 'Megszűnt') {
            acc.nemElerheto++;
        }
        return acc;
    }, { nemElerheto: 0, elerheto: 0 });

    const totalChanges = stats.elerheto + stats.nemElerheto;

    const latestChanges = recentPharmacyMedicines
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 20);

    return {
        stats,
        totalChanges,
        latestChanges
    };
}
