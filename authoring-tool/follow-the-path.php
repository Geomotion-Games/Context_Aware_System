<?php
	require 'class/db.class.php';
	require 'class/conf.class.php';

	error_reporting(E_ERROR | E_PARSE);

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$id = $_REQUEST['id'];

	$query = $bd->ejecutar("select * from minigames where id = " . $id);
	$result = $bd->obtener_fila($query, 0);
	var_dump($result);
	$minigameID = $result["id"];
	$minigameResult = $result["minigame"];
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
				<a class="navbar-brand" href="/">
					<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
				</a>
		    </div>
		  </div>
		</nav>
	</header>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-4 attribute">
				<p class="attrTitle">Game's name:</p>
				<input class="attrValue" type="text">
			</div>
			<div class="col-md-4 attribute">
				<p class="attrTitle">Game's description:</p>
				<input class="attrValue" type="text">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Time</p>
				<input id="timeToggle" class="pubpriv-toggle" type="checkbox" data-toggle="toggle" data-on="Limited" data-off="Unlimited">
			</div>
			<div class="col-md-2 attribute" id="timeLimit" style="visibility: hidden;">
				<p class="attrTitle">Limit</p>
				<input class="attrValue" type="text">
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
				    					<a href="screens-overview.html"><i class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
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
				    					<a href="screens-overview.html"><i class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
				    				</div>
				    			</div>
				    		</div>
				    	</li>
					</ul>

				</div>

				<footer>
					<div>
						<div class="col-md-9">
							<div class="footerText">
								<p class="footerTitle"><strong>Description:</strong></p>
								<p class="footerDescription">Define the basic parameters of your game. Create POI (Points of Interest) clicking on the map, reorder and edit them as you wish and personalize the content of each one with funny challenges.</p>
							</div>
						</div>
						<div class="col-md-3">
							<a id="addBeacon">+ Add Beacon</a>
							<a id="finishEdition" href="">Finish Edition</a>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</div>

	<script src="js/lib/Control.Geocoder.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/models.js"></script>
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
		
		var result = <?= json_encode($minigameResult); ?>;
		var id = <?= $minigameID ?>;
		console.log(result);
		var games = [];
		games.push(parseMinigameJSON(id, result));
		console.log(games);
	</script>
</body>
</html>