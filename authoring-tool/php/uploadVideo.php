<?php
	
	error_reporting(0);
	ini_set('upload_max_filesize', '10M');

	$screenId = $_REQUEST["screenId"];
	$file = $_FILES["file"];

	if(isset($file["type"])){
		$validextensions = array("mp4");
		$temp = explode(".", $file["name"]);
		$file_extension = end($temp);

		if (($file["size"] < 100 * 1024 * 1024) // 100MB
			&& in_array($file_extension, $validextensions)) {
			
			if ($file["error"] > 0) {
				echo $file["error"];
			}
			else {
				$base = "../uploads/videos";

				if (!file_exists($base)) {
    				mkdir($base, 0777, true);
				}

				$sourcePath = $file['tmp_name'];
				$targetPath = $base . "/screen_" . $screenId . "_video.";


				// borrar archivos con el mismo nombre pero diferente extension
				foreach ($validextensions as $key => $value) {
					unlink($targetPath . $value);
				}

				$p = substr($targetPath, 3);

				move_uploaded_file($sourcePath, $targetPath . $file_extension);
				echo "ok-" . $p . $file_extension;
			}
		}else {
			echo "Invalid file size or type";
		}
	}else{
		echo "Invalid form data";
	}
?>