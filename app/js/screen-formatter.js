/* LAYOUT FORMATTER */
$(function() {

    $(".modalDialog.screen .modalContent").each(function(index) { 
        //ONLY FOR LANDSCAPE MODE

        if ($("img", this)[0]) {
        	var prop = $("img", this)[0].naturalWidth / $("img", this)[0].naturalHeight; // >1 landscape; <1 portrait; =1 squared
        
        	if (prop > 1.66) { $(this).addClass("fullWidth"); }
        	else { $(this).addClass("portrait"); }
    	} else {
    		//?
    	}
    });
});
