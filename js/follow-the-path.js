
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
	game.time = $("#timeToggle").prop('checked') ? parseInt($("#gameTimeValue").val()) || 0 : 0;
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

function loadStops(){
	points.forEach(function(p){
		if(p.type == "beacon") addBeaconMarker(p.beaconId, p);
		showStop(p);
		if(p.marker)p.marker.step = p;
	});
	
	sortPoints();
	updatePath();
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
			copy.marker.step = copy;
			map.addLayer(copy.marker);
			map.panTo(copy.marker._latlng);
    		duplicatePOI(copy, game, function(id){
    			showStop(copy);
    			points[poisCreated] = copy;
    			updatePath();
    			sortPoints();
    			updateATPlot(game);
    		});
		}
	}
}

function addStop(marker, type){
	var lastPoi = poisCreated;

	poisCreated++;
	var step = new Step({marker: marker, orderNumber: poisCreated, type: type});
	if(marker)marker.step = step;
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
		updateATPlot(game);
	});

}

function showStop(stop){
	var len = Object.keys(points).length;
	var last = game.type == "TreasureHunt" && (stop.orderNumber == len);

	var url = stop.id ? "screens-overview.php?id=" + stop.id + (last ? "&noClue" : ""): "#";
	if(stop.type == "normal") {
		$('#stops').append(`
			<li class="stop-row poirow" id="point` + stop.orderNumber + `" stop-number="` + stop.orderNumber + `">
				<div class="row">
					<div class="col-md-12 poiInfo">
					 	<i title="` + l("move")+`" class="move fa fa-arrows-v fa-2x" aria-hidden="true"></i>
						<div class="poiChest ${last?"":"hidden"}">
				    		<img src="images/chest.png">
				    	</div>
						<div class="poiTexts">
							<p><span class="name poiTitle" style="margin: 0;">` + l("stop")+` `+(stop.orderNumber) + `</span></p>
						</div>
						<div class="poiActions">
							<a><i title="` + l("delete")+`" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a><i title="` + l("duplicate")+`" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a class="editPOI" href="${ url }"><i title="` + l("edit")+`" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a><img src="images/locationPoi.png" title="` + l("to_center")+`" class="center">&nbsp;</a>
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
					 	<i title="` + l("move")+`" class="move fa fa-arrows-v fa-2x" aria-hidden="true"></i>
						<div class="poiChest ${last?"":"hidden"}">
				    		<img src="images/chest.png">
				    	</div>
						<div class="poiTexts">
							<p style="width: 30% !important;"><span class="name poiTitle" style="margin: 0;">` + l("stop")+` `+(stop.orderNumber) + `</span></p>
							<select name="beacon-id" class="beacon-select-${stop.orderNumber}">
								<option hidden value="">` + l("select_beacon") + `</option>
								${beacons.map(b => `<option ${stop.beaconId==b.name?"selected":""} value="${b.name}">${b.id} - ${b.name}</option>`).join('\n')}
							</select>
						</div>
						<div class="poiActions">
							<a><i title="` + l("delete")+`" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a><i title="` + l("duplicate")+`" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a class ="editPOI" href="${ url }"><i title="` + l("edit")+`" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
							<a><img src="images/locationPoi.png" title="` + l("to_center")+`" class="center">&nbsp;</a>
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
		if(beacons[b].name == id){
			beacon = beacons[b];
			break;
		}
	}
	if(beacon == null) return;
	if(step.marker) map.removeLayer(step.marker);
	var coords = {lat: beacon.lat, lng: beacon.lng};
	var marker = addMarker(coords, false);
	step.beaconId = id;
	map.addLayer(marker);
	step.marker = marker;
	if(focus){
		map.setView(coords, 20);
	}
	sortPoints(null, true);
	updatePath();
	updateATPlot(game);
}

function removeStop(stopNumber) {
	for(var point in points){
		if (points[point] && points[point].orderNumber == stopNumber) {
			if(points[point].marker)map.removeLayer(points[point].marker);
			removePOI(points[point], game);
			delete points[point];
		}
	}

	poisCreated--;
	sortPoints(true);
	//updateATPlot(game);
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
					var name = l("stop")+" "+points[point].orderNumber;
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
						if(save) {
							savePOI(points[stop], game);
						}

						points.splice(stop, 1);
						break;
					}
				}

			});
			points = newPointList;
			updatePath();
			if (save) {updateATPlot(game);}
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
			if(p.marker) p.marker.setIcon(p.type == "normal" ? generateMarker(1): generateMarker(1, true));
		});

		var pp = points[0];
		if(pp && pp.marker) pp.marker.setIcon(startBothMarkerIcon);

		var p = points[points.length - 1];
		if(p && p.marker) p.marker.setIcon(finishTreasureMarkerIcon);
		
	} else {

		points.forEach(function (p) {
			if(p.marker) p.marker.setIcon(p.type == "normal" ? generateMarker(1): generateMarker(1, true));
		});

		var pp = points[0];
		if(pp && pp.marker) pp.marker.setIcon(startBothMarkerIcon);

		var up = points[points.length - 1];
		if(up && up.marker) up.marker.setIcon(finishFollowMarkerIcon);
	}
}
