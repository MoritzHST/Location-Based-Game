function clearLocalCookies(cookieName) {
    let requestedCookiesCleared = false;
    if (document.cookie) {
        document.cookie.split(";").forEach(function(c) {
            if (!cookieName) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                requestedCookiesCleared |= true;
            } else if (c.trim().startsWith(cookieName)) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                requestedCookiesCleared = true;
            }
        });
    }
    return requestedCookiesCleared;
}

// https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1].replace(/\+/g, '%20')) || null;
}