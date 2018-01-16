<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$name = $_REQUEST['name'];
$description = $_REQUEST['description'];
$time = $_REQUEST['time'];
$type = $_REQUEST['type'];
$public = $_REQUEST['public'];

if($id == null){

	$query = sprintf("INSERT INTO plot (name, description, time, type, public) VALUES ('%s','%s',%d,'%s',%d)",
		$bd->mysqli_real_escape_string($name),
		$bd->mysqli_real_escape_string($description),
		intval($time),
		$bd->mysqli_real_escape_string($type),
		intval($public));

	$res = $bd->ejecutar($query);
	$lastId = mysqli_insert_id($bd->link);
	echo $lastId;
	createDefaultPois($lastId, "start", $bd);
	createDefaultPois($lastId, "finish", $bd);
}else{
	
	$query = sprintf("UPDATE plot SET name='%s', description='%s', time=%d, type='%s', public=%d WHERE id=%d",
		$bd->mysqli_real_escape_string($name),
		$bd->mysqli_real_escape_string($description),
		intval($time),
		$bd->mysqli_real_escape_string($type),
		intval($public),
		intval($id));

	$res = $bd->ejecutar($query);
	echo mysqli_error($bd->link);
	echo $id;
}

function createDefaultPois($plotId, $type, $bd){
	$query = sprintf("INSERT INTO poi (plot, type, lat, lng, triggerDistance) VALUES (%d,'%s',0,0,20)",
		intval($plotId),
		$bd->mysqli_real_escape_string($type));

	$res = $bd->ejecutar($query);
	echo mysqli_error($bd->link);
	createDefaultScreens(mysqli_insert_id($bd->link), $bd);
}

function createDefaultScreens($id, $bd){
	$screensData = array('{"type":"A","title": "The Robot", "text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready?"}');
	
	foreach ($screensData as $data) {
		$query = sprintf("INSERT INTO screen (poi, data) VALUES (%d, '%s')",
			intval($id),
			$data);
		$res = $bd->ejecutar($query);
	}
	
	echo mysqli_error($bd->link);
}

?>