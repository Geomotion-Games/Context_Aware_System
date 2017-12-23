function savePlot(plot, callback) {
    createSavingTimeout();

    var plotJSON = plot.toJSON();

    var request = $.ajax({
        type: 'POST',
        url: 'php/savePlot.php',
        data: plotJSON
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        plot.id = data.trim();
        console.log("Plot saved!" + data);
        if(callback) callback(plot.id);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

function savePOI(poi, game, callback){
    createSavingTimeout();

    var poiJSON = poi.toJSON();

    if(game != null) poiJSON.plot = game.id;

    var request = $.ajax({
        type: 'POST',
        url: 'php/savePOI.php',
        data: poiJSON
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        console.log("POI saved!" + data);
        poi.id = data.trim();
        if(callback) callback(poi.id);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

function saveScreen(screen, poi, game){
    createSavingTimeout();

    var screenJSON = screen.toJSON();

    if(poi != null) screenJSON.poi = poi.id;
    if(game != null) screenJSON.plot = game.id;

    var request = $.ajax({
        type: 'POST',
        url: 'php/saveScreen.php',
        data: screenJSON
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        console.log("Screen saved!" + data);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

function saveTeam(team, game, callback){
    createSavingTimeout();

    var teamJSON = team.toJSON();

    if(game != null) teamJSON.plot = game.id;

    var request = $.ajax({
        type: 'POST',
        url: 'php/saveTeam.php',
        data: teamJSON
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        data = $.trim(data)
        console.log(data);
        if(callback) callback(data);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

var saved = false;
var savingTimeout;

function createSavingTimeout(){
    saved = false;
    $("#saving").text("Saving...");
    $("#saving").show();
    if(savingTimeout != null) clearTimeout(savingTimeout);
    savingTimeout = setTimeout(function(){
        if(saved){
            $("#saving").text("All changes have been saved");
        }
        clearTimeout(savingTimeout);
        savingTimeout = null;
    }, 2000);
}