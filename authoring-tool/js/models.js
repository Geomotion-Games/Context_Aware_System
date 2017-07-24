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

    this.marker = params.marker;
}

Step.prototype.toJSON = function() {
    var json = {
        "id": this.id,
        "type": this.type,
        "lat": this.marker ? this.marker.getLatLng().lat : 0,
        "lng": this.marker ? this.marker.getLatLng().lng : 0,
        "orderNumber": this.orderNumber,
        "beaconId": this.beaconId,
        "title": this.title,
        "triggerDistance": this.triggerDistance,
        "rewardPoints": this.rewardPoints,
        "item": this.item
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
}

Screen.prototype.toJSON = function() {
    var json = {
        "id": this.id,
        "data": JSON.stringify({
            "type": this.type,
            "title" : this.title,
            "text"  : this.text,
            "image" : this.image
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
        image: this.image
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
    };

    return json;
};

Game.prototype.copy = function(){
   var copy = new Game({
       type: this.type,
       name: "Copy of " + this.name,
       description: this.description,
       time: this.time,
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

