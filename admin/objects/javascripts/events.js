$(document).ready(function() {
	onTabLoad();
	$("#events-div-mapping").hide();	    
	$(document).tooltip();
	
	let selectedEvent;
	let selectedMapIndex;
	
	let eventsList = [];
	let roomsList = [];
	let expositionsList = [];
	let gamesList = [];
    
    $("#events-div-accordion").accordion({ 
    	collapsible: true,
    	heightStyle: "content",
    	active: "false",
    	autoHeight: false
    });
    
	//Lädt alle Event Daten
    loadDataIntoTable("events", "events", null, function(result) {
    	eventsList = result;
    	
    	//Handelt das Klicken auf eine Event Reihe
    	$("#events-list").bind('mousedown', function(event) {
    		event.metaKey = true;
        }).selectable({
            filter: 'tr',
            selected: function (event, ui) {
            	selectedMapIndex = -1;
            	toggleField(false, $("#events-div-accordion"));            	
            	$(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
            	$("input[type='checkbox'], input[type='radio']").prop("checked", false);
            	$("#delete-mapping-button").prop("disabled", true);
            	$("#delete-event-button, #duplicate-event-button").prop("disabled", false);
            	$("#events-table-mapping > tbody.table-list").empty();
            	            	
            	selectedEvent = eventsList[$("#events-table-events > tbody.table-list").find(ui.selected).index()];
            	$("#events-table-mapping").find("tbody:first").attr("id", "tbody-" + selectedEvent._id);            	
            	fillTable($("#events-table-mapping"), selectedEvent.locationMappings);
            	//ToDo: wenn mapping status hat, dann auf bs icon zufügen
            	
            	$("#events-div-mapping").show();
            },
            unselected: function (event, ui) {
            	selectedEvent = undefined;
            	selectedMapIndex = -1;
            	toggleField(false, $("#events-div-accordion"));
            	$("input[type='checkbox'], input[type='radio']").prop("checked", false);
            	$("#delete-event-button, #duplicate-event-button").prop("disabled", true);
            	$("#events-table-mapping > tbody.table-list").empty();            	
            	$("#events-div-mapping").hide();
            }
        });
    });
    
    //Lädt alle Raum Daten
	loadDataIntoTable("events", "locations", "radio", function(result) {
	    roomsList = result;	       
	});
    
	//Lädt alle Ausstellung Daten
    loadDataIntoTable("events", "expositions", "radio", function(result) {
    	expositionsList = result;
    });
    
    //Lädt alle Spiel Daten
    loadDataIntoTable("events", "games", "checkbox", function(result) {
    	gamesList = result;
    });
    
    //Handelt das Klicken auf eine Mapping-Reihe
	$("#events-table-mapping > tbody.table-list").bind('mousedown', function(event) {
		event.metaKey = true;
    }).selectable({
        filter: 'tr',
        selected: function (event, ui) {
        	$(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
        	$("#delete-mapping-button").prop("disabled", false);        	
            $("input[type='checkbox'], input[type='radio']").prop("checked", false);
        	        	           	            	
            for (let i = 0; i < eventsList.length; i++) {
                if ("tbody-" + String(eventsList[i]._id) === ui.selected.closest("tbody").id) {
                	selectedMapIndex = $("#events-table-mapping > tbody.table-list").find(ui.selected).index();
                    break;
                }
            }
        	
            let selectedMap = selectedEvent.locationMappings[selectedMapIndex];
            
        	if (selectedMap) {            
                // Vergleich mit Räume
                $("#events-table-locations > tbody.table-list").find("tr").each(function () {
                    if (String(selectedMap.location._id) === $(this).attr("id").slice(3)) {
                        $(this).find("input[type]").prop("checked", true);
                        return false;
                    }
                });

                // Vergleich mit Ausstellungen
                $("#events-table-expositions > tbody.table-list").find("tr").each(function () {
                    if (String(selectedMap.exposition._id) === $(this).attr("id").slice(3)) {
                        $(this).find("input[type]").prop("checked", true);
                        return false;
                    }
                });

                // Vergleich mit Spiele
                $("#events-table-games > tbody.table-list").find("tr").each(function () {
                    for (let game of selectedMap.games) {
                        if (String(game._id) === $(this).attr("id").slice(3)) { //remove "tr-"
                            $(this).find("input[type]").prop("checked", true);
                        }
                    }
                });
        	}
        	            	            	
        	toggleField(true, $("#events-div-accordion"));
        },
        unselected: function (event, ui) {
        	$("input[type='checkbox'], input[type='radio']").prop("checked", false);
        	toggleField(false, $("#events-div-accordion"));
        	$("#delete-mapping-button").prop("disabled", true);
        }        
    });
	
	$('tbody.table-list').off('change');
	$('tbody.table-list').on('change','tr td input', function(){
		toggleField(false, $("#events-div-accordion"));
		let id = $(this).attr("id").slice(6); //remove "check-"
		//console.log(selectedMap);
		
		let type = $(this).closest("tbody").attr("id");
		let selectedMap = selectedEvent.locationMappings[selectedMapIndex];
		
		//Füge die content Änderungen dem aktuellen Mapping hinzu
		if (selectedMap) {
			switch (type) {
				case "exposition":
					for (let e in expositionsList) {
						if (expositionsList[e]._id === id) {
							selectedMap.exposition = expositionsList[e];
							break;
						}
					}
					break;
				case "location":
					for (let l in roomsList) {
						if (roomsList[l]._id === id) {
							selectedMap.location = roomsList[l];
							break;
						}
					}				
					break;
				case "games":
					let game;
					for (let g in gamesList) {
						if (gamesList[g]._id === id) {
							game = gamesList[g];
							break;
						}
					}
					
					for (let sg in selectedMap.games) {
						if (selectedMap.games[sg]._id === game.id) {
							selectedMap.games[sg] = game;
							break;
						}
					}
					break;				
			}
		}
				
		//Füge die Mapping Änderungen dem aktuellen Event hinzu				
		if (!selectedMap.status) {					
			selectedMap.status = "update";
			$("#events-table-mapping > tbody.table-list").find("tr").eq(selectedMapIndex).children("td").eq(0).addClass("edit-item");	
		}
		
		selectedEvent.locationMappings[selectedMapIndex] = selectedMap;		
		
		//Füge die Event Änderungen der Event Liste hinzu
		for (let ev in eventsList) {
			if (eventsList[ev]._id === selectedEvent._id) {
				eventsList[ev]._id = selectedEvent;
				break;
			}
		}
		
		toggleField(true, $("#events-div-accordion"));		
	})	
});

function updateMapping() {
	
}