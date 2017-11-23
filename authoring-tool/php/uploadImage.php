<?php
	
	error_reporting(0);

	$type = $_REQUEST["type"];
	$screenId = $_REQUEST["screenId"];
	$poiId = $_REQUEST["poiId"];
	$file = $_FILES["file"];

	if(isset($file["type"])){
		$validextensions = array("jpeg", "jpg", "png");
		$temp = explode(".", $file["name"]);
		$file_extension = end($temp);
	
		if (((  $file["type"] == "image/png") 
			|| ($file["type"] == "image/jpg") 
			|| ($file["type"] == "image/jpeg")) 
			&& ($file["size"] < 300 * 1024) // 300kb
			&& in_array($file_extension, $validextensions)) {
			
			if ($file["error"] > 0) {
				echo $file["error"];
			}
			else {
				$base = "../uploads/images";

				if (!file_exists($base)) {
    				mkdir($base, 0777, true);
				}

				$sourcePath = $file['tmp_name'];
				$targetPath = $base . "/poi_" . $poiId . "_item.";

				if($type == "screens") $targetPath = $base . "/screen_" . $screenId . "_image.";


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