//Neue Events als Map
var newMap = new Map();

$(document).ready(function () {
    let eventList = [];

    $(".ui-button").prop("disabled", true);
    $.get("/find/events").done(function (result) {
        for (let event in result) {
            addRow($("#events-list"), result[event], {classes: "bs"}, {text: "date"}, {text: "name"});
            eventList.push(result[event]);
        }
    }).fail(function () {
        // Add fail logic here
    }).always(function () {
        $("#events-list").bind('mousedown', function (event) {
            event.metaKey = true;
        }).selectable({
            filter: 'tr',
            selected: function (event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");

                $("#events-rooms-list > tr").remove();
                $("#events-expositions-list > tr").remove();
                $("#events-games-list > tr").remove();

                let selectedEvent = eventList[$("#events-list").find(ui.selected).index()];

                for (let mapping in selectedEvent.locationMappings) {
                    addRow($("#events-rooms-list"), selectedEvent.locationMappings[mapping].location, {classes: "bs"}, {text: "roomnumber"}, {text: "identifier"});
                    addRow($("#events-expositions-list"), selectedEvent.locationMappings[mapping].exposition, {classes: "bs"}, {text: "name"}, {text: "description"});

                    for (let question in selectedEvent.locationMappings[mapping].games) {
                        selectedEvent.locationMappings[mapping].games[question].typeReadable = Game.getNameByType(selectedEvent.locationMappings[mapping].games[question].type);
                        addRow($("#events-games-list"), selectedEvent.locationMappings[mapping].games[question], {classes: "bs"}, {text: "typeReadable"}, {text: "points"}, {text: "question"});
                    }
                }
            },
            unselected: function (event, ui) {
                $("#events-rooms-list > tr").remove();
                $("#events-expositions-list > tr").remove();
                $("#events-games-list > tr").remove();
            }
        });
    });

    $("#duplicate-event-button").on("click", function () {
        //Neu initialisieren und flaggen
        let selectedEvent = eventList[$(".ui-selected").prop("id") - 1];
        let newEvent = Object.assign({}, selectedEvent);
        newEvent.isNew = true;
        //Event-Datum clearen
        newEvent.date = undefined;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        newEvent._id = "pseudoId-" + rowId;
        newMap.set(newEvent._id, newEvent);
        appendRow(newEvent);

        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
        switchData();
    });
});
