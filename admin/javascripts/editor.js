// Eindeutige ID-Referenz für einzelne Tabellenreihen
let rowId;

$(document).ready(function () {
    $("#editor").tabs({
        cache: false,
        ajaxOptions: {
            cache: false
        },
        beforeLoad: function (event, ui) {
            delete window.storage;
            // Diese toggleAction Methode müßte auf "false" gestellt werden
            // Dazu müßten spiele, ausstellungen & galerie zuvor an dem stil von
            // diesem javascript angepasst werden
            toggleAction(true);
            $("div[role='log']").remove();

            ui.panel.html("");
            ui.panel.addClass("center");

            // http://www.ajaxload.info/
            $("<img />", {
                src: "images/ajax-loader.gif",
                alt: "Loading..."
            }).appendTo(ui.panel);
        }, load: function (event, ui) {
            // Entfernt alle Listener von der Sidebar
            // Die "off" Variante von JQuery funktioniert nicht in jedem Browser
            document.getElementById("sidebar").outerHTML = document.getElementById("sidebar").outerHTML;

            onTabLoad();
            ui.panel.removeClass("center");

            // Handlet das Click Event beim drücken des "Aktualisieren" Buttons
            $("#button-refresh").off("click");
            $("#button-refresh").on("click", function () {
                let activeIndex = $("#editor").find("li.ui-tabs-active.ui-state-active:first").index();
                $("#editor").tabs().tabs('load', activeIndex);
            });
        }
    });

    $("#sidebar > input[type='submit']").button();
});

$(document).on("click", ".table-list > tr > td > input[type='radio']", function (event) {
    $(this).closest(".table-list").find("input[type='radio']").not($(this)).each(function () {
        $(this).prop("checked", false);
    });

    if (event.ctrlKey) {
        $(this).prop('checked', false);
    }
});

