
// MAP INIT

var map = L.map('map');

var regularStyle = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVhY29uaW5nIiwiYSI6ImNqYnhxd3h0czJsbngycXBjMjd6MG9vOWoifQ.fNesE_V6xrHFGiK1otUsTg', {
	maxZoom: 19,
	attribution: ""
});

var streetStyle = L.tileLayer('https://api.mapbox.com/styles/v1/beaconing/cjefm16y4eas32snrdhu4xy6o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVhY29uaW5nIiwiYSI6ImNqYnhxd3h0czJsbngycXBjMjd6MG9vOWoifQ.fNesE_V6xrHFGiK1otUsTg', {
	maxZoom: 19,
	attribution: ""
});

console.log(getCookie("map"));
if (getCookie("mapStyle") == "photo") {
	streetStyle.addTo(map);
	$("#styleToogle").attr("src","/images/streetStyle.png");
} else {
	regularStyle.addTo(map);
	$("#styleToogle").attr("src","/images/photoStyle.png");
}

function changeMapStyle(streetsStyle) {
	if (streetsStyle) {
		map.removeLayer(streetStyle);
		map.addLayer(regularStyle);
		setCookie("mapStyle", "street");
	} else {
		map.removeLayer(regularStyle);
		map.addLayer(streetStyle);
		setCookie("mapStyle", "photo");
	}
}

map.on('load', function() {
  	locate();
});

L.easyButton('<img id="locate" src="images/location.png">', function(btn, map){
    locate();
}).addTo(map);

map.setView(lastLocation? lastLocation : [51.505, -0.09], 13);//.addLayer(OpenStreetMap_Mapnik);

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

function generateFinishMarker(team){
	return normalMarkerIcon = new L.Icon({
		iconUrl: "images/markers/finish_race.png",
		iconSize: [26, 44],
		iconAnchor: [2, 44],
		popupAnchor: [1, -34]
	});
}

function generateStartMarker(team){
	return normalMarkerIcon = new L.Icon({
		iconUrl: "images/markers/finish_race.png",
		iconSize: [26, 44],
		iconAnchor: [2, 44],
		popupAnchor: [1, -34]
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

var finishFollowMarkerIcon = L.icon({
    iconUrl: 'images/markers/finish_race.png',
    iconSize:     [39, 47], // size of the icon
    iconAnchor:   [2, 47],  // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var startBothMarkerIcon = L.icon({
    iconUrl: 'images/markers/start_1.png',
    iconSize:     [33, 50], // size of the icon
    iconAnchor:   [4, 50],  // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


map.on('click', function(e) {
	var marker = addMarker(e.latlng);
	if($(".leaflet-control-geocoder-form input").is(":focus") || (game.singlepoi && poisCreated > 0)) return;
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
	}).bindTooltip( `${l("stop")} ` + (poisCreated + 1),
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