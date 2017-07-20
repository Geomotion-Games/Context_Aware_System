<?php

error_reporting(0);
require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$gameJson = array();

function getPlot(id) {

	$bd = Db::getInstance();

	$id = isset($_REQUEST['id']) && ctype_digit($_REQUEST['id']) ? $_REQUEST['id'] : "";

	$query = $bd->ejecutar("SELECT * FROM plot WHERE id = " . $id);
	$numRows = $bd->num_rows($query);
	
	if ($query) {
		$plot = $bd->obtener_fila($query, 0);
	} else {
	    echo mysql_error();
	}

	$query = $bd->ejecutar(sprintf("SELECT * FROM poi WHERE plot = %s ORDER BY orderNumber ASC", $id));
	$numRows = $bd->num_rows($query);

	$pois = array();
	
	if ($query) {
		while(($row =  mysql_fetch_assoc($query))) {
		    $pois[] = $row;
		}
	} else {
	    echo mysql_error();
	}
}

function completeJsonGenerator() {



}
