//var games = [];

showMyGames();

function showMyGames(){
    $("#mygames").empty();

    for(var game in games){
        appendGame("#mygames", games, game);
    }
}

function showCommunityGames(){
    $("#community").empty();

    for(var game in games){
        if(games[game].public) appendGame("#community", games, game);
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
                    <input data-index="${index}" class="pubpriv-toggle" type="checkbox" data-toggle="toggle" data-on="Public" data-off="Private" ${games[index].public?"checked":""}>
                </div>
            </div>
        </li>
    `);

    $('.pubpriv-toggle').bootstrapToggle();

    $('.pubpriv-toggle').change(function() {
        var gameNumber = parseInt($(this).attr("data-index"));
        if(gameNumber == index) {
            console.log("changed " + games[index].name);
            games[index].public = $(this).prop('checked');
            showCommunityGames();
        }
    });

    $(".gamerow").on('click', function(e) {
        var gameNumber = parseInt($(this).attr("data-index"));
        if(gameNumber == index) {
            var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
            action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
            action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;

            gameOnClick(this, gameNumber, action);
        }
    });
}


$("body").find("[aria-controls='mygames']").on('click', function(e) {
    showMyGames();
});

$("body").find("[aria-controls='community']").on('click', function(e) {
    showCommunityGames();
});

$("#newGame").on('click', function(e) {
    saveMinigame(new Game({}));
    window.location = "plots.php";
});

function gameOnClick(parent, gameNumber, action){
    if(action == "remove"){
        $(parent).remove();
        delete games[gameNumber];
    }else if(action == "edit"){
        window.location = "/follow-the-path.php";
    }else if(action == "duplicate"){
        var copy = games[gameNumber].copy();
        games.push(copy);
        showMyGames();
        showCommunityGames();
    }
}