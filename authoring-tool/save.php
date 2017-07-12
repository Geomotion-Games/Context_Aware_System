<?php
 
require 'class/db.class.php';
require 'class/conf.class.php';

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
	echo "CREATED " . mysql_insert_id();
}else{
	$query = "UPDATE plot SET name='$name', description='$description',time='$time',type='$type',public='$public' WHERE id=$id";
	$res = $bd->ejecutar($query);
	echo "UPDATED " . mysql_insert_id();
}

?>