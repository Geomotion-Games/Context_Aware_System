<?php

//error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

require 'duplicate.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = $_REQUEST['id'];
$color = $_REQUEST['color'];
$members = $_REQUEST['members'];
$plot = $_REQUEST['plot'];

if($id != null){
	duplicateTeam($id, $members, $color, $plot, $bd);
}
?>