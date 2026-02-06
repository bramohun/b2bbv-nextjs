const fs = require('fs');
const path = require('path');
const Papa = require('papaparse'); // Assuming papaparse is installed in node_modules, if not, we can't run this easily without installing it globally or in root. 
// Actually, let's just use simple split since we just want to inspect columns for status logic.

const filePath = path.join('web', 'data', 'tk_lista.csv');
const content = fs.readFileSync(filePath, 'latin1');
const lines = content.split(/\r?\n/);

if (lines.length > 1) {
    const header = lines[0].split(';');
    console.log('Headers:', header);

    // Find candidate columns for status
    header.forEach((h, i) => {
        if (h.toLowerCase().includes('forgalma') || h.toLowerCase().includes('status') || h.toLowerCase().includes('töröl')) {
            console.log(`Potential Status Column [${i}]: ${h}`);
            // Check first few values
            for (let j = 1; j < 20; j++) {
                if (lines[j]) {
                    const row = lines[j].split(';');
                    console.log(`  Row ${j} Val: ${row[i]}`);
                }
            }
        }
    });
}
