const baseUrl = "admin/test/";

function ajaxRequest(pUrl, pMethod, pObject, pCallback, pFailCallback) {
    $.ajax({
        type: pMethod,
        url: baseUrl + pUrl + pObject,
        data: pObject,
        success: pCallback,
        error: pFailCallback
    });
}