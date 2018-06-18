$(document).ready(function() {
    $(".ui-button").prop("disabled", false);
    $.get("/find/games").done(function(result) {
        for (event in result) {
            var tableRow = $("<tr></tr>");
            var bsCell = $("<td></td>");
            var typeCell = $("<td>" + Game.getNameByType(result[event].type) + "</td>");
            var pointsCell = $("<td>" + result[event].points + "</td>");
            var questionCell = $("<td>" + result[event].question + "</td>");

            bsCell.appendTo(tableRow);
            typeCell.appendTo(tableRow);
            pointsCell.appendTo(tableRow);
            questionCell.appendTo(tableRow);
            tableRow.appendTo("#games-list");
        }
    }).fail(function() {
        // Add fail logic here
    }).always(function() {
        $("#games-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter : 'tr',
            selected : function(event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            }
        });
    });
});