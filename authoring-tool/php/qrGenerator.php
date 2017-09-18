<?php 

require 'lib/phpqrcode/qrlib.php';

$poiID = $_REQUEST['poiID'];
$appID = $_REQUEST['appID'];
$isPre = $_REQUEST['isPre'];

$pre = $isPre ? "pre/" : "";
QRcode::png("https://www.geomotiongames.com/" . $pre . "beaconing/app/app.php?game=" . $appID ."&device=browser&teleport=" . $poiID);

?>