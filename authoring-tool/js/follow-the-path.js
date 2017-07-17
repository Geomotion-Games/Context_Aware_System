$( function() { 

	$( "#stops" ).sortable( {
		update: function(event, ui) {
			sortPoints();
		}
	});  
	poisCreated = points.length;

	getBeacons(function (b) {
		beacons = b;
		loadStops();
	});

	// points[0]   = new Step({marker: 0, idNumber: 0});
	// points[999] = new Step({marker: 0, idNumber: 999});
});

var normalMarkerIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var beaconMarkerIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var x = document.getElementById("location");
var map = L.map('map');

var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.on('load', function() {
  	locate();
});

map.setView([51.505, -0.09], 13).addLayer(OpenStreetMap_Mapnik);

L.Control.geocoder({showResultIcons: false, collapsed: false}).addTo(map);

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

map.on('click', function(e) {
	var marker = addMarker(e.latlng);
	addStop(marker, "normal");
});

function loadStops(){
	points.forEach(function(p){
		if(p.type == "beacon") addBeaconMarker(p.beaconId, p);
		showStop(p);
	});
	updatePath();
}

function addMarker(latlng, draggable){
	var marker = new L.marker(latlng, {
		draggable: draggable === undefined ? 'true' : draggable,
		icon: draggable === undefined || draggable == true ? normalMarkerIcon : beaconMarkerIcon
	}).bindTooltip("Stop " + (poisCreated + 1),
		{
			permanent: true,
			direction: 'bottom'
		});

	marker.on('dragend', function(event){
		var target = event.target;
		var position = target.getLatLng();
		updatePath();
	});

	marker.on('drag', function(event){
		var target = event.target;
		var position = target.getLatLng();
		updatePath();
	});

	map.addLayer(marker);
	return marker;
}

function addStop(marker, type){

	poisCreated++;
	var step = new Step({marker: marker, orderNumber: poisCreated, type: type});
	points[poisCreated] = step;
	//TODO: save
	showStop(step);
	updatePath();
}

function showStop(stop){
	if(stop.type == "normal") {
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + stop.orderNumber + `" stop-number="` + stop.orderNumber + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
					 	<i title="Move" class="move fa fa-arrows-v fa-2x" aria-hidden="true"></i>
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">Stop ` + (stop.orderNumber) + `</span></p>
						</div>
						<div class=poiActions>
							<a href="#"><i title="Delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i title="Duplicate" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
						</div>
					</div>
				</div>
			</li>
   		`);
	}else if(stop.type == "beacon"){
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + stop.orderNumber + `" stop-number="` + stop.orderNumber + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
					 	<i title="Move" class="move fa fa-arrows-v fa-2x" aria-hidden="true"></i>
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">Stop ` + (stop.orderNumber) + `</span></p>
							<select name="beacon-id" class="beacon-select-${stop.orderNumber}">
								<option hidden value="">Select Beacon</option>
								${beacons.map(b => `<option ${stop.beaconId==b.id?"selected":""} value="${b.id}">${b.id} - ${b.name}</option>`).join('\n')}
							</select>
						</div>
						<div class=poiActions>
							<a href="#"><i title="Delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i title="Duplicate" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
						</div>
					</div>
				</div>
			</li>
   		`);

		$(".beacon-select-" + stop.orderNumber).on("change", function(e){
			var id = $(this).val();
			addBeaconMarker(id, stop, true);
		});
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
	if(step.marker) map.removeLayer(step.marker);
	var coords = {lat: beacon.lat, lng: beacon.lng};
	var marker = addMarker(coords, false);
	step.marker = marker;
	if(focus){
		map.panTo(coords);
		map.setZoom(15);
	}
	updatePath();
}

function removeStop(stopNumber) {
	for(var point in points){
		if (points[point] && points[point].orderNumber == stopNumber) {
			if(points[point].marker)map.removeLayer(points[point].marker);
			delete points[point];
		}
	}

	poisCreated--;
	sortPoints();
}

function updateLabels() {
	$("#stops").children().each(function() {
		var number = $(this).attr("stop-number");
		for(var point in points){
			if (points[point] && points[point].orderNumber == number){
				if (points[point].title && points[point].title.length > 0){
					points[point].marker._tooltip.setContent(points[point].title);
					$(this).find("span.name").text(points[point].title);
				}else{
					var name = "Stop " + points[point].orderNumber;
					if(points[point].marker) points[point].marker._tooltip.setContent(name);
					$(this).find("span.name").text(name);
				}
				break;
			}
		}
	});
}

function sortPoints(){
	var len = Object.keys(points).length;

	if (len > 1) {
		var newPointList = [];

		newPointList.push(points[0]);
		$("#stops").children().each(function (index) {
			var number = $(this).attr("stop-number");
			for (var stop in points) {
				if (points[stop] && points[stop].orderNumber == number) {
					$(this).attr("stop-number", index + 1);
					$(this).attr("id", "point" + (index + 1));
					points[stop].orderNumber = (index + 1);
					newPointList.push(points[stop]);
					points.splice(stop, 1);
					break;
				}
			}

		});
		newPointList[999] = points[points.length - 1];
		points = newPointList;
		updatePath();
	}
}

$("#addBeacon").on('click', function(e) {
	addStop(null, "beacon");
});

function getBeacons(callback){
	$.getJSON( "http://lbc.dev.pisanello.net.pl/geoapi/beacon?apikey=123", function( data ) {
		var beacons = [];
		$.each( data, function( key, val ) {
			var b = new Beacon(val);
			beacons.push(b);
		});
		callback(beacons);
	});
}