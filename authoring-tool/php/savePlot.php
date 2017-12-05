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
	$query = "INSERT INTO plot (name, description, time, type, public) VALUES ('$name','$description','$time','$type','$public')";
	$res = $bd->ejecutar($query);
	$lastId = mysqli_insert_id($bd->link);
	echo $lastId;
	createDefaultPois($lastId, "start", $bd);
	createDefaultPois($lastId, "finish", $bd);
} else {
	$query = "UPDATE plot SET name='$name', description='$description', time='$time', type='$type', public='$public' WHERE id=$id";
	$res = $bd->ejecutar($query);
	echo mysqli_error($bd->link);
	echo $id;
}

function createDefaultPois($plotId, $type, $bd){
	$query = "INSERT INTO poi (plot, type, lat, lng, triggerDistance) VALUES ('$plotId','$type',0,0,20)";
	$res = $bd->ejecutar($query);
	echo mysqli_error($bd->link);
	createDefaultScreens(mysqli_insert_id($bd->link), $bd);
}

function createDefaultScreens($id, $bd){
	$screensData = array('{"type":"A","title": "The Robot", "text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready?"}');
	foreach ($screensData as $data) {
		$query = "INSERT INTO screen (poi, data) VALUES ('$id','$data')";
		$res = $bd->ejecutar($query);
	}
	
	echo mysqli_error($bd->link);
}

?>