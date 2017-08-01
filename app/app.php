<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	
	error_reporting(0);

	require 'class/db.class.php';
	require 'class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$game_id = isset($_REQUEST['game']) && ctype_digit($_REQUEST['game']) ? $_REQUEST['game'] : "0";

    /*$query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $id);
	$numRows = $bd->num_rows($query);

 	if ($numRows > 0) {
		$plot = $bd->obtener_fila($query, 0);
    }*/

    $query = $bd->ejecutar(sprintf("SELECT poi.*, plot.id as plotId, plot.time as time_limit, plot.type as game_type
    								FROM poi
    				  				INNER JOIN plot 
    				  				ON poi.plot = plot.id 
    				  				WHERE plot = %s 
    				  				ORDER BY orderNumber ASC", $game_id));


   /* var_dump(sprintf("SELECT poi.*, plot.id as plotId, plot.time as time_limit, plot.type as game_type
    								FROM poi
    				  				INNER JOIN plot 
    				  				ON poi.plot = plot.id 
    				  				WHERE plot = %s 
    				  				ORDER BY orderNumber ASC", $game_id));
    *//*

	if ($bd->num_rows($query) > 0) {

 		$pois = array();
 		$poiIDs = array();

		while ($row = mysql_fetch_assoc($query)) {
		    $pois[$row["orderNumber"]] = $row;
		    $poiIDs[] = $row["id"];
		}

		$finish_poi = $pois[1];
		array_pop($pois[1]);
		$pois[ $finish_poi["orderNumber"] ] = $finish_poi;
		
		$finish_poi_id = $poiIDs[1];
		unset($poiIDs[1]);
		$poiIDs[] = $finish_poi_id;

		$query = $bd->ejecutar(sprintf( "SELECT * FROM screen WHERE poi IN (%s)", implode(",", $poiIDs) ));

		if ($bd->num_rows($query) > 0) {

			//$completePOIs = array();
			while ($row = mysql_fetch_assoc($query)) {
				$pois[$row["poi"]][] = json_decode($row["data"]);
		   	}
		}
    }

    */


 	if ($bd->num_rows($query) > 0) {

 		$pois = array();
 		$poiIDs = array();

		while ($row = mysql_fetch_assoc($query)) {
		    $pois[$row["id"]] = $row;
		    $poiIDs[] = $row["id"];
		}

		$query = $bd->ejecutar(sprintf( "SELECT * FROM screen WHERE poi IN (%s)", implode(",", $poiIDs) ));

		if ($bd->num_rows($query) > 0) {

			while ($row = mysql_fetch_assoc($query)) {
				$screen = json_decode($row["data"], true);
				$pois[$row["poi"]][$screen["type"]] = $screen;
		   	}
		}
		
		$finish_index = array_keys($pois)[1];
    	$finish_poi = $pois[$finish_index];
    	unset($pois[$finish_index]);

    	//sort by orderNumber
    	usort($your_data, function($a, $b)
		{
    		return strcmp($a->orderNumber, $b->orderNumber);
		});

		//change keys
		$keys_to_remove = array_keys($pois);
		$size = sizeof($pois);
		for($i=0; $i<$size; $i++) {
			$key = $keys_to_remove[$i];
			$pois[$i] = $pois[$key];
		}

		//var_dump($pois);
		foreach($keys_to_remove as $key) {
			unset($pois[$key]);
		}

    	$pois[999] = $finish_poi;
    }

	$fromMinigame = false;
	$currentPOI = 0;

	if (isset($_REQUEST['step']) && ctype_digit($_REQUEST['step'])) {
		$currentPOI = $_REQUEST['step'];
		$fromMinigame = true;
	}

	$game = array();
	$game['POIS'] = $pois; 

	//var_dump($game);

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

	var demo_info = <?= json_encode($game); ?>

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
				//TODO UNDEFINED
				var clue = game[currentPOI]["A"].clue;
				if (clue) {
					clue = "";
				}
				document.getElementById('clueLayer').getElementsByTagName("p")[0].innerHTML = clue + "<br/><br/> <span style='font-size:0.8em;'>Distance: " + parseInt(distanceToNextPOI) + " meters</span>";
				document.getElementById('clueLayer').className = "shown";
			} else if (game[currentPOI]["B"].hasOwnProperty("clue")) {
				var clue = game[currentPOI]["B"].clue;
				if (clue) {
					clue = "";
				}
				document.getElementById('clueLayer').getElementsByTagName("p")[0].innerHTML = clue + "<br/><br/> <span style='font-size:0.8em;'>Distance: " + parseInt(distanceToNextPOI) + " meters</span>";
				document.getElementById('clueLayer').className = "shown";
			}
			
		}

		this.refreshUserMarker(coors);
	}

	gameReady();

</script>

</body>
</html>