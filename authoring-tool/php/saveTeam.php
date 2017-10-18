<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$color = $_REQUEST['color'];
$members = $_REQUEST['members'];
$plot = $_REQUEST['plot'];

if($id == null){
	$query = "INSERT INTO team (color, plot) VALUES ('$color','$plot')";
	$res = $bd->ejecutar($query);
	$lastId = mysql_insert_id();
	echo $lastId;
}else{
	$query = "UPDATE team SET color='$color', members='$members', plot='$plot' WHERE id=$id";
	$res = $bd->ejecutar($query);
	echo mysql_error();
	echo $id;
}

?>