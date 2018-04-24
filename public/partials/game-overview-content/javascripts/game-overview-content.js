function initGameOverviewContent() {
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
    setLayer("outdoor");
    //EG setzen
    setLayer("eg");
    //1OG setzen
    setLayer("1og");
    //2OG setzen
    setLayer("2og");
}

function setLayer(pLayer) {
    var locations = user.locations[pLayer];
    for (let i in locations) {
        if (locations.hasOwnProperty(i)) {
            $('<div/>', {
                id: locations[i]._id + "-hook"
            }).appendTo($("#" + pLayer));
            setNodeHookFromFile(document.getElementById(locations[i]._id + "-hook"),
                "../partials/overview-table-cell/overview-table-cell.html", setTableContent, (locations[i]));
        }
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