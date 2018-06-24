$(document).ready(function() {
    // Diese toggleAction Methode müßte in
    // die "beforeLoad" Option von der editor.js
    // Dazu müßten spiele, ausstellungen & galerie zuvor an dem stil von
    // diesem javascript angepasst werden
    toggleAction(false, $("#button-save"));

    onTabLoad();
    $("#events-div-mapping").hide();

    window.storage = {
        selectedEventIndex: -1,
        selectedMapIndex: -1,
        eventsList: [],
        roomsLis: [],
        expositionsList: [],
        gamesList: []
    };

    $("#events-div-accordion").accordion({
        collapsible: true,
        heightStyle: "content",
        active: "false",
        autoHeight: false
    });

    $("div#sidebar").on("click", "#button-save", function() {
        let saveIsOk = true;
        for ( let event in storage.eventsList) {
            if (storage.eventsList.hasOwnProperty(event)) {
                let row = $("#events-table-events > tbody.table-list").children("tr").eq(event);
                let result = rowIsInvalid(storage.eventsList, storage.eventsList[event]);

                row.removeAttr("title");
                row.removeClass("failed");

                if (storage.eventsList.hasOwnProperty(event) && !result) {
                    // ... nix zu tun
                } else {
                    for ( let r in result) {
                        let propText = $("#events-table-events > thead:first").find("th." + result[r].property + ":first").text();

                        if (result[r].property === "status" || !propText) continue;

                        switch (result[r].reason) {
                        case "date-format":
                            if (result[r].property === "name")
                                continue;

                            row.attr("title", "Der folgende Bereich hat nicht das richtige Format: " + propText);
                            break;
                        case "empty":
                            if (result[r].property === "date")
                                continue;

                            row.attr("title", "Das folgende Feld darf nicht leer sein: " + propText);
                            break;
                        default:
                            continue;
                            break;
                        }

                        row.addClass("failed");

                        saveIsOk &= false;
                    }
                }
            }
        }

         if (saveIsOk) {
         let failureList = $("#events-load-failure");
         $(".loadingPanel").show();

         for (let event in storage.eventsList) {
             for (let map in storage.eventsList[event].locationMappings) {
                 if (storage.eventsList[event].locationMappings[map].status === "delete") {
                     storage.eventsList[event].locationMappings.splice(map,1);
                 }
             }
         }

         callAction("Das Event mit der ID {0} konnte nicht {1} werden.", "events",
             storage.eventsList, "_id", failureList, function() {
                 let activeIndex = $("#editor").find("li.ui-tabs-active.ui-state-active:first").index();
                 $("#editor").tabs().tabs('load', activeIndex);
             });
         }
    });

    // Lädt alle Event Daten
    loadDataIntoTable("events", "events", null, function(result) {
        storage.eventsList = result;

        // Handelt das Klicken auf eine Event Reihe
        $("#events-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter: 'tr',
            selected: function (event, ui) {
                storage.selectedMapIndex = -1;
                toggleField(false, $("#events-div-accordion"));

                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                $("input[type='checkbox'], input[type='radio']").prop("checked", false);
                $("#delete-mapping-button").prop("disabled", true);
                $("#delete-event-button, #duplicate-event-button").prop("disabled", false);
                $("#events-table-mapping > tbody.table-list").empty();

                storage.selectedEventIndex = $("#events-table-events > tbody.table-list").find(ui.selected).index();
                let selectedEvent = clone(storage.eventsList[storage.selectedEventIndex]);
                $("#events-table-mapping").find("tbody:first").attr("id", "tbody-" + selectedEvent._id);
                fillTable($("#events-table-mapping"), selectedEvent.locationMappings);
                toggleField(true, $(".details"), selectedEvent);

                if(selectedEvent.status)
                    $("#delete-event-button").prop("disabled", true);

                $("#events-div-mapping").show();

                $("div.details").find("input").off("input");
                $("div.details").find("input").on("input", function() {
                    let cellClass = $(this).attr('class').split(' ')[0];
                    let selector = $("#events-table-events").children("thead:first").find("th." + cellClass).index();

                    selectedEvent[cellClass] = $(this).val();
                    $(ui.selected).children("td").eq(selector).text($(this).val());

                    if (!selectedEvent.status) {
                        selectedEvent.status = "update";
                        $(ui.selected).children("td").eq(0).addClass("edit-item");
                    }

                    storage.eventsList[storage.selectedEventIndex] = selectedEvent;
                    $("#delete-event-button").prop("disabled", true);
                    toggleAction(true, $("#button-save"));
                });
            },
            unselected: function () {
                $("div.details").find("input").off("input");
                toggleField(false, $("#events-div-accordion"));
                toggleField(false, $(".details"), storage.eventsList[storage.selectedEventIndex]);

                storage.selectedEventIndex = -1;
                storage.selectedMapIndex = -1;

                $("input[type='checkbox'], input[type='radio']").prop("checked", false);
                $("#delete-event-button, #duplicate-event-button").prop("disabled", true);
                $("#events-table-mapping > tbody.table-list").empty();
                $("#events-div-mapping").hide();
            }
        });
    });

    // Lädt alle Raum Daten
    loadDataIntoTable("events", "locations", "radio", function(result) {
        storage.roomsList = result;
    });

    // Lädt alle Ausstellung Daten
    loadDataIntoTable("events", "expositions", "radio", function(result) {
        storage.expositionsList = result;
    });

    // Lädt alle Spiel Daten
    loadDataIntoTable("events", "games", "checkbox", function(result) {
        storage.gamesList = result;
    });

    // Handelt das Klicken auf eine Mapping-Reihe
    $("#events-table-mapping > tbody.table-list").bind('mousedown', function(event) {
        event.metaKey = true;
    }).selectable({
        filter: 'tr',
        selected: function (event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            $("#delete-mapping-button").prop("disabled", false);
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);
            for (let i = 0; i < storage.eventsList.length; i++) {
                if ("tbody-" + String(storage.eventsList[i]._id) === ui.selected.closest("tbody").id) {
                    storage.selectedMapIndex = $("#events-table-mapping > tbody.table-list").find(ui.selected).index();
                    break;
                }
            }

            let selectedMap = clone(storage.eventsList[storage.selectedEventIndex].locationMappings[storage.selectedMapIndex]);

            if (selectedMap.status)
                $("#delete-mapping-button").prop("disabled", true);

            if (selectedMap) {
                // Vergleich mit Räume
                $("#events-table-locations > tbody.table-list").find("tr").each(function () {
                    if (String(selectedMap.location._id) === $(this).attr("id").slice(3)) {
                        $(this).find("input[type]").prop("checked", true);
                        return false;
                    }
                });

                // Vergleich mit Ausstellungen
                $("#events-table-expositions > tbody.table-list").find("tr").each(function () {
                    if (String(selectedMap.exposition._id) === $(this).attr("id").slice(3)) {
                        $(this).find("input[type]").prop("checked", true);
                        return false;
                    }
                });

                // Vergleich mit Spiele
                $("#events-table-games > tbody.table-list").find("tr").each(function () {
                    for (let game of selectedMap.games) {
                        if (String(game._id) === $(this).attr("id").slice(3)) {
                            $(this).find("input[type]").prop("checked", true);
                        }
                    }
                });
            }
            toggleField(true, $("#events-div-accordion"));
        },
        unselected: function () {
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);
            toggleField(false, $("#events-div-accordion"));
            $("#delete-mapping-button").prop("disabled", true);
        }
    });

    $('tbody.table-list').off('change');
    $('tbody.table-list').on('change','input', function(){
        toggleField(false, $("#events-div-accordion"));
        let id = $(this).attr("id").slice(6);

        let type = $(this).closest("tbody").attr("id");
        let selectedMap = clone(storage.eventsList[storage.selectedEventIndex].locationMappings[storage.selectedMapIndex]);

        // Füge die content Änderungen dem aktuellen Mapping hinzu
        if (selectedMap) {
            switch (type) {
                case "exposition":
                    for (let e in storage.expositionsList) {
                        if (storage.expositionsList[e]._id === id) {
                            selectedMap.exposition = storage.expositionsList[e];
                            break;
                        }
                    }
                    break;
                case "location":
                    for (let l in storage.roomsList) {
                        if (storage.roomsList[l]._id === id) {
                            selectedMap.location = storage.roomsList[l];
                            break;
                        }
                    }
                    break;
                case "games":
                    let game;
                    for (let g in storage.gamesList) {
                        if (storage.gamesList[g]._id === id) {
                            game = clone(storage.gamesList[g]);
                            break;
                        }
                    }

                    handleObjectInArray(selectedMap.games, game);
                    break;
            }
        }

        let selectedRow = $("#events-table-mapping > tbody.table-list").children("tr").eq(storage.selectedMapIndex);

        // Füge die Mapping Änderungen dem aktuellen Event hinzu
        if (!selectedMap.status) {
            selectedMap.status = "update";
            selectedRow.children("td").eq(0).addClass(selectedMap.status + "-icon");
            toggleAction(true, $("#button-save"));
        }

        updateRowContent(selectedRow, createDataRow(selectedMap, getTableHeaderAttributes($("#events-table-mapping > thead:first"))));

        let selectedEvent = clone(storage.eventsList[storage.selectedEventIndex]);
        selectedEvent.locationMappings[storage.selectedMapIndex] = selectedMap;

        if(!selectedEvent.status) {
            selectedEvent.status = "update";
            $("#events-table-events > tbody.table-list").find("tr").eq(storage.selectedEventIndex).children("td").eq(0).addClass(selectedEvent.status + "-icon");
        }

        // Füge die Event Änderungen der Event Liste hinzu
        for (let ev in storage.eventsList) {
            if (storage.eventsList[ev]._id === selectedEvent._id) {
                storage.eventsList[ev] = selectedEvent;
                break;
            }
        }

        toggleField(true, $("#events-div-accordion"));
    });

    // Handlet das Click Event beim drücken des "Hinzufügen" (+) Buttons
    $("#new-event-button").off("click");
    $("#new-event-button").on("click", function() {
        let event = {
                status: "insert",
                name: "",
                date: "",
                locationMappings: []
            };
        storage.eventsList.push(event);

        let tableRow = createDataRow(event, getTableHeaderAttributes($("#events-table-events > thead:first")));
        tableRow.children("td").eq(0).addClass("insert-icon");
        let tbody = $("#events-list");
        tableRow.appendTo(tbody);
        selectSelectableElement (tbody, tableRow);
        toggleAction(true, $("#button-save"));
    });

    // Handlet das Click Event beim drücken des "Hinzufügen" (+) Buttons
    $("#duplicate-event-button").off("click");
    $("#duplicate-event-button").on("click", function() {
        let event = clone(storage.eventsList[storage.selectedEventIndex]);
        event.status = "insert",
        event.date = "";
        delete event._id;
        storage.eventsList.push(event);

        let tableRow = createDataRow(event, getTableHeaderAttributes($("#events-table-events > thead:first")));
        tableRow.children("td").eq(0).addClass("insert-icon");
        let tbody = $("#events-list");
        tableRow.appendTo(tbody);
        selectSelectableElement (tbody, tableRow);
        toggleAction(true, $("#button-save"));
    });

    // Handlet das Click Event beim drücken des "Löschen" (-) Buttons
    $("#delete-event-button").off("click");
    $("#delete-event-button").on("click", function() {
        let tableRow = $("#events-table-events > tbody").find("tr").eq(storage.selectedEventIndex);
        tableRow.children("td").eq(0).addClass("delete-item");

        storage.eventsList[storage.selectedEventIndex].status = "delete";
        $("#delete-event-button").prop("disabled", true);
        toggleAction(true, $("#button-save"));
    });

    // Handlet das Click Event beim drücken des "Hinzufügen" (+) Buttons
    $("#new-mapping-button").off("click");
    $("#new-mapping-button").on("click", function() {
        let map = {
                status: "insert",
                location: "",
                exposition: "",
                games: []
            };

        let mapping = storage.eventsList[storage.selectedEventIndex].locationMappings;
        mapping.push(map);

        let tableRow = createDataRow(map, getTableHeaderAttributes($("#events-table-mapping > thead:first")));
        tableRow.children("td").eq(0).addClass("insert-icon");
        let tbody = $("#events-table-mapping > tbody:first");
        tableRow.appendTo(tbody);
        selectSelectableElement (tbody, tableRow);
        toggleAction(true, $("#button-save"));
    });

    // Handlet das Click Event beim drücken des "Löschen" (-) Buttons
    $("#delete-mapping-button").off("click");
    $("#delete-mapping-button").on("click", function() {
        let tableRow = $("#events-table-mapping > tbody").find("tr").eq(storage.selectedMapIndex);
        tableRow.children("td").eq(0).addClass("delete-item");

        storage.eventsList[storage.selectedEventIndex].locationMappings[storage.selectedMapIndex].status = "delete";
        $("#delete-mapping-button").prop("disabled", true);
        toggleAction(true, $("#button-save"));

        let selectedEvent = storage.eventsList[storage.selectedEventIndex];
        if(!selectedEvent.status) {
            selectedEvent.status = "update";
            $("#events-table-events > tbody.table-list").find("tr").eq(storage.selectedEventIndex).children("td").eq(0).addClass(selectedEvent.status + "-icon");
        }
    });
});