$(document).ready(function() {
    $("#logs-wrapper").children("div").each(function() {
        var divId = $(this).attr("id");
        var fileName = divId.substring(divId.indexOf("-") + 1);

        $.get("/admin/logs/" + fileName + ".log", function(data) {
            $("#" + divId).html(data.replace(/\n/g, "<br />"));
        });
    });
});