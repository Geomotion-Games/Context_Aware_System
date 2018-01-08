<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	
	error_reporting(0);

	require '../class/db.class.php';
	require '../class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$game_id = isset($_REQUEST['game']) && ctype_digit($_REQUEST['game']) ? $_REQUEST['game'] : "0";

    $query = $bd->ejecutar(sprintf("SELECT poi.*, plot.id as plotId, plot.time as time_limit, plot.type as game_type
    								FROM poi
    				  				INNER JOIN plot 
    				  				ON poi.plot = plot.id 
    				  				WHERE plot = %s 
    				  				ORDER BY orderNumber ASC", $game_id));

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

		foreach($keys_to_remove as $key) {
			unset($pois[$key]);
		}

    	$pois[999] = $finish_poi;
    }

	$fromMinigame = false;
	$currentPOI = 0;
	$device = "app";

	if (isset($_REQUEST['device']) && $_REQUEST['device']) {
		$device = $_REQUEST['device'];
	}

	if (isset($_REQUEST['step']) && ctype_digit($_REQUEST['step'])) {
		$currentPOI = $_REQUEST['step'];
		$fromMinigame = true;
	}

	$startingTime = 0;
	if (isset($_REQUEST['startingtime']) && ctype_digit($_REQUEST['startingtime'])) {
		$startingTime = $_REQUEST['startingtime'];
	}

	$game = array();
	$game['POIS'] = $pois; 
?>

<!DOCTYPE html>
<html>
<head>

	<title>Beaconing Minigame</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="css/leaflet.css" />
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css" />

	<?php switch($game["POIS"][0]["game_type"]): 

		case "TreasureHunt": ?>
			<script src="js/treasure-hunt.js"></script>
		<?php break; ?>

		<?php case "FollowThePath": ?>
		    <script src="js/follow-the-path.js"></script>
		<?php break; ?>

	<?php endswitch; ?>

	<script src="js/leaflet.js"></script>
	<script type="text/javascript" src="js/analytics/dist/js-tracker.bundle.js"></script>
	<script type="text/javascript" src="js/analytics/plugins/geolocation.js"></script>

</head>
<body>

<!--div style="width: 100%; height: 100px; display: block; position:fixed; top:0; left:0; z-index: 99999;"><p id="jsoutput"></p><div-->
<a id="chooseBtn" href="http://www.google.es" style="opacity:1; position:fixed; z-index:99999;">choose game</a>

<div id="topBar">
	<p id="distance"></p>
	<div id="gameInfo">
		<img id="topImageNoTime" class="hidden" src="images/ui-app-d-follow-treasure-notime.png" usemap="#inventoryButtonNoTime">
		<map name="inventoryButtonNoTime" id="inventoryButtonNoTime">
    		<area alt="" title="" href="JavaScript: showInventory(6); void(0);" shape="rect" coords="61,54,107,103" />
		</map>

		<img id="topImageTime" class="hidden" src="images/ui-app-d-follow-treasure.png" usemap="#inventoryButton">
		<map name="inventoryButton" id="inventoryButton">
    		<area alt="" title="" href="JavaScript: showInventory(6); void(0);" shape="rect" coords="61,89,107,138" />
		</map>
		<p id="remaining-time"></p>
		<p id="main-progress"></p>
	</div>
	<div id="left-icon-div" class="hidden"><img src="images/ui-app-i-treasure.png" id="left-icon"></div>
	<div id="clueLayer" class="hidden"><p class="clue"></p></div>

	<!-- extra -->
	<p id="message" style="display: none;"></p>
</div>
<div id="map"></div>
<div id="extras"></div>

<div id="inventory" class="modalDialog">
	<div>
		<div id="inventory-header">
			<a id="return" href="#"><</a>
			<p id="inventory-title">Inventory</p>
			<img src="images/inventory-header.png" id="inventory-header-image">
			<p id="inventory-progress"></p>
		</div>
		<div id="inventory-grid">
			<!--inventory content-->
		</div>
	</div>
</div>

<div id="time-limit" class="modalDialog screen">
	<div>
		<H2>Time is over</H2>
		<img src="images/timelimit.jpg" id="time-limit-image">
		<p>Oh! The time limit to complete the game is over.</p>
		<a id="time-limit-button" href="#" class="goButton">Go out</a>
	</div>
</div>

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

	var game_id = <?= $game_id; ?>;
	if (game_id == 1) {
		window.open("https://www.geomotiongames.com/pre/beaconing/app/choose-game.php", "_self");
	}

	var server_url = (window.location.href).indexOf("/pre/") !== -1 ? 
					"https://www.geomotiongames.com/pre/beaconing/" : 
					"https://www.geomotiongames.com/beaconing/";

	var game_info = <?= json_encode($game); ?>;
	var game_type = game_info["POIS"][0]["game_type"];
	var time_limit = game_info["POIS"][0]["time_limit"] * 60;
	var startingTime = <?= $startingTime; ?>;
	var device = "<?= $device; ?>";

	var currentPOI = <?= $currentPOI ?>;
	var nextPOI = currentPOI;
	var nextDistance = 1000;
	var located = false;
	var fromMinigame = <?= $fromMinigame ? 1 : 0 ?>;

	var stopIcon = L.icon({
	    iconUrl:    server_url + 'app/images/map-marker-blue.png',
	    iconSize:   [26, 42],
	    iconAnchor: [13, 42],
	});

	var flagIcon = L.icon({
	    iconUrl:    server_url + 'app/images/start-blue-flag.png',
	    iconSize:   [26, 39],
	    iconAnchor: [4, 39],
	});

	var locationIcon = L.icon({
	    iconUrl: 	server_url + 'app/images/avatar-marker.png',
	    iconSize:   [40, 50],
	    iconAnchor: [20, 50],
	});

	var map = L.map('map', { zoomControl:false }).fitWorld();

	map.removeControl( map.attributionControl );

	L.tileLayer('https://api.mapbox.com/styles/v1/citynostra/ciw6pvt9g00012qppdm7txtet/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2l0eW5vc3RyYSIsImEiOiJTa2FCY0RzIn0.DoxoeVwC6gVhVtsEr0mA6Q', {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(map);

	locate_app();
	
	gameReady();

</script>

</body>
</html>