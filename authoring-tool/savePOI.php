<?php


require 'class/db.class.php';
require 'class/conf.class.php';

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

if($id == null){
	$query = "INSERT INTO poi (plot, type, lat, lng, orderNumber, beaconId, title) VALUES ('$plot','$type','$lat','$lng','$orderNumber','$beaconId','$title')";
	echo $query;
	$res = $bd->ejecutar($query);
	if(!$res) die(mysql_error());
	echo mysql_insert_id();
}else{
	$query = "UPDATE poi SET lat='$lat',lng='$lng',orderNumber='$orderNumber',beaconId='$beaconId',title='$title' WHERE id=$id";
	echo $query;
	$res = $bd->ejecutar($query);
	if(!$res) die(mysql_error());
	echo mysql_insert_id();
}

?>