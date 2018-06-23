// Eindeutige ID-Referenz für einzelne Tabellenreihen
let rowId;

$(document).ready(function () {
    $("#editor").tabs({
        beforeLoad: function( event, ui ) {
            toggleAction(true);
            $("input[type='submit']").off("click");
            ui.panel.html("");
            ui.panel.addClass("center");

            // http://www.ajaxload.info/
            $("<img />", {
                src: "images/ajax-loader.gif",
                alt: "Loading..."
            }).appendTo(ui.panel);
        },
        load: function( event, ui ) {
            toggleField(false, $(".details"));
            ui.panel.removeClass("center");
        }
    });
    $("input[type='submit']").button();
});

$(document).on("click", ".table-list > tr > td > input[type='radio']", function(event) {
    $(this).closest(".table-list").find("input[type='radio']").not($(this)).each(function() {
        $(this).prop("checked", false);
    });

    if (event.ctrlKey) {
        $(this).prop('checked', false);
    }
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

function fillTable(table, data) {
    let tableHeader = table.children("thead:first");
    let tableBody = table.children("tbody:first");

    if (tableHeader && tableBody) {
        let tableHeaderChildren = tableHeader.children("tr");
        let tableHeaderAttributes = [];

        tableHeaderChildren.children("th").each(function() {
            let abbr = $(this).attr("abbr");
            let classes = $(this).attr("class").split(" ");
            tableHeaderAttributes.push({ "classes" : classes[0], "abbr" : abbr });
        });

        if (!data) {
            let emptyResult = $("<td />", {
                    text: "Keine Daten gefunden"
                });

            let emptyRow = $("<tr />");
            emptyResult.attr("colspan", tableHeaderAttributes.length);

            emptyResult.appendTo(emptyRow);
            emptyRow.appendTo(tableRow);
            return;
        }

        let queryData = $(data);

        for (let cellObj of queryData) {
            let tableRow = $("<tr />");
            tableRow.attr("id", "tr-" + cellObj._id);
            let cellObjQuery = $(cellObj);
            for (let thAttributes of tableHeaderAttributes) {

                let thSplitClasses = thAttributes.classes.split(".");
                let property = cellObjQuery;
                let clazz = "";

                for (let counter = 0; counter < thSplitClasses.length; counter++) {
                    if (!property) {
                        property = "";
                        break;
                    }

                   property = $(property).attr(thSplitClasses[counter]);
                }

                switch (thAttributes.abbr) {
                    case "smooth":
                        let propStrings = property.split("_");
                        for (let i = 0; i < propStrings.length; i++) {
                            propStrings[i] = propStrings[i].charAt(0).toUpperCase() + propStrings[i].slice(1);
                        }
                        property = propStrings.join(" ");
                        break;
                    case "number":
                        property = property.length;
                        break;
                    default:
                        if (thAttributes.abbr)
                            clazz = thAttributes.abbr;
                        break;
                }

                $("<td />", {
                    html: property,
                    class: clazz
                }).appendTo(tableRow);
            }
            tableRow.appendTo(tableBody);
            if (!rowId) {
                rowId = 0;
            }
            rowId++;
        }
    }
}

function loadDataIntoTable(mainName, dataName, checkType, callBack) {
    let dataList = [];
    $.holdReady(true);
    $.get("/find/" + dataName).done(function (result) {
        if (result.length > 0) {
            for (let index in result) {
                if (result.hasOwnProperty(index)) {
                    if (checkType) {
                        result[index].check = $("<input />", {
                            id: "check-" + result[index]._id,
                            type: checkType
                        });
                    }
                    fillTable($("#" + mainName + "-table-" + dataName), result[index]);
                    dataList.push(result[index]);
                }
            }
        } else {
            fillTable($("#" + mainName + "-table-" + result), null);
        }
    }).fail(function () {
        $("#" + mainName + "-load-failure").append($("<li />", {
            text: "Die " + dataName + " Daten konnten nicht geladen werden."
        }));
        $("#" + mainName + "-table-" + dataName).hide();
    }).always(function () {
        $.holdReady(false);
        callBack(dataList);
    });
}

function toggleAction(isEnabled, buttons) {
    let toggleButtons = buttons ? buttons : $("input[type='submit']");
    toggleButtons.prop("disabled", !isEnabled);

    if (isEnabled) {
        toggleButtons.removeClass (function (index, className) {
            return (className.match (/\S+disabled/g) || []).join(' ');
        });
    } else {
        toggleButtons.off("click");
    }
}

function toggleField(isEnabled, field) {
    if (field) {
        field.find("*").each(function() {
           $(this).prop("disabled", !isEnabled);

           if (!isEnabled) {
               $(this).off("input");
           }
        });
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
        if (!val.text) {
            continue;
        }
        $("<td/>", {
            text: "<p>" + (data[val.text] && data[val.text].length > 120 ? data[val.text].substring(0, 117) + "..." : data[val.text]) ? data[val.text] : "" + "</p>",
            class: (val.classes ? val.classes : "")
        }).appendTo(tableRow);
    }
    tableRow.appendTo(tableBody);

    return tableRow;
}