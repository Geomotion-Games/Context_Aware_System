<?php

	function loadLang($lang) {
		try {
			$l = substr($lang, 0, 2);
			$GLOBALS["strings"] = json_decode(file_get_contents("lang/" . $l . ".json"), true); 
		} catch(Exception $e) {
			$GLOBALS["strings"] = json_decode(file_get_contents("lang/en.json"), true); 
		}
	}

	function l( $string, $extra ) {
		if (!$extra) {
			if (isset($GLOBALS["strings"][$string])) {
				echo $GLOBALS["strings"][$string];
			} else {
				echo $string;
			}
		} else {
			echo sprintf($GLOBALS["strings"][$string], $extra);
		}
	}
?>
