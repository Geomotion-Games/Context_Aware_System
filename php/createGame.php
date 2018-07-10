<?php

header("Access-Control-Allow-Origin: *");

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

if (!isset($_REQUEST['type'])) { die; }

$name = "Game name";
$description = "Game description";
$time = 0;
$type = $_REQUEST['type'] == "th" ? "TreasureHunt" : ($_REQUEST['type'] == "ftp" ? "FollowThePath" : die);
$url_php = $_REQUEST['type'] == "th" ? "treasure-hunt" : "follow-the-path";
$single_poi = isset($_REQUEST['singlePOI']) && $_REQUEST['singlePOI'] == "true";
//$callbackURL = isset($_REQUEST['callbackURL']) ? $_REQUEST['callbackURL'] : null;
//$updateURL = isset($_REQUEST['updateURL']) ? $_REQUEST['updateURL'] : null;
$public = 0;

$query = sprintf("INSERT INTO plot (name, description, time, type, public, singlepoi, origin) VALUES ('%s','%s',%d,'%s',%d,%b,'atglp')",
	$bd->mysqli_real_escape_string($name),
	$bd->mysqli_real_escape_string($description),
	intval($time),
	$bd->mysqli_real_escape_string($type),
	intval($public),
	boolval($single_poi));

$res = $bd->ejecutar($query);
$lastId = mysqli_insert_id($bd->link);
$response = array();
$response["success"] = true;
$response["newGameID"] = $lastId;
createDefaultPois($lastId, "start", $bd);
createDefaultPois($lastId, "finish", $bd);
$json = json_encode($response);
echo $json;
//header("Location: https://" . $_SERVER["SERVER_NAME"] . "/" . $url_php . ".php?id=" . $lastId);

function createDefaultPois($plotId, $type, $bd){

	$query = sprintf("INSERT INTO poi (plot, type, lat, lng, triggerDistance) VALUES (%d,'%s',0,0,20)", 
		intval($plotId),
		$bd->mysqli_real_escape_string($type));

	$res = $bd->ejecutar($query);
	//echo mysqli_error($bd->link);
	createDefaultScreens(mysqli_insert_id($bd->link), $bd);
}

function createDefaultScreens($id, $bd){
	$screensData = array('{"type":"A","title": "The Robot", "text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready?"}');
	foreach ($screensData as $data) {
		$query = "INSERT INTO screen (poi, data) VALUES ('$id','$data')";
		$res = $bd->ejecutar($query);
	}
	
	//echo mysqli_error($bd->link);
}

?>