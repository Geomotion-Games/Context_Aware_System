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
	//var_dump($result);
	$minigameID = $result["id"];
	$minigameResult = $result["minigame"];
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
				<a class="navbar-brand" href="index.php">
					<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
				</a>
		    </div>
		  </div>
		</nav>
	</header>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-2 attribute">
				<p class="attrTitle">Name of the POI</p>
				<input class="attrValue" type="text">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Reward Points</p>
				<input class="attrValue" type="number">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Trigger distance (meters)</p>
				<input class="attrValue" type="number">
			</div>
			<div class="col-md-6 attribute">
				<p class="attrTitle">Collectable item</p>
				<input class="attrValue" type="file" accept="image/*">
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

	<footer>
		<div class="container">
			<div class="col-md-8 ">
				<div class="footerText">
					<p class="footerTitle"><b>Description:</b></p>
					<p class="footerDescription">Preview the content of the screens that students will see on the app when arriving to a POI during the game. "Challenge description" screen shows a description of the POI and the challenge. "Challenge screen" shows the challenge that the student have to overcome when arriving at the POI. "Result screen" shows the result of the challenge: reward points, items collected, etc. You can add as many screens you need to make the experience awesome!</p>
				</div>
			</div>
			<div class="col-md-4">
				<a id="qrcode" style="cursor:pointer;">Generate QR Code</a>
				<a id="endEditing" href="index.php">Finish edition</a>
			</div>
		</div>
	</footer>

	<script src="js/utils.js"></script>
	<script src="js/models.js"></script>
	<script src="js/screen-editor.js"></script>
	<script>
		poisCreated = 2;
		points[0]   = new Step({marker: 0, idNumber: 0});
		points[999] = new Step({marker: 0, idNumber: 999});
		showScreensOverview(0);

		$(".preview-screen.clickable").on('click',function(e){
	        var screen_index = $(this).attr("data-index");
	        showEditorScreen(screen_index, 0);
	    });

	    $("#qrcode").on('click',function(e){
	    	$("#qr-viewer").modal('show');
	    	return false;
	    });

	    var result = <?= json_encode($minigameResult); ?>;
		var id = <?= $minigameID ?>;
		console.log(result);
		var games = [];
		games.push(parseMinigameJSON(id, result));
		console.log(games);

	</script>

</body>
</html>