function setNodeHookFromFile(pNodeHook, pFilePath, pCallback, pCallbackObject, pPartialInitFunction) {
    return fetch(pFilePath)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            let head = $('head');
            //Alte Stylesheets und JavaScript für Hook entfernen
            $('.partial.style.' + pNodeHook.id).remove();
            $('.partial.js.' + pNodeHook.id).remove();
            pNodeHook.innerHTML = html;
            //Stylesheets und JavaScript für den Hook taggen
            $(pNodeHook.getElementsByTagName('link')).addClass('partial style ' + pNodeHook.id);
            $(pNodeHook.getElementsByTagName('script')).addClass('partial js ' + pNodeHook.id);

            //JavaScript laden und hinzufügen
            let counter = 0;
            const jsList = $('.partial.js.' + pNodeHook.id);
            let elements = jsList.length;
            jsList.each(function () {
                counter++;
                let scriptTag = document.createElement('script');
                scriptTag.src = this.src;
                scriptTag.className = this.className;
                $(scriptTag).ready(function () {
                    if (pPartialInitFunction !== undefined && elements === counter) {
                        const fn = window[pPartialInitFunction];
                        if (typeof fn === 'function') {
                            console.log(fn());
                            fn();
                        }
                    }
                });
                head.append(scriptTag);
            });
            //Javascript aus Hook entfernen
            $('#' + pNodeHook.id + '>.partial.js.' + pNodeHook.id).remove();

            //Neue Stylesheets hinzufügen
            $(pNodeHook.getElementsByTagName('link')).appendTo(head);
            //Funktion die global ausgeführt werden sollte, wenn das Partial in den Hook eingefügt wird
            if (pCallback !== undefined) {
                pCallback(pCallbackObject);
            }
        });
}

function clearNodeHook(pNodeHookId) {
    $("#" + pNodeHookId).html("");
    //Alte Stylesheets und JavaScript für Hook entfernen
    $('.partial.style.' + pNodeHookId).remove();
    $('.partial.js.' + pNodeHookId).remove();
}