
/*****************************************/
/*         FOLLOW THE PATH LOGIC         */
/*			  Geomotion Games			 */
/*****************************************/

var mapLoaded = false;
var dataLoaded = false;
var game = {};
var lastPOITime;
var lastPOIDistance = 0;
var totalDistance = 0;
var lastPosition;
var challengeType = "";

function gameReady() {

	game = game_info["POIS"];
	var pointList = [];

	for (step in game) {

		var image = "";
		var clue = "";
		var extras = document.getElementById("extras");

		/****** A ******/

		if (game[step]["A"].hasOwnProperty("image") && game[step]["A"].image != "") {
			image = "<img src=" + server_url + game[step]["A"].image + ">";
		}

		var textButton = "Go to challenge";

		if (game[step].hasOwnProperty("B") && step > 0 ) {

			if (game[step]["B"].hasOwnProperty("challenge")) {
				var challenge = game[step]["B"]["challenge"];
				if (challenge.hasOwnProperty("type")) {
					if (challenge["type"] == "checkin") {
						challengeType = "checkin";
						textButton = "Check-in"
					} else if (challenge["type"] == "upload_content") {
						challengeType = "upload_content";
					} else if (challenge["type"] == "minigame") {
						challengeType = "minigame";
					}
				}
			}
		}
		if (step == 0) { textButton = "Go out and play!"; }

		var checkinButton = `<a id="toChallenge` + step + `" href="#" class="goButton" >` + textButton + `</a>`;
		var timeSpent = "";
		if (step == 999) { 
			checkinButton = ""; 
			if (time_limit == 0) {
				var spent = new Date().getTime() - parseInt(startingTime);
				timeSpent = "<h3>Total time played: <span>" + spent/60 + ":" + spent%60 + "</span><h3>";
			}
		}

		if (game[step]["A"].hasOwnProperty("clue") && game[step]["A"].clue != "") {
			clue = "<p>" + game[step]["A"].clue + "</p>";
		} else {
			clue = "";
		}

		var POIBefore = `
			<a href="#modal` + step + `" id="openA` + step + `" style="display: none;">Open Modal</a>
			<div id="modal` + step + `" class="modalDialog screen">
				<div>
					<h2>` + game[step]["A"].title + `</h2>
					` + image + `
					<p>` + game[step]["A"].text + `</p>` + 
					clue +
					timeSpent +
					checkinButton + 
				`</div>
			</div>
		`;

		extras.innerHTML += POIBefore;


		/****** B ******/

		if (game[step].hasOwnProperty("B") && step > 0 ) {

			if (challengeType != "") {
				if (challengeType == "upload_content") {

					var POIChallenge = `
						<a href="#challenge` + step + `" id="openB` + step + `" style="display: none;">Open Modal</a>
						<div id="challenge` + step + `" class="modalDialog screen">
							<div>
								<h2>UPLOAD CONTENT</h2>
								<!--http://code.hootsuite.com/html5/-->
								<input id="file" type="file" accept="image/*">
								<label for="file"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg> <span>Choose a file…</span></label>
								<a id="toClue` + step + `" href="#" class="goButton">Continue</a>
							</div>
						</div>`;

					extras.innerHTML += POIChallenge;

					document.getElementById("toClue" + step).onclick = function() {
						setTimeout(function() {
							document.getElementById("openC" + currentPOI).click();
						}, 1000);
					};
				}
			}
		}

		/****** C ******/

		if (game[step].hasOwnProperty("C") && step > 0 ) {

			if (game[step].hasOwnProperty("item") && game[step].item != "") {
				image = "<img src=" + server_url + game[step].item + ">";
			} else {
				image = "";
			}

			// TODO fer aqui el llistat de paràmetres i validar l'existencia de tots
			var points = game[step]["rewardPoints"] == 0 ? 
								"" : "<p class="pointsWon">You won <span>"+ points +"</span> points</p>";

			var POIAfter = `
				<a href="#clue` + step + `" id="openC` + step + `" style="display: none;">Open Modal</a>
				<div id="clue` + step + `" class="modalDialog screen">
					<div>
						<h2>` + game[step]["C"].title + `</h2>`
						+ image +
						`<p>` + game[step]["C"].text + `</p>`
						+ points +
						`<a id="closeClue` + step + `" href="#" class="goButton" >Continue</a>
					</div>
				</div>
			`;

			extras.innerHTML += POIAfter;
		}
	}

	if (nextPOI == 0) {
		document.getElementById('openA0').click();
		nextPOI = getFollowingPOIId(nextPOI);
	} else {
		if (fromMinigame) {
			fromMinigame = false;
			document.getElementById("openC" + nextPOI).click();
			nextPOI = getFollowingPOIId(nextPOI);

			updatePath();
		} else {
			nextPOI = getFollowingPOIId(nextPOI);
		}
	}

	for (i=1; i<Object.keys(game).length-1; i++) {

		document.getElementById("toChallenge"+i).onclick = function() {

			setTimeout(function() {

				if (challengeType != "") {
					if (challengeType == "minigame") {

						var minigameURL = challenge["url"];
						if (minigameURL.length > 0) {

							var url = (window.location.href).indexOf("/pre/") !== -1 ? 
								"https%3A%2F%2Fwww.geomotiongames.com/pre/beaconing/" : 
								"https%3A%2F%2Fwww.geomotiongames.com/beaconing/";

							minigameURL += "&callbackurl=" + url + "app/app.php%3Fgame%3D"+ game_id + "%26step%3D" + currentPOI + "%26startingtime%3D" + startingTime
							window.open(minigameURL, "_self")
						} else {
							document.getElementById("openC" + currentPOI).click();
						}

					} else if (challengeType == "upload_content") {
						document.getElementById("openB" + currentPOI).click();
					} else { // checkin
						document.getElementById("openC" + currentPOI).click();
					}

				} else {
					document.getElementById("openC" + currentPOI).click();
				}

			}, 1000);
		};
	}

	var lastPOIId = Object.keys(game)[Object.keys(game).length-2];
	document.getElementById("closeClue" + lastPOIId).onclick = function() {
		setTimeout(function() {
			document.getElementById("openA999").click();
			//tracker.Completable.Completed("demo",tracker.Completable.CompletableType.Game, true, 1);
		}, 1000);
	}

	updatePath();
	if (time_limit != 0) { setInterval(function() { updateTimeLabel(); }, 1000); }
	startingTime = startingTime != 0 ? startingTime : new Date().getTime() / 1000;
}

