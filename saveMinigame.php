<?php
 
require 'class/db.class.php';
require 'class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');


$bd=Db::getInstance();

$minigame=$_REQUEST['minigame'];
/*
$test=$bd->ejecutar("select * from minigames");

var_dump($bd->obtener_fila($test,0));*/

$query = "INSERT INTO minigames (id, minigame) VALUES (NULL, '" . $minigame . "')";

$res = $bd->ejecutar($query);

echo( mysql_insert_id() );

/*
$rsp1=$bd->ejecutar("select id from partido where a2='$id_jugador' and id='$id_partido' and ea2='pen' order by id desc limit 1");
$rowp1=$bd->obtener_fila($rsp1,0);
if ($rowp1['id']!=''){
	$res=1;
	$bd->ejecutar("update partido set  ea2='con' where id='$id_partido'");
}
else {
	$rsp2=$bd->ejecutar("select id from partido where b1='$id_jugador' and id='$id_partido' and eb1='pen' order by id desc limit 1");
	$rowp2=$bd->obtener_fila($rsp2,0);
	if ($rowp2['id']!=''){
		$res=1;
		$bd->ejecutar("update partido set eb1='con' where id='$id_partido'");
	}
	else {
		$rsp3=$bd->ejecutar("select id from partido where b2='$id_jugador' and id='$id_partido' and eb2='pen' order by id desc limit 1");
		$rowp3=$bd->obtener_fila($rsp3,0);
		if ($rowp3['id']!=''){
			$res=1;
			$bd->ejecutar("update partido set eb2='con' where id='$id_partido'");
		}
		else {
			$res=0;
		}
	}
}
$conttags=0;xº

if ($res==1)
{
	$rsj=$bd->ejecutar("select id,nombre,apellidos from usuario where id='$id_jugador'");
	$rowj=$bd->obtener_fila($rsj,0);
	$nombrejugador=$rowj['nombre']." ".$rowj['apellidos'];
	$nombrejugador=utf8_encode($nombrejugador);
	
	$rspartido=$bd->ejecutar("select * from partido where id='$id_partido' order by id desc limit 1");
	$rowpartido=$bd->obtener_fila($rspartido,0);
	
	$tagsarray[]=("c".$rowpartido['a1']);
	$conttags=1;
	
	$json["partido"][]= array (
		'id'=>$rowpartido['id'],
		'fechai'=>$rowpartido['fechai'],
		'fechaf'=>$rowpartido['fechaf'],
		'preferencia'=>$rowpartido['preferencia'],
		'ranking'=>$rowpartido['ranking'],
		'club'=>$rowpartido['club'],
		'a1'=>$rowpartido['a1'],
		'a2'=>$rowpartido['a2'],
		'b1'=>$rowpartido['b1'],
		'b2'=>$rowpartido['b2'],
		'ea1'=>$rowpartido['ea1'],
		'ea2'=>$rowpartido['ea2'],
		'eb1'=>$rowpartido['eb1'],
		'eb2'=>$rowpartido['eb2'],
		'estado'=>$rowpartido['estado'],
		'edoclub' =>$rowpartido['edoclub']
	);
}
else {
 
	$json["error"][]=array('id'=>$res);
}

 
$out =  ($json);
$result= json_encode($out);
echo($result); 


//NOTIFICACIONES//
if ($conttags>0){
	define('APPKEY','OaV4g2NtSNu4kHecca2fuQ'); // Your App Key
 	define('PUSHSECRET', '4kPlH2GBRQaSWpAVg-exrg'); // Your Master Secret
 	define('PUSHURL', 'https://go.urbanairship.com/api/push/');
	$contents = array();
	 
	//notificationcenter
			$idpart=$rowpartido['id'];
			$un1=$tagsarray[0];
			$un2=$tagsarray[1];
			$un3=$tagsarray[2];
			$un4=$tagsarray[3];
			$un1=str_replace("c","",$un1);
			$un2=str_replace("c","",$un2);
			$un3=str_replace("c","",$un3);
			$un4=str_replace("c","",$un4);
			
			if ($un1!=''){
			$bd->ejecutar("insert into notificacion values (NULL,'$un1','$nombrejugador se ha unido a tu partido de padel','$idpart')");
			}
			if ($un2!=''){
			$bd->ejecutar("insert into notificacion values (NULL,'$un2','$nombrejugador se ha unido a tu partido de padel','$idpart')");
			}
			if ($un3!=''){
			$bd->ejecutar("insert into notificacion values (NULL,'$un3','$nombrejugador se ha unido a tu partido de padel','$idpart')");
			}
			if ($un4!=''){
			$bd->ejecutar("insert into notificacion values (NULL,'$un4','$nombrejugador se ha unido a tu partido de padel','$idpart')");
			}
			//notificationcenter 
	 
 	$contents['alert'] = $nombrejugador." se ha unido a tu partido de padel\n"; 
 	$contents['sound'] = "alert.caf";
	$contents['extra']=array("id_partido"=>$rowpartido['id']);
 	$notification = array();
 	$notification['ios'] = $contents;
 	$platform = array();
 	array_push($platform, "ios");

 	$push = array("audience"=>array("tag"=>$tagsarray), "notification"=>$notification, "device_types"=>$platform);

 	$json = json_encode($push);
 	$sessionxc = curl_init(PUSHURL);
 	curl_setopt($sessionxc, CURLOPT_USERPWD, APPKEY . ':' . PUSHSECRET);
 	curl_setopt($sessionxc, CURLOPT_POST, True);
 	curl_setopt($sessionxc, CURLOPT_POSTFIELDS, $json);
 	curl_setopt($sessionxc, CURLOPT_HEADER, False);
 	curl_setopt($sessionxc, CURLOPT_RETURNTRANSFER, True);
 	curl_setopt($sessionxc, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept: application/vnd.urbanairship+json; version=3;'));
 	$content = curl_exec($sessionxc);
	  	 

 	curl_close($sessionxc);
}*/
//NOTIFICACIONES//
?>