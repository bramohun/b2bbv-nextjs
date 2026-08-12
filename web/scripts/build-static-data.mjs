import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

const processCwd = process.cwd();
const DATA_DIR = path.join(processCwd, 'data');
const PUBLIC_DATA_DIR = path.join(processCwd, 'public', 'data');

function seededRandom(seed) {
    let h = 5381;
    for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

const TARGET_CHANGES_PER_DAY = 25;

async function generateData() {
    console.log('Generating static JSON data for GitHub Pages export...');
    await fs.mkdir(PUBLIC_DATA_DIR, { recursive: true });

    // 1. Medicines & Shortages
    let medicines = [];
    try {
        const filePath = path.join(DATA_DIR, 'tk_lista.csv');
        const fileContent = await fs.readFile(filePath, 'latin1');

        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            transformHeader: (h) => h.trim().replace(/^"|"$/g, '')
        });

        let shortagesMap = new Map();
        try {
            let shortagePath = path.join(DATA_DIR, 'shortage_lista.csv');
            try {
                await fs.access(shortagePath);
            } catch {
                shortagePath = path.join(processCwd, '..', '.brief', 'data-brief', 'shortage_lista 20260212.csv');
            }
            const shortageContent = await fs.readFile(shortagePath, 'latin1');
            const shortageResult = Papa.parse(shortageContent, {
                header: true,
                skipEmptyLines: true,
                delimiter: ';',
                transformHeader: (h) => h.trim().replace(/^"|"$/g, '')
            });

            shortageResult.data.forEach((row) => {
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
            console.warn('Warning loading shortage list:', err.message);
        }

        medicines = parseResult.data.map((record, index) => {
            const get = (key) => {
                const val = record[key];
                return typeof val === 'string' ? val.trim() : '';
            };
            const findVal = (keys) => {
                for (const k of keys) {
                    if (record[k]) return record[k].trim();
                }
                return '';
            };

            let tk = get('TK-szám');
            let status = 'Elérhető';

            const shortage = (get('termékhiánnyal érintett') || '').toLowerCase();
            if (shortage === 'igen' || shortagesMap.has(tk)) {
                status = 'Készlethiány';
            }

            const forgalmazhato = (get('Forgalmazható') || get('Forgalmazhato') || '').toLowerCase();
            if (forgalmazhato === 'nem') {
                status = 'Megszűnt';
            }

            let lastUpdate = new Date(0).toISOString();
            let isMock = false;

            if (index < 20) {
                tk = `MOCK-${String(index).padStart(3, '0')}`;
                isMock = true;
                const now = new Date();
                if (index < 3) {
                    status = 'Készlethiány';
                    lastUpdate = now.toISOString();
                } else if (index < 6) {
                    status = 'Megszűnt';
                    lastUpdate = now.toISOString();
                } else if (index < 12) {
                    status = 'Készlethiány';
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    lastUpdate = yesterday.toISOString();
                } else if (index < 16) {
                    status = 'Megszűnt';
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    lastUpdate = yesterday.toISOString();
                } else {
                    status = 'Elérhető';
                    const recent = new Date(now);
                    recent.setDate(now.getDate() - 2);
                    lastUpdate = recent.toISOString();
                }
            }

            const medicineBase = {
                internalId: `${tk}-${index}`,
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
                _isMock: isMock,
            };

            let shortageInfo = shortagesMap.get(tk);
            if (!shortageInfo && tk.includes('/')) {
                const baseTk = tk.split('/')[0];
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
        }).filter((m) => m.tkSzam && m.nev);

        const spreadDays = Math.ceil(medicines.length / TARGET_CHANGES_PER_DAY);
        medicines.forEach((med) => {
            if (med._isMock) {
                delete med._isMock;
                return;
            }
            delete med._isMock;
            const dayBucket = Math.floor(seededRandom(med.tkSzam) * spreadDays);
            const hourVal = Math.floor(seededRandom(med.tkSzam + 'h') * 24);
            const minVal = Math.floor(seededRandom(med.tkSzam + 'm') * 60);
            const changeDate = new Date();
            changeDate.setDate(changeDate.getDate() - dayBucket);
            changeDate.setHours(hourVal, minVal, 0, 0);
            med.lastUpdate = changeDate.toISOString();
        });

    } catch (err) {
        console.error('Error generating medicines static data:', err);
    }

    await fs.writeFile(path.join(PUBLIC_DATA_DIR, 'medicines.json'), JSON.stringify(medicines));
    console.log(`Saved ${medicines.length} medicines to public/data/medicines.json`);

    // 2. Pharmacies
    let pharmacies = [];
    try {
        const filePath = path.join(DATA_DIR, 'benu_pharmacies.csv');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ',',
            transformHeader: (h) => h.trim().replace(/^"|"$/g, '').replace(/^\ufeff/, '')
        });

        const uniqueMap = new Map();
        parseResult.data.forEach((record, index) => {
            const get = (key) => {
                const val = record[key];
                return typeof val === 'string' ? val.trim() : '';
            };
            const id = get('BF kód') || index.toString();
            if (uniqueMap.has(id)) return;

            const parseHours = (hoursStr) => {
                if (!hoursStr || hoursStr.toLowerCase() === 'zárva') return { open: '', close: '' };
                const parts = hoursStr.split('-').map((p) => p.trim());
                return parts.length === 2 ? { open: parts[0], close: parts[1] } : { open: hoursStr, close: '' };
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
            if (isNaN(lat) || isNaN(lng)) { lat = 0; lng = 0; }

            const name = get('Név');
            if (!name || lat === 0) return;

            uniqueMap.set(id, {
                id,
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
            });
        });

        pharmacies = Array.from(uniqueMap.values());
    } catch (err) {
        console.error('Error generating pharmacies static data:', err);
    }

    await fs.writeFile(path.join(PUBLIC_DATA_DIR, 'pharmacies.json'), JSON.stringify(pharmacies));
    console.log(`Saved ${pharmacies.length} pharmacies to public/data/pharmacies.json`);

    // 3. Dashboard stats
    const stats = medicines.reduce((acc, med) => {
        if (med.status === 'Megszűnt') acc.megszunt++;
        if (med.status === 'Készlethiány') acc.hiany++;
        if (med.status === 'Elérhető') acc.elerheto++;
        acc.total++;
        return acc;
    }, { total: 0, megszunt: 0, hiany: 0, elerheto: 0 });

    const latestChanges = [...medicines]
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 20);

    const dashboardStats = { stats, latestChanges };
    await fs.writeFile(path.join(PUBLIC_DATA_DIR, 'dashboard-stats.json'), JSON.stringify(dashboardStats));

    // 4. Forum activity & stats mock
    const forumActivity = [
        { id: '1', title: 'GLP-1 analógok készlethiánya', author: 'Dr. Kovács Péter', date: '2 órája', replies: 14 },
        { id: '2', title: 'Új OGYÉI módszertani útmutató', author: 'Szabó Anna', date: '5 órája', replies: 8 },
        { id: '3', title: 'Ügyeleti betegellátás tapasztalatok', author: 'Tóth Gábor', date: 'tegnap', replies: 23 }
    ];
    await fs.writeFile(path.join(PUBLIC_DATA_DIR, 'forum-activity.json'), JSON.stringify(forumActivity));

    const forumStats = { totalTopics: 142, totalReplies: 856, activeUsers: 64 };
    await fs.writeFile(path.join(PUBLIC_DATA_DIR, 'forum-stats.json'), JSON.stringify(forumStats));

    console.log('Static JSON data generation complete!');
}

generateData().catch(console.error);
