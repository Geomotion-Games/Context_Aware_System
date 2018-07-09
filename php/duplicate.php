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

$datarow = $res->fetch_array();

$name 		 = $datarow["name"];
$description = $datarow["description"];
$time 		 = $datarow["time"];
$type 		 = $datarow["type"];
$public 	 = $datarow["public"];
$user_id 	 = $datarow["user_id"];
$user_name 	 = $datarow["user_name"];

$newid = duplicatePlot($id, $name, $description, $time, $type, $public, $user_id, $user_name, $bd);

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
