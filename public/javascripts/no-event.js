$(document).ready(function () {
    setNodeHookFromFile($("#header-hook"), "../partials/header/header.html");
    setNodeHookFromFile($("#footer-hook"), "../partials/footer/footer.html");

    findNextEvent();
});
//Date bietet standardmäßig keine Monatsnamen, deshalb ein Array mit diesen initialisieren
let MonthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
];


function findNextEvent() {
    $.get("/find/events")
        .done(function (obj) {
            //Referenzobjekt erstellen
            let today = new Date().getTime();
            //Einmal initialisieren
            let curEvent = obj[0];

            for (let i in obj) {
                //Suche das nächst mögliche Event
                if (obj.hasOwnProperty(i) && new Date(obj[i].date).getTime() < new Date(curEvent.date).getTime() && new Date(obj[i].date).getTime() > today) {
                    curEvent = obj[i];
                }
            }
            //Das curEvent kann durch initialisierung noch vor heute liegen -> abfangen!
            //Ebenfalls kann es undefiniert sein
            if (!curEvent || new Date(curEvent.date).getTime() < today) {
                $("#next-event-defined").hide();
            }
            else {
                curEvent.date = new Date(curEvent.date);
                $("#event-date").html(curEvent.date.getDate() + " " + MonthNames[curEvent.date.getMonth()] + " " + curEvent.date.getFullYear());
                $("#event-name").html("\"" + curEvent.name + "\"");
            }
        })
        .fail(function () {
            //Abfrage fehlgeschlagen, ausblenden
            $("#next-event-defined").hide();
        });
}