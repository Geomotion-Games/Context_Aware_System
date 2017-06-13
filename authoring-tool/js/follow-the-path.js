$( function() { 

	$( "#stops" ).sortable( {
		update: function( event, ui ) {
			var len = Object.keys(points).length;
	    	
	    	if (len > 1) {
	    		var newPointList = [];
	    		var number = 0;

				newPointList.push(points[0]);
	    		$(this).children().each(function(index) {
	    			number = $(this).attr("stop-number");
					for (point in points) {
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

	points[0]   = new Step(0, 0);
	points[999] = new Step(0, 999);
});

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

var points = [];
var poisCreated = 0;
var path;

function Step(marker, number) {
	this.idNumber 	 = number;
	this.marker 	 = marker;
	this.title 	 	 = "";
	this.description = "";
	this.distance 	 = 20;
	this.reward 	 = 0;
	this.url 		 = "";
}

Step.prototype.toJSON = function() {
    
	var json = { 
    	"idNumber" 	  : this.idNumber,
    	"title" 	  : this.title,
    	"description" : this.description,
    	"lat"		  : this.marker ? this.marker.getLatLng().lat : 0,
		"lng" 		  : this.marker ? this.marker.getLatLng().lat : 0,
		"distance" 	  : this.distance,
		"reward" 	  : this.reward,
		"url" 		  : this.url
	};

    return json;
};

function updatePath() {

	var pointList = [];

	for (stop in points) {
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

	poisCreated++;

	var marker = new L.marker(e.latlng, {
		draggable:'true'

	}).bindTooltip("Stop " + (poisCreated),
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

  	var step = new Step(marker, poisCreated);

    jQuery('#stops').append(`

    	<li class="ui-state-default stop-row" id="point`+ poisCreated +`" stop-number="`+ poisCreated +`">
    		<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
  			<span class="name" style="margin: 0;">Stop `+ (poisCreated) + `</span>
    		<img class="stop-icon" src="images/trash-icon.png"/>
    	</li>

    `);

    jQuery('body').append(`

		<div class="stop-editor modal fade" id="stop-edit` + poisCreated + `" tabindex="-1" role="dialog" aria-labelledby="stop-editor">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4 class="modal-title" id="exampleModalLabel">Editing Stop:</h4>
		      </div>
		      <div class="modal-body">
		      <div id="stop-editor-content">
					<div id="stop-editor-preview">
						<b>Preview:</b>
						<div id="preview-screen">
							<p id="preview-title">Title</p>
							<p id="preview-distance">Distance</p>
							<p id="preview-reward">Reward</p>
							<p id="preview-description">Description</p>
							<p id="preview-url">Url</p>
							<p id="preview-img">Image</p>
							<button id="preview-continue">Continuar</button>
						</div>
					</div>
					<form id="stop-editor-form">
						<div class="form-group">
							<label for="name-name" class="control-label">Title:</label>
							<input name="name-` + poisCreated + `" type="text" class="form-control" id="name-` + poisCreated + `">
						</div>
						<div class="form-group">
							<label for="distance-name" class="control-label">distance (trigger) meters:</label>
							<input name="distance-` + poisCreated + `" type="number" min="0" class="form-control" id="distance-` + poisCreated + `">
						</div>
						<div class="form-group">
							<label for="reward-name" class="control-label">Reward:</label>
							<input name="reward-` + poisCreated + `" type="number" class="form-control" id="reward-` + poisCreated + `">
						</div>
						<div class="form-group">
							<label for="clue-name" class="control-label">image:</label>
							<input name="image-` + poisCreated + `" type="file" class="form-control" id="image-` + poisCreated + `" accept="image/*">
						</div>
						<div class="form-group">
							<label for="content-name" class="control-label">Description:</label>
							<textarea id="content-` + poisCreated + `" name="content-` + poisCreated + `"></textarea>
						</div>
						<div class="form-group">
							<label for="url-name" class="control-label">URL:</label>
							<input name="url-` + poisCreated + `" type="text" class="form-control" id="url-` + poisCreated + `">
						</div>
		        	</form>
				</div>
		        
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
		      </div>
		    </div>
		  </div>
		</div>

    `);

    //CKEDITOR.replace( "editor" + len );

    points[poisCreated] = step;

    updatePath();

});

var x = document.getElementById("location");

function removeStop(stopNumber) {

	for (point in points) {
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
		for (point in points){
			if (points[point] && points[point].idNumber == number){
	    		if ( points[point].title.length > 0){
	    			points[point].marker._tooltip.setContent( points[point].title );
	    			$(this).find("span.name").text( points[point].title );
	    		} 
	    		else{
	    			var name = "Stop " + parseInt(number)
	    			points[point].marker._tooltip.setContent( name );
	    			$(this).find("span.name").text( name );
	    		}
	    	}
		}
	});

	var first;
	for (p in points) {
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


function saveMinigame() {

	/*var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log(this.responseText);
	    	alert("Go to: \nhttps://www.geomotiongames.com/beaconing/client.php?minigame=" + this.responseText.replace(/ /g,''));
	    }
	};*/

	var minigame = JSON.stringify(getMinigameJson(), null, 2);
	console.log(minigame);

	//xhttp.open("GET", "https://www.geomotiongames.com/beaconing/saveMinigame.php?minigame=" + minigame, true);
	//xhttp.send();
}

function getMinigameJson() {
	var json = {};
	for (step in points) {
		json[points[step].idNumber] = points[step].toJSON();
	}
	return json;
}
