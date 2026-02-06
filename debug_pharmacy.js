const fs = require('fs');
const path = require('path');
// Simple split since we just want headers
const filePath = path.join('web', 'data', 'pharmacy_list.csv');
const content = fs.readFileSync(filePath, 'latin1');
const lines = content.split(/\r?\n/);
if (lines.length > 0) {
    console.log('Headers:', lines[0]);
}
