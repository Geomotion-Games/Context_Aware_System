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
		"plot-type": "treasure_hunt",
		"time-limit": 0,
		"POIS": {
			"0": { // START
				"A": {
					"title": "Coding & Robotics",
					"text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 4 pieces to finish it that you will find exploring the real world. Find the hidden places and answer questions to collect pieces and unlock clues to find the next place. <br/> Are you ready? Go out and play!",
					"image": "",
					"clue": "Clue #1: Allez à ORT France"
				}
			},
			"1": { // POI 1
				"lat": 48.8463156,
				"lng": 2.26091070,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "ORT France",
					"text": "You found the first hidden place. You now know there are many different gears of different size that exist. One common way to differentiate all those gears is by their number of teeth. For example the smallest gear has 8 teeth and the bigger one has 40. <br/><br/> To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=000000666"
				},
				"B": {
					"title": "ORT France",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "f-poi1.jpg",
					"clue": "Clue #2: Transport public le plus proche"
				}
			},
			"2": { // POI 2
				"lat": 48.847925,
				"lng": 2.264208,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "Metro Auteuil",
					"text": "Great! You found the second hidden place. The gear ratio is the relationship between the number of teeth on two gears that are meshed or two sprockets connected with a common roller chain. In LEGO terms, a gear ratio is simply: \"number of follower’s gear teeth : number of driver’s gear teeth\". To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=0000006662"
				},
				"B": {
					"title": "Metro Auteuil",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "f-poi2.jpg",
					"clue": "Clue #3: Touvez le Supermarché"
				}
			},
			"3": { // POI 3
				"lat": 48.8480837,
				"lng": 2.26142942,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "Rectorate",
					"text": "Well done! You found the third hidden place. To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=0000006663"
				},
				"B": {
					"title": "Rectorate",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "f-poi3.jpg",
					"clue": "Clue #4: Autre station de metro"
				}
			},
			"4": { // POI 4
				"lat": 48.845165,
				"lng": 2.2616611,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "Metro Molitor",
					"text": "Yay! You found the fourth hidden place. To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=999888778"
				},
				"B": {
					"title": "Metro Molitor",
					"text": "Well done! Here is the clue for the next hidden place",
					"image": "f-poi4.jpg",
					"clue": "Clue #5: Angle de la rue"
				}
			},
			"5": { // POI 5
				"lat": 48.845099,
				"lng": 2.2602611,
				"distance": 20,
				"reward": 10,
				"A": {
					"title": "Street Corner",
					"text": "Awesome! You found the fifth hidden place. To collect the robot piece you need to answer a question. Go!",
					"image": ""
				},
				"challenge": {
					"type": "minigame",
					"url": "http://beaconing.seriousgames.it/games/genericquiz/?session_id=999888779"
				},
				"B": {
					"title": "Street Corner",
					"text": "Well done!",
					"image": "f-poi5.jpg"
				}
			},
			"999": { // FINISH
				"A": {
					"title": "Coding & Robotics",
					"text": "The Earth Special Agency congratulates you! Show this screen to the teacher and get the package with LEGO bricks in it to start building your new robot. Congratulations!",
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