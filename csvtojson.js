const fs = require('fs');
const path = require('path');

const csvFile = path.join(__dirname, 'activity.csv');


fs.readFile(csvFile, 'utf8', (err, data) => {
    if (err) {
        console.error('打開CSV檔案時發生錯誤:', err);
        return;
    }

    const rows = data.split('\n');
    const headers = rows[0].split('\t');
    const jsonArray = [];

    const trimmedHeaders = headers.map(header => header.trim());
    rows.slice(1).forEach(row => {
        if (!row.trim()) return;
    
        const columns = row.split('\t');
        const jsonObject = {};
    
        columns.forEach((column, j) => {
            const header = trimmedHeaders[j];
            let value = column.trim();
    
            if (header === '每人最低價' && value) {
                value = Number(value);
            }
    
            jsonObject[header] = value;
        });

        jsonArray.push(jsonObject);
    });

    const jsonString = JSON.stringify(jsonArray, null, 2);

    console.log(jsonString);
});
