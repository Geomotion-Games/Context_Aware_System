function parsePlotJSON(data){
    return new Game({
        id: data.id, 
        type: data.type,
        name: data.name, 
        description: data.description, 
        time: parseInt(data.time), 
        last_update: data.last_update,
        public: data.public == 1 ? true : false
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
    var isTeamGame = teams.length > 0;
    var team = isTeamGame ? getTeamNumberFromId(p.team) : 0;
    var color = isTeamGame ? teams[getTeamNumberFromId(p.team)].color : colorNames[0];

    return new Step({
        id: p.id,
        plot: parseInt(p.plot),
        title: p.title,
        orderNumber: p.orderNumber,
        type: p.type,
        marker: p.type == "normal" && typeof(addMarker) == "function" ? addMarker({lat: p.lat, lng: p.lng}, true, team, color) : null,
        lat: p.lat,
        lng: p.lng,
        beaconId: p.beaconId,
        triggerDistance: p.triggerDistance,
        rewardPoints: p.rewardPoints,
        item: p.item,
        itemName: p.itemName,
        team: p.team
    });
}

function parseTeam(t){
    return new Team({
        id: t.id,
        members: t.members,
        color: t.color,
        plot: t.plot
    });
}

function parseTeams(teamsJSON){
    var teams = [];
    for(var s in teamsJSON){
        var data = teamsJSON[s];
        teams.push(parseTeam(data));
    }
    return teams;
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