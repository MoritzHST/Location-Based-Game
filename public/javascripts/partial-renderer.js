function setNodeHookFromFile(pNodeHook, pFilePath, pCallback, pCallbackObject, pPartialInitFunction, pPartialInitObject) {
    return fetch(pFilePath, {
        // Die Option ist notwendig um credentials bei jedem GET zu übertragen,
        // da sonst keine Befugnis dafür gegeben ist
        credentials : "include"
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        let head = $('head');
        let partialJS = $('.partial.js.' + pNodeHook.attr("id"));
        let partialCSS = $('.partial.style.' + pNodeHook.attr("id"));

        // Alte Stylesheets und JavaScript für Hook entfernen
        partialCSS.remove();
        partialJS.remove();

        pNodeHook.html(html);
        // Stylesheets und JavaScript für den Hook taggen
        pNodeHook.find("link").addClass('partial style ' + pNodeHook.attr("id"));
        pNodeHook.find("script").addClass('partial js ' + pNodeHook.attr("id"));

        // JavaScript laden und hinzufügen
        let counter = 0;
        const jsList = $('.partial.js.' + pNodeHook.attr("id"));
        let elements = jsList.length;
        jsList.each(function() {
            counter++;
            let scriptTag = document.createElement('script');
            scriptTag.src = this.src;
            scriptTag.className = this.className;
            $(scriptTag).ready(function() {
                if (pPartialInitFunction !== undefined && elements === counter) {
                    const fn = window[pPartialInitFunction];
                    if (typeof fn === 'function') {
                        fn(pPartialInitObject);
                    }
                }
            });
            head.append(scriptTag);
        });
        // Javascript aus Hook entfernen
        $('#' + pNodeHook.attr("id") + '>.partial.js.' + pNodeHook.attr("id")).remove();

        // Neue Stylesheets hinzufügen
        pNodeHook.find("link").appendTo(head);
        // Funktion die global ausgeführt werden sollte, wenn das Partial in den
        // Hook eingefügt wird
        if (pCallback !== undefined) {
            pCallback(pCallbackObject);
        }
    });
}

function clearNodeHook(pNodeHookId) {
    $("#" + pNodeHookId).html("");
    // Alte Stylesheets und JavaScript für Hook entfernen
    $('.partial.style.' + pNodeHookId).remove();
    $('.partial.js.' + pNodeHookId).remove();
}