// https://stackoverflow.com/questions/3140017/how-to-programmatically-select-selectables-with-jquery-ui
function selectSelectableElement(selectableContainer, elementsToSelect) {
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

// Setzt Standwarte für die Inhalte geladener Tabs fest
function onTabLoad() {
    toggleField(false, $(".details"));
    $(".remove-button, .duplicate-button").prop("disabled", true);
    $(".loadingPanel").hide();
}

// Legt fest ob und welche Objekte angezeigt werden sollen.
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

// Erstellt eine Kopie eines JSON Objektes
function clone(jsonObject) {
    return JSON.parse(JSON.stringify(jsonObject));
}

// Füllt eine Tabelle mit übergebenen Daten
function fillTable(table, data) {
    let tableHeader = table.children("thead:first");
    let tableBody = table.children("tbody:first");

    if (tableHeader && tableBody) {
        let tableHeaderAttributes = getTableHeaderAttributes(tableHeader);

        if (!data) {
            return;
        }

        for (let cellObj of $(data)) {
            createDataRow(cellObj, tableHeaderAttributes).appendTo(tableBody);

            if (!rowId) {
                rowId = 0;
            }
            rowId++;
        }
    }
}

// Gibt die Attribute eines übergebenen TableHeader zurück
// Dabei wird immer nur die erste (!) Klasse und ein optionales abbr Attribut
// verwertet
function getTableHeaderAttributes(tableHeader) {
    let tableHeaderAttributes = [];
    tableHeader.children("tr:first").children("th").each(function () {
        let abbr = $(this).attr("abbr");
        let classes = $(this).attr("class").split(" ");
        tableHeaderAttributes.push({"classes": classes[0], "abbr": abbr});
    });

    return tableHeaderAttributes;
}

// überschreibt die Daten einer Reihe mit den Daten einer anderen Reihe
function updateRowContent(baseRow, newRow) {
    newRow.children("td").each(function (index) {
        baseRow.children("td").eq(index).html($(this).html());
    });
}

// Fügt ein Object dem Array hinzu, falls es noch nicht vorhanden ist,
// andernfalls wird es entfernt
// https://stackoverflow.com/questions/9604389/jquery-simple-array-pushing-item-in-if-its-not-there-already-removing-item-i
function handleObjectInArray(array, object) {
    let index = -1;
    for (let element in array) {
        if (array.hasOwnProperty(element) && array[element]._id === object._id) {
            index = element;
            break;
        }
    }

    if (index >= 0) {
        // Entferne gefundenes Element
        array.splice(index, 1);
    } else {
        // Füge Element dem Array hinzu
        array.push(object);
    }
}

// Erstellt eine Tabellenreihe und gibt diese zurück
function createDataRow(cellObj, tableHeaderAttributes) {
    let tableRow = $("<tr />");
    if (cellObj._id)
        tableRow.attr("id", "tr-" + cellObj._id);
    let cellObjQuery = $(cellObj);
    for (let thAttributes of tableHeaderAttributes) {

        let thSplitClasses = thAttributes.classes.split(".");
        let property = cellObjQuery;
        let clazz = "";
        let thSplitAbbr = [];
        if (thAttributes.abbr)
        	thSplitAbbr = thAttributes.abbr.split(" ");

        for (let counter = 0; counter < thSplitClasses.length; counter++) {
            if (!property) {
                property = "";
                break;
            }

            property = $(property).attr(thSplitClasses[counter]);
        }

        for (let abbr in thSplitAbbr) {
	        switch (thSplitAbbr[abbr]) {
	            case "shorten":
	            	property = shortenString(property, 125);
	        	    break;
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
	            case "icon":
	                clazz = property + "-icon";
	                property = "";
	                break;
	            default:
	                clazz = thSplitAbbr[abbr];
	                break;
	        }
        }

        $("<td />", {
            html: property,
            class: clazz
        }).appendTo(tableRow);
    }

    return tableRow;
}

// Sucht in der MongoDB nach Daten und fügt diese einer Tabelle hinzu
// Wird ein checktype übergeben, wird anstelle von Text ein entsprechener Input
// type erzeugt
function loadDataIntoTable(mainName, dataName, checkType, callBack) {
    let dataList = [];
    $.holdReady(true);
    $.get("/find/" + dataName).done(function (result) {
        if (result.length > 0) {
            $("#" + mainName + "-table-" + dataName).children("tbody:first").empty();

            for (let index in result) {
                let obj = clone(result);
                if (obj.hasOwnProperty(index) && checkType) {
                    obj[index].check = $("<input />", {
                        id: "check-" + obj[index]._id,
                        type: checkType
                    });
                    obj[index].check.prop("disabled", true);
                }
                fillTable($("#" + mainName + "-table-" + dataName), obj[index]);
                dataList.push(result[index]);
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
        toggleButtons.removeClass(function (index, className) {
            return (className.match(/\S+disabled/g) || []).join(' ');
        });
    } else {
        toggleButtons.off("**");
    }
}

function toggleField(isEnabled, field, listData) {
    let data = listData ? listData : {};
    if (field) {
        field.find("*").each(function () {
            Object.keys(data).forEach(property => {
                if ($(this).hasClass(property)) {
                    $(this).text(isEnabled ? data[property] : "").val(isEnabled ? data[property] : "");
                }

                if (!isEnabled) {
                    $(this).off("input");
                    $(this).removeAttr("value");
                }
            });

            $(this).prop("disabled", !isEnabled);
        });
    }
}

// Entfern alle zugefügten Status Eigenschaften (Rekusiv)
function removeAllStatus(dataObject) {
    if (dataObject["status"]) {
        delete dataObject.status;
    }

    for (let o in dataObject) {
        if (dataObject.hasOwnProperty(o) && (dataObject[o].constructor === [].constructor || dataObject[o].constructor === {}.constructor)) {
            removeAllStatus(dataObject[o]);
        } else if (dataObject[o]["status"]) {
            delete dataObject[o].status;
        }
    }
}

//Verkleinert einen Text auf den übergebenen Wert, falls die Länge diesen überschritet 
function shortenString(text, maxChars) {
	let shorten = $('<div>').html(text);
	
	if (shorten.text().length > maxChars) {
		shorten.text(shorten.text().slice(0, maxChars));
		shorten.text(shorten.text() + "...");
	}
		
	return shorten.text();
}

function callAction(errorText, collectionName, dataList, propertyName, failureList, callback) {
    let calls = [];
    failureList.empty();

    for (let object in dataList) {
        if (dataList.hasOwnProperty(object) && dataList[object].status) {
            let status = dataList[object].status;
            let id = String(dataList[object]._id);

            removeAllStatus(dataList[object]);

            let dataObject = clone(dataList[object]);
            delete dataList[object]._id;

            let errText = errorText.replace("{0}", dataObject[propertyName]);

            switch (status) {
                case "insert":
                    errText = errText.replace("{1}", "hinzugefügt");
                    calls.push(
                        // $.post("/insert/" + collectionName, dataList[object]).fail(function() {
                        //     $("<li />", {
                        //         text: errText
                        //         }).appendTo(failureList);
                        //     })
                        ajaxRequest("/insert/" + collectionName, "POST", dataList[object], function () {

                        }, function () {
                            $("<li />", {
                                text: errText
                            }).appendTo(failureList);
                        }));
                    break;
                case "update":
                    errText = errText.replace("{1}", "geupdatet");
                    calls.push(
                        // $.post("/update/" + collectionName + "/" + id, dataList[object]).fail(function (error) {
                        //     $("<li />", {
                        //         text: errText
                        //     }).appendTo(failureList);
                        // })
                        ajaxRequest("/update/" + collectionName + "/" + id, "POST", dataList[object], function () {

                        }, function () {
                            $("<li />", {
                                text: errText
                            }).appendTo(failureList);
                        })
                    );
                    break;
                case "delete":
                    errText = errText.replace("{1}", "gelöscht");
                    calls.push(
                        $.post("/delete/" + collectionName, dataList[object]).fail(function () {
                            $("<li />", {
                                text: errText
                            }).appendTo(failureList);
                        })
                    );
                    break;
                default:
                    break;
            }
        }
    }

    $.when.apply($, calls).done(function () {
        callback();
    });
}

function rowIsInvalid(dataList, object) {
    for (let element in dataList) {
        if (dataList.hasOwnProperty(element)) {
            let reasons = [];
            for (let prop in object) {
                if (!(String(object[prop]).trim() === "") && !(new RegExp('^(2[0-9][0-9][0-9])[-](0[1-9]|1[0-2])[-](0[1-9]|[1][0-9]|[2][0-9]|3[01])$').test(String(object[prop]).trim()))) {
                    reasons.push({reason: "date-format", property: prop});
                }
                if (String(object[prop]).trim() === "") {
                    reasons.push({reason: "empty", property: prop});
                }
                if (dataList[element] !== object && dataList[element][prop] === object[prop]) {
                    reasons.push({reason: "same", property: prop});
                }
            }

            if (reasons.length > 0)
                return reasons;
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