<!DOCTYPE html>
<html>
<head>
	
	<title>Mobile tutorial - Leaflet</title>

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

	var nextPOI = 0

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