function removePlot(plot, callback) {
    createSavingTimeout();

    var request = $.ajax({
        type: 'POST',
        url: 'php/removePlot.php',
        data: {id:plot.id}
    });

    console.log("Removing...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        if(callback) callback();
        console.log("Plot removed!");
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error removing..." + JSON.stringify(error));
    })
}

function removePOI(poi, game) {
    createSavingTimeout();

    var request = $.ajax({
        type: 'POST',
        url: 'php/removePOI.php',
        data: {id:poi.id, plot: game.id}
    });

    console.log("Removing...");
    request.done(function(data) {
        if(!savingTimeout)$("#saving").text("All changes have been saved");
        saved = true;
        console.log("POI removed!");
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error removing..." + JSON.stringify(error));
    })
}