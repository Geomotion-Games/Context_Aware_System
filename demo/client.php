<!DOCTYPE html>
<html>
<head>
	
	<title>Beaconing Minigame</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
	<script src="js/gps-minigames.js"></script>
	<script src="js/leaflet.js"></script>

	<style>

		body { padding: 0; margin: 0; } html, body, #map { height: 100vh; width: 100vw; }

		.modalDialog {
			position: fixed;
			font-family: Arial, Helvetica, sans-serif;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0,0,0,0.8);
			z-index: 99999;
			opacity:0;
			-webkit-transition: opacity 400ms ease-in;
			-moz-transition: opacity 400ms ease-in;
			transition: opacity 400ms ease-in;
			pointer-events: none;
		}

		.modalDialog:target {
			opacity:1;
			pointer-events: auto;
		}

		.modalDialog > div {
			width: 80%;
			position: relative;
			margin: 10% auto;
			padding: 5px 20px 13px 20px;
			border-radius: 10px;
			background: #fff;
			background: -moz-linear-gradient(#fff, #999);
			background: -webkit-linear-gradient(#fff, #999);
			background: -o-linear-gradient(#fff, #999);
		}

		.close {
			background: #606061;
			color: #FFFFFF;
			line-height: 25px;
			position: absolute;
			right: -12px;
			text-align: center;
			top: -10px;
			width: 24px;
			text-decoration: none;
			font-weight: bold;
			-webkit-border-radius: 12px;
			-moz-border-radius: 12px;
			border-radius: 12px;
			-moz-box-shadow: 1px 1px 3px #000;
			-webkit-box-shadow: 1px 1px 3px #000;
			box-shadow: 1px 1px 3px #000;
		}

		.close:hover { background: #00d9ff; }

	</style>

</head>
<body>

<p id="message"></p>
<div id="map"></div>
<div id="extras"></div>

<script>

	var demo_info = {
  "0": {
    "idNumber": 0,
    "title": "The broken robot",
    "description": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready? Go out and play!",
    "lat": 0,
    "lng": 0,
    "distance": 0,
    "clue": "Clue #1: Go to the place where 3 flags welcomes you to the learning experience",
    "image": "https://drive.google.com/open?id=0B4cvW8f9kWUSSGM0YTZZaFROR00"
  },
  "1": {
    "idNumber": 1,
    "title": "Main Entrance",
    "description": "There you go! First sensor found. The EV3 Brick serves as the control center and power station for your robot. Only 2 sensors left, keep up the good work! Check in now to show the clue to the next point",
    "lat": 44.444,
    "lng": 26.05372,
    "distance": 20,
    "clue": "Clue #2: Where Bizantine architecture meets Polytechnic University of Bucharest",
    "image": "https://drive.google.com/open?id=0B4cvW8f9kWUSSGM0YTZZaFROR00"
  },
  "2": {
    "idNumber": 2,
    "title": "Church",
    "description": "Yes! you did it! The second sensor is in your hands. The Infrared Sensor is a digital sensor that can detect infrared light reflected from solid objects. It can also detect infrared light signals sent from the Remote Infrared Beacon. Only 1 sensor left. Let's do this! Check in now to show the clue to the next point",
    "lat": 44.44099,
    "lng": 26.05295,
    "distance": 20,
    "clue": "Clue #3: Find the most amazing round and square building inside the University",
    "image": "https://drive.google.com/open?id=0B4cvW8f9kWUSeExJX2dVdGVOcEE"
  },
  "3": {
    "idNumber": 3,
    "title": "Rectorate",
    "description": "Well done! This sensor maintains precision, while trading some power for compact size and faster responses. Check in now to show the clue to the next point",
    "lat": 44.43845,
    "lng": 26.05153,
    "distance": 20,
    "clue": "Clue #3: Find the most amazing round and square building inside the University",
    "image": "https://drive.google.com/open?id=0B4cvW8f9kWUSeExJX2dVdGVOcEE"
  },
  "4": {
    "idNumber": 4,
    "title": "Library",
    "description": "Great Job Agent! You found all the sensors and helped Alfred finish the Robot.",
    "lat": 44.44113,
    "lng": 26.05192,
    "distance": 20,
    "clue": "",
    "image": "https://drive.google.com/open?id=0B4cvW8f9kWUSSGM0YTZZaFROR00"
  },
  "999": {
    "idNumber": 999,
    "title": "",
    "description": "The Earth Special Agency congratulates and rewards you with a great PRIZE! Show this screen and ask for it to the BEACONING Staff.",
    "lat": "",
    "lng": "",
    "distance": 20,
    "clue": "",
    "image": "http://beaconing.eu/wp-content/themes/beaconing/images/logo/original_version_(black).png"
  }
};

	var nextPOI = 0 //TODO 0 no pq ja hi ha una amb 0... tractar el primer poi com la resta

	var minigame_number = <?php echo($_REQUEST['minigame']); ?>;

	getMinigame()

	var map = L.map('map').fitWorld();

	var stopIcon = L.icon({
	    iconUrl:   'http://trianco.co.uk/wp-content/uploads/2015/08/map-marker.png',
	    iconSize:     [40, 40], // size of the icon
	    iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
	});

	var locationIcon = L.icon({
	    iconUrl:   'https://www.geomotiongames.com/beaconing/images/map-marker.png',
	    iconSize:     [24, 50], // size of the icon
	    iconAnchor:   [12, 50], // point of the icon which will correspond to marker's location
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

	locate();

    function newLocation(position) {
    	var coors = {lng: position.coords.longitude, lat: position.coords.latitude};
    	if (nextPOI == 0) {
    		map.setZoom(15);
    		map.panTo(coors);
    	}

    	if (nextPOI >= 0) {
	    	var distanceToNextPOI = map.distance({ "lat": game[nextPOI].lat, "lng": game[nextPOI].lng }, coors);

	    	console.log(distanceToNextPOI);
			//document.getElementById("message").innerHTML = "position: " + position.coords.latitude + ", " + position.coords.longitude "<br/>" + "distance: " + distanceToNextPOI;
			
			if (distanceToNextPOI < game[nextPOI].distance) {
				document.getElementById('openModal' + nextPOI).click();
				nextPOI = getFollowingPOIId(nextPOI);
			}
		}

		this.refreshUserMarker(coors);
	}

</script>

</body>
</html>