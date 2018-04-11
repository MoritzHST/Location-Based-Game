function ajaxRequest(pUrl, pMethod, pCallback) {
    $.ajax({
        type: "POST",
        url: pUrl,
        success: function (data) {
            callback(data, passData)
        }
    });
}