function newLocation(position) {

	var coors = {lng: position.coords.longitude, lat: position.coords.latitude};

	//tracker.Places.Moved("POI" + nextPOI, position.coords.latitude, position.coords.longitude, tracker.Places.PlaceType.POI);

	distanceToNextPOI += getDistanceFromLatLon(coors.lat, coors.lng, lastPosition.latitude, lastPosition.longitude);
	totalDistance     += getDistanceFromLatLon(coors.lat, coors.lng, lastPosition.latitude, lastPosition.longitude);
	lastPosition = position.coords;

	if (!located) {
		map.setZoom(18);
		map.panTo(coors);
		located = true;

		//tracker.Completable.Initialized("demo", tracker.Completable.CompletableType.Game);
		lastPOITime  = new Date().getTime() / 1000;
	}

	if (nextPOI > 0 && nextPOI < 999) {

    	var distanceToNextPOI = map.distance({ "lat": game[nextPOI].lat, "lng": game[nextPOI].lng }, coors);

		if (distanceToNextPOI < game[nextPOI].triggerDistance) {

			//trackProgress();
			document.getElementById('openA' + nextPOI).click();
			currentPOI = nextPOI;
			nextPOI = getFollowingPOIId(nextPOI);
		}

		document.getElementById('distance').innerHTML = parseInt(distanceToNextPOI) + " meters";
	}

	this.refreshUserMarker(coors);
}

function updateTimeLabel() {
		var now = new Date().getTime();
		var time_spent = now - parseInt(startingTime);
		var remaining_time = Math.round(time_limit - time_spent/1000)
		//document.getElementById('timespent').innerHTML = (now - parseInt(startingTime));
}

