// Imagelist
var persistedImages;
// maximale Anzahl and Preview Bildern
var maximumImageAmount = 12;
// Image Objekt das ggf. gerade erstellt wird
var newImage;
// Aktuelles Image für die bearbeitung
var editImage;

$(document).ready(function () {
    //Imageobjekt initialisieren
    newImage = {};
    $("#submit-new-image-button").on("click", function () {
        // Namen aus dem Textfeld ans Objekt hängen
        newImage.name = $("#image-textfield-name").val();
        $.post("/insert/images", newImage)
            .done(function () {
                fetchImages();
                $("#image-textfield-name").val("");
            });
    });

    $("#cancel-new-image-button").on("click", function () {
        $("#image-dropzone-preview-image").hide();
        $("#image-dropzone-hint").show();
        $("#image-textfield-name").val("");
    });

    $("#submit-update-image-button").on("click", function () {
        editImage.name = $("#persisted-image-textfield-name").val();
        $.post("/update/images/" + editImage._id, editImage)
            .done(function () {
                fetchImages();
            });
    });

    $("#delete-update-image-button").on("click", function () {
        $.post("/delete/images", {_id: editImage._id})
            .done(function () {
                fetchImages();
            });
    });

    fetchImages();

    // Image Upload
    // Initialisiere Drag&Drop EventListener
    let imageDropzone = $("#image-dropzone");
    imageDropzone.on('dragover', handleDragOver);
    imageDropzone.on('drop', chooseData);
});


function fetchImages() {
    $("#image-dropzone-preview-image").hide();
    $("#image-dropzone-hint").show();

    $.get("/find/images")
        .done(function (obj) {
            persistedImages = obj;
            updatePreview();
        });
}


function chooseData(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var selectedData = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.originalEvent.dataTransfer.files[0]; // FileList Objekt

    var reader = new FileReader();

    reader.onload = (function (file) {
        $("#image-dropzone-preview-image").show().attr("src", file.target.result);
        $("#image-dropzone-hint").hide();

        newImage.data = file.target.result;
    });

    reader.readAsDataURL(selectedData);

}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer = evt.dataTransfer ? evt.dataTransfer : evt.originalEvent.dataTransfer;
    evt.dataTransfer.dropEffect = 'copy';
}

function updatePreview() {
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

        //erster Durchlauf? Einmal anklicken
        if (i === 1) {
            curPagination.click();
        }
    }
}


function updateWrapper(curPagination) {
    let imageWrapper = $("#persisted-image-collection-wrapper");
    let imageMinCount = (curPagination - 1) * maximumImageAmount;
    let imageMaxCount = (curPagination * maximumImageAmount) - 1;


    imageWrapper.fadeOut("slow", function () {
        imageWrapper.empty();
        for (let i = imageMinCount; i <= imageMaxCount; i++) {
            if (persistedImages[i] !== undefined) {
                let curImage = $("<img/>", {
                    id: persistedImages[i]._id,
                    src: persistedImages[i].data,
                    class: "persisted-image-preview-item",
                    href: "#"
                });

                let curImageContainer = $("<div/>", {
                    class: "persisted-image-preview-item-container"
                });

                curImage.on("click", function () {
                    $.get("/find/images", {
                        _id: $(this).attr("id")
                    })
                        .done(function (obj) {
                            editImage = obj;
                            updateCurrentImage();
                        });
                });

                curImage.appendTo(curImageContainer);
                curImageContainer.appendTo(imageWrapper);
            }
        }
        imageWrapper.fadeIn("slow");
    });
}

function updateCurrentImage() {
    $("#persisted-image-textfield-name").val(editImage.name);
    $("#persisted-image-preview").attr("src", editImage.data);
}