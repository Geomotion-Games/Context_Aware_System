<?php
	
error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$poi = $_REQUEST['poi'];
$plot = $_REQUEST['plot'];
$data = addSlashes($_REQUEST['data']);

if($id != null){
	$query = "UPDATE screen SET poi='$poi',data='$data' WHERE id=$id";
	$res = $bd->ejecutar($query);
	echo mysqli_error($bd->link);
	echo $id;
	$query = "UPDATE plot SET last_update = CURRENT_TIMESTAMP WHERE id ='$plot'";
	$res = $bd->ejecutar($query);
}

?>