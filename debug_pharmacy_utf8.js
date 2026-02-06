const fs = require('fs');
const path = require('path');

const filePath = path.join('web', 'data', 'pharmacy_list.csv');
// Try reading as UTF-8
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

console.log('--- UTF-8 READ ---');
if (lines.length > 0) {
    console.log('Headers:', lines[0]);
    // Check first data row
    if (lines.length > 1) {
        console.log('First Row:', lines[1]);
    }
}
