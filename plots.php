<?php
	//error_reporting(E_ALL);
	//ini_set('display_errors', 1);
	ini_set('display_errors', 0);

	include("php/handleAccessToken.php");

	$auth = new HandleAccessToken();
	$user = $auth->currentUser();
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
					<li><a href="./"><span>Desktop</span></a></li>
					<li class="active"><span>Select plot</span></li>
				</ol>
			</div>
		</div>
	</header>

	<div class="container">
		<div class="col-md-12 description">
			<p class="descriptionText"><strong>Description: </strong>Select the type of location-based game that best suits your gamified lesson path and pedagogical content. Each type of game have different dynamics, mechanics and minigames to create an awesome playful real-life learning experience</p>
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
							<p>Linear geolocation game where students have to find specific Points of Interest (POI) in the real world. All points are shown in the map from the begining and the winner is the one who arrives first to the last POI.</p>
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
							<p style="font-size: 0.94em;">Non-linear exploratory geolocation game where the goal is to find a hidden treasure in the real world. Individually or in groups, students will have to find clues with relevant information that has to be interpreted to find the final location of the treasure.</p>
						</div>
					</div>
					<h2>Treasure Hunt</h2>
				</div>
				<!--div class="col-md-6 col-sm-6 gameType">
					<div id="RatRace" class="plot plotDisabled">
						<div class="zoomOnHover image">
							<img src="images/plots/rat-race.jpg" style="opacity: 0.6;">
						</div>
						<div class="POIdescription">
							<p>Linear competitive geolocation game where two or more teams of students have to participate on a race. The goal is to be the first to reach the finish line solving challenges on different POI (Points Of Interests).</p>
						</div>
					</div>
					<h2>Rat Race</h2>
				</div-->
				</div>
			</div>
		<!--div class="official-row">
			<div class="row">
				<div class="col-md-4 col-sm-6 gameType">
					<div id="Jigsaw" class="plot plotDisabled">
						<div class="zoomOnHover image">
							<img src="images/plots/jigsaw.jpg" style="opacity: 0.6;">
						</div>
						<div class="POIdescription">
							<p style="font-size: 0.9em;">Linear geolocation game where the goal is to be the first team to arrive to a specific location overcoming challenges in different POI (Point Of Interest). Different teams start the race at different POI and every time a team solves the challenge of a POI a clue to the next one is shown.</p>
						</div>
					</div>
					<h2>Jigsaw</h2>
				</div>
				<div class="col-md-4 col-sm-6 gameType">
					<div id="CaptureTheFlag" class="plot plotDisabled">
						<div class="zoomOnHover image">
							<img src="images/plots/capture-the-flag.jpg" style="opacity: 0.6;">
						</div>
						<div class="POIdescription">
							<p>Non-linear geolocation game where students are teamed up in two different teams. Each team has a base where the flag is allocated. The goal of the game is to capture the enemy's’ flag and bring it to the base.</p>
						</div>
					</div>
					<h2>Capture the flag</h2>
				</div>
				<div class="col-md-4 col-sm-6 gameType">
					<div id="Conquest" class="plot plotDisabled">
						<div class="zoomOnHover image">
							<img src="images/plots/conquest.jpg" style="opacity: 0.6;">
						</div>
						<div class="POIdescription">
							<p>Non-linear geolocation game where students teamed up in different teams have to conquer the real world solving challenges. The first team to conquer a certain number of zones wins the challenge.</p>
						</div>
					</div>
					<h2>Conquest</h2>
				</div>
			</div>
		</div>
		<div class="official-row">
			<div class="row">
				<div class="col-md-4 col-sm-6 gameType">
					<div id="Stratego" class="plot plotDisabled">
						<div class="zoomOnHover image">
							<img src="images/plots/stratego.jpg" style="opacity: 0.6;">
						</div>
						<div class="POIdescription">
							<p style="font-size:0.9em;">Adapted from the board game "Stratego". Non-linear strategy geolocation game where students teamed up in 2 teams. Each player has a role and each team has a base where the flag is allocated. The goal of the game is to capture the enemy's’ flag and bring it to the base.</p>
						</div>
					</div>
					<h2>Stratego</h2>
				</div>
			</div>
		</div-->
		</div>
	<script>
		var userId = <?= $user["id"]; ?>;
		var userName = "<?= $user["username"]; ?>";
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