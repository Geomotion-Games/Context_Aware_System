<?php
 
error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$plot = $_REQUEST['plot'];

//TODO: only delete if the current user is the owner of the plot

if($id != null){

	$query = sprintf("DELETE FROM poi WHERE id = '%d'", 
		intval($id));

	$res = $bd->ejecutar($query);
	echo "Removed plot " . $id;

	$query = sprintf("UPDATE plot SET last_update = CURRENT_TIMESTAMP WHERE id=%d", 
		intval($plot));

	$res = $bd->ejecutar($query);
}else{
	echo "Error: Id is null";
}

?>