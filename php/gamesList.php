<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	header("Access-Control-Allow-Origin: *");

	error_reporting(E_ALL);

	require '../class/db.class.php';
	require '../class/conf.class.php';

	setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
	date_default_timezone_set('Europe/Madrid');

	if (!isset($_REQUEST['type'])) { die; }
	$userFilter = isset($_REQUEST['user']) ? "AND (user_id = " . $_REQUEST["user"] . " OR user_id IS NULL)" : "";

	$bd = Db::getInstance();

	$gameType = $_REQUEST['type'] == "th" ? "TreasureHunt" : "FollowThePath";

	$query = $bd->ejecutar(sprintf("SELECT id, name FROM plot WHERE type='%s' AND archived = 0 %s ORDER BY name ASC", $gameType, $userFilter));

 	if ($bd->num_rows($query) > 0) {
 		$pois = array();

 		while ($row = mysqli_fetch_assoc($query)) {
		    $pois[$row["id"]] = $row["name"];
		}

		echo json_encode($pois);
    } else {
      	echo mysqli_error();
    }
?>