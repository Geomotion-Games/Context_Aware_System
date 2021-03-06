/* COMMON FUNCTIONS FOR GPs */

function getTodaysDate() {
	var today = new Date();
	var milis = today.getMilliseconds();
	var s = today.getSeconds();
	var m = today.getMinutes();
	var h = today.getHours();
	/*var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();*/

	/*if(dd<10) {
	    dd = '0'+dd
	} 

	if(mm<10) {
	    mm = '0'+mm
	} */

	return h + "-" + m + "-" + s + "-" + milis;
}

$("#topBar").on('swipeleft swiperight', function(e){
    e.preventDefault();
});

function getEarnedPoints() {
    var pointsEarned = 0;
    for (step in game) { //TODO posarho a th
        if (step != 0 && step != 999 && currentPOI >= step) {
            pointsEarned += parseInt(game[step]["rewardPoints"]);
        }
    }
    return pointsEarned;
}

function uploadVideo(options){
        var file = options.file;
        if(!file) return;

        var filetype = file.type;

        var match = ["video/mp4"];

        if(match.indexOf(filetype) == -1){
            return false;
        } else {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("screenId", options.screenId);

            showSpinner();

            $.ajax({
                url: "php/uploadVideo.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    console.log("hiding spinner");
                    hideSpinner();
                    if (data.startsWith("ok")) {
                        var url = data.split("-")[1];
                        console.log("Succes upload: " + url);
                        options.postCallback(true);
                    } else {
                        $("#uploadingVideo").modal('hide');
                        showWarning(l("video_exceeds"));
                        console.log("Error upload: " + data);
                    }
                },
                error: function(data) {
                    hideSpinner();
                    console.log("error uploading...");
                }
            });
        }
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

function showSpinner() {
    $("#spinner").css("display", "block");
}

function hideSpinner() {
    $("#spinner").css("display", "none");
}


function uploadImage(options){
        var file = options.file;
        if(!file) return;
        var imagefile = file.type;
        var match= ["image/jpeg","image/png","image/jpg"];
        if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))){
            return false;
        } else {
            var formData = new FormData();
            formData.append("gameId", options.gameId);
            formData.append("file", file);
            formData.append("poiNum", options.poiNum);
            formData.append("currentDate", getTodaysDate())

            showSpinner();

            $.ajax({
                url: "app/uploadImages.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                success: function(data){
                    hideSpinner();
                    if (data.startsWith("ok")) {
                        console.log("Succes upload");
                        options.postCallback(true);
                    } else {
                        alert(l("image_exceeds"));
                        console.log("Error upload: " + data);
                    }
                },
                error: function(data) {
                    hideSpinner();
                    console.log("error uploading...");
                }
            });
        }
}


function parseYoutubeOrVimeoURL(url) {
	var type = "";
	url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo.com|youtu(be.com|.be|be.googleapis.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

	if (RegExp.$3.indexOf('youtu') > -1) {
	    type = 'youtube';
	} else if (RegExp.$3.indexOf('vimeo') > -1) {
	    type = 'vimeo';
	} else {
	    console.log("Could not extract video ID.");
	    return;
	}

	return (type == "youtube" ? "https://www.youtube.com/embed/" : "https://player.vimeo.com/video/") + RegExp.$6;
}

function getInventoryProgressAsString(game) {

	var totalItems = 0; //Number of collectables
	var currentProgress = 0; //Number of collectables collected

	for (step in game) {

		if (game[step].hasOwnProperty("item") && game[step].item !="" && game[step].item) {

			if (parseInt(step) <= parseInt(currentPOI)) {
				currentProgress += 1;
			}

			totalItems++;
		}
	}

	return currentProgress + "/" + totalItems; //TODO current POI no, contar quants en porta
}


function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function remainingTime() {
    var now = new Date().getTime();
    var time_spent = now - parseInt(startingTime);
    return Math.round(time_limit - time_spent/1000);
}

function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}

function fbshare() {

    var hashtag = "#BeaconingEU";
    var via = "@BeaconingEU";

    // Bobo
    if (game_id == 487) {
        hashtag = "#bobopulpin";
        via = "@bobopulpin";
    // Bella
    } else if (game_id == 488) {
        hashtag = "#BellavistaBcn";
        via = "@BellavistaBcn";
    }

    FB.ui({
        method: 'share',
        href: 'http://beaconing.eu/',
        hashtag: hashtag,   
        quote: via
    }, function(response){});
}
