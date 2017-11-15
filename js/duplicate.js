
function duplicatePlot(plot, callback){
    createSavingTimeout();

    var request = $.ajax({
        type: 'POST',
        url: 'php/duplicatePlot.php',
        data: plot.toJSON()
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        plot.id = data.trim();
        console.log("Plot saved!" + data);
        if(callback) callback(plot.id)
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

function duplicatePOI(poi, game, callback){
    createSavingTimeout();

    var poiJSON = poi.toJSON();

    if(game != null) poiJSON.plot = game.id;

    var request = $.ajax({
        type: 'POST',
        url: 'php/duplicatePOI.php',
        data: poiJSON
    });

    console.log("Saving...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        poi.id = data.trim();
        console.log("Plot saved!" + data);
        if(callback) callback(poi.id)
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}

function duplicateTeam(team, callback){
    createSavingTimeout();

    var request = $.ajax({
        type: 'POST',
        url: 'php/duplicateTeam.php',
        data: team.toJSON()
    });

    console.log("Saving...");
    request.done(function(data) {
        data = data.trim();
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        var values =  data.split(",");
        var teamId = parseInt(values.splice(0, 1)[0]);
        console.log("Team saved!" + data);
        if(callback) callback(teamId, values);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    })
}