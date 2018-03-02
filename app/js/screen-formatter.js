/* LAYOUT FORMATTER */
$(function() {
    $(".modalDialog.screen .modalContent").each(function(index) { 
        //ONLY FOR LANDSCAPE MODE

        console.log($("img", this)[0]);
        var prop = $("img", this)[0].naturalWidth / $("img", this)[0].naturalHeight; // >1 landscape; <1 portrait; =1 squared
        console.log(prop);
        
        if (prop > 1.66) { $(this).addClass("fullWidth"); }
        else { $(this).addClass("portrait"); }
    });
});
