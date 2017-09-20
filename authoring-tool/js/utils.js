var lastLocation = loadLastLocation();

function locate() {
    if(lastLocation){
        map.setView(lastLocation, 15);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if(!lastLocation || (lastLocation.lat != position.coords.latitude || lastLocation.lng != position.coords.longitude)){
                    lastLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                    map.setView(lastLocation, 15);
                    saveLastLocation(lastLocation);
                }
            });
    } else {
        coordinates.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showLocation(position) {
    var coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    map.panTo(position);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loadLastLocation(){
    var lastLocation = localStorage.getItem("lastLocation");
    return lastLocation ? JSON.parse(lastLocation) : null;
}

function saveLastLocation(location){
    localStorage.setItem("lastLocation", JSON.stringify(location));
}

function gameTypeToUrl(type){
    if(type == "FollowThePath") return "follow-the-path";
    else if(type == "TreasureHunt") return "treasure-hunt";
    else if(type == "RatRace") return "rat-race";
    else if(type == "Jigsaw") return "jigsaw";
    else if(type == "CaptureTheFlag") return "rat-race";
    else if(type == "Conquest") return "conquest";
    else if(type == "Stratego") return "stratego";
}

function gameTypeToDisplayName(type){
    if(type == "FollowThePath") return "Follow The Path";
    else if(type == "TreasureHunt") return "Treasure Hunt";
    else if(type == "RatRace") return "Rat Race";
    else if(type == "Jigsaw") return "Jigsaw";
    else if(type == "CaptureTheFlag") return "Capture The Flag";
    else if(type == "Conquest") return "Conquest";
    else if(type == "Stratego") return "Stratego";
}

function addMetersToCoordinates(coords, x, y){
    var xx = x * 0.0000089;
    var yy = y * 0.0000089;
    return {lat: coords.lat + yy, lng: coords.lng + xx / Math.cos(coords.lng * 0.018)}
}