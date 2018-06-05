$(document).ready(function() {
    $.get("/find/expositions").done(function(result) {
        for (event in result) {
            var tableRow = $("<tr></tr>");
            var bsCell = $("<td></td>");
            var nameCell = $("<td>" + result[event].name + "</td>");
            var description = result[event].description.length > 120 ? result[event].description.substring(0, 117) + "..." : result[event].description;
            var descriptionCell = $("<td>" + $("<p>" + description + "</p>").text() + "</td>");

            bsCell.appendTo(tableRow);
            nameCell.appendTo(tableRow);
            descriptionCell.appendTo(tableRow);
            tableRow.appendTo("#expositions-list");
        }
    }).fail(function() {
        // Add fail logic here
    }).always(function() {
        $("#expositions-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter : 'tr',
            selected : function(event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            }
        });
    });
});