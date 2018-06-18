//Eindeutige ID-Referenz für einzelne Tabellenreihen
let rowId;

$(document).ready(function () {
    $("#editor").tabs();
    $("input[type='submit']").button();
});

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