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

	require 'class/db.class.php';
	require 'class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$id = $_REQUEST['id'];

	// POI
    $query = $bd->ejecutar("SELECT * FROM poi WHERE id = " . $id);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$poi = $bd->obtener_fila($query, 0);
    }else {
      echo mysqli_error();
    }

    // PLOT
    $plotId = $poi["plot"];
    $query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $plotId);
	$numRows = $bd->num_rows($query);

 	if ($query) {
		$plot = $bd->obtener_fila($query, 0);
    } else {
      echo mysqli_error();
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
      echo mysqli_error();
    }

    // TOTAL REWARD POINTS

    $query = $bd->ejecutar("SELECT SUM(rewardPoints) AS total FROM poi WHERE plot = " . $plotId);
    $sum = 0;
    if($query){
    	$row = mysqli_fetch_assoc($query);
		$sum = is_null($row['total']) ? 0 : $row['total'];
    }else{
    	echo mysqli_error();
    }
?>
<html>
<head>

	<script src="app/js/cooking-machine.js"></script>
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
					<li><a href="./"><span><?= l("desktop"); ?></span></a></li>
					<li><span><?= l("select_plot"); ?></span></li>
					<!--TODO href depenent del joc...-->
					<li><a class="endEditing" href="../follow-the-path.php"><span><?= l("edit_game"); ?></span></a></li>
					<li class="active"><span><?= l("edit_poi"); ?></span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container-fluid wideDescription">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong><?= l("description"); ?>: </strong><?= l("edit_poi_description"); ?></p>
		</div>
	</div>

	<div class="container-fluid">
		<div id="attributes" class="row">
			<div id="nameContainer" class="col-md-2 attribute">
				<p class="attrTitle"><?= l("name_poi"); ?></p>
				<input id="poiName" class="attrValue" type="text" maxlength="25">
			</div>
			<div id="rewardContainer" class="col-md-2 attribute">
				<p class="attrTitle"><?= l("reward_points"); ?></p>
				<input id="poiReward" class="attrValue" type="number" max="1000000">
			</div>
			<div id="triggerContainer" class="col-md-2 attribute">
				<p class="attrTitle"><?= l("trigger_distance"); ?></p>
				<input id="poiTriggerDistance" class="attrValue" type="number">
			</div>
			<div id="itemNameContainer" class="col-md-2 attribute">
				<p class="attrTitle"><?= l("collectable_name"); ?></p>
				<input id="itemName" class="attrValue" type="text" placeholder="<?= l("item") ?>" maxlength="25">
			</div>
			<div id="imageContainer" class="col-md-4 attribute">
				<p class="attrTitle"><?= l("item_formats"); ?></p>
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
					<h4 class="modal-title" id="exampleModalLabel"><?= l("editing_stop"); ?>:</h4>
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
				<h4><b><?= l("warning"); ?></b></h4>
				<hr>
				<p class="fileSizeWarningMessage"><?= l("image_exceeds"); ?></p>
				<a class="warningBtn fileSizeWarning-close"><?= l("ok"); ?></a>
			</div>
		</div>
	</div>

	<div class="fileSizeWarning modal fade" id="minigameSelectedWarning" tabindex="-1" role="dialog" aria-labelledby="minigameSelectedWarning">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b><?= l("warning"); ?></b></h4>
				<hr>
				<p class="fileSizeWarningMessage"><?= l("challenges_must"); ?></p>
				<a class="warningBtn fileSizeWarning-close"><?= l("ok"); ?></a>
				<input type="checkbox" id="dontshowagain" onclick="dontShowChallengeWarning()">
				<?= l("dont_show_again"); ?>
			</div>
		</div>
	</div>

	<div class="uploadingVideo modal fade" id="uploadingVideo" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="uploadingVideo">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b><?= l("uploading"); ?></b></h4>
				<hr>
				<p class="uploadingVideoMessage"><?= l("wait_video_uploaded"); ?></p>
				<img src="images/uploading.gif">
			</div>
		</div>
	</div>

	<footer class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="col-md-12">
				<a class="endEditing orangeBtn" href="../follow-the-path.php"><?= l("finish_poi_edition"); ?></a>	
				<a id="qrcode" class="blueBtn"><?= l("qr_code"); ?></a>
				<div id="saving"><?= l("saving"); ?>...</div>
			</div>
		</div>
	</footer>

	<script>
		var strings = <?= json_encode($GLOBALS["strings"]); ?>;
	</script>

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
 	    	var url = getAppDomain() + "app.php?game=" + game.id +"&teleport=" + poi.id;

	    	var apiUrl =  "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(url) + "&choe=UTF-8";

	    	var img = $("#qr-viewer img");
	    	img.attr("src", apiUrl);
	    	$("#qr-viewer").modal('show');
	    	return false;
	    });

	    var resultPOI = <?= json_encode($poi); ?>;
	    var resultPlot = <?= json_encode($plot); ?>;
	    var resultScreens = <?= json_encode($screens); ?>;
		var poi = parsePOI(resultPOI);
		var screens = parseScreens(resultScreens);
		var game = parsePlotJSON(resultPlot);
		var totalRewardPoints = <?= $sum; ?>;
		var points = [];
		//var minigames = [];

		var updateurl = getCookie("updateurl-at");
		var glpid = getCookie("glpid-at");

		var userId = <?= $user["id"]; ?>;

		if(poi.type == "start" || poi.type == "finish") $("#qrcode").hide();

	 	/*getMinigames(function(m){
	        minigames = m;*/
			showScreensOverview();
			init();
	    //});
	</script>

</body>
</html>