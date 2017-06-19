var games = [];

games.push(new Game({name: "Game Test 1", description: "Game Description", public: true}));
games.push(new Game({name: "Game Test 2", description: "Game Description"}));
games.push(new Game({name: "Game Test 3", description: "Game Description"}));
games.push(new Game({name: "Game Test 4", description: "Game Description"}));

showGames();

function showGames(){
    $("#mygames").empty();

    for(var game in games){
        appendGame("#mygames", games, game);
    }
}

function appendGame(parent, games, index){
    $(parent).append(`
       <li class="gamerow" data-index="${index}">
		    		<div class="row">
		    			<div class="col-md-8 gameinfo">
		    				<div class="gametexts">
		    					<p class="gameTitle">${games[index].name}</p>
		    					<p class="gameType">${games[index].description}</p>
		    				</div>
		    				<div class=gameactions>
		    					<a href="#"><i class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
		    					<a href="#"><i class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
		    					<a href="#"><i class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
		    				</div>
		    			</div>
		    			<div class="col-md-4 pubpriv">
		    				<input type="checkbox" data-toggle="toggle" data-on="Public" data-off="Private" ${games[index].public?"checked":""}>
							<script>
							  $(function() {
							    $('#toggle-two').bootstrapToggle({
							      on: 'Private',
							      off: 'Public'
							    });
							  })
							</script>
		    			</div>
		    		</div>
	    		<li>
    `);
}

// STOPS
$(".gamerow").on('click', function(e) {
    var gameNumber = parseInt($(this).attr("data-index"));
    var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
    action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
    action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;

    gameOnClick(this, gameNumber, action);
});

function gameOnClick(parent, gameNumber, action){
    if(action == "remove"){
        $(parent).remove();
    }else if(action == "edit"){
        window.location = "/follow-the-path.html";
    }else if(action == "duplicate"){
        console.log("duplicate!");
    }
}