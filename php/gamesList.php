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

	$bd = Db::getInstance();

	$numRows = 0;
	if ($_REQUEST['type'] == "ftp") {
    	$query = $bd->ejecutar("SELECT id, name FROM plot WHERE type='FollowThePath' ORDER BY id DESC");
    	$numRows = $bd->num_rows($query);
	}
	else if ($_REQUEST['type'] == "th") {
    	$query = $bd->ejecutar("SELECT id, name FROM plot WHERE type='TreasureHunt' ORDER BY id DESC");
    	$numRows = $bd->num_rows($query);
	}

 	if ($numRows > 0) {
 		$pois = array();

 		while ($row = mysqli_fetch_assoc($query)) {
		    $pois[$row["id"]] = $row["name"];
		}

		$json = json_encode($pois);
		echo str_replace(' ', '', $json);
    }else {
      	echo mysqli_error();
    }
?>