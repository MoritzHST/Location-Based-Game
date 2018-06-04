$(document).ready(function () {
    setNodeHookFromFile($("#header-hook"), "../partials/header/header.html");
    setNodeHookFromFile($("#footer-hook"), "../partials/footer/footer.html");

    findNextEvent();
});

MonthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
];


function findNextEvent() {
    $.get("/find/events")
        .done(function (obj) {
            let today = new Date().getTime();
            //Einmal initialisieren
            let curEvent = obj[0];

            for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (new Date(obj[i].date).getTime() < new Date(curEvent.date).getTime() && new Date(obj[i].date).getTime() > today) {
                        curEvent = obj[i];
                    }
                }
            }
            //Das curEvent kann durch initialisierung noch vor heute liegen -> abfangen!
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
            $("#next-event-defined").hide();
        });
}