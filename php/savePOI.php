<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$plot = $_REQUEST['plot'];
$type = $_REQUEST['type'];
$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];
$orderNumber = $_REQUEST['orderNumber'];
$beaconId = $_REQUEST['beaconId'];
$title = $_REQUEST['title'];
$triggerDistance = $_REQUEST['triggerDistance'];
$rewardPoints = $_REQUEST['rewardPoints'];
$item = $_REQUEST['item'];
$itemName = $_REQUEST['itemName'];
$team = $_REQUEST['team'];

if($id == null){

	$query = "";
	if($team != ""){
		$query = "INSERT INTO poi (plot, type, lat, lng, orderNumber, beaconId, title, triggerDistance, rewardPoints, item, team, itemName) VALUES ('$plot','$type','$lat','$lng','$orderNumber','$beaconId','$title','$triggerDistance','$rewardPoints','$item','$team', $itemName')";
	}else{
		$query = "INSERT INTO poi (plot, type, lat, lng, orderNumber, beaconId, title, triggerDistance, rewardPoints, item, itemName) VALUES ('$plot','$type','$lat','$lng','$orderNumber','$beaconId','$title','$triggerDistance','$rewardPoints','$item', $itemName')";
	}
	$res = $bd->ejecutar($query);
	echo mysqli_insert_id($bd->link);
	echo mysqli_error($bd->link);
	createDefaultScreens(mysqli_insert_id($bd->link), $bd);
	$query = "UPDATE plot SET last_update = CURRENT_TIMESTAMP WHERE id ='$plot'";
	$res = $bd->ejecutar($query);
}else{
	$query = "";
	if($team != ""){
		$query = "UPDATE poi SET lat='$lat',lng='$lng',orderNumber='$orderNumber',beaconId='$beaconId',title='$title',triggerDistance='$triggerDistance',rewardPoints='$rewardPoints',item='$item',itemName='$itemName',team='$team' WHERE id=$id";
	}else{
		$query = "UPDATE poi SET lat='$lat',lng='$lng',orderNumber='$orderNumber',beaconId='$beaconId',title='$title',triggerDistance='$triggerDistance',rewardPoints='$rewardPoints',item='$item',itemName='$itemName' WHERE id=$id";
	}
	$res = $bd->ejecutar($query);
	//if(!$res) die(mysql_error());
	echo $id;

	$query = "UPDATE plot SET last_update = CURRENT_TIMESTAMP WHERE id ='$plot'";
	$res = $bd->ejecutar($query);
}

function createDefaultScreens($id, $bd){
	$screensData = array('{"type":"A","title": "The Robot", "text": "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready?"}','{"type":"B"}', "{\"type\":\"C\", \"title\": \"The Robot\", \"text\": \"Yes! you did it! The second sensor is in your hands. The Infrared Sensor is a digital sensor that can detect infrared light reflected from solid objects. It can also detect infrared light signals sent from the Remote Infrared Beacon. Only 1 sensor left. Let\'s do this! Check in now to show the clue to the next point\"}");
	foreach ($screensData as $data) {
		$query = "INSERT INTO screen (poi, data) VALUES ('$id','$data')";
		$res = $bd->ejecutar($query);
	}
	
	return mysqli_error($bd->link);
}

?>