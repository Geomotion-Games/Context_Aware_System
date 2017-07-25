<?php

	error_reporting(0);

	require 'class/db.class.php';
	require 'class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$id = $_REQUEST['id'];

    $query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $id);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$plot = $bd->obtener_fila($query, 0);
    }else {
      echo mysql_error();
    }

    $query = $bd->ejecutar("SELECT * FROM poi WHERE plot = " . $id . " ORDER BY orderNumber ASC");
	$numRows = $bd->num_rows($query);

	$pois = array();
 	if ($query) {
		while(($row =  mysql_fetch_assoc($query))) {
		    $pois[] = $row;
		}
    }else {
      echo mysql_error();
    }

?><html>
<head>

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

</head>
<body>

	<header class="header">
		<nav class="navbar navbar-default">
		  <div class="container-fluid">
		    <div class="navbar-header">
				<a class="navbar-brand" href="index.php">
					<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
				</a>
		    </div>
		  </div>
		</nav>

		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li><a href="/beaconing"><span>Desktop</span></a></li>
					<li><span>Select plot</span></li>
					<!--TOTO href depenent del joc...-->
					<li class="active"><span>Edit game</span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container-fluid wideDescription">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong>Description: </strong>Define the basic parameters of your game. Create POI (Points of Interest) clicking on the map, reorder and edit them as you wish and personalize the content of each one with funny challenges.</p>
		</div>
	</div>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-3 attribute">
				<p class="attrTitle">Name of the Game</p>
				<input id="gameName" class="attrValue" type="text">
			</div>
			<div class="col-md-4 attribute">
				<p class="attrTitle">Description of the game (max. 100 characters)</p>
				<input id="gameDescription" class="attrValue" type="text">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Time limit</p>
				<input id="timeToggle" class="pubpriv-toggle gameTimeActive" type="checkbox" data-toggle="toggle" data-on="Limited" data-off="Unlimited">
			</div>
			<div class="col-md-3 attribute" id="timeLimit" style="visibility: hidden;">
				<p class="attrTitle">Time to complete the game (in minutes)</p>
				<input id="gameTimeValue" class="attrValue" type="text">
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="section">
					<div class="block-left">
						<div id='map' class="element"></div>
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
				    					<p><span class="name poiTitle" style="margin: 0;">START</span></p>
				    					<p class="poiType">[%description of start%]</p>
				    				</div>
				    				<div class=poiActions>
				    					<a href="screens-overview.php?id=0"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
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
				    					<p><span class="name poiTitle" style="margin: 0;">FINISH</span></p>
				    					<p class="poiType">[%description of finish%]</p>
				    				</div>
				    				<div class=poiActions>
				    					<a href="screens-overview.php?id=0"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
				    				</div>
				    			</div>
				    		</div>
				    	</li>
					</ul>

				</div>

				<footer class="navbar-fixed-bottom">
					<div class="container-fluid">
						<div class="col-md-12">
							<a id="finishEdition" href="" class="orangeBtn">Finish Edition</a>
							<a id="manageBeacons" class="blueBtn">Manage Beacons</a>
							<a id="addBeacon" class="blueBtn">+ Add Beacon</a>
							<div id="saving">Saving...</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</div>

	<script src="js/lib/Control.Geocoder.js"></script>
	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/follow-the-path.js"></script>
	<script src="js/screen-editor.js"></script>

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

		var game = parsePlotJSON(plot);
		var points = parsePOIS(pois);

		console.log(points);

		init();

	</script>
</body>
</html>