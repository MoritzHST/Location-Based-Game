// Imagelist
let persistedImages;
// maximale Anzahl and Preview Bildern
let maximumImageAmount = 16;

$(document).ready(function () {
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
        $.post("/insert/images", {
            data: btoa(file.target.result)
        })
            .done(function () {
                fetchImages()
            });
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
                    class: "persisted-image-preview-item"
                });

                curImage.on("click", function () {
                    $("#persisted-image-preview").attr("src", curImage.attr("src"));
                });

                curImage.appendTo(imageWrapper);
            }
        }
        imageWrapper.fadeIn("slow");
    });
}