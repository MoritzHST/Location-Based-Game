$(document).ready(function() {
    $(".ui-button").prop("disabled", false);

    let eventList = [];

    $.get("/find/events").done(function(result) {
        for ( let event in result) {
            addRow($("#events-list"), result[event], {
                classes : "bs"
            }, {
                text : "date"
            }, {
                text : "name"
            });
            eventList.push(result[event]);
        }
    }).fail(function() {
        // Add fail logic here
    }).always(function() {
        $("#events-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter : 'tr',
            selected : function(event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");

                displayObjects(true, "events-rooms-list", "events-expositions-list", "events-games-list");

                let selectedEvent = eventList[$("#events-list").find(ui.selected).index()];

                for ( let mapping in selectedEvent.locationMappings) {
                    addRow($("#events-rooms-list"), selectedEvent.locationMappings[mapping].location, {
                        classes : "bs"
                    }, {
                        text : "roomnumber"
                    }, {
                        text : "identifier"
                    });
                    addRow($("#events-expositions-list"), selectedEvent.locationMappings[mapping].exposition, {
                        classes : "bs"
                    }, {
                        text : "name"
                    }, {
                        text : "description"
                    });

                    for ( let question in selectedEvent.locationMappings[mapping].games) {
                        selectedEvent.locationMappings[mapping].games[question].typeReadable = Game.getNameByType(selectedEvent.locationMappings[mapping].games[question].type);
                        addRow($("#events-games-list"), selectedEvent.locationMappings[mapping].games[question], {
                            classes : "bs"
                        }, {
                            text : "typeReadable"
                        }, {
                            text : "points"
                        }, {
                            text : "question"
                        });
                    }
                }
            },
            unselected : function(event, ui) {
                displayObjects(false, "events-rooms-list", "events-expositions-list", "events-games-list");
            }
        });
    });
    displayObjects(false, "events-rooms-list", "events-expositions-list", "events-games-list");
});