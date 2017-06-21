<?php
 
require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$minigame = addslashes($_REQUEST['minigame']);
$id = $_REQUEST['id'];

if($id == null){
	$query = "INSERT INTO minigames (id, minigame) VALUES (NULL, '" . $minigame . "')";
	$res = $bd->ejecutar($query);
	echo "CREATED " . mysql_insert_id();
}else{
	$query = "UPDATE minigames SET minigame='" . $minigame . "' WHERE id=" . $id;
	$res = $bd->ejecutar($query);
	echo "UPDATED " . mysql_insert_id();
}

?>