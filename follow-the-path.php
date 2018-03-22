<?php

	error_reporting(0);

	include("php/handleAccessToken.php");

	$auth = new HandleAccessToken();
	$user = $auth->currentUser();

	include("php/multilanguage.php");
	loadlang($user["language"]);

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	error_reporting(0);

	require 'class/db.class.php';
	require 'class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$id = $_REQUEST['id']; //TODO controlar això....

	$callback = (isset($_REQUEST['callback']) && $_REQUEST['callback'] != "") ? $_REQUEST['callback'] : "atcc";

    $query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $id);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$plot = $bd->obtener_fila($query, 0);
		/*if (!is_null($plot["user_id"]) && $plot["user_id"] != $user["id"] ) {
			header("Location: https://" . $_SERVER["SERVER_NAME"]);
		}*/
    }else {
      	echo mysqli_error();
    }

//    $query = $bd->ejecutar("SELECT * FROM poi WHERE plot = " . $id . " ORDER BY orderNumber ASC");

    $inset = '\'%"type":"B"%\'';
    $query = $bd->ejecutar("SELECT p.*, s.data FROM poi as p LEFT JOIN screen as s ON (p.id = s.poi AND s.data LIKE ". $inset .") WHERE plot = " . $id . " ORDER BY orderNumber ASC");

	$numRows = $bd->num_rows($query);

	$pois = array();
 	if ($query) {
		while(($row =  mysqli_fetch_assoc($query))) {
			$row["data"] = json_decode($row["data"], true);
		    $pois[] = $row;
		}
    }else {
      echo mysqli_error();
    }
?>
<html>
<head>

	<script src="app/js/cooking-machine.js"></script>
	<script src="https://use.fontawesome.com/bb1c86f444.js"></script>

	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">
	<link rel="stylesheet" href="css/jquery-ui.css">

	<script src="js/lib/jquery-1.12.4.js"></script>
	<script src="js/lib/jquery-ui.js"></script>

	<link rel="stylesheet" href="css/leaflet.css" />
	<script src="js/lib/leaflet.js"></script>

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>

	<link rel="stylesheet" href="css/Control.Geocoder.css" />
	<link rel="stylesheet" href="css/cacat.css" />
	<link rel="stylesheet" href="css/map-follow-the-path.css" />

	<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
	<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>

	<link rel="stylesheet" href="css/easy-button.css">
	<script src="js/lib/easy-button.js"></script>

