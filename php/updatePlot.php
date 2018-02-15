<?php

error_reporting(0);

require '../class/db.class.php';
require '../class/conf.class.php';

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
date_default_timezone_set('Europe/Madrid');

$bd = Db::getInstance();

$id = intval($_REQUEST['id']);

if($id != null){
	echo duplicatePlot($id, $name, $description, $time, $type, $public, $bd);
}

/*[
    {
        "value": "",
        "default": "",
        "name": "POI1",
        "descr": "Informant1",
        "type": "minigameURL",
        "whereInGLP": "(MissionID)/(QuestID)" (e.g. (Mission1)/(Quest1)),
        "outputs": [
            "POI2"
        ]
    },
    {
        "value": "",
        "default": "",
        "name": "POI2",
        "descr": "Informant2",
        "type": "minigameURL",
        "whereInGLP": "(MissionID)/(QuestID)" (e.g. (Mission1)/(Quest1)),
        "outputs": [
            "POI3"
        ]
    },
    {
        "value": "",
        "default": "",
        "name": "POI3",
        "descr": "Informant3",
        "type": "minigameURL",
        "whereInGLP": "(MissionID)/(QuestID)" (e.g. (Mission1)/(Quest1)),
        "outputs": [
            "POI4"
        ]
    },
    {
        "value": "",
        "default": "",
        "name": "POI4",
        "descr": "Informant4",
        "type": "minigameURL",
        "whereInGLP": "(MissionID)/(QuestID)" (e.g. (Mission1)/(Quest1)),
        "outputs": [
            "POI5"
        ]
    },
    {
        "value": "",
        "default": "upload content",
        "name": "POI5",
        "descr": "Hidden Treasure",
        "type": "uploadContent",
        "whereInGLP": "(MissionID)/(QuestID)" (e.g. (Mission1)/(Quest1)),
        "outputs": []
    }
]*/

?>