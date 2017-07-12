function locate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var coors = {lng: position.coords.longitude, lat: position.coords.latitude};
                map.panTo(coors);
                map.setZoom(15);
            });
    } else {
        coordinates.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showLocation(position) {
    var coords = {lng: position.coords.longitude, lat: position.coords.latitude};
    map.panTo(position);
}

function saveMinigame(game) {

    var minigame = JSON.stringify(game.toJSON());
    var id = game.id;

    console.log(minigame);
    var request = $.ajax("save.php?id=" + id + "&minigame=" + minigame);
    if(id == null) request = $.ajax("save.php?minigame=" + minigame);

    request.done(function(data) {
        console.log("Saved! " + data);
    });
    request.fail(function() {
        console.log("Error saving...");
    })
}

function parsePlotJSON(data){
    return new Game({
        id: data.id, 
        type: data.type,
        name: data.name, 
        description: data.description, 
        time: data.time, 
        public: data.public==1 ? true : false
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

function parseScreensJSON(screensJson){
    var screens = [];
    for(var s in screensJson){
        var data = screensJson[s];
        screens.push(new Screen({
            type: data.type,
            title: data.title,
            text: data.text,
            image: data.image,
        }));
    }
    return screens;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
