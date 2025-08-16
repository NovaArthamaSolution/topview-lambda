const { google } = require("googleapis");
const creds = JSON.parse(atob(process.env.SA_KEY_FILE))

exports.handler = async (event) => {
    try {
        console.log('Starting auth creation');
        const auth = new google.auth.GoogleAuth({
            credentials: creds,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        console.log('Auth created, fetching sheets');
        const sheets = google.sheets({ version: 'v4', auth: auth });
        console.log('Sheets API initialized, fetching data');
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1ilfh51A78xXq1-tN2yHXY5FC_JdcuFXm9aIaSVJs0Sw',
            range: 'A:J',
        });
        console.log('Data fetched, processing response');
        
        const data = [];
        const values = response.data.values;
        const headers = values[0]; // Assuming first row contains headers

        // Convert rows to objects
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            if (row) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] || ''; // Handle empty cells
                });
                data.push(rowData);
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: data
            })
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: err.message
            })
        };
    }
};

// Helper function to parse A1:D range notation
function parseRange(range) {
    const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
    if (!match) throw new Error('Invalid range format');
    const startCol = columnToIndex(match[1]);
    const startRow = parseInt(match[2], 10) - 1;
    const endCol = columnToIndex(match[3]);
    const endRow = parseInt(match[4], 10) - 1;
    return [startRow, startCol, endRow, endCol];
}

// Convert column letter (e.g., 'A') to index (0-based)
function columnToIndex(col) {
    return col.split('').reduce((index, char) => index * 26 + (char.charCodeAt(0) - 64), 0) - 1;
}

if (process.argv[1].indexOf('index.js') !== -1) {
    exports.handler({});
}