//In der Tabelle gewählte Ausstellung
var selectedExposition;
//Liste der Ausstellungen (Tabelle als Objektliste)
var expositionList;
//Liste an Bildern, die bereits in der DB vorhanden sind
var persistedImages;
//Neue Ausstellungen als Map
var newMap = new Map();
//Bearbeitete, Persistierte Ausstellungen als Map
var updateMap = new Map();
//Fehlgeschlagene Items bei der Persitierung
var failedItems;
//Interne Nummerierung der einzelnen Tabellenreihen (Synchron mit roomsList-Adresse)
var rowId;
// Bilder Pro Pagination
var maximumImageAmount = 8;
// BIlder die Pro ausstellung erlaubt sind
var maximumImageItems = 5;

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
        for (let i in newList) {
            if (newList.hasOwnProperty(i) /* && isValid(newList[i]) */) {
                calls.push(
                    $.post("/insert/expositions", {
                        name: newList[i].name,
                        description: newList[i].description,
                        thumbnailPath: newList[i].thumbnailPath,
                        imagePaths: newList[i].imagePaths
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
            if (updList.hasOwnProperty(i) /* && isValid(updList[i]) */) {
                calls.push(
                    $.post("/update/expositions/" + updList[i]._id, {
                        name: updList[i].name,
                        description: updList[i].description,
                        thumbnailPath: updList[i].thumbnailPath,
                        imagePaths: updList[i].imagePaths
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

            $.when.apply($, calls).done(function () {
                init();
            });
        }
    });

    $("#new-exposition-button").on("click", function () {
        //Einmal das alte Objekt speichern
        storeOld();
        //Neu initialisieren und flaggen
        selectedExposition = {};
        selectedExposition.isNew = true;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        selectedExposition._id = "pseudoId-" + rowId;
        selectedExposition.imagePaths = [];
        updateDetails();

        appendRow(selectedExposition);
        //click triggern
        $("#" + (rowId - 1)).click();
    });

    $("#select-image-dialog").dialog({
        autoOpen: false,
        modal: true,
        width: "80%",
        resizable: true,
        height: 700
    });

    $("#exposition-thumbnail-preview").on("click", function () {
        $("#select-image-dialog").dialog("open");
        let assignedImageContainer = $("#assigned-image-items");
        assignedImageContainer.hide();
        fetchImages();

        let imagePreview = $("#image-preview");
        imagePreview.attr("src", "");
        if (selectedExposition.thumbnailPath) {
            imagePreview.attr("src", selectedExposition.thumbnailPath);
        }

        let selectImage = $("#select-image-button");
        let deselectImage = $("#deselect-image-button");
        selectImage.off("click");
        deselectImage.off("click");
        selectImage.on("click", function () {
            let imagePreview = $("#image-preview");
            if (imagePreview.attr("src").trim() !== "") {
                selectedExposition.thumbnailPath = imagePreview.attr("src");
            }
            $("#select-image-dialog").dialog("close");
            storeOld();
            updateDetails();
        });

        deselectImage.on("click", function () {
            $("#image-preview").attr("src", "");
            selectedExposition.thumbnailPath = undefined;
            storeOld();
            updateDetails();
        });
    });

    $("#exposition-image-preview").on("click", function () {
        $("#select-image-dialog").dialog("open");
        let assignedImageContainer = $("#assigned-image-items");
        assignedImageContainer.show();
        updateImageContainer(assignedImageContainer);
        fetchImages();

        let imagePreview = $("#image-preview");
        imagePreview.attr("src", "");
        if (selectedExposition.imagePaths[0]) {
            imagePreview.attr("src", selectedExposition.imagePaths[0]);
        }

        let selectImage = $("#select-image-button");
        let deselectImage = $("#deselect-image-button");
        selectImage.off("click");
        deselectImage.off("click");
        selectImage.on("click", function () {
            if (selectedExposition.imagePaths.length < maximumImageItems) {
                let imagePreview = $("#image-preview");
                if (imagePreview.attr("src").trim() !== "") {
                    selectedExposition.imagePaths.push(imagePreview.attr("src"));
                }
                updateImageContainer($("#assigned-image-items"));
            }
            else {
                $("#select-image-dialog").dialog("option", "title", "Es sind maximal 5 Bilder erlaubt");
            }
            storeOld();
            updateDetails();
        });

        deselectImage.on("click", function () {
            let imagePreview = $("#image-preview");
            for (let i in selectedExposition.imagePaths) {
                if (selectedExposition.imagePaths[i] === imagePreview.attr("src")) {
                    selectedExposition.imagePaths.splice(i, 1);
                }
            }
            imagePreview.attr("src", "");
            updateImageContainer($("#assigned-image-items"));
            storeOld();
            updateDetails();
        });
    });

    let textAreaExpositionDescription = $("#exposition-description-textfield");
    $("#exposition-description-bold").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<strong></strong>");
    });
    $("#exposition-description-italic").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<i></i>");
    });
    $("#exposition-description-header").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<h4></h4>");
    });
    $("#exposition-description-list").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<ul></ul>");
    });
    $("#exposition-description-listelement").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<li></li>");
    });
    $("#exposition-description-paragraph").on("click", function () {
        textAreaExpositionDescription.val(textAreaExpositionDescription.val() + "<p></p>");
    });

    init();
});

function init() {
    $(".exposition-data-row").remove();
    $.get("/find/expositions").done(function (result) {
            for (event in result) {
                appendRow(result[event]);
            }
        }
    ).fail(function () {
        // Add fail logic here
    });
}

