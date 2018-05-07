/**
 * Stellt AJAX-Request
 * @param pUrl "Adresse, an die der Request gestellt werden soll"
 * @param pMethod "POST/GET als Methode zur Interaktion"
 * @param pObject "Objekt, welches an die Adresse übergeben wird"
 * @param pCallback "Funktion die ausgeführt wird, wenn Request erfolgreich war"
 * @param pFailCallback "Funktion die ausgeführt wird, wenn Request nicht erfolgreich war"
 */
function ajaxRequest(pUrl, pMethod, pObject, pCallback, pFailCallback) {
    $.ajax({
        type: pMethod,
        url: pUrl,
        data: pObject,
        success: pCallback,
        error: pFailCallback
    });
}