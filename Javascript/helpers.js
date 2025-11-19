//The ID of the sheet found in the URL
const sheetID = "1MS0WNduj1qRFA0J7fzuE6DDvYnjaWVEaFPAOc9TpLYs";

//get the URL of a specific tab
function getTabURL(tabName) {
    return `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
}

//CSV Parser
function parseCSV(csv) {
    const rows = [];
    let row = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const next = csv[i + 1];

        if (char === '"' && insideQuotes && next === '"') {
            cell += '"';
            i++;
        } 
        else if (char === '"') {
            insideQuotes = !insideQuotes;
        } 
        else if (char === ',' && !insideQuotes) {
            row.push(cell);
            cell = "";
        } 
        else if ((char === "\n" || char === "\r") && !insideQuotes) {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
        } 
        else {
            cell += char;
        }
    }

    if (cell || row.length) {
        row.push(cell);
        rows.push(row);
    }

    return rows;
}
//gets the Parsed CSV file from the sheet
async function getParsedCSV(url) {
    const response = await fetch(url);
    const csv = await response.text();
    return parseCSV(csv);
}

//finds the index of the table header
function getHeaderRow(rows, terms) {
    const upperCaseTerms = terms.map(t => t.toUpperCase());

    const index = rows.findIndex(row => {
        return upperCaseTerms.every(term =>
            row.some(cell =>
                cell.toUpperCase().includes(term)
            )
        );
    });

    //error handling
    if (index === -1) {
        console.error(`Header row not found for terms: ${terms.join(", ")}`);
        return null;
    }

    return index;
}

//startCol and endCol are the columns on the spreadsheet to get where A = 0, B = 1, etc. skipPhrases can be used to skip milestone rows.
function trimData(rows, headerIndex, startCol, endCol, skipPhrases) {
    const rawData = rows.slice(headerIndex + 1);
    return rawData.map( r => r.slice(startCol, endCol + 1) )
    .filter(r => {
        if (!r[0] || !r[0].trim()) return false;

        const text = r.join(" ").toUpperCase();

        for(const phrase of skipPhrases) {
            if(text.includes(phrase.toUpperCase())) return false;
        }
        return true;
    });
}