</head>
<body>

	<header class="header">
		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li><a href="./"><span><?= l("desktop"); ?></span></a></li>
					<li><span><?= l("select_plot"); ?></span></li>
					<!--TODO href depenent del joc...-->
					<li class="active"><span><?= l("edit_game"); ?></span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container-fluid wideDescription">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong><?= l("description"); ?>: </strong><?= l("edit_game_description"); ?></p>
		</div>
	</div>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-3 attribute">
				<p class="attrTitle"><?= l("name_game"); ?></p>
				<input id="gameName" class="attrValue" type="text" maxlength="40">
			</div>
			<div class="col-md-4 attribute">
				<p class="attrTitle"><?= l("name_description"); ?></p>
				<input id="gameDescription" class="attrValue" type="text" maxlength="100">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle"><?= l("time_limit"); ?></p>
				<input id="timeToggle" class="pubpriv-toggle gameTimeActive" type="checkbox" data-toggle="toggle" data-on="<?= l("limited"); ?>" data-off="<?= l("unlimited"); ?>">
			</div>
			<div class="col-md-3 attribute" id="timeLimit" style="visibility: hidden;">
				<p class="attrTitle"><?= l("time_to_complete"); ?></p>
				<input id="gameTimeValue" class="attrValue" type="number" placeholder="0">
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="section">
					<div class="block-left">
						<div id='map' class="element"></div>
						<img id="styleToogle" src="/images/photoStyle.png">
					</div>
				</div>
			</div>
			<div class="col-md-6 section">
				<div class="block-right">

					<ul id="start" class="sortable">
				    	<li class="stop-row poirow" id="point0" stop-number="0">
				    		<div class="row">
				    			<div class="col-md-12 poiInfo">
				    				<div class="poiTexts">
				    					<p><span class="name poiTitle" style="margin: 0;"><?= l("start"); ?></span><a class="poi-tooltip" href="#" data-toggle="tooltip" data-placement="right" title="<?= l("start_info"); ?>"><i class="fa fa-info fa-1.2x" aria-hidden="true"></i></a></p>
				    				</div>
				    				<div class=poiActions>
				    					<a href="#"><i title="<?= l("edit")?>" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
				    				</div>
				    			</div>
				    		</div>
				    	</li>
					</ul>

					<ul id="stops" class="sortable"></ul>

					<ul id="finish" class="sortable">
				    	<li class="stop-row poirow" id="point999" stop-number="999">
				    		<div class="row">
				    			<div class="col-md-12 poiInfo">
				    				<div class="poiTexts">
				    					<p><span class="name poiTitle" style="margin: 0;"><?= l("finish"); ?></span><a class="poi-tooltip" href="#" data-toggle="tooltip" data-placement="right" title="<?= l("finish_info"); ?>"><i class="fa fa-info fa-1.2x" aria-hidden="true"></i></a></p>
				    				</div>
				    				<div class=poiActions>
				    					<a href="#"><i title="<?= l("edit")?>" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
				    				</div>
				    			</div>
				    		</div>
				    	</li>
					</ul>

				</div>

				<footer class="navbar-fixed-bottom">
					<div class="container-fluid">
						<div class="col-md-12">
							<a id="finishEdition" href="./" class="orangeBtn"><?= l("finish_game_edition"); ?></a>
							<a id="qrcode" class="blueBtn"><?= l("qr_code"); ?></a>
							<a id="manageBeacons" href="http://location.beaconing.eu/" target="_blank" class="blueBtn"><?= l("manage_beacons"); ?></a>
							<a id="addBeacon" class="blueBtn">+ <?= l("add_beacons"); ?></a>
							<div id="saving"><?= l("saving"); ?>...</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</div>

	<div class="qr-viewer modal fade" id="qr-viewer" tabindex="-1" role="dialog" aria-labelledby="qr-viewer">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				 <image src="">
			</div>
		</div>	
	</div>

	<script>
		var strings = <?= json_encode($GLOBALS["strings"]); ?>;
	</script>

	<script src="js/lib/Control.Geocoder.js"></script>
	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/parse.js"></script>
	<script src="js/save.js"></script>
	<script src="js/remove.js"></script>
	<script src="js/duplicate.js"></script>
	<script src="js/map.js"></script>
	<script src="js/follow-the-path.js"></script>

	<script>
		$(function() {
		    $('#timeToggle').change(function() {
		    	if (!$(this).prop('checked')) {
		    		$('#timeLimit').css("visibility", 'hidden');
				} else {
					$('#timeLimit').css("visibility", 'visible');
				}
		    })
		})

		var plot = <?= json_encode($plot); ?>;
		var pois = <?= json_encode($pois); ?>;

		var start = parsePOI(pois[0]);
		var finish = parsePOI(pois[1]);

		pois.splice(0, 2);

		var game = parsePlotJSON(plot);
		var points = parsePOIS(pois);
		var streetsStyle = true;

		init();

		$(document).ready(function(){
		    $('[data-toggle="tooltip"]').tooltip();   
		});

		var callback = "<?= $callback; ?>";
		if ( callback != "atcc") {
			setCookie("callback-at", "<?= $callback; ?>", 365); 
		}

		var buttonurl = getCookie("callback-at");
		if ( buttonurl != "" ) {
			console.log(buttonurl);
			if (buttonurl.startsWith("http")) {
				$("#finishEdition").attr("href", buttonurl);
			} else {
				$("#finishEdition").attr("href", "https://" + buttonurl);
			}
		}

		$("#styleToogle").click(function() {
			streetsStyle = !streetsStyle;
			if (streetsStyle) {
				$("#styleToogle").attr("src","/images/photoStyle.png");
			} else {
				$("#styleToogle").attr("src","/images/streetStyle.png");
			}
			changeMapStyle(streetsStyle);
		});

		$("#finishEdition").click(function() {
			setCookie("callback-at", "", 365);
		});

		$("#qrcode").on('click',function(e){
			var url = getAppDomain() + "app.php?game=" + game.id;

			var apiUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(url) + "&choe=UTF-8";

			var img = $("#qr-viewer img");
			img.attr("src", apiUrl);
			$("#qr-viewer").modal('show');
			return false;
		});

		console.log(game.toGLPJSON());

	</script>
</body>
</html>