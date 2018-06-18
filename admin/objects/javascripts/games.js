$(document).ready(function () {
    $("#button-save-template.ui-button, #button-import-template.ui-button").prop("disabled", true);
    // Save-Button neu registrieren
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {
        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
        let delList = Array.from(delMap.values());

        // Neue Räume persistieren
        for (let i in newList) {
            if (newList.hasOwnProperty(i) && isValid(newList[i])) {
                calls.push(
                    $.post("/insert/locations", {
                        roomnumber: newList[i].roomnumber,
                        identifier: newList[i].identifier
                    })
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(newList[i]);
                        }));
            }
            else {
                failedItems.push(newList[i]);
            }
        }
        // geänderte RÄume persistieren
        for (let i in updList) {
            if (updList.hasOwnProperty(i) && isValid(updList[i])) {
                calls.push(
                    $.post("/update/locations/" + updList[i]._id, {
                        roomnumber: updList[i].roomnumber,
                        identifier: updList[i].identifier
                    })
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(updList[i]);
                        }));
            }
            else {
                failedItems.push(updList[i]);
            }
        }
        // Räume löschen
        for (let i in delList) {
            if (delList.hasOwnProperty(i)) {
                calls.push(
                    $.post("/delete/locations", {_id: delList[i]._id})
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(updList[i]);
                        }));
            }
            else {
                failedItems.push(updList[i]);
            }
        }

        $.when.apply($, calls).done(function () {
            init()
                .then(function () {
                    for (let i in failedItems) {
                        if (failedItems[i].isNew) {
                            appendRow(failedItems[i]);
                            $("#" + rowId).addClass("failed");
                        }
                        else {
                            for (let j in roomList) {
                                if (roomList[j]._id && roomList[j]._id.toString() === failedItems[i]._id.toString()) {
                                    $("#" + j).addClass("failed");
                                }
                            }
                        }
                    }
                });
        });
    });
});

async function init() {
    return new Promise(resolve => {
        $.get("/find/games").done(function (result) {
            for (event in result) {
                appendRow(result[event]);
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
            resolve(true);
        }).fail(function () {
            resolve(false);
        }).always(function () {
            $("#games-list").bind('mousedown', function (event) {
                event.metaKey = true;
            }).selectable({
                filter: 'tr',
                selected: function (event, ui) {
                    $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                }
            });
        });
    });
}