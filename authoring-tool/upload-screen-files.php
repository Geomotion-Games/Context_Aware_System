<?php
	
	error_reporting(0);

	$type = $_REQUEST["type"];
	$screenId = $_REQUEST["screenId"];
	$screenType = $_REQUEST["screenId"];
	$poiId = $_REQUEST["poiId"];

	if(isset($_FILES["file"]["type"])){
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
				$base = "uploads/images";

				if($type == "screens") $base = "uploads/images/screens/" . $screenId;
				if (!file_exists($base)) {
    				mkdir($base, 0777, true);
				}

				$sourcePath = $_FILES['file']['tmp_name'];
				$targetPath = $base . "/poi_" . $poiId . "_item.";

				// borrar imagenes con el mismo nombre pero diferente extension
				foreach ($validextensions as $key => $value) {
					unlink($targetPath . $value);
				}

				move_uploaded_file($sourcePath, $targetPath . $file_extension);
				echo "ok-" . $targetPath . $file_extension;
			}
		}
		else {
			echo "Invalid file size or type";
		}
	}else{
		echo "Invalid form data";
	}
?>