
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

window.onload = function() {
	if (game_id == 1) {
		document.getElementById("chooseBtn").click();
	}
};

function gameReady() {

	game = game_info["POIS"];
	var pointList = [];

	for (step in game) {

		var image = "";
		var classP = "p67vh";
		var clue = "";
		var extras = document.getElementById("extras");

		/****** A ******/

		if (game[step]["A"].hasOwnProperty("image") && game[step]["A"].image != "") {
			image = "<img src=" + server_url + game[step]["A"].image + ">";
			classP = "p30vh";
		}

		var textButton = "Go to challenge";
		var uploadContentButton = "";

		if (game[step].hasOwnProperty("B") && step > 0 ) {

			if (game[step]["B"].hasOwnProperty("challenge")) {
				var challenge = game[step]["B"]["challenge"];
				if (challenge.hasOwnProperty("type")) {
					if (challenge["type"] == "checkin") {
						challengeType = "checkin";
						textButton = "Check-in";
					} else if (challenge["type"] == "upload_content") {
						challengeType = "upload_content";
						var contentType = "content";
						var acceptableType = "media_type";
						if (challenge["uploadType"] != "any") {
							contentType = challenge["uploadType"];
							acceptableType = challenge["uploadType"] + "/*";
						}
						uploadContentButton = `<input id="file` + step + `" type="file" accept="`+ acceptableType +`"><label class="goButton" for="file` + step + `"><span>Upload `+ contentType +`</span></label>` +
											  `<a style="display:none;" id="toChallenge` + step + `" href="#" >` + textButton + `</a>`;
						
						//TODO textbutton depending on the file type
					} else if (challenge["type"] == "minigame") {
						challengeType = "minigame";
					}
				} else { challengeType = "checkin"; }
			}
		} else { challengeType = "checkin"; }

		if (step == 0) { textButton = "Start game"; }
		var button = `<a id="toChallenge` + step + `" href="#" class="goButton" >` + textButton + `</a>`;

		if (step == 999) { button = ""; }
		else if (challengeType == "upload_content") button = uploadContentButton;

		var POIBefore = `
			<a href="#modal` + step + `" id="openA` + step + `" style="display: none;">Open Modal</a>
			<div id="modal` + step + `" class="modalDialog screen">
				<div>
					<h2>` + game[step]["A"].title + `</h2>` +
					image +
					`<p class="`+ classP +`">` + Autolinker.link(game[step]["A"].text) + `</p>` +
					`<div class="totalPointsEarned"></div>` +
					`<div class="totalTimeSpent"></div>` +
					button + 
				`</div>
			</div>
		`;

		extras.innerHTML += POIBefore;

		/****** C ******/

		if (game[step].hasOwnProperty("C") && step > 0 ) {

			if (game[step].hasOwnProperty("item") && game[step].item != "") {
				image = "<img src=" + server_url + game[step].item + ">";
				classP = "p25vh";
			} else {
				image = "";
				classP = "p50vh";
			}

			// TODO fer aqui el llistat de paràmetres i validar l'existencia de tots
			var points = game[step]["rewardPoints"] == 0 
						? "" : ("<p class='pointsWon'>You won <span>"+ game[step]["rewardPoints"] +"</span> points</p>");

			var POIAfter = `
				<a href="#clue` + step + `" id="openC` + step + `" style="display: none;">Open Modal</a>
				<div id="clue` + step + `" class="modalDialog screen">
					<div>
						<h2>` + game[step]["C"].title + `</h2>`
						+ image +
						`<p class="`+ classP +`">` + Autolinker.link(game[step]["C"].text) + `</p>`
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
			if (!challengeSuccess) {

				console.log(challengeSuccess);

				var challenge = game[nextPOI]["B"]["challenge"];
				var minigameURL = challenge["url"];
				var inapp = device == "app" ? "%26device%3Dapp" : "%26device%3Dbrowser";
				var playerId = "playerid=" + encodeURI(tracker.playerId);
				var trackingCode = "trackingcode=" + tracker.settings.trackingCode;

				var url = (window.location.href).indexOf("geomotiongames") !== -1 ?  
					"https%3A%2F%2Fwww.geomotiongames.com/beaconing/app/" : 
					"https%3A%2F%2Fatcc.beaconing.eu/";

				minigameURL += "&"+playerId + "&"+trackingCode + "&callbackurl=" + url + "app.php%3Fgame%3D"+ game_id + "%26step%3D" + currentPOI + "%26startingtime%3D" + startingTime + inapp;
				window.open(minigameURL, "_self");
				return;
			}

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

				var challenge = game[currentPOI]["B"]["challenge"];

				if (challenge.hasOwnProperty("type")) {
					if (challenge["type"] == "upload_content") {
						document.getElementById("openC" + currentPOI).click();
					} else if (challenge["type"] == "minigame") {
						var minigameURL = challenge["url"];
						var inapp = device == "app" ? "%26device%3Dapp" : "%26device%3Dbrowser";
						var playerId = "playerid=" + encodeURI(tracker.playerId);
						var trackingCode = "trackingcode=" + tracker.settings.trackingCode;

						if (minigameURL.length > 0) {
							var url = (window.location.href).indexOf("geomotiongames") !== -1 ?  
								"https%3A%2F%2Fwww.geomotiongames.com/beaconing/app/" : 
								"https%3A%2F%2Fatcc.beaconing.eu/";

							minigameURL += "&"+playerId + "&"+trackingCode + "&callbackurl=" + url + "app.php%3Fgame%3D"+ game_id + "%26step%3D" + currentPOI + "%26startingtime%3D" + startingTime + inapp;
							window.open(minigameURL, "_self");
						}
					} else {
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

			// TIME
			var spent = Math.round((new Date().getTime() - parseInt(startingTime))/1000);
			var seconds = spent%60;
			var timeSpent = "<h3>Total time played: <span>" + (spent-seconds)/60 + ":" + (seconds < 10 ? "0"+seconds : seconds) + "</span><h3>";
			var timeDivs = document.getElementsByClassName('totalTimeSpent');
			timeDivs[timeDivs.length-1].innerHTML = timeSpent;

			// POINTS
			var pointsEarned = 0
			for (step in game) pointsEarned += parseInt(game[step]["rewardPoints"]);

			if (pointsEarned > 0) {
				var pointsDivs = document.getElementsByClassName('totalPointsEarned');
				pointsDivs[pointsDivs.length-1].innerHTML = "<h3>You earned <span>"+ pointsEarned +"</span> points</h3>";
			}
			tracker.Completable.Completed("demo",tracker.Completable.CompletableType.Game, true, 1);
		}, 1000);
	}

	updatePath();

	if (time_limit != 0) { 
		document.getElementById("main-progress").className = "time";
		document.getElementById("distance").className = "time";
		document.getElementById("topImageTime").className = "time";
	} else {
		document.getElementById("main-progress").className = "notime";
		document.getElementById("distance").className = "notime";
		document.getElementById("topImageNoTime").className = "notime";
	}

	document.getElementById('main-progress').innerHTML = getInventoryProgressAsString();

	attachUploadContentEvents();
	teleportIfNeeded();
}

function attachUploadContentEvents() {
	for (step in game) {
		if (game[step].hasOwnProperty("B") && step > 0 && step < 999 ) {
			if (game[step]["B"].hasOwnProperty("challenge")) {
				var challenge = game[step]["B"]["challenge"];
				if (challenge.hasOwnProperty("type")) {
					if (challenge["type"] == "upload_content") {

						document.getElementById("file" + step).onchange = function () {
			    			document.getElementById("toChallenge" + this.id.substr(-1)).click();
						};

					}
				}
			}
		}		
	}
}

function teleportIfNeeded() {
	if ( teleport ) {
		var position = { coords : {longitude: game[currentPOI+1].lng, latitude: game[currentPOI+1].lat}};
		lastPosition = position;
		newLocation(position);
		mapLoaded = true;
	}
}

function updateTimeLabel() {
	var now = new Date().getTime();
	var time_spent = now - parseInt(startingTime);
	var remaining_time = Math.round(time_limit - time_spent/1000)
	var r_sec = remaining_time%60;

	if (remaining_time > 0) {
		document.getElementById("remaining-time").innerHTML = (remaining_time - r_sec)/60 + ":" + (r_sec < 10 ? ("0" + r_sec) : r_sec);
	} else {
		document.getElementById('time-limit').style.zIndex = "9999";
		document.getElementById('time-limit').style.opacity = "1";
	}
}

function updatePath() {

	var pointList_pre = [];
	var pointList_post = [];

	for (step in game) {

		if (step != 0 && step != 999) {

			var latlng = { "lat": game[step].lat, "lng": game[step].lng };
			var poiIcon = step == 1 ? flagIcon : stopIcon;
			var marker;

			if (game[step].hasOwnProperty("title") && game[step]["title"] != "") {
				marker = L.marker(latlng, { icon: poiIcon }).bindTooltip( game[step]["title"],
							{
								permanent: true,
								direction: 'bottom'
							});
			} else {
				marker = L.marker(latlng, { icon: poiIcon });
			}

			if (currentPOI >= step) {
				marker.setOpacity(0.5);
				pointList_pre.push(latlng);
			}

			if (currentPOI <= step) {
				pointList_post.push(latlng);
			}

			marker.addTo(map);
		}
	}

	new L.Polyline(pointList_pre, {
    	color: '#1c3587',
    	weight: 4,
    	opacity: 0.5,
    	smoothFactor: 1
	}).addTo(map);

	new L.Polyline(pointList_post, {
    	color: '#1c3587',
    	weight: 4,
    	opacity: 1,
    	smoothFactor: 1
	}).addTo(map);
}


function locate_browser() {

	if (navigator.geolocation) {
		setInterval(function() {
			/*tracker.Flush(function(result, error){
				console.log("flushed");
			});*/

			navigator.geolocation.getCurrentPosition(function(position) {
				if (totalDistance == 0) {
					lastPosition = position.coords
				}
				newLocation(position);
				mapLoaded = true;
			}, errorHandler, { enableHighAccuracy: true });

		}, 3000);
	} else {
		console.log("no va");
		document.getElementById("message").innerHTML = "Geolocation is not supported by this browser.";
	}
}

function locate_app() {

	setInterval(function() {
		tracker.Flush(function(result, error){
			console.log("flushed");
		});

		window.location.href = "?getGPSData";
	}, 3000);
}


function setGPSData(data) {			

	var d = JSON.parse(data);

	var position = {};
	position = { coords: {longitude: parseFloat(d.lon), latitude: parseFloat(d.lat) } };

	if (totalDistance == 0) {
		lastPosition = position.coords
	}
	newLocation(position);
	mapLoaded = true;
}


function newLocation(position) {

	var coors = {lng: position.coords.longitude, lat: position.coords.latitude};

	tracker.Places.Moved("POI" + nextPOI, position.coords.latitude, position.coords.longitude, tracker.Places.PlaceType.POI);

	distanceToNextPOI += getDistanceFromLatLon(coors.lat, coors.lng, lastPosition.latitude, lastPosition.longitude);
	totalDistance     += getDistanceFromLatLon(coors.lat, coors.lng, lastPosition.latitude, lastPosition.longitude);
	lastPosition = position.coords;

	if (!located) {
		map.setZoom(18);
		map.panTo(coors);
		located = true;

		tracker.Completable.Initialized("demo", tracker.Completable.CompletableType.Game);
		lastPOITime  = new Date().getTime() / 1000;
		startingTime = startingTime != 0 ? startingTime : new Date().getTime();
		if (time_limit != 0) {
			setInterval(function() { updateTimeLabel(); }, 1000);
		}
	}

	if (nextPOI > 0 && nextPOI < 999) {

    	var distanceToNextPOI = map.distance({ "lat": game[nextPOI].lat, "lng": game[nextPOI].lng }, coors);

		if (distanceToNextPOI <= game[nextPOI].triggerDistance) {

			trackProgress();
			document.getElementById('openA' + nextPOI).click();
			currentPOI = nextPOI;
			nextPOI = getFollowingPOIId(nextPOI);
			document.getElementById('main-progress').text = getInventoryProgressAsString; //TODO després del challenge si l'ha superat?
		}

		document.getElementById('distance').innerHTML = parseInt(distanceToNextPOI) + " meters";
	}

	this.refreshUserMarker(coors);
}


function trackProgress() {
	
	var progress = nextPOI > 0 ? nextPOI / (Object.keys(game).length - 2) : 0;
	console.log("new progress: " + progress);

	var t = new Date().getTime() / 1000;
	var timeSpent = t - lastPOITime;
	lastPOITime = t;
	var poiId = "POI" + nextPOI;

	var distance = 100; //TODO
	var speed = 12; //TODO distance / lastPOITime

	//tracker.setVar("time", timeSpent);
	tracker.setVar("time", Math.floor(Math.random() * 20) + 20);
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

					var itemName = "ITEM" + (i+1);
					if (game[step].hasOwnProperty("itemName") && game[step].itemName != "") {
						itemName = game[step].itemName;
					}

					rowHTML = `<div class="row">
										<div class="collectable">
											<div class="collectable-image" style="
												background-image:url('`+ uploads_url + game[step].item +`');
												background-size:cover;
											"></div>
											<div class="collectable-name">
												<p>`+ itemName +`</p>
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
									background-image:url('`+ uploads_url + game[step].item +`');
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

	progress.innerHTML = getInventoryProgressAsString(); //TODO current POI no, contar quants en porta

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

function getInventoryProgressAsString() {

	game = game_info["POIS"];

	var totalItems = 0; //Number of collectables
	var currentProgress = 0; //Number of collectables collected

	for (step in game) {

		if (game[step].hasOwnProperty("item") && game[step].item !="") {

			if (step <= currentPOI) {
				currentProgress += 1;
			}

			totalItems++;
		}
	}

	return currentProgress + "/" + totalItems; //TODO current POI no, contar quants en porta
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

