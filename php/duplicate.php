<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

require 'duplication.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = intval($_REQUEST['id']);
$callback = isset($_REQUEST['callback']) ? $_REQUEST["callback"] : "";

$query = sprintf("SELECT * FROM plot WHERE id=%d", $id);
$res = $bd->ejecutar($query);
$res->data_seek($row); 
$datarow = $res->fetch_array();

$name 		 = $datarow["name"];
$description = $datarow["description"];
$time 		 = $datarow["time"];
$type 		 = $datarow["type"];
$public 	 = $datarow["public"];

$newid = duplicatePlot($id, $name, $description, $time, $type, $public, $bd);

if ( $newid != null ) {
	$game_type = $type == "FollowThePath" ? "follow-the-path" : "treasure-hunt";
	if ($callback == ""){
		header("Location: https://" . $_SERVER["SERVER_NAME"] . "/" . $game_type . ".php?id=" . $newid );
	} else {
		header("Location: https://" . $_SERVER["SERVER_NAME"] . "/" . $game_type . ".php?id=" . $newid . "&callback=" . $callback);
	}
} else {
	echo "game plot not created";
}
?>
