<?php

function duplicatePlot($id, $name, $description, $time, $type, $public, $bd){
	$query = "INSERT INTO plot (name, description, time, type, public) VALUES ('$name','$description','$time','$type','$public')";
	$res = $bd->ejecutar($query);
	$newPlotId = mysql_insert_id();
	duplicatePois($id, $newPlotId, $bd);
	return $newPlotId;
}

function duplicatePois($lastPlotId, $newPlotId, $bd){
	$query = "INSERT INTO poi (`plot`, `type`, `lat`, `lng`, `orderNumber`, `beaconId`, `title`, `rewardPoints`, `triggerDistance`, `item`)
			SELECT $newPlotId, po.type, po.lat, po.lng, po.orderNumber, po.beaconId, po.title, po.rewardPoints, po.triggerDistance, po.item
			FROM plot pl 
			JOIN poi po ON po.plot = pl.id 
			WHERE pl.id = $lastPlotId
			";
	$res = $bd->ejecutar($query);
	$newPoiId = mysql_insert_id();
	duplicateScreens($lastPlotId, $newPoiId, $bd);
	return $newPoiId;
}

function duplicateScreens($lastPlotId, $newPoiId, $bd){
	$query = "INSERT INTO screen (`poi`, `data`)
			SELECT $newPoiId, p.data,
			FROM poi p 
			JOIN screen s ON s.poi = p.id 
			WHERE p.plot = $lastPlotId
			";
	$res = $bd->ejecutar($query);
	$newScreenId = mysql_insert_id();
	return $newScreenId;
}

?>