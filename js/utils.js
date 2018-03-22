var lastLocation = loadLastLocation();

function locate() {
    console.log("locate")
    if(lastLocation){
        map.setView(lastLocation, 15);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if(!lastLocation || (lastLocation.lat != position.coords.latitude || lastLocation.lng != position.coords.longitude)){
                    lastLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                    map.stop();
                    map.setView(lastLocation, 15);
                    saveLastLocation(lastLocation);
                }
            });
    } else {
        coordinates.innerHTML = `${ l("geo_not_supported") }`;
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
    if(!isLocalHost()){ // isPRO
        url = getATDomain();
    } else { // isLOCALHOST
        url = "/"
    }
    return url;
}

function generateGameUrl(game){
    var url = getAppDomain() + "app.php?game=" + game.id + "&device=browser";
    return url;
}

function parseYoutubeOrVimeoURL(url) {
    var type = "";
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        type = 'vimeo';
    }else{
        console.log("Could not extract video ID.");
        return;
    }

    return (type == "youtube" ? "https://www.youtube.com/embed/" : "https://player.vimeo.com/video/") + RegExp.$6;
}

function getATDomain() {
    if ((window.location.href).indexOf("atcc-qa") !== -1) {
        return "https://atcc-qa.beaconing.eu/";
    } else {
        return "https://atcc.beaconing.eu/";
    }
}

function getAppDomain() {
    if ((window.location.href).indexOf("atcc-qa") !== -1) {
        return "https://atcc-qa.beaconing.eu/";
    } else {
        return "https://atcc.beaconing.eu/";
    }
}

function isLocalHost(){
    return  (window.location.href).includes("localhost");
}

function addMetersToCoordinates(coords, x, y){
    var xx = x * 0.0000089;
    var yy = y * 0.0000089;
    return {lat: coords.lat + yy, lng: coords.lng + xx / Math.cos(coords.lng * 0.018)}
}

function l(string, extra) {
    if (!extra) {
        if (strings.hasOwnProperty(string)) {
            return strings[string];
        } else {
            return string;
        }
    } else {
        return strings[string].replace(/%s/g, extra);
    }
}





