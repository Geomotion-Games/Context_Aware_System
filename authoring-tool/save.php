<?php
 
require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$minigame = $_REQUEST['minigame'];

$query = "INSERT INTO minigames (id, minigame) VALUES (NULL, '" . $minigame . "')";

$res = $bd->ejecutar($query);

echo( mysql_insert_id() );

?>