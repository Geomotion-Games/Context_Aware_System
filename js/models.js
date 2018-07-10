var points = [];
var poisCreated = 0;
var beacons = [];

//--- STEP

function Step(params) {
    this.id = params.id ? parseInt(params.id) : null;
    this.plot = params.plot;
    this.type = params.type || "normal"; // normal, beacon
    this.lat = params.lat || 0;
    this.lng = params.lng || 0;
    this.orderNumber = params.orderNumber || 0;
    this.beaconId = params.beaconId || "";
    this.title = params.title;
    this.triggerDistance = params.triggerDistance || 30;
    this.rewardPoints = params.rewardPoints || 10;
    this.item = params.item;
    this.itemName = params.itemName || "";
    this.marker = params.marker;
    this.data = params.data || "";
}

Step.prototype.toJSON = function() {
    var json = {
        "id": this.id,
        "type": this.type,
        "lat": this.marker ? this.marker.getLatLng().lat : this.lat,
        "lng": this.marker ? this.marker.getLatLng().lng : this.lng,
        "orderNumber": this.orderNumber,
        "beaconId": this.beaconId,
        "title": this.title,
        "triggerDistance": this.triggerDistance,
        "rewardPoints": this.rewardPoints,
        "item": this.item,
        "itemName": this.itemName
    };

    return json;
};

Step.prototype.copy = function() {
    var copy = new Step({
        id: this.id,
        plot: this.plot,
        type: this.type,
        orderNumber: this.orderNumber,
        beaconId: this.beaconId,
        title: this.title,
        triggerDistance: this.triggerDistance,
        rewardPoints: this.rewardPoints,
        item: this.item,
        itemName: this.itemName,
        marker: this.marker
    });

    return copy;
};

//---


//--- SCREEN

function Screen(params){
    this.id = parseInt(params.id);
    this.type = params.type;
    this.title = params.title || "";
    this.text = params.text || "";
    this.image = params.image;
    this.youtubeOrVimeoURL = params.youtubeOrVimeoURL || "";
    this.uploadedVideo = params.uploadedVideo || "";
    this.mediaType = params.mediaType || "image";
    this.clue = params.clue || "";
    if(params.challenge){
        this.challengeType = params.challenge.type || "";
        this.challengeURL = params.challenge.url || "";
        //this.challengeID = params.challenge.id || "";
        this.challengeUploadType = params.challenge.uploadType || "";
    }
}

Screen.prototype.toJSON = function() {
    var challenge = {};
    if(this.challengeType != ""){
        challenge.type = this.challengeType;
        if(this.challengeURL != "")challenge.url = this.challengeURL;
        //if(this.challengeID != "")challenge.id = this.challengeID;
        if(this.challengeUploadType != "")challenge.uploadType = this.challengeUploadType;
    }
    var json = {
        "id": this.id,
        "data": JSON.stringify({
            "type": this.type,
            "title" : this.title,
            "text"  : this.text,
            "image" : this.image,
            "youtubeOrVimeoURL" : this.youtubeOrVimeoURL,
            "uploadedVideo": this.uploadedVideo,
            "mediaType" : this.mediaType,
            "clue"  : this.clue,
            "challenge": challenge
        })
    };

    return json;
};

Screen.prototype.copy = function() {
    var copy = new Screen({
        id: this.id,
        type: this.type,
        title: this.title,
        text: this.text,
        image: this.image,
        youtubeOrVimeoURL: this.youtubeOrVimeoURL,
        uploadedVideo: this.uploadedVideo,
        mediaType: this.mediaType,
        clue: this.clue
    });

    return copy;
};

//--- GAME

function Game(params){
    var defaultStops = [];
    defaultStops[0]   = new Step({marker: 0, idNumber: 0});
    defaultStops[999] = new Step({marker: 0, idNumber: 999});

    this.id = params.id || null;
    this.user_id = params.user_id || null;
    this.user_name = params.user_name || null;
    this.type = params.type || "FollowThePath";
    this.name = params.name || l("game_name");
    this.description = params.description || l("game_description");
    this.time = params.time || 0;
    this.public = params.public || false;
    this.last_update = timestampToDate(params.last_update);
    this.stops = params.stops || defaultStops;
    this.singlepoi = params.singlepoi == "1";
    this.callbackurl = params.callbackurl || "";
    this.updateurl = params.updateurl || "";
    this.origin = params.origin || "atcc";
}

