$(".plot").on('click', function(e) {
    var type = $(this).attr("id");
    e.preventDefault();
    if(type == "FollowThePath"){
    	savePlot(new Game({
    		type: type
	    }), function(id){
	    	if(type == "FollowThePath") window.location = "follow-the-path.php?id=" + id;
	    });
    }
});