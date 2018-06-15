$(document).ready(function() {
    let eventList = [];

    $(".ui-button").prop("disabled", true);
    $.get("/find/events").done(function(result) {
        for ( let event in result) {
            addRow($("#events-list"), result[event], "bs", "date", "name");
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

                $("#events-rooms-list > tr").remove();
                $("#events-expositions-list > tr").remove();
                $("#events-games-list > tr").remove();

                let selectedEvent = eventList[$("#events-list").find(ui.selected).index()];

                for ( let mapping in selectedEvent.locationMappings) {
                    addRow($("#events-rooms-list"), selectedEvent.locationMappings[mapping].location, "bs", "roomnumber","identifier");
                    addRow($("#events-expositions-list"), selectedEvent.locationMappings[mapping].exposition, "bs", "name","description");

                    for ( let question in selectedEvent.locationMappings[mapping].games) {
                        addRow($("#events-games-list"), selectedEvent.locationMappings[mapping].games[question], "bs", "type", "points", "question");
                    }
               }
            },
            unselected : function(event, ui) {
                $("#events-rooms-list > tr").remove();
                $("#events-expositions-list > tr").remove();
                $("#events-games-list > tr").remove();
            }
        });
    });
});

function addRow(tableBody, data, bs, ...params) {
    let tableRow = $("<tr></tr>");
    if (bs)
        $("<td></td>").appendTo(tableRow);

    for (let val of params) {
        $("<td>" + data[val] + "</td>").appendTo(tableRow);
    }
    tableRow.appendTo(tableBody);
}