<?php
	$fromMinigame = false;
	$currentPOI = 0;
	
	if (isset($_REQUEST['step']) && ctype_digit($_REQUEST['step'])) {
		$currentPOI = $_REQUEST['step'];
		$fromMinigame = true;
	}
?>

<!DOCTYPE html>
<html>
<head>

	<title>Beaconing Minigame</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.1.0/dist/leaflet.css" />
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css" />

	<script src="js/gps-minigames.js"></script>
	<script src="js/leaflet.js"></script>
	<script type="text/javascript" src="js/analytics/dist/js-tracker.bundle.js"></script>
	<script type="text/javascript" src="js/analytics/plugins/geolocation.js"></script>

</head>
<body>

<div id="clueLayer" class="hidden"><p class="clue"></p></div>
<p id="message" style="display: none;"></p>
<div id="map"></div>
<div id="extras"></div>

<script>

/*	var tracker = new TrackerAsset();

	tracker.settings.host = "https://rage.e-ucm.es//";
	tracker.settings.trackingCode = "592d716bb7353f006d52312eddska7hn2ji0y66r";

	//Add the plugin
	tracker.addPlugin(new TrackerPlugins.Geolocation());

	var connected = false;
	  tracker.Start(function(result, error){
      if(!error){
      	connected = true;
        console.log("tracker started");
        //tracker.Places.Moved("nextPOI", 1, 2, tracker.Places.PlaceType.UrbanArea);
      }else{
        console.log("start error")
      }
	});
*/

	var demo_info = {
		"plot-type": "treasure_haunt",
		"time-limit": 0,
		"POIS": {
			"0": { // START
				"A": {
					"title": "Coding & Robotics",
					"text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 4 pieces to finish it that you will find exploring the real world. Find the hidden places and answer questions to collect pieces and unlock clues to find the next place. <br/> Are you ready? Go out and play!",
					"image": "",
					"clue": "Clue #1:"
				}
			},
			"1": { // POI 1
				"lat": 41.4367806,
				"lng": 2.1695897,
				"distance": 40,
				"reward": 10,
				"A": {
					"title": "POI1_SCREEN_A",
					"text": "You found the first hidden place. To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=495831"
				},
				"B": {
					"title": "POI1_SCREEN_B",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "poi1.jpg",
					"clue": "Clue #2:"
				}
			},
			"2": { // POI 2
				"lat": 41.446713,
				"lng": 2.168341,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "POI2_SCREEN_A",
					"text": "Great! You found the second hidden place. To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=495831"
				},
				"B": {
					"title": "POI2_SCREEN_B",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "poi2.jpg"
				}
			},
			"999": { // FINISH
				"A": {
					"title": "Coding & Robotics",
					"text": "The Earth Special Agency congratulates you! Show this screen to the teacher and get the package with LEGO bricks in it to start building your new robot. Congratulations! ",
					"image": ""
				},
			}
		}
	};

	var currentPOI = <?= $currentPOI ?>;
	var nextPOI = currentPOI; //TODO 0 no pq ja hi ha una amb 0... tractar el primer poi com la resta
	var nextDistance = 1000;
	var located = false;
	var fromMinigame = <?= $fromMinigame ? 1 : 0 ?>;

	var map = L.map('map', { zoomControl:false }).fitWorld();

	map.removeControl( map.attributionControl );

	var stopIcon = L.icon({
	    iconUrl:    'https://www.geomotiongames.com/beaconing/demo/images/map-marker.png',
	    iconSize:   [40, 40], // size of the icon
	    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
	});

	var locationIcon = L.icon({
	    iconUrl:   'https://www.geomotiongames.com/beaconing/images/map-marker.png',
	    iconSize:     [24, 50], // size of the icon
	    iconAnchor:   [12, 50], // point of the icon which will correspond to marker's location
	});

	L.tileLayer('https://api.mapbox.com/styles/v1/citynostra/ciw6pvt9g00012qppdm7txtet/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2l0eW5vc3RyYSIsImEiOiJTa2FCY0RzIn0.DoxoeVwC6gVhVtsEr0mA6Q', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

	locate();

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
    		startingTime = new Date().getTime() / 1000;
    		lastPOITime  = new Date().getTime() / 1000;
    	}

    	if (nextPOI > 0 && nextPOI < 999) {

	    	var distanceToNextPOI = map.distance({ "lat": game[nextPOI].lat, "lng": game[nextPOI].lng }, coors);

			if (distanceToNextPOI < game[nextPOI].distance) {

				//trackProgress();
				document.getElementById('openA' + nextPOI).click();
				currentPOI = nextPOI;
				nextPOI = getFollowingPOIId(nextPOI);
			}

			if (fromMinigame) { 
				updatePath();
			}

			if (currentPOI == 0) {
				document.getElementById('clueLayer').getElementsByTagName("p")[0].innerHTML = game[currentPOI]["A"].clue + "<br/><br/> <span style='font-size:0.8em;'>Distance: " + parseInt(distanceToNextPOI) + " meters</span>";
				document.getElementById('clueLayer').className = "shown";
			} else if (game[currentPOI]["B"].hasOwnProperty("clue")) {
				document.getElementById('clueLayer').getElementsByTagName("p")[0].innerHTML = game[currentPOI]["B"].clue + "<br/><br/> <span style='font-size:0.8em;'>Distance: " + parseInt(distanceToNextPOI) + " meters</span>";
				document.getElementById('clueLayer').className = "shown";
			}
			
		}

		this.refreshUserMarker(coors);
	}

	gameReady();

</script>

</body>
</html>