$(".plot").on('click', function(e) {
    var disabled = $(this).hasClass("plotDisabled");
    if(disabled) return;
    var type = $(this).attr("id");
    e.preventDefault();
	savePlot(new Game({
		type: type
    }), function(id){
    	var url = gameTypeToUrl(type);
    	window.location = url + ".php?id=" + id;
    });
});

function updateGameGLPAT(game) {
    
}