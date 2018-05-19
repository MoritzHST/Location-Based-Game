function initGameOverviewContent() {
    // Preselect Button Alle (Button Navbar)
    $("#play_all_rooms").focus();

    // On-Click event für QR-Code Button
    $("#btn-scan-qr").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/qr-scanner/qr-scanner.html", function () {
            $("#content-hook").ready(function () {
                initScanner({context: GameViewContext.SCAN_ATTEMPT_FROM_PLAY_OVERVIEW});
            });
        });
    });


    user.locations = {};
    // Legt für jede Checkbox innerhalb einer bestimmten Gruppe eine
    // Location-Eigenschaft fest
    $("#play_filter > label.btn.btn-secondary.host-button-group-button > input[type='checkbox']").each(function() {
        user.locations[$(this).val()] = [];
    });

    // Sucht nach allen Benutzer-Raum Relationen und baut damit eine Übersicht
    // zusammen
    $.get("find/missions").done(function(pData) {
        setLocations(pData);

        for (let i in user.locations) {
            if (user.locations.hasOwnProperty(i))
                setLayer(i);
        }
    });

    // Wenn auf ein bestimmtes label geklickt wird, so wird gleichzeitig das
    // kind-input-element berührt
    $("label.btn.btn-secondary.host-button-group-button").on("click", function() {
        $(this).children("input").click();
    });

    // Handhabt die Sichtbarkeit bei check wechsel
    $("label.btn.btn-secondary.host-button-group-button > input[type='checkbox']").on("click", function() {
        $("div.labor-frame.floor-" + $(this).val()).toggle($(this).checked);
    });
}

/**
 * Übernimmt die Daten aus dem Callback in ein Clientseitiges UserObjekt
 * @param pObj Raumliste
 */
function setLocations(pObj) {
    console.log(pObj);
    for (let i in pObj) {
        if (pObj.hasOwnProperty(i)) {
            let location = pObj[i].location;
            location.roomnumber = !location.roomnumber || location.roomnumber === "" ? "0" : location.roomnumber;

            let currentLocation = user.locations[location.roomnumber.substring(0,1)];

            if (currentLocation)
                currentLocation.push(pObj[i]);
        }
    }
}


/**
 * Legt den Rahmen für RaumObjekte fest. (Darstellung in der Übersicht)
 * @param pLayer user location layer
 */
function setLayer(pLayer) {
    var locations = user.locations[pLayer];

    for (let i in locations) {
        if (locations.hasOwnProperty(i)) {
            $('<div/>', {
                id: locations[i]._id + "-hook",
                class: "labor-frame floor-" + pLayer
            }).appendTo($("#labor-frame-container"));

            setNodeHookFromFile($("#" + locations[i]._id + "-hook"),
            "../partials/overview-table-cell/overview-table-cell.html", setTableContent,
            locations[i]);
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