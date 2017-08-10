<?php

error_reporting(0);

require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];

//TODO: only delete if the current user is the owner of the plot

if($id != null){
	$query = "UPDATE plot SET archived='1' WHERE id=$id";
	$res = $bd->ejecutar($query);
	// $query = "DELETE FROM plot WHERE id = '$id'";
	// $res = $bd->ejecutar($query);
	echo "Removed plot " . $id;
}else{
	echo "Error: Id is null";
}

?>