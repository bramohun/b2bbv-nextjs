import fs from 'fs/promises';
import path from 'path';
import { Medicine, Pharmacy } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getMedicines(): Promise<Medicine[]> {
    try {
        const filePath = path.join(DATA_DIR, 'tk_lista.csv');
        const fileContent = await fs.readFile(filePath, 'utf-8'); // Assume UTF-8 for now, might need Windows-1252 handling

        const lines = fileContent.split('\n');
        const medicines: Medicine[] = [];

        // Skip header and process lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple semicolon split for prototype - in production use a proper CSV parser
            // Note: The legacy CSV parser handled quotes, we might need a library if data is complex
            const cols = line.split(';');

            if (cols.length >= 6) {
                medicines.push({
                    tkSzam: cols[0]?.trim() || '',
                    nev: cols[1]?.trim() || '',
                    inn: cols[2]?.trim() || '',
                    atcKod: cols[3]?.trim() || '',
                    kiszereles: cols[4]?.trim() || '',
                    gyarto: cols[5]?.trim() || '',
                    status: 'Elérhető', // Default status for now
                    price: 0, // Placeholder
                    lastUpdate: new Date().toISOString(),
                    brand: cols[1]?.trim() || '',
                    activeSubstance: cols[2]?.trim() || '',
                });
            }
        }
        return medicines;

    } catch (error) {
        console.error('Error reading medicines:', error);
        return [];
    }
}

export async function getPharmacies(): Promise<Pharmacy[]> {
    try {
        const filePath = path.join(DATA_DIR, 'pharmacy_list.csv');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        const lines = fileContent.split('\n');
        const pharmacies: Pharmacy[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const cols = line.split(';');

            if (cols.length >= 4) {
                pharmacies.push({
                    id: (i).toString(),
                    nev: cols[0]?.trim() || '',
                    varmegye: cols[1]?.trim() || '',
                    cim: cols[2]?.trim() || '',
                    telepules: cols[2]?.split(',')[0]?.trim() || '', // Rough extraction
                    irsz: '',
                    telefon: cols[3]?.trim() || '',
                    email: '',
                    latitude: 0,
                    longitude: 0,
                    // Default open hours logic placeholder
                    mondayOpen: '08:00', mondayClose: '18:00',
                    tuesdayOpen: '08:00', tuesdayClose: '18:00',
                    wednesdayOpen: '08:00', wednesdayClose: '18:00',
                    thursdayOpen: '08:00', thursdayClose: '18:00',
                    fridayOpen: '08:00', fridayClose: '18:00',
                    saturdayOpen: '', saturdayClose: '',
                    sundayOpen: '', sundayClose: ''
                });
            }
        }
        return pharmacies;

    } catch (error) {
        console.error('Error reading pharmacies:', error);
        return [];
    }
}
