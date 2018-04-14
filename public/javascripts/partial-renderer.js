function setNodeHookFromFile(pHeader, pNodeHook, pFilePath, pCallback, pCallbackObject) {
    return fetch(pFilePath)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            pNodeHook.innerHTML = html;
            $(pNodeHook.getElementsByTagName('link')).appendTo(pHeader);
            $(pNodeHook.getElementsByTagName('script')).appendTo(pHeader);
            if (pCallback != undefined) {
                pCallback(pCallbackObject);
            }
        });
}