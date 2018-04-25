function setNodeHookFromFile(pNodeHook, pFilePath, pCallback, pCallbackObject, pPartialInitFunction) {
    return fetch(pFilePath)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            let head = $('head');

            pNodeHook.innerHTML = html;
            //Stylesheets und JavaScript für den Hook taggen
            $(pNodeHook.getElementsByTagName('link')).addClass('partial style ' + pNodeHook.id);
            $(pNodeHook.getElementsByTagName('script')).addClass('partial js ' + pNodeHook.id);

            //Alte Stylesheets und JavaScript für Hook entfernen


            $('partial style ' + pNodeHook.id).remove();
            $('partial js ' + pNodeHook.id).remove();

            //JavaScript laden und hinzufügen
            let counter = 0;
            const jsList = $('.partial.js.' + pNodeHook.id);
            let elements = jsList.length;
            jsList.each(function () {
                counter++;
                let scriptTag = document.createElement('script');
                scriptTag.src = this.src;
                scriptTag.className = this.className;

                scriptTag.onload = function () {
                    //Mögl. Initialisierungsfunktion des Partials
                    //Nur wenn es sich um das letzte Script handelt
                    if (pPartialInitFunction !== undefined && elements === counter) {
                        const fn = window[pPartialInitFunction];
                        if (typeof fn === 'function') {
                            fn();
                        }
                    }
                };

                document.head.appendChild(scriptTag);
            });

            //Neue Stylesheets hinzufügen
            $(pNodeHook.getElementsByTagName('link')).appendTo(head);
            //Funktion die global ausgeführt werden sollte, wenn das Partial in den Hook eingefügt wird
            if (pCallback !== undefined) {
                pCallback(pCallbackObject);
            }
        });
}