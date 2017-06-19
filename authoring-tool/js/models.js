var points = [];
var poisCreated = 0;

function Step(params) {
    this.idNumber 	 = params.idNumber;
    this.marker 	 = params.marker;
    this.title 	 	 = params.title;
    this.description = params.description;
    this.distance 	 = params.distance;
    this.reward 	 = params.reward;
    this.url 		 = params.url;
    this.screens	 = [
        new Screen({type:"A", title: "Titulooooooo", description: "Descripciooooooooon"}),
        new Screen({type:"B", description: "description"}),
        new Screen({type:"C", description: "description"})
    ];
}

Step.prototype.toJSON = function() {
    return JSON.stringify(this);
    // var json = {
    //     "idNumber" 	  : this.idNumber,
    //     "title" 	  : this.title,
    //     "description" : this.description,
    //     "lat"		  : this.marker ? this.marker.getLatLng().lat : 0,
    //     "lng" 		  : this.marker ? this.marker.getLatLng().lat : 0,
    //     "distance" 	  : this.distance,
    //     "reward" 	  : this.reward,
    //     "url" 		  : this.url,
    //     "screens"	  : this.screens
    //
    // };
    //
    // return json;
};


Step.prototype.copy = function() {
    var copy = new Step({
        marker: this.marker,
        idNumber: this.idNumber,
        title: this.title,
        description: this.description,
        distance: this.distance,
        reward: this.reward,
        url: this.url,
        screens: this.screens
    });

    return copy;
};

function Screen(params){
    this.type = params.type;
    this.title = params.title;
    this.text = params.text;
    this.image = params.image;
    this.reward = params.reward;
}

function Game(params){
    this.name = params.name || "Game name";
    this.description = params.description || "Game description";
    this.time = params.time || 0;
    this.public = params.public || false;
    this.stops = params.stops || [];
}
