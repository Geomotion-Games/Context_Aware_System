
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

// MARKER STYLE

var colorTeamMarker = [
	"#30499b",
	"#EE4035",
	"#56B949",
	"#F3A530",
	"#844D9E",
	"#F9ED3A",
	"#4CB2D4",
	"#EB7B2D",
	"#88C542",
	"#EC4A94"
];

var colorTeamPath = [
	"#233674",
	"#c91b10",
	"#3f8b35",
	"#ce800b",
	"#633976",
	"#dfd106",
	"#298dae",
	"#bf5912",
	"#66962e",
	"#d2166c"
];

function generateMarker(team, isBeacon){
	team++;
	return new L.Icon({
		iconUrl: "images/markers/" + (isBeacon? "beacon" : "poi") + "_" + team + ".png",
		shadowUrl: "images/markers/shadow.png",
		iconSize: isBeacon ? [26, 54] : [25, 41],
		iconAnchor: isBeacon ? [13, 54] : [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
}

function generateStartMarker(team){
	team++;
	return normalMarkerIcon = new L.Icon({
		iconUrl: "images/markers/start_" + team + ".png",
		shadowUrl: "images/markers/shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
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


map.on('click', function(e) {
	if($(".leaflet-control-geocoder-form input").is(":focus")) return;
	var marker = addMarker(e.latlng);
	addStop(marker, "normal");
	map.addLayer(marker);
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
    var stopNumber = parseInt($(this).attr("stop-number"));
    var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
    action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
    action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;
    action = $(e.target).hasClass('center') ? "center" : action;

    stopOnClick(this, stopNumber, action);
});

$( function() { 
	$( "#stops" ).sortable( {
		update: function(event, ui) {
			sortPoints(true);
		}
	});  
	poisCreated = points.length;

	getBeacons(function (b) {
		beacons = b;
		loadStops();
	});
});

function stopOnClick(parent, stopNumber, action){
    if(action == "remove"){
        $(parent).remove();
        map.removeLayer("point" + stopNumber);
        map.removeLayer("pointText" + stopNumber);
        removeStop(stopNumber);
        return;
    }else if(action == "edit"){
    	
    }else if(action == "duplicate"){
       duplicate(stopNumber);
    }else if(action == "center"){
       for(var point in points){
			if (points[point] && points[point].orderNumber == stopNumber && points[point].marker) {
				var latlng = points[point].marker.getLatLng();
				map.setView(latlng, 20);
			}
		}
    }
}

// PATHS

var path;

function updatePath() {
	for(var i = 0; i < teams.length; i++){

		var pointList = [];

		layers[i].eachLayer(function(marker){
			pointList.push(marker._latlng)
		});

		if (paths[i] != null) map.removeLayer(paths[i]);

		paths[i] = new L.Polyline(pointList, {
	    	color: colorTeamPath[i],
	    	weight: 4,
	    	opacity: i == currentTeam ? 0.6 : 0.2, 
	    	smoothFactor: 1
		});

		paths[i].addTo(map);

		updateLabels();
	}

}

// POI LOADING

function loadStops(){
	points.forEach(function(p){
		if(p.type == "beacon") addBeaconMarker(p.beaconId, p);
		showStop(p);
		if(p.marker)p.marker.step = p;
	});
	
	sortPoints();
	updatePath();
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
	map.addLayer(marker);
	step.marker = marker;
	step.beaconId = id;
	if(focus){
		map.setView(coords, 20);
	}
	sortPoints(null, true);
	updatePath();
}

function addMarker(latlng, draggable, team){
	team = team || 0;
	var icon = draggable === undefined || draggable == true ? generateMarker(team): generateMarker(team, true);
	var marker = new L.marker(latlng, {
		draggable: draggable === undefined ? 'true' : draggable,
		icon: icon
	}).bindTooltip( "Stop " + (poisCreated + 1),
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
	updatePath();
	updateMarkersOpacity();
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