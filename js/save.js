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
        if(!savingTimeout)$("#saving").text(`${ l("changes_saved") }`);
        saved = true;
        plot.id = data.trim();
        console.log("Plot saved!" + data);
        if(callback) callback(plot.id);
    });
    request.fail(function(error) {
        $("#saving").hide();
        console.log("Error saving..." + JSON.stringify(error));
    });
}

function updateATPlot(plot) {

    var update_url = getCookie("updateurl-at");
    var glpid_at = getCookie("glpid-at");

    if ( update_url == "" || glpid_at == "") { return; }

    var atglpJSON = plot.toGLPJSON();

    console.log(atglpJSON);

    var request = $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: update_url,
        data: JSON.stringify(atglpJSON)
    });

    console.log("sending to ATGLP... " + plot.updateurl);

    request.done(function(data) {
        console.log("updated in AT");
    });
    request.fail(function(error) {
        console.log("Error updating... " + JSON.stringify(error));
    });
}


function saveScreenATGLP() {

    var request = $.ajax({
        type: 'GET',
        url: "https://atcc.beaconing.eu/php/getPlot.php",
        data: "plotId=" + game.id
    });

    request.done(function(data) {
        console.log("we have the data!");
        var pois = JSON.parse(data);
        var start = parsePOI(pois[0]);
        var finish = parsePOI(pois[1]);
        pois.splice(0, 2);
        points = parsePOIS(pois);

        updateATPlot(game);
    });

    request.fail(function(error) {
        console.log("Error updating... " + JSON.stringify(error));
    });

}


function savePOI(poi, game, callback) {
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
        if(!savingTimeout)$("#saving").text(`${ l("changes_saved") }`);
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
        if(!savingTimeout)$("#saving").text(`${ l("changes_saved") }`);
        saved = true;
        console.log("Screen saved!" + data);
        saveScreenATGLP();
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
    $("#saving").text(`${ l("saving") }` + "...");
    $("#saving").show();
    if(savingTimeout != null) clearTimeout(savingTimeout);
    savingTimeout = setTimeout(function(){
        if(saved){
            $("#saving").text(`${ l("changes_saved") }`);
        }
        clearTimeout(savingTimeout);
        savingTimeout = null;
    }, 2000);
}