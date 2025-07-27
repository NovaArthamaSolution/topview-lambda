const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const credentials = {
    "type": "service_account",
    "project_id": "monitoring-imigrasi",
    "private_key_id": "2bae1c4bf7b2a4b339950402b51ac61cfb3e24fe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDVFoEHbQnZ3lHA\nWfeA+SMfm+Sl/zrCUkLEVu0Z8+Ez3NgGccgSmK5eShMJ4F4ic27sjtcWOIydXeaI\ntugri4qxqdaUwsTBG+D9tvXzyIRX8ZkHVi0T+o/tfv77ee3JwI0fyU6XjYyYCQ9Y\nk+lzCDGMzZGDBMMzpQd/wujLqzqFig4h+u+b4cN+MLzI/Jv8U3CT3oaJFtvOk9dW\n+ZioJudC80T5M7UGCnPiuwfDnl8LcJH9D69RyykzgH2CzpRvyo8VHp7I8y+Rd0xa\nAgFqNC5zVyy9Int3B54BpgEEZx/MCnOtdv9a4iQvbdhFrSULrFwL/myDvbyNHhaf\nHHgp8xD7AgMBAAECggEABotn5W9TD6F1N6gBDYbZWNBZaphsWL6HtW8JXjQwKlRx\n6r9rioKs9vwQb0u4UxeM2cVzVAfi7bcOFwyDFJ9MYF4xLHrPlIduLBdb9iOmSOsv\nLNtX4WwJ0pywE8+FXvPD1yzqyzB6QnXOG7At9INVE5gsDBmagzIM3mmBQTbI7S6n\nbn8TqwahkwtwqVSv75Yp8JGp/tqpnoXUn0qYdOjEAI38lbEq4txnEtHsBfIvVbpt\nuzSELuuYrwMLj7TvFayM8PN8Etf+A50hNBh3e3t9zAkTQBjTYZ4sS5/klf/pjJdY\n99lcfi/pqmuY1vtBEBD0/u/xEnAy0WHzseIY38MCoQKBgQD09Y2s73cGTj0h2weU\nD3bDDnweDRhb8RsUHUy7keD3EXiUGyUkgdaHdNy+FC814ZCSCaGOflHRO7vlCLxm\nyu8vFui0UFxiDiLfMHNfXSyJGaTc6af32acWkXxoL9nZtNokdLNgkJb5Ho0oTplW\nABpHV/Mh2XnG62x6qY7Uaqc9WwKBgQDesTSp9HiRb1Roh73iTr0Ru8jjkyn1FXs+\n1SE/a7ZmuvdrXCCto04RdCocACtmTsRn8vmJNbAgHs41upijYZ9/xH/vDOCLjf60\n3YsKbtZuvh/dl9HUIRyKAe8F8lAn3N3obqCEM95GboPlE10lV1PLlgP0yfE3CUWe\nxzigeses4QKBgHeZhKjQ6m47uQFUraiOvE+UPOl3P1N0ruHtRE+4c/xtnU/CySm/\n8vyEBFsSA9Ls5OdIqIaoCk58OcsjrskJgCqfptKTAegmOsR6JXqERYBS8vmhY49R\nx5DvS6ya4GS5NmDiUcpuDihn0EfDyH4C4tG+kUkPo7OJspdZPhFcWXdNAoGAdeHQ\nQvdKq5IHWJ4igh20MCL7oJxSZY5Ng2FHDE90asUmHArUsZX0yYB4mgHs92dSyMPy\nHBPze81S01ZHXpVa3UOjhWOHqdgssIlmBMvPbyftrlujk2tDtDp50OgITlG4lkWZ\nauIaE6aE40pw0Ed98BMlXPtZWQzrcbV74FeeQ4ECgYBhz3MTy7iQU4ygpU9efYC3\nJphSqgCQJdD6wkqZl8rwvHHSucm70L9YFJw0QCYZntk2XTg5QKWSmja/dWQRHpYX\nTF/fuW+bQm/uwdbdXixe9M46Za4YfBRINrrl5ztsYC0KuEEfBWonqU3yCY1lTCIS\n7qQgx6JSKV4slP85+SSPDQ==\n-----END PRIVATE KEY-----",
    "client_email": "iam-be@monitoring-imigrasi.iam.gserviceaccount.com",
    "client_id": "117806201098464258147",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/iam-be%40monitoring-imigrasi.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
exports.handler = async (event) => {
    try {
        const serviceAccountAuth = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Initialize the Google Spreadsheet client
        const doc = new GoogleSpreadsheet('1ilfh51A78xXq1-tN2yHXY5FC_JdcuFXm9aIaSVJs0Sw', serviceAccountAuth);

        // Load spreadsheet info
        await doc.loadInfo();

        // Get the first sheet (or specify a sheet by name or index)
        const sheet = doc.sheetsByTitle['data']; // Or use doc.sheetsByTitle['Sheet1']
        const range = 'A:J'; // Default range

        // Load specific range
        await sheet.loadCells(range);

        // Get cell values
        const rows = [];
        const [startRow, startCol, endRow, endCol] = parseRange(range);
        for (let i = startRow; i <= endRow; i++) {
            const row = [];
            for (let j = startCol; j <= endCol; j++) {
                const cell = sheet.getCell(i, j);
                row.push(cell.value || '');
            }
            rows.push(row);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Enable CORS if needed
            },
            body: JSON.stringify({
                success: true,
                data: rows
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
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