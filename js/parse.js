function parsePlotJSON(data){
    return new Game({
        id: data.id, 
        type: data.type,
        name: data.name, 
        description: data.description, 
        time: parseInt(data.time), 
        last_update: data.last_update,
        public: data.public == 1 ? true : false,
        user_id: data.user_id,
        user_name: data.user_name
    });
}

function parsePOIS(pois){
    var ps = [];
    pois.forEach(function(p){
        ps.push(parsePOI(p));
    });
    return ps;
}

function parsePOI(p){

    var s = new Step({
        id: p.id,
        plot: parseInt(p.plot),
        title: p.title,
        orderNumber: p.orderNumber,
        type: p.type,
        marker: p.type == "normal" && typeof(addMarker) == "function" ? addMarker({lat: p.lat, lng: p.lng}, true) : null,
        lat: p.lat,
        lng: p.lng,
        beaconId: p.beaconId,
        triggerDistance: p.triggerDistance,
        rewardPoints: p.rewardPoints,
        item: p.item,
        itemName: p.itemName,
        data: p.data
    });

    return s;
}

function parseStopsJSON(stopsJson){
    var stops = [];
    for(var s in stopsJson){
        var data = stopsJson[s];
        stops.push(new Step({
            idNumber: data.idNumber,
            type: data.type,
            marker: null, //TODO: create marker
            title: data.title,
            description: data.description,
            distance: data.distance,
            reward: data.reward,
            url: data.url,
            screens: parseScreensJSON(data.screens)
        }));
    }
    return stops;
}

function parseScreens(screens){
    var sc = [];
    for(var s in screens){
        sc.push(parseScreen(screens[s]));
    }
    return sc;
}

function parseScreen(screen){
    var json = JSON.parse(screen.data);
    console.log(json)
    return new Screen({
        id: screen.id,
        type: json.type,
        title: json.title,
        text: json.text,
        image: json.image,
        youtubeOrVimeoURL: json.youtubeOrVimeoURL,
        uploadedVideo: json.uploadedVideo,
        mediaType: json.mediaType,
        clue: json.clue,
        challenge: json.challenge
    });
}