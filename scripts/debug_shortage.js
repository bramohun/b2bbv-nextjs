
const fs = require('fs');
const Papa = require('../web/node_modules/papaparse');
const path = require('path');

const shortagePath = 'c:\\GitHub\\b2bbv-nextjs\\.brief\\data-brief\\shortage_lista 20260212.csv';

async function debug() {
    try {
        const shortageContent = fs.readFileSync(shortagePath, 'latin1');
        const shortageResult = Papa.parse(shortageContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            transformHeader: (header) => header.trim().replace(/^"|"$/g, '')
        });

        console.log('Sample row raw:', shortageResult.data[0]);

        const targetTk = 'OGYI-T-23217/15';
        let found = false;

        shortageResult.data.forEach((row, index) => {
            const tk = (row['TK szám'] || '').trim();
            if (tk.includes(targetTk)) {
                console.log(`Found TK at index ${index}: [${tk}] (length: ${tk.length})`);
                found = true;
            }
        });

        if (!found) {
            console.log(`TK [${targetTk}] not found in parsed data.`);
            // List some keys to see format
            console.log('Sample keys:', shortageResult.data.slice(0, 5).map(r => r['TK szám']));
        }
    } catch (err) {
        console.error(err);
    }
}

debug();
