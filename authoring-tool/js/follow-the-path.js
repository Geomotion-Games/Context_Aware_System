$( function() { 

	$( "#stops" ).sortable( {
		update: function(event, ui) {
			var len = Object.keys(points).length;

	    	if (len > 1) {
	    		var newPointList = [];
	    		var number = 0;

				newPointList.push(points[0]);
	    		$(this).children().each(function(index) {
	    			number = $(this).attr("stop-number");
					for (var point in points) {
						if (points[point] && points[point].idNumber == number) {
							newPointList.push(points[point]);
						}
					}
	    		});
				newPointList.push(points[999]);

				points = newPointList;
		    	updatePath();
			}
		}
	});  

	$("#saveButton").click(function() {
		saveMinigame();
	});

	points[0]   = new Step({marker: 0, idNumber: 0});
	points[999] = new Step({marker: 0, idNumber: 999});
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

function addMarker(latlng){
	var marker = new L.marker(latlng, {
		draggable:'true'

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
	var step = new Step({marker: marker, idNumber: poisCreated, type: type});

	if(type == "normal") {
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + poisCreated + `" stop-number="` + poisCreated + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">Stop ` + (poisCreated) + `</span></p>
							<p class="poiType">[%POI description%]</p>
						</div>
						<div class=poiActions>
							<a href="#"><i class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
						</div>
					</div>
				</div>
			</li>
   		`);
	}else if(type == "beacon"){
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + poisCreated + `" stop-number="` + poisCreated + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">Stop ` + (poisCreated) + `</span></p>
							 <select name="beacon-id">
								  <option value="a">Beacon A</option>
								  <option value="b">Beacon B</option>
								  <option value="c">Beacon C</option>
								  <option value="d">Beacon D</option>
							</select>
						</div>
						<div class=poiActions>
							<a href="#"><i class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a href="#"><i class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
						</div>
					</div>
				</div>
			</li>
			<script>
			  $(function() {
				$('beacon-id').on("change", function(e){
					console.log("changed");
				});
			  })
			</script>
   		`);
	}

	//CKEDITOR.replace( "editor" + len );

	updatePath();
}

function removeStop(stopNumber) {
	for (var point in points) {
		if (points[point].idNumber == stopNumber) {
			map.removeLayer(points[point].marker);
			delete points[point];
		}
	}

	updatePath();
}

function updateLabels() {

	$("#stops").children('li').each(function() {
		var number = $(this).attr("stop-number");
		for (var point in points){
			if (points[point] && points[point].idNumber == number){
	    		if (points[point].title && points[point].title.length > 0){
	    			points[point].marker._tooltip.setContent( points[point].title );
	    			$(this).find("span.name").text( points[point].title );
	    		} 
	    		else{
	    			var name = "Stop " + parseInt(number)
	    			if(points[point].marker) points[point].marker._tooltip.setContent( name );
	    			$(this).find("span.name").text( name );
	    		}
	    	}
		}
	});

	var first;
	for (var p in points) {
		first = points[p];
		break;
	}

/*	first.marker._tooltip.setContent( "START" );
	$("#stops li").first().find("span.name").text("START");

	var len = Object.keys(points).length;

	if (len > 1) {
		var last;
		for (p in points) {
			last = points[p];
		}
		last.marker._tooltip.setContent( "END" );
		$("#stops li").last().find("span.name").text("END");
	}*/
}

$("#addBeacon").on('click', function(e) {
	console.log("addBacon");
	addStop(null, "beacon");
});