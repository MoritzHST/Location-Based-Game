//In der Tabelle gewählter Raum
var selectedEvent;

var eventList = [];
//Neue Ausstellungen als Map
var newMap = new Map();
//Ausstellungen die gelöscht werden sollen
var delMap = new Map();
//Bearbeitete, Persistierte Ausstellungen als Map
var updateMap = new Map();
//Fehlgeschlagene Items bei der Persitierung
var failedItems;

$(document).ready(function () {
    $("#button-save-template.ui-button, #button-import-template.ui-button").prop("disabled", true);
    //Save-Button neu registrieren
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {

        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
        let delList = Array.from(delMap.values());
        for (let i in newList) {
            if (newList.hasOwnProperty(i) && isValid(newList[i])) {
                if (newList[i]._id.startsWith("pseudoId")) {
                    newList[i]._id = undefined;
                }
                newList[i].isNew = undefined;
                calls.push(
                    $.post("/insert/events", newList[i])
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(newList[i]);
                        }));
            }
            else {
                failedItems.push(newList[i]);
            }
        }

        for (let i in updList) {
            if (updList.hasOwnProperty(i) && isValid(updList[i])) {
                calls.push(
                    $.post("/update/events/" + updList[i]._id, updList[i])
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(updList[i]);
                        }));
            }
            else {
                failedItems.push(updList[i]);
            }
        }
        for (let i in delList) {
            if (delList.hasOwnProperty(i)) {
                calls.push(
                    $.post("/delete/events", {_id: delList[i]._id})
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(updList[i]);
                        }));
            }
            else {
                failedItems.push(updList[i]);
            }
        }

        $.when.apply($, calls).done(function () {
            init()
                .then(function () {
                    for (let i in failedItems) {
                        if (failedItems[i].isNew) {
                            appendRow(failedItems[i]);
                            $("#" + (rowId)).addClass("failed");
                        }
                        else {
                            for (let j in expositionList) {
                                if (expositionList[j]._id && expositionList[j]._id.toString() === failedItems[i]._id.toString()) {
                                    $("#" + j).addClass("failed");
                                }
                            }
                        }
                    }
                });
        });
    });
    getNeededData(eventList);

    $("#delete-event-button").addClass("disabled");
    $("#new-mapping-button").addClass("disabled");
    $("#delete-mapping-button").addClass("disabled");
    $("#duplicate-event-button").addClass("disabled");

    $("input[type='checkbox'], input[type='radio']").prop("disabled", true);
    $(".ui-button").prop("disabled", false);

    $("#events-table-default > tbody.table-list").bind('mousedown', function (event) {
        event.metaKey = true;
    }).selectable({
        filter: 'tr',
        selected: function (event, ui) {
            $("#events-table-mapping > tbody").empty();
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            $("#delete-event-button").removeClass("disabled");
            $("#new-mapping-button").removeClass("disabled");
            $("#duplicate-event-button").removeClass("disabled");
            let deleteMappingButton = $("#delete-mapping-button");
            deleteMappingButton.addClass("disabled");
            deleteMappingButton.addClass("disabled");
            let checkBox = $("input[type='checkbox'], input[type='radio']");
            checkBox.prop("checked", false);
            checkBox.prop("disabled", true);

            selectedEvent = eventList[$("#events-table-default > tbody.table-list").find(ui.selected).index()];

            let eventTableMapping = $("#events-table-mapping");
            fillTable(eventTableMapping, selectedEvent.locationMappings);
            eventTableMapping.find("tbody:first").attr("id", "tbody-" + selectedEvent._id);
        },
        unselected: function () {
            $("#events-table-mapping > tbody").empty();
            $("#new-mapping-button").addClass("disabled");
            $("#delete-event-button").addClass("disabled");
            $("#duplicate-event-button").addClass("disabled");
            let checkBox = $("input[type='checkbox'], input[type='radio']");
            checkBox.prop("checked", false);
            checkBox.prop("disabled", true);
        }
    });

    $("#events-table-mapping > tbody.table-list").bind('mousedown', function (event) {
        event.metaKey = true;
    }).selectable({
        filter: 'tr',
        selected: function (event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            $("#delete-mapping-button").removeClass("disabled");
            $("#new-mapping-button").removeClass("disabled");
            let checkInputs = $("input[type='checkbox'], input[type='radio']");
            checkInputs.prop("disabled", false);
            checkInputs.prop("checked", false);

            let selectedMap;
            for (let i = 0; i < eventList.length; i++) {
                if ("tbody-" + String(eventList[i]._id) === ui.selected.closest("tbody").id) {
                    selectedMap = eventList[i].locationMappings[$("#events-table-mapping > tbody.table-list").find(ui.selected).index()];
                    break;
                }
            }

            // Vergleich mit Räume
            $("#events-table-locations > tbody").find("tr").each(function () {
                if (String(selectedMap.location._id) === $(this).attr("id").slice(3)) {
                    $(this).find("input[type]").prop("checked", true);
                    return false;
                }
            });

            // Vergleich mit Ausstellungen
            $("#events-table-expositions > tbody").find("tr").each(function () {
                if (String(selectedMap.exposition._id) === $(this).attr("id").slice(3)) {
                    $(this).find("input[type]").prop("checked", true);
                    return false;
                }
            });

            // Vergleich mit Spiele
            $("#events-table-games > tbody").find("tr").each(function () {
                for (let game of selectedMap.games) {
                    if (String(game._id) === $(this).attr("id").slice(3)) {
                        $(this).find("input[type]").prop("checked", true);
                    }
                }
            });
        },
        unselected: function () {
            let deleteMappingButton = $("#delete-mapping-button");
            deleteMappingButton.addClass("disabled");
            deleteMappingButton.addClass("disabled");
            let checkBox = $("input[type='checkbox'], input[type='radio']");
            checkBox.prop("checked", false);
            checkBox.prop("disabled", true);
        }
    });
    $("#duplicate-event-button").on("click", function () {
        //Neu initialisieren und flaggen
        if (!selectedEvent) {
            return;
        }
        let newEvent = Object.assign({}, selectedEvent);
        newEvent.isNew = true;
        //Event-Datum clearen
        newEvent.date = undefined;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        newEvent._id = "pseudoId-" + rowId;
        newMap.set(newEvent._id, newEvent);
        appendRow(newEvent);

        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
    });

    $("#new-event-button").on("click", function () {
        //Einmal das alte Objekt speichern
        storeOld();
        //Neu initialisieren und flaggen
        selectedEvent = {};
        selectedEvent.isNew = true;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        selectedEvent._id = "pseudoId-" + rowId;
        selectedEvent.name = "";
        selectedEvent.date = undefined;
        selectedEvent.locationMappings = [];

        appendRow(selectedEvent);

        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
        switchData();
    });

    $("#delete-event-button").on("click", function () {
        //Neu initialisieren und flaggen
        if (!selectedEvent) {
            return;
        }
        selectedEvent.remove = true;
        $(".ui-selected").find(".bs").addClass("delete-item");
        delMap.set(selectedEvent._id, selectedEvent);
        storeOld();
    });
});

