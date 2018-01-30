<?php

	error_reporting(0);

	$type = $_REQUEST["type"];
	$gameId = $_REQUEST["gameId"];
	$currentDate = $_REQUEST["currentDate"];
	$poiNum = $_REQUEST["poiNum"];
	$file = $_FILES["file"];

	if(isset($file["type"])){
		$validextensions = array("jpeg", "jpg", "png");
		$temp = explode(".", $file["name"]);
		$file_extension = end($temp);
	
		if (((  $file["type"] == "image/png")
			|| ($file["type"] == "image/jpg")
			|| ($file["type"] == "image/jpeg"))
			&& ($file["size"] < 10 * 1024 * 1024) // 10MB
			&& in_array($file_extension, $validextensions)) {
			
			if ($file["error"] > 0) {
				echo $file["error"];
			}
			else {
				$base = "../uploads/challenges";

				if (!file_exists($base)) {
    				mkdir($base, 0777, true);
				}

				$sourcePath = $file['tmp_name'];
				$targetPath = $base . "/" . $gameId . "_" . $currentDate . ".";

				// borrar imagenes con el mismo nombre pero diferente extension
				foreach ($validextensions as $key => $value) {
					unlink($targetPath . $value);
				}

				$p = substr($targetPath, 3);

				move_uploaded_file($sourcePath, $targetPath . $file_extension);
				echo "ok-" . $p . $file_extension;
			}
		}
		else {
			echo "Invalid file size or type";
		}
	}else{
		echo "Invalid form data";
	}
?>