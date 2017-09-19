//var games = [];

showMyGames();

function showMyGames(){
    /*$("#mygames").empty();

    for(var game in games){
        appendGame("#mygames", games, game);
    }*/
    $("#mygames").empty();

    var text_to_append = '<div class="gamerow" data-index="${index}"><div class="row">';

    for(var game in games){
        text_to_append += appendGame("#mygames", games, game);
    }

    text_to_append += "</div></div>";

    $('#mygames').append(text_to_append);

    for(var game in games){
        setEvents("#mygames", games, game);
    }
}

function showCommunityGames(){
    $("#community").empty();

    var text_to_append = '<div class="gamerow"><div class="row">';

    for(var game in games){
        if(games[game].public) text_to_append += appendGame("#community", games, game);
    }

    text_to_append += "</div></div>";

    $('#community').append(text_to_append);

    for(var game in games){
        if(games[game].public) setEvents("#community", games, game);
    }
}

function appendGame(parent, games, index){
    var url = gameTypeToUrl(games[index].type) + ".php?id=" + games[index].id;
    var type = gameTypeToDisplayName(games[index].type);

    var game = `<div class="col-md-4 col-sm-6 col-xs-12">
                    <div class="gameinfo" data-index="${index}">
                        <div class="gametexts">
                            <p class="gameTitle">${games[index].name} - ${type}</p>
                            <p class="gameType">${games[index].description}</p>
                        </div>
                        <div class="options">
                            <div class="pubpriv">
                                <input data-index="${index}" class="pubpriv-toggle" type="checkbox" data-toggle="toggle" data-on="Public" data-off="Private" ${games[index].public?"checked":""}>
                            </div>
                            <div class=gameactions>
                                <a href="#"><i title="Delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>&nbsp;</a>
                                <a href="#"><i title="Duplicate" class="fa fa-copy fa-2x" aria-hidden="true"></i>&nbsp;</a>
                                <a href="${url}"><i title="Edit" class="fa fa-pencil fa-2x" aria-hidden="true"></i>&nbsp;</a>
                            </div>
                        </div>
                    </div>
                </div>`;

    return game;
}

function setEvents(parent, games, index) {
    $('.pubpriv-toggle').bootstrapToggle();

    $('.pubpriv-toggle').change(function() {
        var gameNumber = parseInt($(this).attr("data-index"));
        if(gameNumber == index) {
            games[index].public = $(this).prop('checked');
            savePlot(games[index]);
            showCommunityGames();
        }
    });

    $(".gamerow .gameinfo").on('click', function(e) {
        var gameNumber = parseInt($(this).attr("data-index"));
        if(gameNumber == index) {
            var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
            action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
            action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;
       
            if(action != "edit") e.preventDefault();

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

function gameOnClick(parent, gameNumber, action){
    if(action == "remove"){
        showRemoveWarning(parent, gameNumber);
    }else if(action == "edit"){
    }else if(action == "duplicate"){
        var copy = games[gameNumber].copy();
        games.push(copy);
        duplicatePlot(copy, function(id){
            copy.id = id;
            $("#communitytab").parent().hasClass( "active" ) ? window.location="?tab=community" : window.location="";
        });
    }
}

function reorderPlots(){
    showMyGames();
    showCommunityGames();
}

function showRemoveWarning(parent, gameNumber){
    $("#remove-warning").modal('show');
    $(".warning-action-remove").click(function() {
        removePlot(games[gameNumber], function(){
            $("#communitytab").parent().hasClass( "active" ) ? window.location="?tab=community" : window.location="";
            $("#remove-warning").modal('hide');
        });
    });
    $(".warning-action-cancel").click(function(){
        $("#remove-warning").modal('hide');
    });
}

if ( tab == "community" ) { $('#communitytab').click(); }
