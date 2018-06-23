$(document).ready(function() {
    var roomsList = [];

    // Finde Räume aus der Datenbank und füge sie der Tabelle hinzu
    loadDataIntoTable("rooms", "locations", null, function(result) {
        roomsList = result;

        // toggleAction(true, $("#button-save"));
        $("#button-save").on("click", function() {
            for (let room of roomsList) {
                if (roomsList.hasOwnProperty(room)) {
                    // ...
                }
            }
        });

        $("#rooms-list").bind('mousedown', function (event) {
            event.metaKey = true;
        }).selectable({
            filter: 'tr',
            selected: function (event, ui) {
                $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                toggleField(true, $(".details"));
                
                // selectedRoom = roomList[$(".ui-selected").prop("id")];
                // updateDetails(false);
                // $("#location-identifier-textfield,
                // #location-roomnumber-textfield").prop("disabled", false);
                // $("#delete-room-button").removeClass("disabled");
            },
            unselected: function (event, ui) {
                toggleField(false, $(".details"));
                
                // selectedRoom = {};
                // selectedRoom.roomnumber = "";
                // selectedRoom.identifier = "";
                // updateDetails(false);

              // $("#location-identifier-textfield").removeClass("textfield-invalid");
              // $("#location-roomnumber-textfield").removeClass("textfield-invalid");
              // $("#location-identifier-textfield,
                // #location-roomnumber-textfield").prop("disabled", true);
              // $("#delete-room-button").addClass("disabled");
            }
        });
    });
});