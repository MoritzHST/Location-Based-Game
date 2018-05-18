function initGameOverviewContent() {
    //Preselect Button Alle (Button Navbar)
    $("#play_all_rooms").focus();

    //On-Click event für QR-Code Button
    $("#btn-scan-qr").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/qr-scanner/qr-scanner.html", function () {
            $("#content-hook").ready(function () {
                initScanner({context: GameViewContext.SCAN_ATTEMPT_FROM_PLAY_OVERVIEW});
            });
        });
    });
    user.locations = {
        "outdoor": [],
        "eg": [],
        "1og": [],
        "2og": []
    };

    ajaxRequest('find/missions', 'GET', "", setLocations);

    $("#outdoor, #eg, #1og, #2og").on("click", updateTables);
}

/**
 * Übernimmt die Daten aus dem Callback in ein Clientseitiges UserObjekt
 * @param pObj
 */
function setLocations(pObj) {
    console.log(pObj);
    for (let i in pObj) {
        if (pObj.hasOwnProperty(i)) {
            let location = pObj[i].location;
            if (!location.roomnumber) {
                user.locations["outdoor"].push(pObj[i]);
                continue;
            }
            if (location.roomnumber.startsWith("1")) {
                user.locations["eg"].push(pObj[i]);
            }
            if (location.roomnumber.startsWith("2")) {
                user.locations["1og"].push(pObj[i]);
            }
            if (location.roomnumber.startsWith("3")) {
                user.locations["2og"].push(pObj[i]);
            }
        }
    }

    updateTables();
}

/**
 * Initialisiert die Tabellarische Übersicht für die einzelnen Locations
 */
function updateTables() {
    $("#labor-frame-container > .labor-frame").each(function () {
        clearNodeHook(this.id);
    });
    //Outdoor setzen
    if ($("#outdoor").prop("checked")) {
        setLayer("outdoor");
    }
    //EG setzen
    if ($("#eg").prop("checked")) {
        setLayer("eg");
    }
    //1OG setzen
    if ($("#1og").prop("checked")) {
        setLayer("1og");
    }
    //2OG setzen
    if ($("#2og").prop("checked")) {
        setLayer("2og");
    }
}

function setLayer(pLayer) {
    var locations = user.locations[pLayer];
    for (let i in locations) {
        if (locations.hasOwnProperty(i)) {
            $('<div/>', {
                id: locations[i]._id + "-hook",
                class: "labor-frame"
            }).appendTo($("#labor-frame-container"));
            setNodeHookFromFile($("#" + locations[i]._id + "-hook"),
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
    mediaObj.find(".overview-table-cell-location-info-name").html(dataObj.exposition.name);
    mediaObj.find("img").attr("src", dataObj.exposition.image);
    mediaObj.find(".description").html(dataObj.exposition.description);
    mediaObj.find(".overview-table-cell-location-state").addClass("overview-room-state-context-" + dataObj.state);
    mediaObj.on("click", function () {
        dataObj.context = GameViewContext.CODE_PENDING;
        setNodeHookFromFile($("#content-hook"), "partials/exposition-info/exposition-info.html", undefined, undefined, "initExpositionInfo", dataObj);
    });
}