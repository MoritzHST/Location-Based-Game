$(document).ready(function() {
    var roomsList = [];

    // Finde Räume aus der Datenbank und füge sie der Tabelle hinzu
    loadDataIntoTable("rooms", "locations", null, function(result) {
        roomsList = result;

        // toggleAction(true, $("#button-save"));
        $("#button-save").on("click", function() {
            for (let room of roomsList) {
                if (roomsList.hasOwnProperty(room)) {
                    // ...
                }
            }
        });

        $("#rooms-list").bind('mousedown', function (event) {
            event.metaKey = true;
        }).selectable({
            filter: 'tr',
            selected: function (event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                toggleField(true, $(".details"), roomsList[$("#rooms-table-locations > tbody.table-list").find(ui.selected).index()]);

                $("div.details").find("input").on("input", function () {
                    let cellClass = $(this).attr('class').split(' ')[0];
                    let selector = $("#rooms-table-locations").children("thead:first").find("th." + cellClass).index();
                    $(ui.selected).children("td").eq(selector).text($(this).val());

                    $(ui.selected).children("td").eq(0).addClass("edit-item");

                    toggleAction(true, $("#button-save"));
                });
            },
            unselected: function (event, ui) {
                toggleField(false, $(".details"), roomsList[$("#rooms-table-locations > tbody.table-list").find(ui.unselected).index()]);
                $("div.details").find("input").removeClass("textfield-invalid");
            }
        });
    });
});