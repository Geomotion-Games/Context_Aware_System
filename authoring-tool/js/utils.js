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

function saveMinigame() {

    /*var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
     console.log(this.responseText);
     alert("Go to: \nhttps://www.geomotiongames.com/beaconing/client.php?minigame=" + this.responseText.replace(/ /g,''));
     }
     };*/

    var minigame = JSON.stringify(getMinigameJson(), null, 2);
    console.log(minigame);

    //xhttp.open("GET", "https://www.geomotiongames.com/beaconing/saveMinigame.php?minigame=" + minigame, true);
    //xhttp.send();
}

function getMinigameJson() {
    var json = {};
    for (var step in points) {
        json[points[step].idNumber] = points[step].toJSON();
    }
    return json;
}

function parseMinigameJSON(id, json){
    var data = JSON.parse(json);

    return new Game({
        id: id, 
        name: data.name, 
        description: data.description, 
        time: data.time, 
        public: data.public,
        stops: parseStopsJSON(data.stops)
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
