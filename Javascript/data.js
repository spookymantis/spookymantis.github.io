//POINTS RECORD TAB READING
async function getPointsTab() {
    const rows = await getParsedCSV(getTabURL("Points Record"));

    //find starting point for data
    const headerRowIndex = getHeaderRow(rows, ["Discord Username","NCP Username","Points"]);
    if(headerRowIndex === null) return [];

    //gets rid of useless stuff
    const dataRows = trimData(rows, headerRowIndex, 0, 2, ["ABOVE THIS GRANTS POINT PRESTIGE (200) ROLE", "ABOVE THIS GRANTS POINT ACCUMULATOR (100) ROLE"]);

    //turns data into objects
    const [firstRow] = rows.slice(headerRowIndex, headerRowIndex + 1);
    const objects = dataRows.map(row => ({
        discord: row[0],
        ncp: row[1],
        points: Number(row[2].replace(/[^0-9.-]+/g,"")) || 0
    }));

    return objects;
}

/*ATTENDANCE RECORD TAB READING
    uses same structure as getPointsTab
*/
async function getAttendanceTab() {
    const rows = await getParsedCSV(getTabURL("Attendance Record"));

    const headerRowIndex = getHeaderRow(rows, ["Discord Username","NCP Username","Attendances"]);
    if(headerRowIndex === null) return [];

    const dataRows = trimData(rows, headerRowIndex, 0, 2, ["~ ~ ~ ABOVE THIS GRANTS DEDICATION (15) ROLE ~ ~ ~"]);

    const[firstRow] = rows.slice(headerRowIndex, headerRowIndex + 1);
    const objects = dataRows.map(row => ({
        discord: row[0],
        ncp: row[1],
        attendances: Number(row[2].replace(/[^0-9.-]+/g,"")) || 0
    }));

    return objects;
}

async function getMotmTab() {
    const rows = await getParsedCSV(getTabURL("MoTM"));

    const headerRowIndex = getHeaderRow(rows, ["#", "Discord Username", "Ncp Username", "-", "-"]);
    if(headerRowIndex === null) return [];

    const dataRows = trimData(rows, headerRowIndex, 0, 4, []);

    const [firstRow] = rows.slice(headerRowIndex, headerRowIndex + 1);
    const objects = dataRows.map(row => ({
        motmNumber: Number(row[0].replace(/[^0-9.-]+/g,"")) || 0,
        discord: row[1],
        ncp: row[2],
        wins: Number(row[3].replace(/[^0-9.-]+/g,"")) || 0,
        month: row[4]
    }));

    return objects;
}

async function getModHosts(formerStaff) {
    const rows = await getParsedCSV(getTabURL("Mod Hosts Record"));

    if(!formerStaff) {
        const headerRowIndex = getHeaderRow(rows, ["Names", "Hosts"]);
        if(headerRowIndex === null) return [];

        const dataRows = trimData(rows, headerRowIndex, 0, 1, []);

        const [firstRow] = rows.slice(headerRowIndex, headerRowIndex + 1);
        const objects = dataRows.map(row => ({
            name: row[0],
            hosts: Number(row[1].replace(/[^0-9.-]+/g,"")) || 0
        }));

        return objects;
    }

    else {
        const headerRowIndex = getHeaderRow(rows, ["Former Staff"]);
        if(headerRowIndex === null) return [];

        const dataRows = trimData(rows, headerRowIndex, 3, 4, []);

        const [firstRow] = rows.slice(headerRowIndex, headerRowIndex + 1);
        const objects = dataRows.map(row => ({
            name: row[0],
            hosts: Number(row[1].replace(/[^0-9.-]+/g,"")) || 0
        }));

        return objects;
    }
    
}