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

    $query = $bd->ejecutar("SELECT * FROM plot WHERE archived != 1 ORDER BY id DESC");
	$numRows = $bd->num_rows($query);

	$plots = array();

 	if ($query) {
 		for($i = 0; $i < $numRows; $i++){
			$row = $bd->obtener_fila($query, $i);
			$plots[] = $row;
 		}
    }else {
      echo mysql_error();
    }
?>
<html>
<head>
	<script src="https://use.fontawesome.com/bb1c86f444.js"></script>
	
	<script src="js/lib/jquery-1.12.4.js"></script>

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>

	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">

	<link rel="stylesheet" href="css/cacat.css">
	<link rel="stylesheet" href="css/desktop.css">

	<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
	<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
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
					<li class="active"><span>Desktop</span></li>
				</ol>
			</div>
		</div>

	</header>

	<div>
	  	<!-- Nav tabs -->
	  	<ul class="nav nav-tabs" role="tablist">
	    	<li role="presentation" class="active notlast"><a href="#mygames" aria-controls="mygames" role="tab" data-toggle="tab">My games</a></li>
	    	<li role="presentation"><a href="#community" aria-controls="community" role="tab" data-toggle="tab">Community games</a></li>
	  	</ul>

	</div>

	<div class="container">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong>Description: </strong>With location-based challenges students discover and interact with real-world places in a playful learning experience. Create your own games or reuse the ones created by the community. Let's go!</p>
		</div>
	</div>

	<div class="container games">
		<!-- Tab panes -->
	  	<div class="tab-content">
	    	<ul role="tabpanel" class="tab-pane active" id="mygames">
	    	</ul>
	    	<ul role="tabpanel" class="tab-pane" id="community">
			</ul>
		</div>
		
	</div>
	<div class="remove-warning modal fade" id="remove-warning" tabindex="-1" role="dialog" aria-labelledby="remove-warning">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<h4><b>Warning!</b></h4>
				<hr>
				<p>Are you sure you want to remove this game?</p>
				<a class="warningBtn warning-action-remove">Yes</a>
				<a class="warningBtn warning-action-cancel">No</a>
			</div>
		</div>
	</div>

	<footer class="navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="col-md-12">
				<a id="newGame" class="orangeBtn" href="plots.php">+ New Game</a>
				<div id="saving">Saving...</div>
			</div>
		</div>
	</footer>

	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script >
		var games = [];
		var plots = <?= json_encode($plots); ?>;

		for(var index in plots){
			games.push(parsePlotJSON(plots[index]));
		}

		function hide_description() {
		    $('.navbar-fixed-bottom .description').animate({ height: '0' }).promise().done( function() {$('.navbar-fixed-bottom .description').hide()});
		}
	</script>
	<script src="js/game.js"></script>
</body>
</html>