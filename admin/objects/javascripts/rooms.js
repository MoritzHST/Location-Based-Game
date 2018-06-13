var selectedRoom;
var newMap = new Map();
var updateMap = new Map();
var pseudoId = 0;
var failedItems;

$(document).ready(function () {
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {
        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
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

            $.when(calls).then(function () {
                init();
            })
        }
    });

    $("#new-room-button").on("click", function () {
        selectedRoom = {};
        updateDetails();

        var tableRow = $("<tr/>", {
            id: "pseudo-" + pseudoId,
            class: "room-data-row"
        });
        pseudoId++;

        var bsCell = $("<td/>", {
            class: "room-bs-cell bs new-item",
            text: " "
        });
        var roomCell = $("<td/>", {
            class: "room-number-cell"
        });
        var linkCell = $("<td/>", {
            class: "room-identifier-cell"
        });

        bsCell.appendTo(tableRow);
        roomCell.appendTo(tableRow);
        linkCell.appendTo(tableRow);
        tableRow.appendTo("#rooms-list");

        //onclick registereiren
        tableRow.on("click", function () {
            registerTableRow(this);
        });
        //click triggern
        tableRow.click();
    });

    init();
});


function init() {
    $(".room-data-row").remove();
    $.get("/find/locations").done(function (result) {
        for (event in result) {
            var tableRow = $("<tr/>", {
                id: result[event]._id,
                class: "room-data-row"
            });
            var bsCell = $("<td/>", {
                class: "room-bs-cell bs"
            });
            var roomCell = $("<td/>", {
                text: result[event].roomnumber,
                class: "room-number-cell"
            });
            var linkCell = $("<td/>", {
                text: result[event].identifier,
                class: "room-identifier-cell"
            });

            bsCell.appendTo(tableRow);
            roomCell.appendTo(tableRow);
            linkCell.appendTo(tableRow);
            tableRow.appendTo("#rooms-list");
        }
    }).fail(function () {
        // Add fail logic here
    }).always(function () {
        $("#rooms-list").find($(".room-data-row")).on('click', function () {
            registerTableRow(this);
        });
    });
}

function registerTableRow(row) {
    $(row).addClass("ui-selected").siblings().removeClass("ui-selected");

    selectedRoom = {};
    selectedRoom._id = $(row).prop("id");
    selectedRoom.roomnumber = $(row).find(".room-number-cell").text();
    selectedRoom.identifier = $(row).find(".room-identifier-cell").text();

    updateDetails();
}

function updateDetails() {
    let selRow = $(".ui-selected");
    let detailsFields = $("#location-roomnumber-textfield, #location-identifier-textfield");
    detailsFields.off("input");
    detailsFields.on("input", function () {
        if (!($(selRow).find(".bs").hasClass("delete-item") || $(selRow).find(".bs").hasClass("new-item")))
            $(selRow).find(".bs").addClass("edit-item");
        selectedRoom.roomnumber = $("#location-roomnumber-textfield").val();
        selectedRoom.identifier = $("#location-identifier-textfield").val();
        $(selRow).find(".room-number-cell").text(selectedRoom.roomnumber);
        $(selRow).find(".room-identifier-cell").text(selectedRoom.identifier);

        checkInput();

        storeOld();
    });

    $("#location-roomnumber-textfield").val(selectedRoom.roomnumber);
    $("#location-identifier-textfield").val(selectedRoom.identifier);

    checkInput();
}

function storeOld() {
    if (selectedRoom) {
        if (selectedRoom._id.startsWith("pseudo-")) {
            newMap.set(selectedRoom._id, selectedRoom);
        }
        else if (selectedRoom._id) {
            updateMap.set(selectedRoom._id, selectedRoom);
        }
    }
}

function checkInput() {
    let roomNumberValid = true;
    let identifierValid = true;

    let roomnumberTextfield = $("#location-roomnumber-textfield");
    let identifierTextfield = $("#location-identifier-textfield");

    let curRoomNumberInput = roomnumberTextfield.val();
    let curIdentifierInput = identifierTextfield.val();

    let tableRowList = $(".room-data-row:not(.ui-selected)");

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

function isValid(dataObj) {
    let tableRowList = $(".room-data-row");
    let isValid = true;

    tableRowList.each(function (index, obj) {
        if ($(obj).prop("id") !== dataObj._id && ($(obj).find($(".room-number-cell")).text().trim() === dataObj.roomnumber.trim() || dataObj.roomnumber.trim() === "")) {
            isValid = false;
        }
        if ($(obj).prop("id") !== dataObj._id && ($(obj).find($(".room-identifier-cell")).text().trim() === dataObj.identifier.trim() || dataObj.identifier.trim() === "")) {
            isValid = false;
        }
    });
    return isValid;
}
