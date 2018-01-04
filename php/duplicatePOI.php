<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

require 'duplicate.php';

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
$team = $_REQUEST['team'];
$itemName = $_REQUEST['itemName'];

if($id != null){
	echo duplicatePoi($id, $plot, $type, $lat, $lng, $orderNumber, $beaconId, $title, $rewardPoints, $triggerDistance, $item, $itemName, $team, $bd);
}
?>