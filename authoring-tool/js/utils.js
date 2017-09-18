var userCoordsCache;

function locate() {
    if(userCoordsCache){
        map.setView(userCoordsCache, 15);
    }else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userCoordsCache = [position.coords.latitude, position.coords.longitude];
                map.setView(userCoordsCache, 15);
            });
    } else {
        coordinates.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showLocation(position) {
    var coords = {lng: position.coords.longitude, lat: position.coords.latitude};
    map.panTo(position);
}

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

function saveScreen(screen, poi){
    createSavingTimeout();

    var screenJSON = screen.toJSON();

    if(poi != null) screenJSON.poi = poi.id;

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

function removePOI(poi) {
    createSavingTimeout();

    var request = $.ajax({
        type: 'POST',
        url: 'php/removePOI.php',
        data: {id:poi.id}
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

function parsePlotJSON(data){
    return new Game({
        id: data.id, 
        type: data.type,
        name: data.name, 
        description: data.description, 
        time: parseInt(data.time), 
        public: data.public == 1 ? true : false
    });
}

function parsePOIS(pois){
    var ps = [];
    pois.forEach(function(p){
        ps.push(parsePOI(p));
    });
    return ps;
}

function parsePOI(p){
    return new Step({
        id: p.id,
        plot: parseInt(p.plot),
        title: p.title,
        orderNumber: p.orderNumber,
        type: p.type,
        marker: p.type == "normal" && typeof(addMarker) == "function" ? addMarker({lat: p.lat, lng: p.lng}, true) : null,
        lat: p.lat,
        lng: p.lng,
        beaconId: p.beaconId,
        triggerDistance: p.triggerDistance,
        rewardPoints: p.rewardPoints,
        item: p.item
    });
}

function parseStopsJSON(stopsJson){
    var stops = [];
    for(var s in stopsJson){
        var data = stopsJson[s];
        stops.push(new Step({
            idNumber: data.idNumber,
            type: data.type,
            marker: null, //TODO: create marker
            title: data.title,
            description: data.description,
            distance: data.distance,
            reward: data.reward,
            url: data.url,
            screens: parseScreensJSON(data.screens)
        }));
    }
    return stops;
}

function parseScreens(screens){
    var sc = [];
    for(var s in screens){
        sc.push(parseScreen(screens[s]));
    }
    return sc;
}

function parseScreen(screen){
    var json = JSON.parse(screen.data);
    return new Screen({
        id: screen.id,
        type: json.type,
        title: json.title,
        text: json.text,
        image: json.image,
        clue: json.clue,
        challenge: json.challenge
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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

function gameTypeToUrl(type){
    if(type == "FollowThePath") return "follow-the-path";
    if(type == "TreasureHunt") return "treasure-hunt";
}

function addMetersToCoordinates(coords, x, y){
    var xx = x * 0.0000089;
    var yy = y * 0.0000089;
    return {lat: coords.lat + yy, lng: coords.lng + xx / Math.cos(coords.lng * 0.018)}
}