var points = [];
var poisCreated = 0;
var beacons = [];

//--- STEP

function Step(params) {
    this.idNumber 	 = params.idNumber;
    this.type        = params.type || "normal"; // normal, beacon
    this.marker 	 = params.marker;
    this.title 	 	 = params.title;
    this.description = params.description;
    this.distance 	 = params.distance;
    this.reward 	 = params.reward;
    this.url 		 = params.url;
    this.screens	 = params.screens || [
        new Screen({type:"A", title: "The Robot", text: "Alfred is building a robot that will help the Earth Special Agents on their duty. The problem is that he needs 3 unique sensors to finish it that you will find exploring the real world. Check in those hidden places to unlock clues to the next point. Are you ready?"}),
        new Screen({type:"B"}),
        new Screen({type:"C", title: "The Robot", image: "images/poi2-image.png", text: "Yes! you did it! The second sensor is in your hands. The Infrared Sensor is a digital sensor that can detect infrared light reflected from solid objects. It can also detect infrared light signals sent from the Remote Infrared Beacon. Only 1 sensor left. Let's do this! Check in now to show the clue to the next point"})
    ];
}

Step.prototype.toJSON = function() {
    var json = {
        "idNumber" 	  : this.idNumber,
        "type"        : this.type,
        "title" 	  : this.title,
        "description" : this.description,
        "lat"		  : this.marker ? this.marker.getLatLng().lat : 0,
        "lng" 		  : this.marker ? this.marker.getLatLng().lat : 0,
        "distance" 	  : this.distance,
        "reward" 	  : this.reward,
        "url" 		  : this.url,
        "screens"	  : this.screens.map(function(screen){
            return screen.toJSON();
        })
    };

    return json;
};

Step.prototype.copy = function() {
    var copy = new Step({
        marker: this.marker,
        idNumber: this.idNumber,
        type: this.type,
        title: this.title,
        description: this.description,
        distance: this.distance,
        reward: this.reward,
        url: this.url,
        screens: this.screens
    });

    return copy;
};

//---


//--- SCREEN

function Screen(params){
    this.type = params.type;
    this.title = params.title;
    this.text = params.text;
    this.image = params.image;
}

Screen.prototype.toJSON = function() {
    var json = {
        "type"  : this.type,
        "title" : this.title,
        "text"  : this.text,
        "image" : this.image
    };

    return json;
};

Screen.prototype.copy = function() {
    var copy = new Screen({
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

    this.id = params.id || 0;
    this.name = params.name || "Game name";
    this.description = params.description || "Game description";
    this.time = params.time || 0;
    this.public = params.public || false;
    this.stops = params.stops || defaultStops;
}

Game.prototype.toJSON = function() {
    var json = {
        "name"          : this.name,
        "description"   : this.description,
        "time"          : this.time,
        "public"        : this.public,
        "stops"         : this.stops.map(function(stop){
            return stop.toJSON();
        })
    };

    return json;
};

Game.prototype.copy = function(){
   var copy = new Game({
       id: this.id,
       name: "Copy of " + this.name,
       description: this.description,
       time: this.time,
       public: this.public,
       stops: this.stops
   });

    return copy;
};

//---

function Beacon(params){
    this.name = params.name;
    this.id = params.beaconId;
    this.active = params.active;
    this.qr = params.qr;
    this.lat = params.lat;
    this.lng = params.lng;
}

