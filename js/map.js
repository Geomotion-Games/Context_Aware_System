
// MAP INIT

var map = L.map('map');
var layers = createTeamLayers();
var paths = [];

var currentTeam = 0;

var OpenStreetMap_Mapnik = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVhY29uaW5nIiwiYSI6ImNqYnhxd3h0czJsbngycXBjMjd6MG9vOWoifQ.fNesE_V6xrHFGiK1otUsTg', {
	maxZoom: 19,
	attribution: ""
}).addTo(map);

map.on('load', function() {
  	locate();
});

L.easyButton('<img id="locate" src="images/location.png">', function(btn, map){
    locate();
}).addTo(map);

map.setView(lastLocation? lastLocation : [51.505, -0.09], 13).addLayer(OpenStreetMap_Mapnik);

L.Control.geocoder({showResultIcons: false, collapsed: false}).addTo(map);

function createTeamLayers(){
	var layers = [];
	for(var i = 0; i < 10; i++){
		var layer = new L.layerGroup();
		layers.push(layer);
		map.addLayer(layer);
	}
	return layers;
}

function generateMarker(teamColor, isBeacon){
	var team = teamColorToId(teamColor) ;
	return new L.Icon({
		iconUrl: "images/markers/" + (isBeacon? "beacon" : "poi") + "_" + (team + 1) + ".png",
		shadowUrl: "images/markers/shadow.png",
		iconSize: isBeacon ? [26, 54] : [25, 41],
		iconAnchor: isBeacon ? [13, 54] : [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
}

function generateStartMarker(teamColor){
	var team = teamColorToId(teamColor);
	return normalMarkerIcon = new L.Icon({
		iconUrl: "images/markers/start_" + (team + 1) + ".png",
		shadowUrl: "images/markers/shadow.png",
		iconSize: [26, 39],
		iconAnchor: [5, 38],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
}

var finishTreasureMarkerIcon = L.icon({
    iconUrl: 'images/markers/finish_treasure.jpg',

    iconSize:     [50, 43], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [25, 43], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var finishRaceMarkerIcon = L.icon({
    iconUrl: 'images/markers/finish_race.png',

    iconSize:     [41, 53], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [2, 52], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


map.on('click', function(e) {
	if($(".leaflet-control-geocoder-form input").is(":focus")) return;
	var color = teams.length > 0 ? teams[currentTeam].color : colorNames[0];
	var marker = addMarker(e.latlng, undefined, currentTeam, color);
	addStop(marker, "normal");
	//map.addLayer(marker);
	//updatePath();
});

// POI EVENTS

// START
$("#start").on('click', 'li', function(e) {
    var stopNumber = 0;
    var action =  $(e.target).hasClass('fa-pencil') ? "edit" : "";

    stopOnClick(this, stopNumber, action);
});

// FINISH
$("#finish").on('click', 'li', function(e) {
    var stopNumber = 999;
    var action =  $(e.target).hasClass('fa-pencil') ? "edit" : "";

    stopOnClick(this, stopNumber, action);
});

// STOPS
$("#stops").on('click', 'li', function(e) {
    var stopId = parseInt($(this).attr("stop-id"));
    var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
    action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
    action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;
    action = $(e.target).hasClass('center') ? "center" : action;

    stopOnClick(this, stopId, action);
});

var pointsCopy;

$( function() { 
	$( "#stops" ).sortable( {
		update: function(event, ui) {
			sortPoints(true);
		}
	});  
	poisCreated = points.length;

	showTeams();

	getBeacons(function (b) {
		beacons = b;
		pointsCopy = points.slice();
		loadStops();
	});
});

function stopOnClick(parent, stopId, action){
    if(action == "remove"){
        $(parent).remove();
        removeStop(stopId);
        return;
    }else if(action == "edit"){
    	
    }else if(action == "duplicate"){
       duplicate(stopId);
    }else if(action == "center"){
       for(var point in points){
			if (points[point] && points[point].id == stopId && points[point].marker) {
				var latlng = points[point].marker.getLatLng();
				map.setView(latlng, 20);
			}
		}
    }
}

// PATHS

var path;

function updatePath() {
	for(var i = 0; i < teams.length || 1; i++){
		if(!layers[i]) break;
		var pointList = [];

		layers[i].eachLayer(function(marker){
			if(marker._latlng){
				pointList.push(marker._latlng);
			}
		});

		if (paths[i] != null) map.removeLayer(paths[i]);

		var color = teams.length > 0 && teams[i] ? teams[i].color : colorNames[0];

		paths[i] = new L.Polyline(pointList, {
	    	color: colorTeamPath[teamColorToId(color)],
	    	weight: 4,
	    	opacity: i == currentTeam ? 0.6 : 0.2, 
	    	smoothFactor: 1
		});

		paths[i].addTo(map);

	}

	updateLabels();
	updateMarkersOpacity();
}

// POI LOADING

function loadStops(){
	points = pointsCopy.slice();
	points.forEach(function(p){
		if(p.type == "beacon") addBeaconMarker(p.beaconId, p);
		showStop(p);
		if(p.marker)p.marker.step = p;
	});
	
	sortPoints();
}

function showTeams(){
	var disableAdd = teams.length >= 10
	$("#teams").empty();
	for(var i = 0; i < teams.length; i++){
		var background_color = currentTeam == i ? "#3b4f61" : "#2c353e";
		var color = colorTeamMarker[teamColorToId(teams[i].color)];
		var style = `style="border-bottom: 8px solid ${color}; background-color: ${background_color}"`;
		$("#teams").append(`
			<li ${style} team-index="${i}">
				<div class="teamTitle">
					Team ${i + 1}
				</div>
				<div class="teamActions">
					<a><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
					<a><i title="Duplicate" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
					<a ${i==0 && teams.length == 1 ? "class='hidden'":""}><i title="Delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
				</div>
			</li>
		`);
	}
	
	$("#teams").append(`<li class="addTeam ${disableAdd?"disabled":""}">
							<p>+ Add team</p>
						</li>`);
	$("#teams").off('click', 'li');
	$("#teams").on('click', 'li', function(e) {
		var element = this;
		var index = parseInt($(element).attr("team-index"));
	    var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
	    action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
	    action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;

	    if(isNaN(index)){
			addTeam();
	    }

	    if(action){
	    	switch(action){
	    		case "edit":
	    			setCurrentTeam(index);
	    		break;
	    		case "duplicate":
	    			if(teams.length >= 10) return;
	    			var copy = teams[index].copy();
	    			copy.color = getAvailableTeam();
	    			duplicateTeam(copy, function(teamId, poiIds){
	    				copy.id = teamId;
	    				teams.push(copy);
	    				setCurrentTeam(teams.length - 1);
	    				showTeams();

	    				var i = 0;
	    				if(poiIds.length > 0){
		    				layers[index].eachLayer(function(marker){
		    					var c = marker.step.copy();
		    					c.id = parseInt(poiIds[i]);
		    					c.team = teamId;
		    					pointsCopy.push(c);
		    					var latlng = {lat:c.lat, lng: c.lng};
		    					var marker = addMarker(latlng, undefined, currentTeam, copy.color);
		    					marker.step = c;
		    					c.marker = marker;
		    					i++;
		    				});
	    				}
	    				
	    				updatePath();
		    			loadStops();
	    			});
	    		break;
	    		case "remove":
	    			removeTeam(teams[index], game, function(data){
	    				teams.splice(index, 1);
	    				map.removeLayer(layers[index]);
	    				layers.splice(index, 1); 
	    				layers.push(new L.layerGroup());
	    				map.addLayer(layers[layers.length - 1]);

	    				var newIndex = index == 0 ? 0 : index - 1;
	    				setCurrentTeam(newIndex);
	    				//showTeams();
	    			});
	    		break;
	    	}
	    }
	});
}

function addTeam(){
	if(teams.length >= 10) return;
	var color = getAvailableTeam();
	var team = new Team({color: color});
	teams.push(team);
	saveTeam(team, game, function(t){
		showTeams();
		team.id = t;
		setCurrentTeam(teams.length - 1);
	})
}

function duplicate(stopId){
 	for(var point in points){
		if (points[point] && points[point].id == stopId) {
			poisCreated++;
			console.log("Team: " + points[point].team);
			var copy = points[point].copy();
			
			var lastMarker = copy.marker;
			var newPosition = addMetersToCoordinates(lastMarker._latlng, 200, 0);
			copy.marker = addMarker(newPosition, copy.type != "beacon");
			copy.marker.step = copy;
			map.addLayer(copy.marker);
			map.panTo(copy.marker._latlng);

			var count = Object.keys(layers[currentTeam]._layers).length;

			if((game.type == "RatRace" || game.type == "Jigsaw") && count > 2){
				copy.orderNumber = count - 1;
				pointsCopy.push(copy);

				//copy.team = currentTeam;
				var last = points[points.length - 1];

				if(last){
    				points[points.length - 2] = copy;
					//points[points.length - 2] = step;
					last.orderNumber = poisCreated;
					points[poisCreated] = last;
					savePOI(last, game, function(id){
						duplicatePOI(copy, game, function(id){
							$("#stops").children().each(function() {
								var number = $(this).attr("stop-number");
								if(number == poisCreated){
									var url = game.type == "TreasureHunt" ? "screens-overview.php?id=" + id + "&noClue" : "screens-overview.php?id=" + id;
									$(this).find(".editPOI").attr("href", url);
								}
							});
							emptyStops();
							loadStops();
						});
					});
				}
			}else{
				copy.orderNumber = poisCreated;
    			points[poisCreated] = copy;
				pointsCopy.push(copy);

				duplicatePOI(copy, game, function(id){
	    			showStop(copy);
	    			//points[poisCreated] = copy;
	    			updatePath();
	    			sortPoints();
	    		});
			}
		}
	}
}

function addBeaconMarker(id, step, focus){
	var beacon = null;
	for(var b in beacons){
		if(beacons[b].id == id){
			beacon = beacons[b];
			break;
		}
	}
	if(beacon == null) return;
	if(step.marker) map.removeLayer(step.marker);
	var coords = {lat: beacon.lat, lng: beacon.lng};
	var marker = addMarker(coords, false);
	step.marker = marker;
	step.beaconId = id;
	if(focus){
		map.setView(coords, map._zoom);
	}
	sortPoints(null, true);
	updatePath();
}

function addMarker(latlng, draggable, team, teamColor){
	teamColor = teamColor || colorNames[0];
	team = team || 0;

	var icon;

	var icon = draggable === undefined || draggable == true ? generateMarker(teamColor): generateMarker(teamColor, true);
	var marker = new L.marker(latlng, {
		draggable: draggable === undefined ? 'true' : draggable,
		icon: icon
	}).bindTooltip( "Stop " + (Object.keys(layers[currentTeam]._layers).length + 1),
		{
			permanent: true,
			direction: 'bottom'
		});

	marker.on('dragend', function(event){
		var target = event.target;
		var position = target.getLatLng();

		if(marker && marker.step){
			marker.step.lat = position.lat;
			marker.step.lng = position.lng;
		}

		updatePath();
		savePOI(marker.step, game);
	});

	marker.on('drag', function(event){
		var target = event.target;
		var position = target.getLatLng();
		
		if(marker && marker.step){
			marker.step.lat = position.lat;
			marker.step.lng = position.lng;
		}
		
		updatePath();
	});

	layers[team].addLayer(marker);

	return marker;
}

function updateLabels() {
	for(var i = 0; i < teams.length || 1; i++){
		if(!layers[i]) break;

		var count = 1;
		layers[i].eachLayer(function(marker){
			if(!marker.step || !marker.step.title || marker.step.title.length == 0) {
				marker._tooltip.setContent("Stop " + count);
			}else{
				marker._tooltip.setContent(marker.step.title);
			}
			count++;
		});
	}

	var count = 1;
	$("#stops").children().each(function() {
		var id = $(this).attr("stop-id");
		for(var point in points){
			if (points[point] && points[point].id == id){
				if (points[point].title && points[point].title.length > 0){
					$(this).find("span.name").text(points[point].title);
				}else{
					var name = "Stop " + count;
					$(this).find("span.name").text(name);
				}
				break;
			}
		}
		count++;
	});
}

function addStop(marker, type){
	var lastPoi = poisCreated;
	var team = teams[currentTeam] ? teams[currentTeam].id : null;

	poisCreated++;

	var step;
	var skipSave = false;
	var count = Object.keys(layers[currentTeam]._layers).length;

	if((game.type == "RatRace" || game.type == "Jigsaw") && count > 2){
		step = new Step({marker: marker, orderNumber: count - 1, type: type, team: team});
		var last = points[points.length - 1];

		if(last){
			points[points.length - 2] = step;
			last.orderNumber = poisCreated;
			points[poisCreated] = last;
			skipSave = true;
			savePOI(last, game, function(id){
				savePOI(step, game, function(id){
					$("#stops").children().each(function() {
						var number = $(this).attr("stop-number");
						if(number == poisCreated){
							var url = game.type == "TreasureHunt" ? "screens-overview.php?id=" + id + "&noClue" : "screens-overview.php?id=" + id;
							$(this).find(".editPOI").attr("href", url);
						}
					});
					emptyStops();
					loadStops();
				});
			});
		}
	}else{
		step = new Step({marker: marker, orderNumber: count, type: type, team: team});
		points[poisCreated] = step;
	}

	if(marker)marker.step = step;
	pointsCopy.push(step);

	if(!skipSave){
		savePOI(step, game, function(id){
			$("#stops").children().each(function() {
				var number = $(this).attr("stop-number");
				if(number == poisCreated){
					var url = game.type == "TreasureHunt" ? "screens-overview.php?id=" + id + "&noClue" : "screens-overview.php?id=" + id;
					$(this).find(".editPOI").attr("href", url);
				}
			});
			showStop(step);
			updatePath();
			sortPoints();
		});
	}
}

function removeStop(stopId) {
	for(var point in points){
		var p = points[point];
		if (p && p.id == stopId) {
			if(p.marker)map.removeLayer(p.marker);
			removePOI(p, game);
			delete pointsCopy[pointsCopy.indexOf(p)];
			delete p;
		}
	}

	layers[currentTeam].eachLayer(function(marker){
		if(marker.step.id == stopId) layers[currentTeam].removeLayer(marker);
	});

	poisCreated--;
	updatePath();
	sortPoints(true);
}

function getTeamNumberFromId(id){
	for(var i = 0; i < teams.length; i++){
		if(teams[i].id == id) return i;
	}
	return 0;
}

function updateMarkersOpacity(){
	for(var i = 0; i < teams.length; i++){
		layers[i].eachLayer(function(marker){
			if(i == currentTeam) marker.setOpacity(1);
			else marker.setOpacity(0.5);
		});
	}
}

function setCurrentTeam(team){
	currentTeam = team;
	var first = true;
	layers[currentTeam].eachLayer(function(marker){
		if(first) map.setView(marker._latlng, map._zoom);
		first = false;
	});

	$("#attributes").css("background-color", colorNameToColor(teams[currentTeam].color));

    showTeams();
	emptyStops();
	loadStops();
}

function emptyStops(){
	$("#stops").empty();
}

function getAvailableTeam(){
	for(var i = 0; i < colorNames.length; i++){
		var found = false;
		var j = 0;
		while(!found && j < teams.length){
			if(teams[j].color == colorNames[i]) found = true;
			j++;
		}

		if(!found) return colorNames[i];
	}
	return "";
}

function getTeamColorFromTeamId(id){
	return colorTeamMarker[teamColorToId(teams[getTeamNumberFromId(id)].color)];
}

// BEACONS

$("#addBeacon").on('click', function(e) {
	addStop(null, "beacon");
});

function getBeacons(callback){
	var url = "https://location.beaconing.eu/geoapi/beacon?apikey=2eb3e652-21fb-4a97-a9cd-03dfe51c3d41"; //pro
	//var url = "./beacons-xml.xml"; // local - pre
	$.getJSON( url, function( data ) {
		var beacons = [];
		$.each( data, function( key, val ) {
			var b = new Beacon(val);
			beacons.push(b);
		});
		callback(beacons);
	});
}