function updatePath() {

	var pointList = [];
	var markers = [];

	for (step in game) {

		if (step != 0 && step != 999) {

			var latlng = { "lat": game[step].lat, "lng": game[step].lng };

			if (game[step].hasOwnProperty("title")) {
				var marker = L.marker(latlng, { icon: stopIcon }).bindTooltip( game[step]["title"],
							{
								permanent: true,
								direction: 'bottom'
							}).addTo(map);
			} else {
				var marker = L.marker(latlng, { icon: stopIcon }).addTo(map);
			}

			markers.push(marker);

			pointList.push(latlng);
		}
	}

	new L.Polyline(pointList, {
    	color: '#1c3587',
    	weight: 4,
    	opacity: 0.5,
    	smoothFactor: 1
	}).addTo(map);
}


function locate() {

	if (navigator.geolocation) {
		setTimeout(function() {
			/*tracker.Flush(function(result, error){
				console.log("flushed");
			});*/

			navigator.geolocation.getCurrentPosition(function(position) {
				if (totalDistance == 0) {
					lastPosition = position.coords
				}
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
	var t = new Date().getTime() / 1000;
	var timeSpent = t - lastPOITime;
	lastPOITime = t;
	var poiId = "POI" + nextPOI;

	var distance = 100; //TODO
	var speed = 12; //TODO distance / lastPOITime

	tracker.setVar("time", timeSpent);
	tracker.setVar("poiId", poiId);
	tracker.setVar("averageSpeed", lastPOIDistance / timeSpent);
	tracker.setVar("distance", lastPOIDistance);

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
		if (poi == nextPOI)
		{ 
			followingId = -1;
		}
		else if (followingId == -1)
		{ 
			return poi;
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
    console.log(err);
}

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function showInventory(id) {

	addCollectablesToInventory();

	// TODO omplir al principi amb totes les imatges i posarles hidden o shown
	document.getElementById('inventory').style.zIndex = "9999";
	document.getElementById('inventory').style.opacity = "1";

	document.getElementById('return').onclick = function() {
		document.getElementById('inventory').style.zIndex = "-1";
		document.getElementById('inventory').style.opacity = "0";
		return true;
	};
}

function addCollectablesToInventory() {

	game = game_info["POIS"];

	var inventory = document.getElementById('inventory-grid');
	var progress = document.getElementById('inventory-progress');
	inventory.innerHTML = "";
	var rowHTML = "";
	var i = 0; //Number of collectables

	for (step in game) {

		if (game[step].hasOwnProperty("item") && game[step].item !="") {
			if (i % 2 == 0) {

				if (currentPOI > i) {
					rowHTML = `<div class="row">
										<div class="collectable">
											<div class="collectable-image" style="
												background-image:url('`+ server_url + game[step].item +`');
												background-size:cover;
											"></div>
											<div class="collectable-name">
												<p>ITEM `+ (i+1) +`</p>
											</div>
										</div>`;
				} else {
					rowHTML = `<div class="row">
								<div class="collectable">
									<div class="no-collectable-question-mark">
										<p>?</p>
									</div>
								</div>`;
				}

				
			} else {
				if (currentPOI > i) {
					rowHTML += `
							<div class="collectable">
								<div class="collectable-image" style="
									background-image:url('`+ server_url + game[step].item +`');
									background-size:cover;
								"></div>
								<div class="collectable-name">
									<p>ITEM `+ (i+1) +`</p>
								</div>
							</div>
						</div>`;
				} else {
					rowHTML += `
							<div class="collectable">
								<div class="no-collectable-question-mark">
									<p>?</p>
								</div>
							</div>
						</div>`;
				}

				inventory.innerHTML += rowHTML;
				rowHTML = "";
			}
			i++;
		}
	}

	if (rowHTML != "") {
		inventory.innerHTML += rowHTML + "</div>";
	}

	progress.innerHTML = currentPOI + "/" + i;

	`<div class="row">
		<div class="collectable">
			<div class="collectable-image"></div>
			<div class="collectable-name">
				<p>hoalhoalhoasd</p>
			</div>
		</div>
		<div class="collectable">
			<div class="no-collectable-question-mark">
				<p>?</p>
			</div>
		</div>
	</div>`
}

/*
function uploadContent() {
	if ( !isUploadSupported() ) {
		//TODO disable or show error message
	}
}

function isUploadSupported() {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
};

*/

