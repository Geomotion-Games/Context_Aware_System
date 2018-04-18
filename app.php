<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	error_reporting(0);

	require 'class/db.class.php';
	require 'class/conf.class.php';

	include("php/multilanguage.php");
	loadlang("en");

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$game_id = isset($_REQUEST['game']) && ctype_digit($_REQUEST['game']) ? $_REQUEST['game'] : "0";

    $query = $bd->ejecutar(sprintf("SELECT poi.*, plot.id as plotId, plot.time as time_limit, plot.type as game_type, plot.tracking_code as tracking_code
    								FROM poi
    				  				INNER JOIN plot 
    				  				ON poi.plot = plot.id 
    				  				WHERE plot = %s 
    				  				ORDER BY orderNumber ASC", $game_id));

 	if ($bd->num_rows($query) > 0) {

 		$pois = array();
 		$poiIDs = array();

		while ($row = mysqli_fetch_assoc($query)) {
		    $pois[$row["id"]] = $row;
		    $poiIDs[] = $row["id"];
		}

		$query = $bd->ejecutar(sprintf( "SELECT * FROM screen WHERE poi IN (%s)", implode(",", $poiIDs) ));

		if ($bd->num_rows($query) > 0) {

			while ($row = mysqli_fetch_assoc($query)) {
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

	$device = "browser";
	if (isset($_REQUEST['device']) && $_REQUEST['device']) {
		$device = $_REQUEST['device'];
	}
	$tracking_code_param = isset($_REQUEST['trackingcode']) ? $_REQUEST['trackingcode'] : "";

	$currentPOI = 0;
	$fromMinigame = false;
	$challengeSuccess = true;
	if (isset($_REQUEST['step']) && ctype_digit($_REQUEST['step'])) {
		$currentPOI = $_REQUEST['step'];
		$fromMinigame = true;
		if (isset($_REQUEST['success']) && $_REQUEST['success'] == "false") {
			$challengeSuccess = false;
		}
	}

	$teleport = false;
	$teleportId = -1;
	if (isset($_REQUEST['teleport']) && ctype_digit($_REQUEST['teleport'])) {
		$teleportId = $_REQUEST['teleport'];
		$teleport = true;
	}

	if ( isset($_REQUEST['lang']) ) {
		loadLang($_REQUEST['lang']);
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

	<link rel="stylesheet" href="app/css/leaflet.css" />
	<link rel="stylesheet" href="app/css/font-awesome.min.css" />
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<link rel="stylesheet" href="app/css/style.css" />

	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>

	<script src="app/js/gp-common.js"></script>

	<script>var strings = <?= json_encode($GLOBALS["strings"]); ?>;</script>

	<?php switch($game["POIS"][0]["game_type"]): 
		
		case "TreasureHunt": ?>
			<script src="app/js/treasure-hunt.js"></script>
		<?php break; ?>

		<?php case "FollowThePath": ?>
		    <script src="app/js/follow-the-path.js"></script>
		<?php break; ?>

	<?php endswitch; ?>

	<script type="text/javascript" src="app/js/cooking-machine.js"></script>
	<script type="text/javascript" src="app/js/leaflet.js"></script>
	<script type="text/javascript" src="js/lib/Autolinker.min.js"></script>
	<script type="text/javascript" src="app/js/ucm-track/dist/js-tracker.bundle.min.js"></script>
	<script type="text/javascript" src="app/js/ucm-track/plugins/geolocation.js"></script>
	<script type="text/javascript" src="app/js/jquery-3.2.1.min.js"></script>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

</head>
<body>
<div id="fb-root"></div>

<script>
  window.fbAsyncInit = function() {
    	FB.init({
      		appId      : '1577222535665079',
      		xfbml      : true,
      		version    : 'v2.11'
    	});
    	FB.AppEvents.logPageView();
  	};

  	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = 'https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.11&appId=1577222535665079';
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
</script>

<div id="spinner" style="display:none">
	<div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
	</div>
</div>

<div id="topBar">
	<div id="left-icon-div" class="hidden"><img src="app/images/ui-app-i-treasure.png" id="left-icon"></div>
	<div id="clueLayer" class="hidden"><p class="clue"></p></div>

	<!-- extra -->
	<p id="message" style="display: none;"></p>
</div>

<div id="gameInfo">
	<img id="topImageNoTime" class="hidden" src="app/images/ui-app-d-follow-treasure-notime.png" usemap="#inventoryButtonNoTime">
	<map name="inventoryButtonNoTime" id="inventoryButtonNoTime">
		<area alt="" title="" href="JavaScript: showInventory(1); void(0);" shape="rect" coords="61,54,107,103" />
	</map>

	<img id="topImageTime" class="hidden" src="app/images/ui-app-d-follow-treasure.png" usemap="#inventoryButton">
	<map name="inventoryButton" id="inventoryButton">
		<area alt="" title="" href="JavaScript: showInventory(2); void(0);" shape="rect" coords="61,89,107,138" />
	</map>
	<p id="distance"></p>
	<p id="remaining-time"></p>
	<p id="main-progress"></p>
</div>

<div id="map"></div>
<div id="extras"></div>

<div id="inventory" class="modalDialog">
	<div>
		<div id="inventory-header">
			<a id="inventory-return" href="JavaScript: hideInventory(2); void(0);"><</a>
			<p id="inventory-title"><?= l("inventory"); ?></p>
			<img src="app/images/inventory-header.png" id="inventory-header-image">
			<p id="inventory-progress"></p>
		</div>
		<div id="inventory-grid">
			<!--inventory content-->
		</div>
	</div>
</div>

<div id="time-limit" class="modalDialog screen">
	<div>
		<H2><?= l("time_over"); ?></H2>
		<img src="app/images/timelimit.jpg" id="time-limit-image">
		<p style="margin:0;"><?= l("game_over"); ?></p>
		<div class="totalPointsEarned" id="points-time-over"></div>
		<a style="margin: 15px 0;" id="show-inventory-time-over" href="#" class="goButton"><?= l("show_inventory"); ?></a>
		<?php if ($device == "app") { 
			echo '<a id="go-out-time-over" href="#" class="goButton">'; l("go_out"); echo '</a>';
		} ?>
	</div>
</div>

<?php echo $device == "app" ? '<a id="qr-code" href="#"><img src="app/images/qr-icon.png" id="qr-button"/></a>' : ""; ?>
<a id="locate-user" href="#"><img src="app/images/locate-user.png" id="locate-button"/></a>


<script>

	function teleportTo( current ) {
		if (teleport) {
			var game = game_info["POIS"];
			for (step in game) {
				if (game[step]["id"] == "<?= $teleportId ?>") {
					return step - 1;
				}
			}
		}

		return current;
	}

	var game_id = <?= $game_id; ?>;
	var game_info = <?= json_encode($game); ?>;
	var game_type = game_info["POIS"][0]["game_type"];
	var st = getCookie("starting_time_" + game_id);
	var time_limit = game_info["POIS"][0]["time_limit"] * 60; 
	var startingTime = 0;
	if (st.length > 0) {
		startingTime = st;
	} else {
		var n = new Date().getTime();
		setCookie("starting_time_" + game_id, n, 365);
		startingTime = n;
	}
	var device = "<?= $device; ?>";
	var teleport = <?= $teleport ? 1 : 0 ?>;

	var currentPOI = teleportTo(<?= $currentPOI ?>);

	var tracker = new TrackerAsset();
	var cookieNeeded = false;
	var fromMinigame = <?= $fromMinigame ? 1 : 0 ?>;

	var server_url = "";

	if ((window.location.href).indexOf("atcc-qa") !== -1) {
		console.log("pre environment");
		server_url = "https://atcc-qa.beaconing.eu/";
	} else if ((window.location.href).indexOf("atcc") !== -1) {
		console.log("pro environment");
		server_url = "https://atcc.beaconing.eu/";
	}

	if (time_limit != 0) {
		updateTimeLabel();
	}

	if (teleport || fromMinigame) { // From QR
		var userToken = getCookie("userToken");
		console.log("cookie found: " + userToken);
	    if (userToken != "") {
	        // we have it
	        console.log("We had the token! " + userToken);
	        tracker.settings.userToken = userToken;
	    } else {
	    	// first time
	        cookieNeeded = true;
    	}
	} else {
		// set new playerId
		cookieNeeded = true;

		// recover progress
		/*var progress = getCookie("progress_game_" + game_id);
		if (progress != "" && !fromMinigame) {
			currentPOI = teleportTo(progress);
		}*/
	}

	tracker.settings.host = "https://analytics.beaconing.eu/";
	var pretc = "<?= $tracking_code_param ? $tracking_code_param : "5a5f75c31aa66f0081138640tvfardjm1dp" ?>";
	var accessTokenLA = "<?= $access_token ? $access_token : "" ?>";

	tracker.settings.trackingCode = game_info["POIS"][0]["tracking_code"] ? game_info["POIS"][0]["tracking_code"] : pretc;
	tracker.settings.backupStorage = false;

	//Add the plugin
	tracker.addPlugin(new TrackerPlugins.Geolocation());

	var connected = false;

	tracker.LoginBeaconing(accessTokenLA, function(result, error){
		tracker.Start(function(result, error) {
	    if(!error) {
	      	console.log("tracker started");
	      	connected = true;
	    	if (cookieNeeded) {
	    		console.log("Saving UserToken.. " + tracker.userToken);
	    		setCookie("userToken", tracker.userToken, 365);
	    	} else {
	    		console.log("Using saved UserToken: " + tracker.userToken);
	    	}
	    	tracker.Places.Moved("nextPOI", 1, 2, tracker.Places.PlaceType.UrbanArea);
	    } else {
	        	console.log("start error");
	        	console.log(error);
	    }
	});
	});

	var nextPOI = currentPOI;
	var nextDistance = 1000;
	var located = false;
	var challengeSuccess = <?= $challengeSuccess ? 1 : 0 ?>;

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

	L.tileLayer('https://api.mapbox.com/styles/v1/beaconing/cjbxqxhivegeg2smmaat3hkkx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVhY29uaW5nIiwiYSI6ImNqYnhxd3h0czJsbngycXBjMjd6MG9vOWoifQ.fNesE_V6xrHFGiK1otUsTg', {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(map);

	if (device == "app") {
		locate_app();
		window.location.href = "?startScanBeacons";
	} else {
		locate_browser();
	}

	document.getElementById("locate-button").onclick = function() {
		if (lastPosition != null) {
			map.panTo( new L.LatLng(lastPosition.latitude, lastPosition.longitude) );
		}
	}

	if (document.getElementById("qr-button") != null ) { 
		$('#qr-button').on('click touchstart', function(e) {
			window.location.href = "?scanqrcode";
		});
	}

	function setQRCodeScan(data) {
		window.location.replace(data.substring(1, data.length-1) + "&device=app");
	}

	function setBeaconNames(data) {

		if (game[nextPOI]["type"] == "beacon") {
			var bname = getBeaconName(data);
			if (game[nextPOI]["beaconId"] == bname) {
				var position = { coords : {longitude: game[nextPOI].lng, latitude: game[nextPOI].lat}};
				lastPosition = position;
				newLocation(position);
			}
		}
	}

	function getBeaconName(data) {
		return data.substring(10, data.indexOf("address")-3);
	}

	gameReady();

</script>

<script type="text/javascript" src="app/js/screen-formatter.js"></script>
</body>
</html>

