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
				<a class="navbar-brand" href="/">
					<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
				</a>
		    </div>
		  </div>
		</nav>
	</header>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div class="col-md-2 attribute">
				<p class="attrTitle">POI's name:</p>
				<input class="attrValue" type="text">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Reward points:</p>
				<input class="attrValue" type="number">
			</div>
			<div class="col-md-2 attribute">
				<p class="attrTitle">Trigger distance:</p>
				<input class="attrValue" type="number">
			</div>
			<div class="col-md-6 attribute">
				<p class="attrTitle">Harvestable item:</p>
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
					<p class="footerDescription">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec</p>
				</div>
			</div>
			<div class="col-md-4">
				<a id="qrcode" style="cursor:pointer;">QR Code</a>
				<a id="endEditing" href="plots.php">End editing</a>
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