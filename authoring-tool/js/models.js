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
    this.beaconId = params.beaconId || 0,
    this.title = params.title;
    this.triggerDistance = params.triggerDistance || 20;
    this.rewardPoints = params.rewardPoints || 10;
    this.item = params.item;
    this.itemName = params.itemName || "";

    this.marker = params.marker;
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
        this.challengeUploadType = params.challenge.uploadType || "";
    }
}

Screen.prototype.toJSON = function() {
    var challenge = {};
    if(this.challengeType != ""){
        challenge.type = this.challengeType;
        if(this.challengeURL != "")challenge.url = this.challengeURL;
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
    this.type = params.type || "FollowThePath";
    this.name = params.name || "Game name";
    this.description = params.description || "Game description";
    this.time = params.time || 0;
    this.public = params.public || false;
    this.last_update = timestampToDate(params.last_update);
    this.stops = params.stops || defaultStops;
}

Game.prototype.toJSON = function() {
    var json = {
        "id"            : this.id,
        "name"          : this.name,
        "type"          : this.type,
        "description"   : this.description,
        "time"          : this.time,
        "public"        : this.public ? 1 : 0,
        "last_update"   : this.last_update
    };

    return json;
};

Game.prototype.copy = function(){
    var copy = new Game({
        id: this.id,
        type: this.type,
        name: "Copy of " + this.name,
        description: this.description,
        time: this.time,
        last_update: moment().format("YYYY-MM-DD H:mm"),
        public: this.public,
        stops: this.stops
    });

    return copy;
};

//--- BACON

function Beacon(params){
    this.name = params.name;
    this.id = params.beaconId;
    this.active = params.active;
    this.qr = params.qr;
    this.lat = params.lat;
    this.lng = params.lng;
}

function Student(params){
    this.id = params.id;
    this.name = params.name;
}

function Team(params){
    this.id = params.beaconId;
    this.members = params.members;
}
