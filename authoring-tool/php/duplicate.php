<?php

function duplicatePlot($id, $name, $description, $time, $type, $public, $bd){
	$query = "INSERT INTO plot (name, description, time, type, public) VALUES ('$name','$description','$time','$type','$public')";
	$res = $bd->ejecutar($query);
	$newPlotId = mysqli_insert_id();
	duplicatePois($id, $newPlotId, $bd);
	return $newPlotId;
}

function duplicatePois($lastPlotId, $newPlotId, $bd){
	$query = "INSERT INTO poi (plot, type, lat, lng, orderNumber, beaconId, title, rewardPoints, triggerDistance, item)
			SELECT $newPlotId, po.type, po.lat, po.lng, po.orderNumber, po.beaconId, po.title, po.rewardPoints, po.triggerDistance, po.item
			FROM plot pl 
			JOIN poi po ON po.plot = pl.id 
			WHERE pl.id = $lastPlotId
			";
	$res = $bd->ejecutar($query);

	$query = "SELECT id FROM poi WHERE plot = $lastPlotId";
	$res = $bd->ejecutar($query);
	$lastPoiIds = array();
	while(($row = mysqli_fetch_assoc($res))) {
		$lastPoiIds[] = $row['id'];
	}
	
	$query = "SELECT id FROM poi WHERE plot = $newPlotId";
	$res = $bd->ejecutar($query);
	$i = 0;
	while(($row = mysqli_fetch_assoc($res))) {
		$id = $row['id'];
		duplicateScreens($lastPoiIds[$i], $id, $bd);
		$i++;
	}
}

function duplicatePoi($id, $plot, $type, $lat, $lng, $orderNumber, $beaconId, $title, $rewardPoints, $triggerDistance, $item, $bd){
	$query = "INSERT INTO poi (plot, type, lat, lng, orderNumber, beaconId, title, rewardPoints, triggerDistance, item)
			VALUES ('$plot','$type','$lat','$lng','$orderNumber','$beaconId','$title','$triggerDistance','$rewardPoints','$item')";
	$res = $bd->ejecutar($query);
	$newPoiId = mysqli_insert_id();
	duplicateScreens($id, $newPoiId, $bd);
	return $newPoiId;
}


function duplicateScreens($lastPoiId, $newPoiId, $bd){
	$query = "INSERT INTO screen (`poi`, `data`)
			SELECT $newPoiId, s.data
			FROM poi p 
			JOIN screen s ON s.poi = p.id 
			WHERE p.id = $lastPoiId
			";
	$res = $bd->ejecutar($query);
}

?>