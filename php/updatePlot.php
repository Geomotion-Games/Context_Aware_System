<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT");

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

parse_str(file_get_contents("php://input"), $json);

$id = $json["id"];
$parsed_json = $json["data"];

$bd = Db::getInstance();

//OBTENIM ELS POIS
$query = $bd->ejecutar(sprintf("SELECT *
                                FROM poi 
                                WHERE plot = %s
                                ORDER BY orderNumber ASC", $id));

if ($bd->num_rows($query) > 0) {

    $pois = array();
    $poiIDs = array();

    while ($row = mysqli_fetch_assoc($query)) {
        //$pois[$row["id"]] = $row;
        $poiIDs[] = $row["id"];
    }

    // PER CADA POI, OBTENIM ELS CHALLENGES
    $query = $bd->ejecutar(sprintf( "SELECT * FROM screen WHERE poi IN (%s)", implode(",", $poiIDs) ));

    if ($bd->num_rows($query) > 0) {

        while ($row = mysqli_fetch_assoc($query)) {
            $screen = json_decode($row["data"], true);
            $screen["id"] = $row["id"];
            if ($screen["type"] == "B") {
                $pois[$row["poi"]] = $screen;
            }
        }
    }

//    var_dump($pois);exit;

    // Start i finish no actualitzables
/*    $start_index = array_keys($pois)[0];
    $finish_index = array_keys($pois)[1];
    unset($pois[$start_index]);
    unset($pois[$finish_index]);*/

    $it_worked = true;

    foreach ($parsed_json as $jpoi) {
        if ( isset($pois[$jpoi["name"]]) ) {
            $minigameURL = $jpoi["value"];
            if ($jpoi["type"] == "minigameURL") {
        //        echo $jpoi["name"] ." ve com a minigame:<br/>";
                $poi = $pois[$jpoi["name"]];
                $screenId = $poi["id"];
                //Si ens envien un poi amb minijoc, actualitzem si la url ha canviat i si abans no era minijoc
                if (isset($poi["challenge"]))
                {
      //              echo "hi ha challenge<br/>";
                    $challenge = $poi["challenge"];
                    if (isset($challenge["type"]))
                    {
    //                    echo "hi ha tipus de challenge<br/>";
                        if ( $challenge["type"] == "minigame" )
                        {
  //                          echo "també era de tipus minigame<br/>";
                            if ( $challenge["url"] != $minigameURL ) 
                            {
//                                echo "la url és diferent!<br/>";
                                $it_worked = $it_worked && updatePOI($pois, $screenId, $minigameURL);
                            }
                        } else { $it_worked = $it_worked && updatePOI($pois, $screenId, $minigameURL); }
                    } else { $it_worked = $it_worked && updatePOI($pois, $screenId, $minigameURL); }
                } else { $it_worked = $it_worked && updatePOI($pois, $screenId, $minigameURL); }
            }
//            echo "<br/>";
        }
        //Si no compleix alguna condició és que no s'ha d'actualitzar
        if (!$it_worked) { echo false; return; }
    }

    echo true;
}


function updatePOI( $pois, $screenID, $minigameURL ) {

    $new_screen_B = array (
        "type" => "B",
        "title" => "",
        "text" => "",
        "youtubeOrVimeoURL" => "",
        "uploadedVideo" => "",
        "mediaType" => "image",
        "clue" => "",
        "challenge" => array (
            "type" => "minigame",
            "url" => $minigameURL
        )
    );

    $bd = Db::getInstance();

    $query = sprintf("UPDATE screen SET data = '%s' WHERE id=%d", 
        json_encode($new_screen_B), intval($screenID));

    return $bd->ejecutar($query);
}

?>
