<?php
	require 'class/db.class.php';
	require 'class/conf.class.php';

	error_reporting(E_ERROR | E_PARSE);

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	$bd = Db::getInstance();

	$query = $bd->ejecutar("select * from minigames");
	$result = $bd->obtener_fila($query, 0);
	$minigameID = $result["id"];
	$minigameResult = $result["minigame"];
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
					<a class="navbar-brand" href="/">
						<img alt="Brand" style="padding: 8px;" src="images/beaconing_logo.png">
					</a>
				</div>
			</div>
		</nav>
	</header>

	<div>
	  	<!-- Nav tabs -->
	  	<ul class="nav nav-tabs" role="tablist">
	    	<li role="presentation" class="active notlast"><a href="#mygames" aria-controls="mygames" role="tab" data-toggle="tab">My games</a></li>
	    	<li role="presentation"><a href="#community" aria-controls="community" role="tab" data-toggle="tab">Community games</a></li>
	  	</ul>

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

	<footer class="navbar-fixed-bottom">
		<div class="container">
			<div class="col-md-8 ">
				<div class="footerText">
					<p class="footerTitle"><b>Description:</b></p>
					<p class="footerDescription">With location-based challenges students discover and interact with real-world places in a playful learning experience. Create your own games or reuse the ones created by the community. Let's go!</p>
				</div>
			</div>
			<div class="col-md-4">
				<a id="newGame" href="plots.php">+ New Game</a>
			</div>
		</div>
	</footer>

	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script >
		var games = [];
		//TODO: foreach de cada minijuego, en vez de solo el primero
		var result = <?= json_encode($minigameResult); ?>;
		var id = <?= $minigameID ?>;
		console.log(result);
		games.push(parseMinigameJSON(id, result));
		console.log(games);
	</script>
	<script src="js/game.js"></script>
</body>
</html>