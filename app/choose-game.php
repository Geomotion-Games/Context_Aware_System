<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	
	error_reporting(0);

	$device = "app";

	if (isset($_REQUEST['device']) && $_REQUEST['device']) {
		$device = $_REQUEST['device'];
	}
?>

<!DOCTYPE html>
<html>
<head>

	<title>Beaconing - Choose Minigame</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>

	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css" />

</head>
<body>

	<div class="choose-game">
		
		<form id="myForm" onsubmit="gotogame()">
			<p>Enter game id: <input name="gameid" type="text"></p>
  			<p><input type="submit"></p>
		</form>

	</div>

	<style>
		.choose-game {
			text-align: center;
		}

		form {
			padding: 30px;
			border: 1px solid black;
			width: 50%;
			margin: 50px auto;
		}

		input {
			border: 1px solid black;
		    padding: 8px;
		    margin: 10px;
		}

	</style>

	<script>

		var device = "<?= $device; ?>";

		$('#myForm').submit(function(ev) {
		    ev.preventDefault(); // to stop the form from submitting
		    var gameId = document.forms["myForm"]["gameid"].value;
			var url = "https://www.geomotiongames.com/pre/beaconing/app/app.php?game=" + gameId + "&device=" + device;
			window.location.href = url;
		});

	</script>

</body>
</html>