
/*****************************************/
/*    GENERIC FUNCTIONS FOR ALL GAMES    */
/*			  Geomotion Games			 */
/*****************************************/

var mapLoaded = false;
var dataLoaded = false;
var game = {};
var markers = [];
var server_url = "https://www.geomotiongames.com/beaconing/demo/images/";
var path = null;
var startingTime;
var lastPOITime;

function gameReady() {

	game = demo_info;
	var pointList = [];

	for (step in game) {

		/*if (step != 0 && step != 999) {

			var latlng = { "lat": game[step].lat, "lng": game[step].lng };
			var marker = L.marker(latlng, { icon: stopIcon }).addTo(map);

			markers.push(marker);
			if (step < nextPOI) {
				pointList.push(latlng);
			}
		}*/

		var image = "";

		if (game[step].image != "") {
			image = "<img src=" + server_url + game[step].image + ">";
		}

		var textButton = "Check in";
		if (step == 0) { textButton = "Go out and play!" }

		var checkinButton = `<a id="toClue` + game[step].idNumber + `" href="#" class="goButton" >` + textButton + `</a>`;
		if (step == 999) { checkinButton = ""; }

		var POIBefore = `
			<a href="#modal` + game[step].idNumber + `" id="openModal` + game[step].idNumber + `" style="display: none;">Open Modal</a>
			<div id="modal` + game[step].idNumber + `" class="modalDialog">
				<div>
					<h2>` + game[step].title + `</h2>` + image + `<p>` + game[step].description + `</p>` +
					checkinButton
				+ `</div>
			</div>
		`;

		if (game[step].image != "") {
			image = "<img src=" + server_url + game[step].image + ">";
		}

		var POIAfter = `
			<a href="#clue` + game[step].idNumber + `" id="openClue` + game[step].idNumber + `" style="display: none;">Open Modal</a>
			<div id="clue` + game[step].idNumber + `" class="modalDialog">
				<div>
					<!--a href="#close" title="Close" class="close">X</a-->
					<h2>` + game[step].title + `</h2><p>` + game[step].clue + `</p>
					<a id="closeClue` + game[step].idNumber + `" href="#" class="goButton" >Go to map</a>
				</div>
			</div>
		`;

		var extras = document.getElementById("extras");
		extras.innerHTML += POIBefore;
		extras.innerHTML += POIAfter;
	}

	document.getElementById('openModal0').click();
	nextPOI = getFollowingPOIId(nextPOI);

	document.getElementById("toClue0").onclick = function() {
		setTimeout(function() {
			document.getElementById("openClue0").click();
		}, 1000);
	}

	document.getElementById("toClue1").onclick = function() {
		setTimeout(function() {
			document.getElementById("openClue1").click();
		}, 1000);
	}

	document.getElementById("toClue2").onclick = function() {
		setTimeout(function() {
			document.getElementById("openClue2").click();
		}, 1000);
	}

	document.getElementById("toClue3").onclick = function() {
		setTimeout(function() {
			document.getElementById("openClue3").click();
		}, 1000);
	}

	document.getElementById("toClue4").onclick = function() {
		setTimeout(function() {
			document.getElementById("openModal999").click();
			tracker.Completable.Completed("demo",tracker.Completable.CompletableType.Game, true, 1);
		}, 1000);
	}

}


function updatePath() {

	var pointList = []

	for (step in game) {

		if (step < nextPOI && step != 0 && step != 999) {

			var latlng = { "lat": game[step].lat, "lng": game[step].lng };
			var marker = L.marker(latlng, { icon: stopIcon }).addTo(map);

			markers.push(marker);

			pointList.push(latlng);
		}
	}

	if (path != null) {
		map.removeLayer(path);
	}

	path = new L.Polyline(pointList, {
    	color: 'green',
    	weight: 4,
    	opacity: 0.6,
    	smoothFactor: 1
	});

	path.addTo(map);
}


function locate() {

	if (navigator.geolocation) {
		setTimeout(function() {
			
			tracker.Flush(function(result, error){
				console.log("flushed");
			});

			navigator.geolocation.getCurrentPosition(function(position) {
				newLocation(position);
				mapLoaded = true;
				locate();
			}, errorHandler, { enableHighAccuracy: true });

		}, 3000);
	} else {
		console.log("no va");
		document.getElementById("message").innerHTML = "Geolocation is not supported by this browser.";
	}
}

function trackProgress() {
	var progress = nextPOI > 0 ? nextPOI / (game.length - 3) : 0;
	var timeSpent = Date() - lastPOITime;

	console.log("-------------");
	console.log(Date());
	console.log(lastPOITime);
	console.log(Date() - lastPOITime);

	lastPOITime = Date();
	var poiId = "POI" + nextPOI;
	var distance = 100; //TODO
	var speed = 12; //TODO distance / lastPOITime
	tracker.setVar("time", timeSpent);
	tracker.setVar("poiId", poiId);
	tracker.setVar("averageSpeed", speed);
	tracker.setVar("distance", distance);

	tracker.Completable.Progressed("demo", tracker.Completable.CompletableType.Game, progress);
}

function refreshUserMarker(coors) {
	if (mapLoaded != 0) {
		map.removeLayer(marker);
	}

	marker = L.marker(coors, { icon: locationIcon }).addTo(map);
}

function getFollowingPOIId(nextPOI) {

	var followingId = -2;
	for (poi in game)
	{
		if (game[poi].idNumber == nextPOI)
		{ 
			followingId = -1;
		}
		else if (followingId == -1)
		{ 
			return game[poi].idNumber;
		}
	}

	// -2 does not exist 
	// -1 is the last
	return followingId;
}

function errorHandler(err) {

	switch(err.code) {
        case err.TIMEOUT:
            document.getElementById("message").innerHTML = 'Geolocation Timeout';
            break;
        case err.POSITION_UNAVAILABLE:
            document.getElementById("message").innerHTML = 'Geolocation Position unavailable';
            break;
        case err.PERMISSION_DENIED:
            document.getElementById("message").innerHTML = 'Geolocation Permission denied';
            break;
        default:
            document.getElementById("message").innerHTML = 'Geolocation returned an error.code';
    }
}
