function setNodeHookFromFile(pHeader, pNodeHook, pFilePath) {
    return fetch(pFilePath)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            pNodeHook.innerHTML = html;
            $(pNodeHook.getElementsByTagName('link')).appendTo(pHeader);
            $(pNodeHook.getElementsByTagName('script')).appendTo(pHeader);
        });
}