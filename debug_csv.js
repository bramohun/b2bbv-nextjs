const fs = require('fs');
const path = require('path');

const filePath = path.join('web', 'data', 'tk_lista.csv');
const content = fs.readFileSync(filePath, 'latin1');
const lines = content.split(/\r?\n/);
const header = lines[0].split(';');
console.log('Headers:', JSON.stringify(header));

if (lines.length > 1) {
    const firstrow = lines[1].split(';');
    console.log('First Row:', JSON.stringify(firstrow));

    // Map them together
    const mapped = {};
    header.forEach((h, i) => {
        mapped[h.replace(/^"|"$/g, '').trim()] = firstrow[i] ? firstrow[i].replace(/^"|"$/g, '').trim() : '';
    });
    console.log('Mapped:', JSON.stringify(mapped, null, 2));
}
