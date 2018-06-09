function workWithDatabase(dbAction, dbObjectName) {
    $.post('/admin/database', {
        action: dbAction,
        objects: dbObjectName
    }).done(function (result) {
        $("#result").text(result.status);
    });
}