function appendRow(pObj) {
    //Gibt es die RowId schon? Wenn nein neu erstellen
    if (!rowId) {
        rowId = 0;
    }
    //Ist die Ausstellungsliste initialisiert? Wenn nein tu es
    if (!(Array.isArray(expositionList))) {
        expositionList = [];
    }
    //Objekt der Liste hinzufüge
    expositionList[rowId] = pObj;
    //Neue Table row anlegen
    var tableRow = $("<tr/>", {
        id: rowId,
        class: "exposition-data-row"
    });
    rowId++;

    var bsCell = $("<td/>", {
        class: "exposition-bs-cell bs " + (pObj.isNew ? "new-item" : ""),
        text: " "
    });
    var nameCell = $("<td/>", {
        class: "exposition-name-cell",
        text: pObj.name
    });
    var description = pObj.description && pObj.description.length > 120 ? pObj.description.substring(0, 117) + "..." : pObj.description ? pObj.description : "";
    var descriptionCell = $("<td/>", {
        text: $("<p>" + description + "</p>").text(),
        class: "exposition-description-cell"
    });

    bsCell.appendTo(tableRow);
    nameCell.appendTo(tableRow);
    descriptionCell.appendTo(tableRow);
    tableRow.appendTo("#expositions-list");

    // onclick registereiren
    tableRow.on("click", function () {
        $(this).addClass("ui-selected").siblings().removeClass("ui-selected");

        selectedExposition = expositionList[$(this).prop("id")];
        if (!Array.isArray(selectedExposition.imagePaths)) {
            selectedExposition.imagePaths = [];
        }
        updateDetails();
    });
}

function updateDetails() {
    let selRow = $(".ui-selected");
    let detailsFields = $("#exposition-name-textfield, #exposition-descirption-textfield");
    detailsFields.off("input");
    detailsFields.on("input", function () {
        if (!($(selRow).find(".bs").hasClass("delete-item") || $(selRow).find(".bs").hasClass("new-item")))
            $(selRow).find(".bs").addClass("edit-item");
        selectedExposition.name = $("#exposition-name-textfield").val();
        selectedExposition.description = $("#exposition-description-textfield").val();
        $(selRow).find(".exposition-name-cell").text(selectedExposition.name);
        $(selRow).find(".exposition-description-cell").text(selectedExposition.identifier);

        storeOld();
    });
    $("#exposition-thumbnail").attr("src", selectedExposition.thumbnailPath);
    let assignedImageWrapper = $("#exposition-image-collection-wrapper");
    let assignedImage = $("#exposition-selected-image")
    assignedImage.attr("src", "");
    assignedImageWrapper.children().remove();
    if (selectedExposition.imagePaths.length > 0) {
        $("#exposition-selected-image").attr("src", selectedExposition.imagePaths[0]);
        for (let i in selectedExposition.imagePaths) {
            let curImage = $("<img/>", {
                src: selectedExposition.imagePaths[i],
                class: "assigned-image-item image-item",
                href: "#"
            });

            curImage.appendTo(assignedImageWrapper);

            curImage.on("click", function () {
                assignedImage.attr("src", curImage.attr("src"));
            });

        }
    }
    $("#exposition-name-textfield").val(selectedExposition.name);
    $("#exposition-description-textfield").val(selectedExposition.description);
}

function fetchImages() {
    $.get("/find/images")
        .done(function (obj) {
            persistedImages = obj;
            let paginationTabs = Math.ceil(persistedImages.length / maximumImageAmount);

            $(".pagination a").remove();
            for (let i = 1; i <= paginationTabs; i++) {
                let curPagination = $("<a/>", {
                    text: i
                });

                curPagination.on("click", function () {
                    updateWrapper(this.text);
                    $(".pagination a").removeClass("active");
                    $(this).addClass("active");
                });

                curPagination.appendTo($(".pagination"));

                // erster Durchlauf? Einmal anklicken
                if (i === 1) {
                    curPagination.click();
                }
            }
        });
}

function updateWrapper(curPagination) {
    let imageWrapper = $("#image-collection-wrapper");
    let imageMinCount = (curPagination - 1) * maximumImageAmount;
    let imageMaxCount = curPagination * maximumImageAmount - 1;


    imageWrapper.fadeOut("slow", function () {
        imageWrapper.empty();
        for (let i = imageMinCount; i <= imageMaxCount; i++) {
            if (persistedImages[i] !== undefined) {
                let curImage = $("<img/>", {
                    id: persistedImages[i]._id,
                    src: persistedImages[i].data,
                    class: "image-preview-item",
                    href: "#"
                });

                let curImageContainer = $("<div/>", {
                    class: "image-preview-item-container"
                });

                curImage.on("click", function () {
                    $.get("/find/images", {
                        _id: $(this).attr("id")
                    })
                        .done(function (obj) {
                            updateCurrentImage(obj);
                        });
                });

                curImage.appendTo(curImageContainer);
                curImageContainer.appendTo(imageWrapper);
            }
        }
        imageWrapper.fadeIn("slow");
    });
}

function updateCurrentImage(selectedImage) {
    $("#image-textfield-name").val(selectedImage.name);
    $("#image-preview").attr("src", selectedImage.data);
}

function updateImageContainer(assignedImageContainer) {
    assignedImageContainer.children().remove();
    for (let i in selectedExposition.imagePaths) {
        let curImg = $("<img/>", {
            id: "assigned-image-" + i,
            src: selectedExposition.imagePaths[i],
            class: "assigned-image-item"
        });
        curImg.appendTo(assignedImageContainer);

        curImg.on("click", function () {
            updateCurrentImage({data: $(this).attr("src"), name: ""});
        });
    }
}

function storeOld() {
    if (selectedExposition) {
        if (selectedExposition._id.startsWith("pseudo-")) {
            newMap.set(selectedExposition._id, selectedExposition);
        }
        else if (selectedExposition._id) {
            updateMap.set(selectedExposition._id, selectedExposition);
        }
    }
}