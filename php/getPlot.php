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

	$plotId = isset($_REQUEST['plotId']) && ctype_digit($_REQUEST['plotId']) ? $_REQUEST['plotId'] : null;

	$bd = Db::getInstance();

	//For ATGLP Integration
    $inset = '\'%"type":"B"%\'';
    $query = $bd->ejecutar("SELECT p.*, s.data FROM poi as p LEFT JOIN screen as s ON (p.id = s.poi AND s.data LIKE ". $inset .") WHERE plot = " . $plotId . " ORDER BY orderNumber ASC");

//    echo "SELECT p.*, s.data FROM poi as p LEFT JOIN screen as s ON (p.id = s.poi AND s.data LIKE ". $inset .") WHERE plot = " . $plotId . " ORDER BY orderNumber ASC";

	$numRows = $bd->num_rows($query);

	$pois = array();
 	if ($query) {
		while(($row =  mysqli_fetch_assoc($query))) {
			$row["data"] = json_decode($row["data"], true);
		    $pois[] = $row;
		}
    } else {
      	echo mysqli_error();
    }

    echo json_encode($pois);

?>