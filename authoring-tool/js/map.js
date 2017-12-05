
// MAP INIT

var map = L.map('map');

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
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

    if(!action){
    	for(var point in points){
			if (points[point] && points[point].orderNumber == stopNumber && points[point].marker) {
				var latlng = points[point].marker.getLatLng();
				map.setView(latlng, 20);
			}
		}
    }
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
    }
}

// PATHS

var path;

function updatePath() {
	var pointList = [];
	for (var stop in points) {
		if (points[stop] && points[stop].marker) {
			pointList.push(points[stop].marker.getLatLng());
		}
	}

	if (path != null) map.removeLayer(path);

	path = new L.Polyline(pointList, {
    	color: 'green',
    	weight: 4,
    	opacity: 0.6,
    	smoothFactor: 1
	});

	path.addTo(map);

	updateLabels();
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

function addMarker(latlng, draggable){
	var icon = draggable === undefined || draggable == true ? generateMarker(1): generateMarker(1, true);
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

	map.addLayer(marker);
	return marker;
}

// BEACONS

$("#addBeacon").on('click', function(e) {
	addStop(null, "beacon");
});

function getBeacons(callback){
	//var url = "http://lbc.dev.pisanello.net.pl/geoapi/beacon?apikey=123"; //pro
	var url = "./beacons-xml.xml"; // local - pre
	$.getJSON( url, function( data ) {
		var beacons = [];
		$.each( data, function( key, val ) {
			var b = new Beacon(val);
			beacons.push(b);
		});
		callback(beacons);
	});
}