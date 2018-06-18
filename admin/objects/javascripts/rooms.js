//In der Tabelle gewählter Raum
var selectedRoom;
//Neue Räume als Map
var newMap = new Map();
//Räume die gelöscht werden sollen als Map
var delMap = new Map();
//Bearbeitete, persistierte Räume als Map
var updateMap = new Map();
//Liste der Räume (Tabelle als Objektliste)
var roomList;
//Fehlgeschlagene Items bei persistierung
var failedItems;

$(document).ready(function () {
    $(".ui-button").prop("disabled", false);
    //Save-Button neu registrieren
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {
        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
        let delList = Array.from(delMap.values());

        //Neue Räume persistieren
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
        //geänderte RÄume persistieren
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
        //Räume löschen
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
                            $("#" + (rowId)).addClass("failed");
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

    $("#new-room-button").on("click", function () {
        //Einmal das alte Objekt speichern
        storeOld();
        //Neu initialisieren und flaggen
        selectedRoom = {};
        selectedRoom.isNew = true;
        selectedRoom.roomnumber = "";
        selectedRoom.identifier = "";
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        selectedRoom._id = "pseudoId-" + rowId;

        appendRow(selectedRoom);
        //click triggern
        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
        updateDetails();
    });

    $("#delete-room-button").on("click", function () {
        selectedRoom.remove = true;
        $(".ui-selected").find(".bs").addClass("delete-item");
        delMap.set(selectedRoom._id, selectedRoom);
        storeOld();
    });

    init();
});


async function init() {
    return new Promise(resolve => {
        $.get("/find/locations").done(function (result) {
            $(".data-row").remove();
            for (event in result) {
                appendRow(result[event]);
            }
            resolve(true);
        }).fail(function () {
            resolve(false);
        }).always(function () {
            $("#rooms-list").bind('mousedown', function (event) {
                event.metaKey = true;
            }).selectable({
                filter: 'tr',
                selected: function (event, ui) {
                    $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                    selectedRoom = roomList[$(".ui-selected").prop("id")];
                    updateDetails();
                },
                unselected: function (event, ui) {
                }
            });
        });
    });
}


function appendRow(pObj) {
    //Ist die Raumliste initialisiert? Wenn nein tu es
    if (!(Array.isArray(roomList))) {
        roomList = [];
    }

    let tableRow = addRow($("#rooms-list"), pObj, {classes: "room-bs-cell " + (pObj.isNew ? "new-item" : "")}, {
        text: "roomnumber",
        classes: "room-number-cell"
    }, {text: "identifier", classes: "room-identifier-cell"});

    //Row-Objekt der Objektliste hinzufügen
    roomList[rowId] = pObj;

    //onclick registereiren
    tableRow.on("click", function () {
        $(this).addClass("ui-selected").siblings().removeClass("ui-selected");
        selectedRoom = roomList[$(this).prop("id")];
        updateDetails();
    });
}

function updateDetails() {
    let selRow = $(".ui-selected");
    let detailsFields = $("#location-roomnumber-textfield, #location-identifier-textfield");
    //Alten Trigger entfernen, neuen setzen
    detailsFields.off("input");
    detailsFields.on("input", function () {
        //Bearbeitungsstatus setzen
        if (!($(selRow).find(".bs").hasClass("delete-item") || $(selRow).find(".bs").hasClass("new-item")))
            $(selRow).find(".bs").addClass("edit-item");
        //Objekt bei Input updaten
        selectedRoom.roomnumber = $("#location-roomnumber-textfield").val();
        selectedRoom.identifier = $("#location-identifier-textfield").val();
        //Tabelle bei Input updaten
        $(selRow).find(".room-number-cell").text(selectedRoom.roomnumber);
        $(selRow).find(".room-identifier-cell").text(selectedRoom.identifier);
        //Input validieren
        checkInput();
        //Eingaben in Map festhalten
        storeOld();
    });
    //Felder initial befüllen
    $("#location-roomnumber-textfield").val(selectedRoom.roomnumber);
    $("#location-identifier-textfield").val(selectedRoom.identifier);
    //Beim füllen bereits prüfen ob input valide ist
    checkInput();
}

//Funktion, die änderungen am selectedRoom in einer Map nachhält
function storeOld() {
    if (!selectedRoom) {
        return;
    }

    //Objekt ist neu -> hat keine Id -> hat aber isNew-Flag
    if (selectedRoom.isNew) {
        if (selectedRoom.remove) {
            newMap.delete(selectedRoom._id)
        }
        else {
            newMap.set(selectedRoom._id, selectedRoom);
        }
    }
    //Objekt ist persistiert -> hat also ID
    else if (selectedRoom._id) {
        if (selectedRoom.remove) {
            updateMap.delete(selectedRoom._id);
        }
        else {
            updateMap.set(selectedRoom._id, selectedRoom);
        }
    }
}

//Validator für die Textfelder
function checkInput() {
    let roomNumberValid = true;
    let identifierValid = true;

    let roomnumberTextfield = $("#location-roomnumber-textfield");
    let identifierTextfield = $("#location-identifier-textfield");

    let curRoomNumberInput = roomnumberTextfield.val();
    let curIdentifierInput = identifierTextfield.val();

    let tableRowList = $(".data-row:not(.ui-selected)");

    tableRowList.each(function (index, obj) {
        if ($(obj).find($(".room-number-cell")).text().trim() === curRoomNumberInput.trim() || curRoomNumberInput.trim() === "") {
            roomNumberValid = false;
        }
        if ($(obj).find($(".room-identifier-cell")).text().trim() === curIdentifierInput.trim() || curIdentifierInput.trim() === "") {
            identifierValid = false;
        }
    });

    if (!identifierValid) {
        identifierTextfield.addClass("textfield-invalid");
    }
    else {
        identifierTextfield.removeClass("textfield-invalid");
    }

    if (!roomNumberValid) {
        roomnumberTextfield.addClass("textfield-invalid");
    }
    else {
        roomnumberTextfield.removeClass("textfield-invalid");
    }
}

//Validiert, ob das Objekt auf Clientseite valide ist
function isValid(dataObj) {
    let isValid = true;

    for (let i in roomList) {
        if (roomList.hasOwnProperty(i) && roomList[i]._id !== dataObj._id && (roomList[i].roomnumber.trim() === dataObj.roomnumber.trim() || dataObj.roomnumber.trim() === "")) {
            isValid = false;
        }
        if (roomList.hasOwnProperty(i) && roomList[i]._id !== dataObj._id && (roomList[i].identifier.trim() === dataObj.identifier.trim() || dataObj.identifier.trim() === "")) {
            isValid = false;
        }
    }

    return isValid;
}
