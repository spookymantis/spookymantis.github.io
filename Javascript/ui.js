//DISPLAY POINTS RECORD DATA
async function loadPoints() {
    const points = await getPointsTab(sheetID);
    console.log("POINTS RECORD:");
    console.log(points); //print to console for now, put as UI elements later
}

//DISPLAY ATTENDANCE RECORD DATA
async function loadAttendances() {
    const attendances = await getAttendanceTab();
    console.log("ATTENDANCE RECORD:");
    console.log(attendances);
}

async function loadMotms() {
    const motms = await getMotmTab();
    console.log("MOTM RECORD:");
    console.log(motms);
}

async function loadModHosts() {
    const currentHosts = await getModHosts(false);
    console.log("MOD HOSTS RECORD");
    console.log(currentHosts);
    const formerHosts = await getModHosts(true);
    console.log("FORMER STAFF HOSTS:");
    console.log(formerHosts);
}

async function loadAll() {
    await loadPoints();
    await loadAttendances();
    await loadMotms();
    await loadModHosts();
}

loadAll();