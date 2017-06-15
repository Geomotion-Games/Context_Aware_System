function Step(marker, number) {
    this.idNumber 	 = number;
    this.marker 	 = marker;
    this.title 	 	 = "";
    this.description = "";
    this.distance 	 = 20;
    this.reward 	 = 0;
    this.url 		 = "";
    this.screens	 = [
        new Screen({type:"type A", title: "Titulooooooo", description: "Descripciooooooooon"}),
        new Screen({type:"type B", description: "description"}),
        new Screen({type:"type C", description: "description"})
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

function Screen(params){
    this.type = params.type;
    this.title = params.title;
    this.description = params.description;
}

