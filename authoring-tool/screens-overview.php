<?php

	error_reporting(0);

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	require 'class/db.class.php';
	require 'class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$id = $_REQUEST['id'];

    $query = $bd->ejecutar("SELECT * FROM poi WHERE id = " . $id);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$poi = $bd->obtener_fila($query, 0);
    }else {
      echo mysql_error();
    }

    $query = $bd->ejecutar("SELECT * FROM screen WHERE poi = " . $id . " ORDER BY id ASC");
	$numRows = $bd->num_rows($query);

	$screens = array();
 	if ($query) {
		while(($row =  mysql_fetch_assoc($query))) {
		    $screens[] = $row;
		}
    }else {
      echo mysql_error();
    }

?>
<html>
<head>

	<script src="https://use.fontawesome.com/bb1c86f444.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">

	<script src="js/lib/jquery-1.12.4.js"></script>
	<script src="js/lib/jquery-ui.js"></script>

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>

	<link rel="stylesheet" href="css/cacat.css">
	<link rel="stylesheet" href="css/poi-preview.css">

</head>
<body>

	<header class="header">
		<nav class="navbar navbar-default">
		  <div class="container-fluid">
		    <div class="navbar-header">
				<a class="navbar-brand" href="./">
					<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
				</a>
		    </div>
		  </div>
		</nav>

		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li><a href="./"><span>Desktop</span></a></li>
					<li><span>Select plot</span></li>
					<!--TODO href depenent del joc...-->
					<li><a class="endEditing" href="../follow-the-path.php"><span>Edit game</span></a></li>
					<li class="active"><span>Edit POI</span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container-fluid wideDescription">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong>Description: </strong>Preview the content of the screens that students will see on the app when arriving to a POI during the game. "Challenge description" screen shows a description of the POI and the challenge. "Challenge screen" shows the challenge that the student have to overcome when arriving at the POI. "Result screen" shows the result of the challenge: reward points, items collected, etc.</p>
		</div>
	</div>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-2 attribute">
				<p class="attrTitle">Name of the POI</p>
				<input id="poiName" class="attrValue" type="text">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Reward Points</p>
				<input id="poiReward" class="attrValue" type="number">
			</div>
			<div id ="triggerContainer" class="col-md-2 attribute">
				<p class="attrTitle">Trigger distance (meters)</p>
				<input id="poiTriggerDistance" class="attrValue" type="number">
			</div>
			<div class="col-md-6 attribute">
				<p class="attrTitle">Collectable item</p>
				<input id="poiImage" class="attrValue" type="file" accept="image/*">
			</div>
		</div>

		<div class="row" id="screens">

		</div>
	</div>

	<div class="stop-editor modal fade" id="stop-edit" tabindex="-1" role="dialog" aria-labelledby="stop-editor">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="exampleModalLabel">Editing Stop:</h4>
				</div>
				<div class="modal-body">
					<div id="stop-editor-content">
						<div class="col-md-6">
						<!-- PREVIEW -->
							<div id="stop-editor-preview">

				            </div>
						</div>
						<div class="col-md-6">
							<form id="stop-editor-form">

							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="qr-viewer modal fade" id="qr-viewer" tabindex="-1" role="dialog" aria-labelledby="qr-viewer">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				 <image src="images/geomotion-qr.png">
			</div>
		</div>
	</div>

	<footer class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="col-md-12">
				<!-- FER EL LINK ON TOCA amb el ?id=XX -->
				<a class="endEditing" class="orangeBtn" href="../follow-the-path.php">Finish edition</a>	
				<a id="qrcode" class="blueBtn">Generate QR Code</a>
				<div id="saving">Saving...</div>
			</div>
		</div>
	</footer>

	<script src="js/utils.js"></script>
	<script src="js/models.js"></script>
	<script src="js/screen-editor.js"></script>
	<script>

		$(".preview-screen.clickable").on('click',function(e){
	        var screen_index = $(this).attr("data-index");
	        showEditorScreen(screen_index, 0);
	    });

	    $("#qrcode").on('click',function(e){
	    	$("#qr-viewer").modal('show');
	    	return false;
	    });

	    var resultPOI = <?= json_encode($poi); ?>;
	    var resultScreens = <?= json_encode($screens); ?>;
		var poi = parsePOI(resultPOI);
		var screens = parseScreens(resultScreens);
		
		showScreensOverview();
		init();
	</script>

</body>
</html>