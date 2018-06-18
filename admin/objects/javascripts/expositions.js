//In der Tabelle gewählte Ausstellung
var selectedExposition;
//Liste der Ausstellungen (Tabelle als Objektliste)
var expositionList;
//Liste an Bildern, die bereits in der DB vorhanden sind
var persistedImages;
//Neue Ausstellungen als Map
var newMap = new Map();
//Ausstellungen die gelöscht werden sollen
var delMap = new Map();
//Bearbeitete, Persistierte Ausstellungen als Map
var updateMap = new Map();
//Fehlgeschlagene Items bei der Persitierung
var failedItems;
// Bilder Pro Pagination
var maximumImageAmount = 8;
// BIlder die Pro ausstellung erlaubt sind
var maximumImageItems = 5;

$(document).ready(function () {
    $("#button-save-template.ui-button, #button-import-template.ui-button").prop("disabled", true);
    //Save-Button neu registrieren
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {
        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
        let delList = Array.from(delMap.values());
        for (let i in newList) {
            if (newList.hasOwnProperty(i) && isValid(newList[i])) {
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
            if (updList.hasOwnProperty(i) && isValid(updList[i])) {
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
        }
        for (let i in delList) {
            if (delList.hasOwnProperty(i)) {
                calls.push(
                    $.post("/delete/expositions", {_id: delList[i]._id})
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
                            for (let j in expositionList) {
                                if (expositionList[j]._id && expositionList[j]._id.toString() === failedItems[i]._id.toString()) {
                                    $("#" + j).addClass("failed");
                                }
                            }
                        }
                    }
                });
        });
    });

    $("#new-exposition-button").on("click", function () {
        //Einmal das alte Objekt speichern
        storeOld();
        //Neu initialisieren und flaggen
        selectedExposition = {};
        selectedExposition.isNew = true;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        selectedExposition._id = "pseudoId-" + rowId;
        selectedExposition.name = "";
        selectedExposition.description = "";
        selectedExposition.thumbnailPath = "";
        selectedExposition.imagePaths = [];

        appendRow(selectedExposition);

        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
        switchData();
    });

    $("#delete-exposition-button").on("click", function () {
        selectedExposition.remove = true;
        $(".ui-selected").find(".bs").addClass("delete-item");
        delMap.set(selectedExposition._id, selectedExposition);
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
    return new Promise(resolve => {
        $.get("/find/expositions").done(function (result) {
            $(".data-row").remove();
                for (event in result) {
                    appendRow(result[event]);
                }
                resolve(true);
            }
        ).fail(function () {
            resolve(false);
        })
            .always(function () {
                $("#expositions-list").bind('mousedown', function (event) {
                    event.metaKey = true;
                }).selectable({
                    filter: 'tr',
                    selected: function (event, ui) {
                        $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                        switchData();
                    },
                    unselected: function (event, ui) {
                    }
                });
            });
    });
}

function switchData() {
    selectedExposition = expositionList[$(".ui-selected").prop("id")];
    if (!Array.isArray(selectedExposition.imagePaths)) {
        selectedExposition.imagePaths = [];
    }
    updateDetails();
}

function appendRow(pObj) {
    //Ist die Ausstellungsliste initialisiert? Wenn nein tu es
    if (!(Array.isArray(expositionList))) {
        expositionList = [];
    }

    let tableRow = addRow($("#expositions-list"), pObj, {classes: "exposition-bs-cell " + (pObj.isNew ? "new-item" : "")}, {
            classes: "exposition-name-cell",
            text: "name"
        },
        {classes: "exposition-description-cell", text: "description"});

    //Objekt der Liste hinzufüge
    expositionList[rowId] = pObj;
}

function updateDetails() {
    let selRow = $(".ui-selected");
    let detailsName = $("#exposition-name-textfield");
    let detailsTextarea = $("#exposition-description-textfield");

    detailsName.off("input");
    detailsName.on("input", setInput);
    detailsTextarea.unbind("input propertychange");
    detailsTextarea.bind("input propertychange", setInput);
    $("#exposition-thumbnail").attr("src", String(selectedExposition.thumbnailPath ? selectedExposition.thumbnailPath : ""));
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
    detailsName.val(selectedExposition.name);
    detailsTextarea.val(selectedExposition.description);

    function setInput() {
        checkInput();
        if (!($(selRow).find(".bs").hasClass("delete-item") || $(selRow).find(".bs").hasClass("new-item")))
            $(selRow).find(".bs").addClass("edit-item");
        selectedExposition.name = $("#exposition-name-textfield").val();
        selectedExposition.description = $("#exposition-description-textfield").prop("value");
        $(selRow).find(".exposition-name-cell").text(selectedExposition.name);
        $(selRow).find(".exposition-description-cell").text(selectedExposition.description);

        storeOld();
    }
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
    if (!selectedExposition) {
        return;
    }

    if (selectedExposition._id.startsWith("pseudoId-")) {
        if (selectedExposition.remove) {
            newMap.remove(selectedExposition._id);
        }
        else {
            newMap.set(selectedExposition._id, selectedExposition);
        }
    }
    else if (selectedExposition._id) {
        if (selectedExposition.remove) {
            updateMap.remove(selectedExposition._id);
        }
        else {
            updateMap.set(selectedExposition._id, selectedExposition);
        }
    }

}

// Input überprüfen
function checkInput() {
    let curName = $("#exposition-name-textfield");
    let curDescription = $("#exposition-description-textfield");

    if (!curName.val() || !curName.val().trim() === "") {
        curName.addClass("textfield-invalid");
    }
    else {
        curName.removeClass("textfield-invalid");
    }

    if (!curDescription.val() || !curDescription.val().trim() === "") {
        curDescription.addClass("textfield-invalid");
    }
    else {
        curDescription.removeClass("textfield-invalid");
    }
}

// Bezeichnung und Beschreibung darf nicht leer sein
function isValid(pObj) {
    if (!pObj.name || pObj.name.trim() === "") {
        return false;
    }

    if (!pObj.description || pObj.description.trim() === "") {
        return false;
    }

    return true;
}