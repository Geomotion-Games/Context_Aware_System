<?php

	$gameId = 0;
	if ( isset($_REQUEST["gameId"]) && $_REQUEST["gameId"] != "" ) {
		$gameId = $_REQUEST;
	} else { die; }

	if(isset($_FILES["file"]["type"]))
	{
		$validextensions = array("jpeg", "jpg", "png");
		$temp = explode(".", $_FILES["file"]["name"]);
		$file_extension = end($temp);
	
		if (((  $_FILES["file"]["type"] == "image/png") 
			|| ($_FILES["file"]["type"] == "image/jpg") 
			|| ($_FILES["file"]["type"] == "image/jpeg")) 
			&& ($_FILES["file"]["size"] < 300000)
			&& in_array($file_extension, $validextensions)) {
			
			if ($_FILES["file"]["error"] > 0) {
				echo $_FILES["file"]["error"];
			}
			else {

				if (!file_exists("games/images/" . $gameId)) {
    				mkdir("games/images/" . $gameId, 0777, true);
				}

				$sourcePath = $_FILES['file']['tmp_name'];
				$targetPath = "games/images/" . $gameId . $_FILES['file']['name'];
				move_uploaded_file($sourcePath,$targetPath);
				echo "ok";
			}
		}
		else {
			echo "Invalid file size or type";
		}
	}
?>