Game.prototype.toJSON = function() {
    var json = {
        "id"            : this.id,
        "name"          : this.name,
        "type"          : this.type,
        "description"   : this.description,
        "time"          : this.time,
        "public"        : this.public ? 1 : 0,
        "last_update"   : this.last_update,
        "user_id"       : this.user_id,
        "user_name"     : this.user_name,
        "singlepoi"     : this.singlepoi
    };

    return json;
};

Game.prototype.copy = function(){

    var copy = new Game({
        id          : this.id,
        type        : this.type,
        name        : "Copy of " + this.name,
        description : this.description,
        time        : this.time,
        last_update : moment().format("YYYY-MM-DD H:mm"),
        public      : this.public,
        stops       : this.stops,
        user_id     : userId,
        user_name   : userName,
        singlepoi   : this.singlepoi
    });

    return copy;
};

Game.prototype.toGLPJSON = function() {
    var pois = [];

    for ( point in points ) {

        /*"value":"https://beaconing.seriousgames.it/games/solveit/?session_id=7938148887",
         "name":"4600",
         "descr":"",
         "type":"minigameURL",
         "locked":"false",
         "type":"beacon/gps"
         "whereInGLP":"(Mission0)/(Quest0)",
         "outputs":[  
            "4601"
         ]*/

        var type = "checkIn";
        var value = "";

        if (points[point].hasOwnProperty("data") && points[point]["data"] != "" ) {
            var data = points[point]["data"]; 
            if (data.hasOwnProperty("challenge")) {
                if (data["challenge"]["type"] == "minigame") { 
                    type = "minigameURL";
                    value = data["challenge"]["url"] ? data["challenge"]["url"] : "";
                }
                else if (data["challenge"]["type"] == "upload_content") {
                    type = "uploadContent";
                    value = data["challenge"]["uploadType"];
                }
            }    
        }

        var followingId = -2;
        for (p in points) {
            if (point == p) {
                followingId = -1;
            } else if (followingId == -1) {
                followingId = p;
                break;
            }
        }

        var fid = [];
        if (followingId > 0) { fid[0] = points[followingId].id; }

        var stage0URL = "https://atcc.beaconing.eu/app.php?game=" + this.id + "&map=" + parseInt(point);
        var stage1URL = "https://atcc.beaconing.eu/app.php?game=" + this.id + "&teleport=" + parseInt(points[point].id);
        var stage2URL = "https://atcc.beaconing.eu/app.php?game=" + this.id + "&step=" + (parseInt(point) + 1);

        let coords;
        try {
            coords = points[point].marker._latlng;
        } catch(err) {
            coords = { lat:parseFloat(points[point].lat), lng:parseFloat(points[point].lng) };
        }

        var poiJSON = {
            "value"       : value,
            "name"        : points[point].id,
            "descr"       : points[point].title || l("stop") + " " + (parseInt(point)+1),
            "type"        : type, // minigameURL / uploadContent / checkIn
            "beacon"      : points[point].type == "beacon",
            "locked"      : false,
            "playURL"     : [stage0URL, stage1URL, stage2URL],
            "whereInGLP"  : "", // '(Mission0)/(Quest0)',
            "outputs"     : fid, //id of the next poi
            "coordinates" : coords,
            "beaconId"    : ""+points[point].beaconId
        };

        pois.push( poiJSON );
    }

    var accessCode = getCookie("accessCode");

    var json = {
        "gameid"   : this.id,
        "gpi"      : pois,
        "glpid"    : glpid,
        "startURL" : "https://atcc.beaconing.eu/app.php?game=" + this.id,
        "endURL"   : "https://atcc.beaconing.eu/app.php?game=" + this.id + "&teleport=finish",
        "accessCode": accessCode
    };

    return json;
};

//--- BEACON

function Beacon(params){
    this.name = params.name;
    this.id = params.beaconId;
    this.active = params.active;
    this.qr = params.qr;
    this.lat = params.lat;
    this.lng = params.lng;
}

function Minigame(params){
    this.id = params.id;
    this.name = params.name;
}

function Student(params){
    this.id = params.id;
    this.name = params.name;
}

function Team(params){
    this.id = params.beaconId;
    this.members = params.members;
}
