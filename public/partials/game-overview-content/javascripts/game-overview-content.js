function initGameOverviewContent() {
    //Preselect Button Alle (Button Navbar)
    $("#play_all_rooms").focus();

    user.locations = {
        "outdoor": [],
        "eg": [],
        "1og": [],
        "2og": []
    };

    ajaxRequest('find/rooms', 'GET', "", setLocations);
}

/**
 * Übernimmt die Daten aus dem Callback in ein Clientseitiges UserObjekt
 * @param pObj
 */
function setLocations(pObj) {
    for (let i in pObj) {
        if (pObj[i].roomnumber === null) {
            user.locations["outdoor"].push(pObj[i]);
        }
        if (pObj[i].roomnumber.startsWith("1")) {
            user.locations["eg"].push(pObj[i]);
        }
        if (pObj[i].roomnumber.startsWith("2")) {
            user.locations["1og"].push(pObj[i]);
        }
        if (pObj[i].roomnumber.startsWith("3")) {
            user.locations["2og"].push(pObj[i]);
        }
    }

    updateTables();
}

/**
 * Initialisiert die Tabellarische Übersicht für die einzelnen Locations
 */
function updateTables() {
    //Outdoor setzen
    for (let i in user.locations["outdoor"]) {
        $('<div/>', {
            id: user.locations["outdoor"][i]._id + "-hook"
        }).appendTo($("#outdoor"));
        setNodeHookFromFile(document.getElementById(user.locations["outdoor"][i]._id + "-hook"),
            "../partials/overview-table-cell/overview-table-cell.html", setTableContent, (user.locations["outdoor"][i]));
    }
    //EG setzen
    for (let i in user.locations["eg"]) {
        $('<div/>', {
            id: user.locations["eg"][i]._id + "-hook"
        }).appendTo($("#eg"));
        setNodeHookFromFile(document.getElementById(user.locations["eg"][i]._id + "-hook"),
            "../partials/overview-table-cell/overview-table-cell.html", setTableContent, (user.locations["eg"][i]));
    }
    //1OG setzen
    for (let i in user.locations["1og"]) {
        $('<div/>', {
            id: user.locations["1og"][i]._id + "-hook"
        }).appendTo($("#1og"));
        setNodeHookFromFile(document.getElementById(user.locations["1og"][i]._id + "-hook"),
            "../partials/overview-table-cell/overview-table-cell.html", setTableContent, (user.locations["1og"][i]));
    }
    //2OG setzen
    for (let i in user.locations["2og"]) {
        $('<div/>', {
            id: user.locations["2og"][i]._id + "-hook"
        }).appendTo($("#2og"));
        setNodeHookFromFile(document.getElementById(user.locations["2og"][i]._id + "-hook"),
            "../partials/overview-table-cell/overview-table-cell.html", setTableContent, (user.locations["2og"][i]));
    }
}

/**
 * Für die generierten Hooks aus UpdateTable wird über die ID das Raum-ELement generiert
 * @param dataObj
 */
function setTableContent(dataObj) {
    let mediaObj = $("#" + dataObj._id + "-hook");
    mediaObj.find(".title").html(dataObj.name);
    mediaObj.find("img").attr("src", dataObj.image);
    mediaObj.find(".description").html(dataObj.description);
}