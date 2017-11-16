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

function timestampToDate(timestamp){
    if(!timestamp) return Date.now();
    var t = timestamp.split(/[- :]/);
    var localDate = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    var utcDate = toUTC(localDate);
    return typeof moment !== 'undefined' ? moment(moment.utc(utcDate)).local().format("YYYY-MM-DD H:mm"): utcDate;
}

function toUTC(date){
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
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

function getBaseURL(){
    var url = "";
    if(!isPre() && !isLocalHost()){ // isPRO
        url = "https://www.geomotiongames.com/beaconing/authoring-tool/";
    }else if(isPre()){ // isPRE
        url = "https://www.geomotiongames.com/pre/beaconing/authoring-tool/";
    }else{ // isLOCALHOST
        url = "/"
    }
    return url;
}

function generateGameUrl(game){
    var pre = isPre() ? "pre/" : "";
    var url = "https://www.geomotiongames.com/" + pre + "beaconing/app/app.php?game=" + game.id + "&device=browser";
    return url;
}

function getYoutubeVideoID(url){
    console.log("url: " + url)
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if ( match && match[7].length == 11 ){
        return match[7];
    }else{
        console.log("Could not extract video ID.");
    }
}

function isPre(){
    return (window.location.href).includes("/pre/");
}

function isLocalHost(){
    return  (window.location.href).includes("localhost");
}

function addMetersToCoordinates(coords, x, y){
    var xx = x * 0.0000089;
    var yy = y * 0.0000089;
    return {lat: coords.lat + yy, lng: coords.lng + xx / Math.cos(coords.lng * 0.018)}
}