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
}
