$(document).ready(function() {
    let eventList = [];

    getNeededData(eventList);

    $("#delete-event-button").addClass("disabled");
    $("#delete-mapping-button").addClass("disabled");
    $("input[type='checkbox'], input[type='radio']").prop("disabled", true);
    $(".ui-button").prop("disabled", false);

    $("#events-table-default > tbody.table-list").bind('mousedown', function(event) {
        event.metaKey = true;
    }).selectable({
        filter : 'tr',
        selected : function(event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            $("#delete-event-button").removeClass("disabled");

            let selectedEvent = eventList[$("#events-table-default > tbody.table-list").find(ui.selected).index()];
            fillTable($("#events-table-mapping"), selectedEvent.locationMappings);
            $("#events-table-mapping").find("tbody:first").attr("id", "tbody-" + selectedEvent._id);
        },
        unselected : function() {
            $("#events-table-mapping > tbody").empty();
            $("#delete-event-button").addClass("disabled");
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);
            $("input[type='checkbox'], input[type='radio']").prop("disabled", true);
        }
    });

    $("#events-table-mapping > tbody.table-list").bind('mousedown', function(event) {
        event.metaKey = true;
    }).selectable({
        filter : 'tr',
        selected : function(event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            $("#delete-mapping-button").removeClass("disabled");
            $("input[type='checkbox'], input[type='radio']").prop("disabled", false);
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);

            let selectedMap;
            for (let i = 0; i < eventList.length; i++) {
                if ("tbody-" + String(eventList[i]._id) === ui.selected.closest("tbody").id) {
                    selectedMap = eventList[i].locationMappings[$("#events-table-mapping > tbody.table-list").find(ui.selected).index()];
                    break;
                }
            }

            // Vergleich mit Räume
            $("#events-table-locations > tbody").find("tr").each(function() {
                if (String(selectedMap.location._id) === $(this).attr("id").slice(3)) {
                    $(this).find("input[type]").prop("checked", true);
                    return false;
                }
            });

            // Vergleich mit Ausstellungen
            $("#events-table-expositions > tbody").find("tr").each(function() {
                if (String(selectedMap.exposition._id) === $(this).attr("id").slice(3)) {
                    $(this).find("input[type]").prop("checked", true);
                    return false;
                }
            });

            // Vergleich mit Spiele
            $("#events-table-games > tbody").find("tr").each(function() {
                    for (let game of selectedMap.games) {
                        if (String(game._id) === $(this).attr("id").slice(3)) {
                            $(this).find("input[type]").prop("checked", true);
                        }
                    }
            });
        },
        unselected : function() {
            $("#delete-mapping-button").addClass("disabled");
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);
            $("input[type='checkbox'], input[type='radio']").prop("disabled", true);
        }
    });
});

/*
 * Lädt alle notwendigen Daten aus der Datenbank
 */
function getNeededData(eventList) {
    $.holdReady(true);
    $.get("/find/events").done(function(events) {

        if (events.length > 0) {
            for ( let index in events) {
                if (events.hasOwnProperty(index)) {
                    fillTable($("#events-table-default"), events[index]);
                    eventList.push(events[index]);
                }
            }
        } else {
            fillTable($("#events-table-default"), null);
        }
    }).fail(function() {
        $("#events-load-failure").append($("<li />", {
            text : "Die Event Daten konnten nicht geladen werden."
        }));
        $("#events-table-default").hide();
    }).always(function() {
        $.holdReady(false);
    });

    /*
     * Lädt alle Verfügbaren Räume aus der Datenbank
     */
    $.holdReady(true);
    $.get("/find/locations").done(function(locations) {
        if (locations.length > 0) {
            for ( let index in locations) {
                if (locations.hasOwnProperty(index)) {
                    locations[index].check = $("<input />", {
                        type : "radio",
                        id : "check-" + locations[index]._id
                    });
                    fillTable($("#events-table-locations"), locations[index]);
                }
            }
        } else {
            fillTable($("#events-table-locations"), null);
        }
    }).fail(function() {
        $("#events-load-failure").append($("<li />", {
            text : "Die Location Daten konnten nicht geladen werden."
        }));
        $("#events-table-location").hide();
    }).always(function() {
        $.holdReady(false);
    });

    /*
     * Lädt alle Verfügbaren Ausstellungen aus der Datenbank
     */
    $.holdReady(true);
    $.get("/find/expositions").done(function(expositions) {
        if (expositions.length > 0) {
            for ( let index in expositions) {
                if (expositions.hasOwnProperty(index)) {
                    expositions[index].check = $("<input />", {
                        type : "radio",
                        id : "check-" + expositions[index]._id
                    });
                    fillTable($("#events-table-expositions"), expositions[index]);
                }
            }
        } else {
            fillTable($("#events-table-expositions"), null);
        }
    }).fail(function() {
        $("#events-load-failure").append($("<li />", {
            text : "Die Ausstellung Daten konnten nicht geladen werden."
        }));
        $("#events-table-expositions").hide();
    }).always(function() {
        $.holdReady(false);
    });

    /*
     * Lädt alle Verfügbaren Spiele aus der Datenbank
     */
    $.holdReady(true);
    $.get("/find/games").done(function(games) {
        if (games.length > 0) {
            for ( let index in games) {
                if (games.hasOwnProperty(index)) {
                    games[index].check = $("<input />", {
                        type : "checkbox",
                        id : "check-" + games[index]._id
                    });
                    fillTable($("#events-table-games"), games[index]);
                }
            }
        } else {
            fillTable($("#events-table-games"), null);
        }
    }).fail(function() {
        $("#events-load-failure").append($("<li />", {
            text : "Die Games Daten konnten nicht geladen werden."
        }));
        $("#events-table-games").hide();
    }).always(function() {
        $.holdReady(false);
    });
}