var selectedExposition;
var expositions;
var persistedImages;
var newMap = new Map();
var updateMap = new Map();
var failedItems;
var pseudoId = 0;
// Bilder Pro Pagination
var maximumImageAmount = 8;
// BIlder die Pro ausstellung erlaubt sind
var maximumImageItems = 5;

$(document).ready(function () {
    $(".ui-button").prop("disabled", false);
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
                console.log(updList[i]);
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

            $.when(calls).then(function () {
                init();
            })
        }
    });

    $("#new-exposition-button").on("click", function () {
        selectedExposition = {};
        updateDetails();

        var tableRow = $("<tr/>", {
            id: "pseudo-" + pseudoId,
            class: "exposition-data-row"
        });
        pseudoId++;

        var bsCell = $("<td/>", {
            class: "exposition-bs-cell bs new-item",
            text: " "
        });
        var nameCell = $("<td/>", {
            class: "exposition-name-cell"
        });
        var descriptionCell = $("<td/>", {
            class: "exposition-description-cell"
        });
        selectedExposition._id = tableRow.prop("id");
        expositions[tableRow.prop("id")] = selectedExposition;

        bsCell.appendTo(tableRow);
        nameCell.appendTo(tableRow);
        descriptionCell.appendTo(tableRow);
        tableRow.appendTo("#expositions-list");

        // onclick registereiren
        tableRow.on("click", function () {
            registerTableRow(this);
        });
        // click triggern
        tableRow.click();
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
        });

        deselectImage.on("click", function () {
            $("#image-preview").attr("src", "");
            selectedExposition.thumbnailPath = undefined;
            storeOld();
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
            expositions = result;
            for (event in result) {
                var tableRow = $("<tr/>", {
                    class: "exposition-data-row",
                    id: event
                });
                var bsCell = $("<td/>", {
                    class: "exposition-bs-cell bs"
                });
                var nameCell = $("<td/>", {
                    text: result[event].name,
                    class: "exposition-name-cell"
                });
                var description = result[event].description.length > 120 ? result[event].description.substring(0, 117) + "..." : result[event].description;
                var descriptionCell = $("<td/>", {
                    text: $("<p>" + description + "</p>").text(),
                    class: "exposition-description-cell"
                });

                bsCell.appendTo(tableRow);
                nameCell.appendTo(tableRow);
                descriptionCell.appendTo(tableRow);
                tableRow.appendTo("#expositions-list");
            }
        }
    ).fail(function () {
        // Add fail logic here
    }).always(function () {
        $(".exposition-data-row").on('click', function () {
            registerTableRow(this);
        });
    });
}

function registerTableRow(row) {
    $(row).addClass("ui-selected").siblings().removeClass("ui-selected");

    selectedExposition = expositions[$(row).prop("id")];
    if (!Array.isArray(selectedExposition.imagePaths)) {
        selectedExposition.imagePaths = [];
    }

    updateDetails();
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