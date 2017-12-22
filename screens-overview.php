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

	// POI
    $query = $bd->ejecutar("SELECT * FROM poi WHERE id = " . $id);

 	if ($query) {
		$poi = $bd->obtener_fila($query, 0);
    }else {
      echo mysqli_error($bd->link);
    }

    // PLOT
    $plotId = $poi["plot"];
    $query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $plotId);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$plot = $bd->obtener_fila($query, 0);
    }else {
      echo mysqli_error($bd->link);
    }

    // SCREENS
    $query = $bd->ejecutar("SELECT * FROM screen WHERE poi = " . $id . " ORDER BY id ASC");
	$numRows = $bd->num_rows($query);

	$screens = array();
 	if ($query) {
		while(($row = mysqli_fetch_assoc($query))) {
		    $screens[] = $row;
		}
    }else {
      echo mysqli_error($bd->link);
    }

    // TOTAL REWARD POINTS

    $query = $bd->ejecutar("SELECT SUM(rewardPoints) AS total FROM poi WHERE plot = " . $plotId);
    $sum = 0;
    if($query){
    	$row = mysqli_fetch_assoc($query);
		$sum = $row['total'];
    }else{
    	echo mysqli_error($bd->link);
    }

    // GET TEAM

    if(isset($poi["team"])){

	    $query = $bd->ejecutar("SELECT * FROM team WHERE id = ". $poi["team"] .";");

	 	if ($query) {
			$team = $bd->obtener_fila($query, 0);
	    }else {
	      	echo mysqli_error($bd->link);
	    }

	    // GET TEAM NUMBER

	    $query = $bd->ejecutar("SELECT * FROM team WHERE plot = ". $plot["id"] .";");
		$numRows = $bd->num_rows($query);

		$teams = array();
	 	if ($query) {
			while(($row =  mysqli_fetch_assoc($query))) {
			    $teams[] = $row;
			}
	    }else {
	      echo mysqli_error($bd->link);
	    }

	    $index = 0;
	    $found = false;

	    while($index < $numRows && !$found){
	    	if($teams[$index]["id"] == $poi["team"]){
	    		$found = true;
	    	}else $index++;
	    }

	    $teamNumber = $index + 1;
	}

?>
<html>
<head>

	<script src="https://use.fontawesome.com/bb1c86f444.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">

	<script src="js/lib/jquery-1.12.4.js"></script>
	<script src="js/lib/jquery-ui.js"></script>

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>
	
	<script src="js/lib/Autolinker.min.js"></script>

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>

	<link rel="stylesheet" href="css/cacat.css">
	<link rel="stylesheet" href="css/poi-preview.css">

</head>
<body>

	<header class="header">
		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li><a href="./"><span>Desktop</span></a></li>
					<li><span>Select plot</span></li>
					<!--TODO href depenent del joc...-->
					<li><a class="endEditing" href="../follow-the-path.php"><span>Edit game</span></a></li>
					<li class="active"><span id="editPOIspan">Edit POI</span></li>
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
			<div id="nameContainer" class="col-md-2 attribute">
				<p class="attrTitle">Name of the POI</p>
				<input id="poiName" class="attrValue" type="text" maxlength="25">
			</div>
			<div id="rewardContainer" class="col-md-2 attribute">
				<p class="attrTitle">Reward Points (max 1000000)</p>
				<input id="poiReward" class="attrValue" type="number" max="1000000">
			</div>
			<div id="triggerContainer" class="col-md-2 attribute">
				<p class="attrTitle">Trigger distance (meters)</p>
				<input id="poiTriggerDistance" class="attrValue" type="number">
			</div>
			<div id="itemNameContainer" class="col-md-2 attribute">
				<p class="attrTitle">Collectable item name</p>
				<input id="itemName" class="attrValue" type="text" placeholder="Item Name" maxlength="25">
			</div>
			<div id="imageContainer" class="col-md-4 attribute">
				<p class="attrTitle">Collectable item (Formats: JPG JPEG PNG GIF; Max 300kb)</p>
				<div class="row">
                    <div class="col-md-12">
                        <input id="poiImage" class="attrValue" type="file" accept="image/*">
                       	<i class="fa fa-times fa-2x" id="removeImageC" aria-hidden="true" title="Remove Image"></i>
                    </div>
                </div>
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
				 <image src="">
			</div>
		</div>
	</div>

	<div class="fileSizeWarning modal fade" id="fileSizeWarning" tabindex="-1" role="dialog" aria-labelledby="fileSizeWarning">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b>Warning!</b></h4>
				<hr>
				<p class="fileSizeWarningMessage">The image exceeds the 300kb limit</p>
				<a class="warningBtn fileSizeWarning-close">Ok</a>
			</div>
		</div>
	</div>

	<div class="uploadingVideo modal fade" id="uploadingVideo" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="uploadingVideo">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b>Uploading...</b></h4>
				<hr>
				<p class="uploadingVideoMessage">Please wait until your video is fully uploaded.</p>
				<img src="images/uploading.gif">
			</div>
		</div>
	</div>

	<footer class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="col-md-12">
				<a class="endEditing orangeBtn" href="../follow-the-path.php">Finish POI edition</a>	
				<a id="qrcode" class="blueBtn">Generate QR Code</a>
				<div id="saving">Saving...</div>
			</div>
		</div>
	</footer>

	<script src="js/utils.js"></script>
	<script src="js/parse.js"></script>
	<script src="js/save.js"></script>
	<script src="js/remove.js"></script>
	<script src="js/duplicate.js"></script>
	<script src="js/models.js"></script>
	<script src="js/screen-editor.js"></script>
	<script>

		$(".preview-screen.clickable").on('click',function(e){
	        var screen_index = $(this).attr("data-index");
	        showEditorScreen(screen_index, 0);
	    });


	    $("#qrcode").on('click',function(e){
 	    	var url = getAppDomain() + "app.php?game=" + game.id +"&device=browser&teleport=" + poi.id;
 	    	console.log(url);
	    	var apiUrl =  "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(url) + "&choe=UTF-8";
	    	console.log(apiUrl)

	    	var img = $("#qr-viewer img");
	    	img.attr("src", apiUrl);
	    	$("#qr-viewer").modal('show');
	    	return false;
	    });

		var teams = [];

	    var resultPOI = <?= json_encode($poi); ?>;
	    var resultPlot = <?= json_encode($plot); ?>;
	    var resultScreens = <?= json_encode($screens); ?>;

		var poi = parsePOI(resultPOI);
		var screens = parseScreens(resultScreens);
		var game = parsePlotJSON(resultPlot);
		var totalRewardPoints = <?= $sum; ?>;

		var minigames = [];
		
		<?php if($team){ ?>
		var resultTeam = <?= json_encode($team); ?>;
		var teamNumber = <?= $teamNumber ?>;
		var team = parseTeam(resultTeam);
		<?php } ?>

		if(poi.type == "start" || poi.type == "finish") $("#qrcode").hide();

	 	getMinigames(function(m){
	        minigames = m;
			showScreensOverview();
			init();
	    });
	</script>

</body>
</html>