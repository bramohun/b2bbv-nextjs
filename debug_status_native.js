const fs = require('fs');
const path = require('path');

const filePath = path.join('web', 'data', 'tk_lista.csv');
const content = fs.readFileSync(filePath, 'latin1');
const lines = content.split(/\r?\n/);

if (lines.length > 1) {
    const header = lines[0].split(';');
    // console.log('Headers:', header);

    // Find candidate columns for status
    header.forEach((h, i) => {
        const cleanHeader = h.replace(/"/g, '').trim();
        if (cleanHeader.toLowerCase().includes('forgalma') || cleanHeader.toLowerCase().includes('töröl') || cleanHeader.toLowerCase().includes('érvény')) {
            console.log(`Potential Status Column [${i}]: ${cleanHeader}`);
            // Check first few values
            for (let j = 1; j < 6; j++) {
                if (lines[j]) {
                    const row = lines[j].split(';');
                    if (row[i]) console.log(`  Row ${j} Val: ${row[i].replace(/"/g, '')}`);
                }
            }
        }
    });
}