/*
 * Lädt alle notwendigen Daten aus der Datenbank
 */
function getNeededData(eventList) {
    $.holdReady(true);
    $.get("/find/events").done(function (events) {

        if (events.length > 0) {
            for (let index in events) {
                if (events.hasOwnProperty(index)) {
                    fillTable($("#events-table-default"), events[index]);
                    eventList.push(events[index]);
                }
            }
        } else {
            fillTable($("#events-table-default"), null);
        }
    }).fail(function () {
        $("#events-load-failure").append($("<li />", {
            text: "Die Event Daten konnten nicht geladen werden."
        }));
        $("#events-table-default").hide();
    }).always(function () {
        $.holdReady(false);
    });

    /*
     * Lädt alle Verfügbaren Räume aus der Datenbank
     */
    loadData("locations", "radio");

    /*
     * Lädt alle Verfügbaren Ausstellungen aus der Datenbank
     */
    loadData("expositions", "radio");

    /*
     * Lädt alle Verfügbaren Spiele aus der Datenbank
     */
    loadData("games", "checkbox");

}

function loadData(dataName, checkType) {
    $.holdReady(true);
    $.get("/find/" + dataName).done(function (result) {
        if (result.length > 0) {
            for (let index in result) {
                if (result.hasOwnProperty(index)) {
                    result[index].check = $("<input />", {
                        type: checkType,
                        id: "check-" + result[index]._id
                    });
                    fillTable($("#events-table-" + dataName), result[index]);
                }
            }
        } else {
            fillTable($("#events-table-" + result), null);
        }
    }).fail(function () {
        $("#events-load-failure").append($("<li />", {
            text: "Die " + dataName + " Daten konnten nicht geladen werden."
        }));
        $("#events-table-" + dataName).hide();
    }).always(function () {
        $.holdReady(false);
    });
}

function appendRow(pObj) {
    //Ist die Event initialisiert? Wenn nein tu es
    if (!(Array.isArray(eventList))) {
        eventList = [];
    }
    let tableRow = addRow($("#events-list"), pObj, {classes: "event-bs-cell " + (pObj.isNew ? "new-item" : "")},
        {classes: "", text: "date"}
        , {classes: "align-left", text: "name"});
    //Objekt der Liste hinzufüge
    eventList.push(pObj);
}

// Bezeichnung und Beschreibung darf nicht leer sein
function isValid(pObj) {
    if (!pObj.name || pObj.name.trim() === "") {
        return false;
    }

    return true;
}

function storeOld() {
    if (!selectedEvent) {
        return;
    }

    if (selectedEvent._id.startsWith("pseudoId-")) {
        if (selectedEvent.remove) {
            newMap.delete(selectedEvent._id);
        }
        else {
            newMap.set(selectedEvent._id, selectedEvent);
        }
    }
    else if (selectedEvent._id) {
        if (selectedEvent.remove) {
            updateMap.delete(selectedEvent._id);
        }
        else {
            updateMap.set(selectedEvent._id, selectedEvent);
        }
    }

}