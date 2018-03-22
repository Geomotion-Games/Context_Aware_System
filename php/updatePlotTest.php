<?php

    /*
        POI = {
            "value": "www.example1.com", // URL
            "default": "",
            "name": "4336", // ID of the POI
            "descr": "Informant1",
            "type": "minigameURL", // Type of challenge [minigameURL, uploadContent, checkIn]
            "whereInGLP": "(MissionID)/(QuestID)",
            "outputs": [
                "4337" // ID of the following POI 
            ]
        }
    */

    $json = '[{
                "value": "www.example1.com",
                "default": "",
                "name": "4336",
                "descr": "Informant1",
                "type": "minigameURL",
                "whereInGLP": "(MissionID)/(QuestID)",
                "outputs": [
                    "4337"
                ]
            },
            {
                "value": "www.example2.com",
                "default": "",
                "name": "4337",
                "descr": "Informant2",
                "type": "minigameURL",
                "whereInGLP": "(MissionID)/(QuestID)",
                "outputs": [
                    "4338"
                ]
            },
            {
                "value": "www.example3.com",
                "default": "",
                "name": "4338",
                "descr": "Informant3",
                "type": "minigameURL",
                "whereInGLP": "(MissionID)/(QuestID)",
                "outputs": [
                    "4339"
                ]
            },
            {
                "value": "www.example4.com",
                "default": "",
                "name": "4339",
                "descr": "Informant4",
                "type": "minigameURL",
                "whereInGLP": "(MissionID)/(QuestID)",
                "outputs": []
            }]';

    $parsed_json = json_decode($json);

    $data = array("id" => 609, "data" => $parsed_json);
    // $ch = curl_init("https://atcc-qa.beaconing.eu/php/updatePlot.php"); //PRE
    $ch = curl_init("https://atcc.beaconing.eu/php/updatePlot.php"); //PRO
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($data));

    echo curl_exec($ch);
?>
