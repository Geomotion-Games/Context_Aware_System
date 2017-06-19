var points = [];
var poisCreated = 0;

function Step(marker, number) {
    this.idNumber 	 = number;
    this.marker 	 = marker;
    this.title 	 	 = "";
    this.description = "";
    this.distance 	 = 20;
    this.reward 	 = 0;
    this.url 		 = "";
    this.screens	 = [
        new Screen({type:"A", title: "Titulooooooo", description: "Descripciooooooooon"}),
        new Screen({type:"B", description: "description"}),
        new Screen({type:"C", description: "description"})
    ];
}

Step.prototype.toJSON = function() {

    var json = {
        "idNumber" 	  : this.idNumber,
        "title" 	  : this.title,
        "description" : this.description,
        "lat"		  : this.marker ? this.marker.getLatLng().lat : 0,
        "lng" 		  : this.marker ? this.marker.getLatLng().lat : 0,
        "distance" 	  : this.distance,
        "reward" 	  : this.reward,
        "url" 		  : this.url,
        "screens"	  : this.screens

    };

    return json;
};


Step.prototype.copy = function() {
    var copy = new Step(this.marker, this.idNumber);

    copy.title 	 	 = this.title;
    copy.description = this.distance;
    copy.distance 	 = this.distance;
    copy.reward 	 = this.reward;
    copy.url 		 = this.url;
    copy.screens	 = this.screens;

    return copy;
};

function Screen(params){
    this.type = params.type;
    this.title = params.title;
    this.text = params.text;
    this.image = params.image;
    this.reward = params.reward;
}

