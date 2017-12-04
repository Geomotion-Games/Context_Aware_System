<?php 

error_reporting(0);

require 'lib/phpqrcode/qrlib.php';

$poiID = $_REQUEST['poiID'];
$appID = $_REQUEST['appID'];

$url = $_SERVER["SERVER_NAME"] == "atcc.beaconing.eu" ? $_SERVER["SERVER_NAME"] : "www.geomotiongames.com/beaconing/app";
$content = "https://" . $url . "/app.php?game=" . $appID ."&device=browser&teleport=" . $poiID;

QRcode::png($content);

?>