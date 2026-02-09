const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const filePath = path.join(process.cwd(), 'data/tk_lista.csv');
console.log('Reading file from:', filePath);
const fileContent = fs.readFileSync(filePath, 'latin1');

const parseResult = Papa.parse(fileContent, {
    header: true,
    preview: 1, // only read first row
    delimiter: ';',
    transformHeader: (header) => {
        // Remove quotes and extra spaces
        return header.trim().replace(/^"|"$/g, '');
    }
});

console.log(JSON.stringify(parseResult.meta.fields, null, 2));
