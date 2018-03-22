<?php
	//error_reporting(E_ALL);
	//ini_set('display_errors', 1);
	ini_set('display_errors', 0);

	include("php/handleAccessToken.php");

	$auth = new HandleAccessToken();
	$user = $auth->currentUser();

	include("php/multilanguage.php");
	loadlang($user["language"]);
?>


<html>
<head>
	<script src="js/lib/jquery-1.12.4.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Raleway:400,700" rel="stylesheet">

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<script src="js/lib/bootstrap.min.js"></script>
	<link rel="stylesheet" href="css/cacat.css"/>
	<link rel="stylesheet" href="css/plots.css"/>
</head>
<body>
	<header class="header">
		<div class="container-fluid">
			<div class="row">
				<ol class="breadcrumb">
					<li><a href="./"><span><?= l("desktop"); ?></span></a></li>
					<li class="active"><span><?= l("select_plot"); ?></span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong><?= l("description"); ?>: </strong><?= l("select_plot_description"); ?></p>
		</div>
	</div>

	<div class="container">
		<div class="official-row">
			<div class="row">
				<div class="col-md-6 col-sm-6 gameType">
					<div id="FollowThePath" class="plot">
						<div class="zoomOnHover image">
							<img src="images/plots/follow-the-path.jpg">
						</div>
						<div class="POIdescription">
							<p><?= l("follow_the_path_description"); ?></p>
						</div>
					</div>
					<h2>Follow the Path</h2>
				</div>
				<div class="col-md-6 col-sm-6 gameType">
					<div id="TreasureHunt" class="plot">
						<div class="zoomOnHover image">
							<img src="images/plots/treasure-hunt.jpg">
						</div>
						<div class="POIdescription">
							<p style="font-size: 0.94em;"><?= l("treasure_hunt_description"); ?></p>
						</div>
					</div>
					<h2>Treasure Hunt</h2>
				</div>
			</div>
		</div>
	</div>
	<script>
		var userId = <?= $user["id"]; ?>;
		var userName = "<?= $user["username"]; ?>";
		var strings = <?= json_encode($GLOBALS["strings"]); ?>;
	</script>
	<script src="js/models.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/parse.js"></script>
	<script src="js/save.js"></script>
	<script src="js/remove.js"></script>
	<script src="js/duplicate.js"></script>
	<script src="js/plot.js"></script>
</body>
</html>