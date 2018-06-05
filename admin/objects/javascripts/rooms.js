$(document).ready(function() {
    $.get("/find/locations").done(function(result) {
        for (event in result) {
            var tableRow = $("<tr></tr>");
            var bsCell = $("<td></td>");
            var roomCell = $("<td>" + result[event].roomnumber + "</td>");
            var linkCell = $("<td>" + result[event].identifier + "</td>");

            bsCell.appendTo(tableRow);
            roomCell.appendTo(tableRow);
            linkCell.appendTo(tableRow);
            tableRow.appendTo("#rooms-list");
        }
    }).fail(function() {
        // Add fail logic here
    }).always(function() {
        $("#rooms-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter : 'tr',
            selected : function(event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            }
        });
    });
});