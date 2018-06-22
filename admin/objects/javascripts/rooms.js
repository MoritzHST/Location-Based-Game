$(document).ready(function() {
    var roomsList = [];

    // Finde Räume aus der Datenbank und füge sie der Tabelle hinzu
    loadDataIntoTable("rooms", "locations", null, function(result) {
        roomsList = result;

        toggleSideBarButtons(true, $("#button-save"));
        $("#button-save").on("submit", function() {
            alert("Save!");
        });
    });
});