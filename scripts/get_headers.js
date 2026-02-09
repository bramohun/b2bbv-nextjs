const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const filePath = path.join(process.cwd(), 'web/data/tk_lista.csv');
const fileContent = fs.readFileSync(filePath, 'latin1');

const parseResult = Papa.parse(fileContent, {
    header: true,
    preview: 1, // only read first row
    delimiter: ';',
    transformHeader: (header) => header.trim().replace(/^"|"$/g, '')
});

console.log(JSON.stringify(parseResult.meta.fields, null, 2));
