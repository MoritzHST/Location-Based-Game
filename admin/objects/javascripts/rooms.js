$(document).ready(function() {
    // Diese toggleAction Methode müßte in
    // die "beforeLoad" Option von der editor.js
    // Dazu müßten spiele, ausstellungen & galerie zuvor an dem stil von
    // diesem javascript angepasst werden
    toggleAction(false, $("#button-save"));

    onTabLoad();
    $(document).tooltip();
    var roomsList = [];

    // Finde Räume aus der Datenbank und füge sie der Tabelle hinzu
    loadDataIntoTable("rooms", "locations", null, function(result) {
        roomsList = result;

        // Handlet das Click Event beim drücken des "Speichern" Buttons
        $("div#sidebar").on("click", "#button-save", function() {
            let saveIsOk = true;
            for ( let room in roomsList) {
                if (roomsList.hasOwnProperty(room)) {
                    let row = $("#rooms-table-locations > tbody.table-list").children("tr").eq(room);
                    let result = rowIsInvalid(roomsList, roomsList[room]);

                    row.removeAttr("title");
                    row.removeClass("failed");

                    if (roomsList.hasOwnProperty(room) && !result) {
                        // ... nix zu tun
                    } else {
                        let reason = result.reason;

                        let propText = $("#rooms-table-locations > thead:first").find("th." + result.property + ":first").text();

                        switch (reason) {
                        case "same":
                            row.attr("title", "Es gibt bereits einen anderen Raum mit dem gleichen Wert von: " + propText);
                            break;
                        case "empty":
                            row.attr("title", "Das folgende Feld darf nicht leer sein: " + propText);
                            break;
                        }

                        row.addClass("failed");

                        saveIsOk &= false;
                    }
                }
            }

            if (saveIsOk) {
                toggleAction(false, $("#button-save"));
                let failureList = $("#rooms-load-failure");

                $(".loadingPanel").show();
                callAction("Der Raum mit der Nummer {0} konnte nicht {1} werden.", "locations", roomsList, "roomnumber", failureList, function() {
                    let activeIndex = $("#editor").find("li.ui-tabs-active.ui-state-active:first").index();
                    $("#editor").tabs().tabs('load', activeIndex);
                });
            }
        });

        // Handlet das Click Event beim drücken des "Neu" (+) Buttons
        $("#new-room-button").on("click", function() {
            let room = {};
            room.status = "insert";
            roomsList.push(room);

            let tableRow = createDataRow(event, getTableHeaderAttributes($("#rooms-table-locations > thead:first")));
            tableRow.children("td").eq(0).addClass("insert-icon");
            let tbody = $("#rooms-list");
            tableRow.appendTo(tbody);
            selectSelectableElement(tbody, tableRow);
            toggleAction(true, $("#button-save"));
        });

        // Handlet das Click Event beim drücken des "Löschen" (-) Buttons
        $("#delete-room-button").on("click", function() {
            let index = $("#rooms-table-locations > tbody").find("tr.ui-selectee.ui-selected").index();
            $("#rooms-table-locations > tbody").find("tr").eq(index).children("td").eq(0).addClass("delete-item");
            roomsList[index].status = "delete";
            toggleAction(true, $("#button-save"));
        });

        // Handlet das Click Event beim auswählen einer Reihe
        $("#rooms-list").bind('mousedown', function(event) {
            event.metaKey = true;
        }).selectable({
            filter : 'tr', selected : function(event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                $("div.details").find("input").off("input");
                $(".remove-button").prop("disabled", false);

                let room = roomsList[$("#rooms-table-locations > tbody.table-list").find(ui.selected).index()];

                toggleField(true, $(".details"), room);

                $("div.details").find("input").on("input", function() {
                    let cellClass = $(this).attr('class').split(' ')[0];
                    let selector = $("#rooms-table-locations").children("thead:first").find("th." + cellClass).index();

                    room[cellClass] = $(this).val();
                    $(ui.selected).children("td").eq(selector).text($(this).val());

                    if (!room.status) {
                        room.status = "update";
                        $(ui.selected).children("td").eq(0).addClass("edit-item");
                    }

                    toggleAction(true, $("#button-save"));
                });
            }, unselected : function(event, ui) {
                $(".remove-button").prop("disabled", true);
                toggleField(false, $(".details"), roomsList[$("#rooms-table-locations > tbody.table-list").find(ui.unselected).index()]);
                $("div.details").find("input").off("input");
                $("div.details").find("input").removeClass("textfield-invalid");
            }
        });
    });
});