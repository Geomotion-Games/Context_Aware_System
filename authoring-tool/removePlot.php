<?php
 
error_reporting( E_ALL ^ E_DEPRECATED );

require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];

//TODO: only delete if the current user is the owner of the plot

if($id != null){
	$query = "DELETE FROM plot WHERE id = '$id'";
	$res = $bd->ejecutar($query);
	echo "Removed plot " . $id;
}else{
	echo "Error: Id is null";
}

?>