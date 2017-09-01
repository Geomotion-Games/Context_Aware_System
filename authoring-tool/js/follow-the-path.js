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

    stopOnClick(this, stopNumber, action);
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

var editTimeout;
function createEditTimeout(){
	if(editTimeout != null) clearTimeout(editTimeout);
	editTimeout = setTimeout(function(){
		updateGameValues();
		savePlot(game);
		clearTimeout(editTimeout);
		editTimeout = null;
	}, 2000);
}

function updateGameValues(){
	game.name = $("#gameName").val();
	game.description = $("#gameDescription").val()
	game.time = $("#timeToggle").prop('checked') ? parseInt($("#gameTimeValue").val()) : 0;
}

function init(){
	$("#gameName").val(game.name);
	$("#gameDescription").val(game.description);

	if(game.time != 0){
		$("#timeToggle").prop('checked', true);
		$('#timeLimit').css("visibility", 'visible');
		$('#gameTimeValue').val(game.time);
	}

	$("#gameName").blur(onBlur);
	$("#gameDescription").on("input", onInput);
	$("#gameDescription").blur(onBlur);
	$("#gameName").on("input", onInput);
	$("#gameTimeValue").blur(onBlur);
	$("#gameTimeValue").on("input", onInput);
	$("#timeToggle").change(onBlur);

	$("#point0 a").attr("href", "screens-overview.php?id=" + start.id);
	$("#point999 a").attr("href", "screens-overview.php?id=" + finish.id);

	function onBlur(){
		if(editTimeout != null) clearTimeout(editTimeout);
		updateGameValues();
		savePlot(game);
	}

	function onInput(){
		if(editTimeout != null) clearTimeout(editTimeout);
		createEditTimeout();
	}

}

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

var chestMarkerIcon = L.icon({
    iconUrl: 'images/chestMarker.jpg',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [50, 43], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [25, 43], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var x = document.getElementById("location");
var map = L.map('map');

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: ""/*'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'*/
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
	if($(".leaflet-control-geocoder-form input").is(":focus")) return;
	var marker = addMarker(e.latlng);
	addStop(marker, "normal");
	map.addLayer(marker);
});

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
	var icon = draggable === undefined || draggable == true ? normalMarkerIcon: beaconMarkerIcon;
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
		updatePath();
		savePOI(marker.step, game);
	});

	marker.on('drag', function(event){
		var target = event.target;
		var position = target.getLatLng();
		updatePath();
	});

	map.addLayer(marker);
	return marker;
}

function duplicate(stopNumber){
 	for(var point in points){
		if (points[point] && points[point].orderNumber == stopNumber) {
			poisCreated++;
			var copy = points[point].copy();
			copy.orderNumber = poisCreated;
			var lastMarker = copy.marker;
			var newPosition = addMetersToCoordinates(lastMarker._latlng, 200, 0);
			copy.marker = addMarker(newPosition, copy.type != "beacon");
			map.addLayer(copy.marker);
			map.panTo(copy.marker._latlng);
    		duplicatePOI(copy, game, function(id){
    			showStop(copy);
    			points[poisCreated] = copy;
    			updatePath();
    			sortPoints();
    		});
		}
	}
}

function addStop(marker, type){
	var lastPoi = poisCreated;

	poisCreated++;
	var step = new Step({marker: marker, orderNumber: poisCreated, type: type});
	marker.step = step;
	points[poisCreated] = step;
	showStop(step);
	updatePath();
	sortPoints();

	savePOI(step, game, function(id){
		$("#stops").children().each(function() {
			var number = $(this).attr("stop-number");
			if(number == poisCreated){
				var url = game.type == "TreasureHunt" ? "screens-overview.php?id=" + id + "&noClue" : "screens-overview.php?id=" + id;
				$(this).find(".editPOI").attr("href", url);
			}
		});
	});
}

function showStop(stop){
	var len = Object.keys(points).length;
	var last = game.type == "TreasureHunt" && (stop.orderNumber == len);

	var url = stop.id ? "screens-overview.php?id=" + stop.id + (last ? "&noClue" : ""): "#"
	if(stop.type == "normal") {
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + stop.orderNumber + `" stop-number="` + stop.orderNumber + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
					 	<i title="Move" class="move fa fa-arrows-v fa-2x" aria-hidden="true"></i>
						<div class="poiChest ${last?"":"hidden"}">
				    		<img src="images/chest.png">
				    	</div>
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">Stop ` + (stop.orderNumber) + `</span></p>
						</div>
						<div class=poiActions>
							<a href="#"><i title="Delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i title="Duplicate" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a class="editPOI" href="${ url }"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
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
						<div class="poiChest ${last?"":"hidden"}">
				    		<img src="images/chest.png">
				    	</div>
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
							<a class ="editPOI" href="${ url }"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
						</div>
					</div>
				</div>
			</li>
   		`);

		$(".beacon-select-" + stop.orderNumber).on("change", function(e){
			var id = $(this).val();
			addBeaconMarker(id, stop, true);
			savePOI(stop, game);
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
	if(beacon == null) return;
	if(step.marker) map.removeLayer(step.marker);
	var coords = {lat: beacon.lat, lng: beacon.lng};
	var marker = addMarker(coords, false);
	map.addMarker(marker);
	step.marker = marker;
	step.beaconId = id;
	if(focus){
		map.panTo(coords);
		map.setZoom(15);
	}
	sortPoints(null, true);
	updatePath();
}

function removeStop(stopNumber) {
	for(var point in points){
		if (points[point] && points[point].orderNumber == stopNumber) {
			if(points[point].marker)map.removeLayer(points[point].marker);
			removePOI(points[point]);
			delete points[point];
		}
	}

	poisCreated--;
	sortPoints(true);
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

function sortPoints(save, skipSort){
	var len = Object.keys(points).length;
	if (len >= 1) {

		var newPointList = [];

		if(!skipSort){
			$("#stops").children().each(function (index) {
				var number = $(this).attr("stop-number");
				for (var stop in points) {
					if (points[stop] && points[stop].orderNumber == number) {
						$(this).attr("stop-number", index + 1);
						$(this).attr("id", "point" + (index + 1));
						points[stop].orderNumber = (index + 1);
						newPointList.push(points[stop]);
						if(save)savePOI(points[stop], game);
						points.splice(stop, 1);
						break;
					}
				}

			});
			points = newPointList;
			updatePath();
		}
	}

	if(game.type == "TreasureHunt"){
		$(".poiChest").addClass("hidden");
		var childrens = $("#stops").children();
		$(childrens[len - 1]).find(".poiChest").removeClass("hidden");

		childrens.each(function(index){
			var e = $(childrens[index]).find(".editPOI");
			e.attr("href", e.attr("href").replace("&noClue", ""));
		});

		var e = $(childrens[len - 1]).find(".editPOI");
		e.attr("href", e.attr("href") + "&noClue");
		
		points.forEach(function (p) {
			if(p.marker) p.marker.setIcon(p.type == "normal" ? normalMarkerIcon : beaconMarkerIcon);
		});

		var p = points[points.length - 1];
		if(p && p.marker) p.marker.setIcon(chestMarkerIcon);
	}
}

$("#addBeacon").on('click', function(e) {
	addStop(null, "beacon");
});

function getBeacons(callback){
	// $.getJSON( "http://lbc.dev.pisanello.net.pl/geoapi/beacon?apikey=123", function( data ) {
	$.getJSON( "../beacons-xml.xml", function( data ) {
		var beacons = [];
		$.each( data, function( key, val ) {
			var b = new Beacon(val);
			beacons.push(b);
		});
		callback(beacons);
	});
}