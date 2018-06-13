$(document).ready(function() {
    $.get("/find/events").done(function(result) {
        for (event in result) {
            var tableRow = $("<tr></tr>");
            var bsCell = $("<td></td>");
            var dateCell = $("<td>" + result[event].date + "</td>");
            var nameCell = $("<td>" + result[event].name + "</td>");

            bsCell.appendTo(tableRow);
            dateCell.appendTo(tableRow);
            nameCell.appendTo(tableRow);
            tableRow.appendTo("#events-list");
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
            }
        });
    });
});