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

	$master = isset($_REQUEST['master']) ? true : false;

	$bd = Db::getInstance();

	$q = "SELECT * FROM plot WHERE archived != 1 AND (public = 1 OR user_id = " . $user["id"] . " OR user_id IS NULL OR user_id = 0) ORDER BY id DESC";

	if ($master) {
		$q = "SELECT * FROM plot WHERE archived != 1 ORDER BY id DESC";
	}

    $query = $bd->ejecutar($q);

	$numRows = $bd->num_rows($query);

	$plots = array();
	$tab = isset($_REQUEST['tab']) ? $_REQUEST['tab'] : "";

 	if ($query) {
 		for($i = 0; $i < $numRows; $i++){
			$row = $bd->obtener_fila($query, $i);
			$plots[] = $row;
 		}
    }else {
    	echo mysqli_error();
    }
?>
<html>
<head>
	<script src="https://use.fontawesome.com/bb1c86f444.js"></script>
	
	<script src="js/lib/jquery-1.12.4.js"></script>

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/moment.min.js"></script>
	<script src="js/lib/jquery.ellipsis.min.js"></script>


	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">

	<link rel="stylesheet" href="css/cacat.css">
	<link rel="stylesheet" href="css/desktop.css">

	<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
	<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
</head>
<body>

	<header class="header">
		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li class="active"><span><?= l("desktop"); ?></span></li>
				</ol>
			</div>
		</div>
	</header>

	<div>
	  	<!-- Nav tabs -->
	  	<ul class="nav nav-tabs" role="tablist">
	    	<li role="presentation" class="active notlast"><a href="#mygames" aria-controls="mygames" role="tab" data-toggle="tab"><?= l("my_games"); ?></a></li>
	    	<li role="presentation"><a id="communitytab" href="#community" aria-controls="community" role="tab" data-toggle="tab"><?= l("community_games"); ?></a></li>
	  	</ul>

	</div>

	<div class="container">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong><?= l("description"); ?>: </strong><?= l("index_description"); ?></p>
		</div>
	</div>

	<div class="container games">
		<!-- Tab panes -->
	  	<div class="tab-content">
	    	<div role="tabpanel" class="tab-pane active" id="mygames">
	    	</div>
	    	<div role="tabpanel" class="tab-pane" id="community">
			</div>
		</div>
		
	</div>
	<div class="remove-warning modal fade" id="remove-warning" tabindex="-1" role="dialog" aria-labelledby="remove-warning">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b><?= l("warning"); ?></b></h4>
				<hr>
				<p><?= l("shure_remove"); ?></p>
				<div id="remove-buttons">
					<a class="warningBtn warning-action-remove"><?= l("yes"); ?></a>
					<a class="warningBtn warning-action-cancel"><?= l("no"); ?></a>
				</div>
			</div>
		</div>
	</div>

	<footer class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="col-md-12">
				<a id="newGame" class="orangeBtn" href="plots.php">+ <?= l("new_game"); ?></a>
				<div id="saving"><?= l("saving"); ?></div>
			</div>
		</div>
	</footer>

	<script>
		var strings = <?= json_encode($GLOBALS["strings"]); ?>;
		var userId = <?= $user["id"]; ?>;
		var userName = "<?= $user["username"]; ?>";
		var master = <?= $master ? 1 : 0; ?>;
	</script>

	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/parse.js"></script>
	<script src="js/save.js"></script>
	<script src="js/remove.js"></script>
	<script src="js/duplicate.js"></script>
	<script >
		var games = [];
		var plots = <?= json_encode($plots); ?>;

		for (var index in plots){
			games.push(parsePlotJSON(plots[index]));
		}

		function hide_description() {
		    $('.navbar-fixed-bottom .description').animate({ height: '0' }).promise().done( function() {$('.navbar-fixed-bottom .description').hide()});
		}

		var tab = "<?= $tab; ?>";

	</script>
	<script src="js/game.js"></script>
</body>
</html>