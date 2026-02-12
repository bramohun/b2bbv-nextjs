
const fs = require('fs');
const Papa = require('../web/node_modules/papaparse');
const path = require('path');

const shortagePath = 'c:\\GitHub\\b2bbv-nextjs\\.brief\\data-brief\\shortage_lista 20260212.csv';

async function test() {
    try {
        const shortageContent = fs.readFileSync(shortagePath, 'latin1');
        const rawBuffer = fs.readFileSync(shortagePath); // Read as buffer for byte-level analysis

        const shortageResult = Papa.parse(shortageContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            transformHeader: (header) => header.trim().replace(/^"|"$/g, '')
        });

        if (shortageResult.errors.length > 0) {
            console.log('PapaParse Errors:', shortageResult.errors.slice(0, 5));
        }

        // Original string search (kept for comparison if needed, but replaced by buffer search below)
        // const targetDigits = '23217';
        // const indexInRaw = shortageContent.indexOf(targetDigits);
        // console.log(`Index of [${targetDigits}] in raw content:`, indexInRaw);

        // if (indexInRaw !== -1) {
        //     const surrounding = shortageContent.substring(indexInRaw - 10, indexInRaw + 20);
        //     console.log('Surrounding content:', surrounding);
        //     console.log('Surrounding Hex:', Buffer.from(surrounding, 'latin1').toString('hex'));
        // }

        const coreTk = '23217';
        console.log(`Searching for core TK: ${coreTk}`);

        const variants = shortageResult.data.filter(r => (r['TK szám'] || '').includes(coreTk));

        console.table(variants.map(v => ({
            TK: v['TK szám'],
            Start: v['A hiány kezdete'],
            End: v['A hiány tervezett vége'],
            Reason: v['A hiány oka'].substring(0, 30) + '...'
        })));

        if (variants.length > 0) {
            console.log('Shortage reason for first variant:', variants[0]['A hiány oka']);
        }

    } catch (err) {
        console.error(err);
    }
}

test();
