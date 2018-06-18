// Eindeutige ID-Referenz für einzelne Tabellenreihen
let rowId;

$(document).ready(function () {
    $("#editor").tabs({
        beforeLoad: function( event, ui ) {
            ui.panel.html("");
            ui.panel.addClass("center");

            // http://www.ajaxload.info/
            $("<img />", {
                src: "images/ajax-loader.gif",
                alt: "Loading..."
            }).appendTo(ui.panel);
        },
        load: function( event, ui ) {
            ui.panel.removeClass("center");
        }
    });
    $("input[type='submit']").button();
});

// https://stackoverflow.com/questions/3140017/how-to-programmatically-select-selectables-with-jquery-ui
function selectSelectableElement (selectableContainer, elementsToSelect)
{
    // add unselecting class to all elements in the styleboard canvas except the
    // ones to select
    $(".ui-selected", selectableContainer).not(elementsToSelect).removeClass("ui-selected").addClass("ui-unselecting");

    // add ui-selecting class to the elements to select
    $(elementsToSelect).not(".ui-selected").addClass("ui-selecting");

    // trigger the mouse stop event (this will select all .ui-selecting
    // elements, and deselect all .ui-unselecting elements)
    selectableContainer.selectable('refresh');
    selectableContainer.data("ui-selectable")._mouseStop(null);
}

function displayObjects(isDisplayed, ...objectIds) {
    for (let obj of objectIds) {
        if (isDisplayed) {
            $("#" + obj + " > tr").remove();
            $("#" + obj).parent("table").show();
        } else {
            $("#" + obj).parent("table").hide();
            $("#" + obj + " > tr").remove();
        }
    }
}

function addRow(tableBody, data, bs, ...params) {
    if (!rowId) {
        rowId = 0;
    }
    rowId++;

    let tableRow = $("<tr/>", {
        id: rowId,
        class: "data-row"
    });
    if (bs)
        $("<td/>", {
            class: "bs " + (bs.classes ? bs.classes : "")
        }).appendTo(tableRow);

    for (let val of params) {
        $("<td/>", {
            html: "<p>" + data[val.text] && data[val.text].length > 120 ? data[val.text].substring(0, 117) + "..." : data[val.text] ? data[val.text] : "" + "</p>",
            class: (val.classes ? val.classes : "")
        }).appendTo(tableRow);
    }
    tableRow.appendTo(tableBody);

    return tableRow;
}