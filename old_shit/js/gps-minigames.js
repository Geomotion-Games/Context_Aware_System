
/*****************************************/
/*    GENERIC FUNCTIONS FOR ALL GAMES    */
/*			  Geomotion Games			 */
/*****************************************/

var mapLoaded = false;
var dataLoaded = false;
var game = {};
var markers = [];

function getMinigame() {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var minigame = JSON.parse(this.responseText);
	    	dataLoaded = true;
	    	setTimeout(function() {
				gameReady(minigame);
			}, 3000);
	    }
	};

	xhttp.open("GET", "getMinigame.php?minigame=" + minigame_number, true);
	xhttp.send();
}

function gameReady(minigame) {

	game = minigame;
	var pointList = [];

	for (step in game) {
		var latlng = { "lat": game[step].lat, "lng": game[step].lng };
		var marker = L.marker(latlng, { icon: stopIcon }).addTo(map);
		markers.push(marker);
		pointList.push(latlng);

		var POIInfo = `
			<a href="#modal` + game[step].idNumber + `" id="openModal` + game[step].idNumber + `" style="display: none;">Open Modal</a>
			<div id="modal` + game[step].idNumber + `" class="modalDialog">
				<div>
					<a href="#close" title="Close" class="close">X</a>
					<h2>` + game[step].title + `</h2>
					<p>` + game[step].description + `</p>
				</div>
			</div>
		`;

		var extras = document.getElementById("extras");
		extras.innerHTML += POIInfo;
	}

	map.removeLayer(markers[0]);
	map.removeLayer(markers[markers.length -1]);

	var start = markers[0];
	start.bindTooltip("Start", 
    {
        permanent: true, 
        direction: 'bottom'
    }).addTo(map);

    var end = markers[markers.length - 1];
	end.bindTooltip("End", 
    {
        permanent: true, 
        direction: 'bottom'
    }).addTo(map);

	
	markers.splice(0, 0, start);
	markers.push(end);

	var path = new L.Polyline(pointList, {
    	color: 'green',
    	weight: 4,
    	opacity: 0.6,
    	smoothFactor: 1
	});

	path.addTo(map);

	document.getElementById('openModal0').click();
}

function locate() {

	if (navigator.geolocation) {
		setTimeout(function() {
			navigator.geolocation.getCurrentPosition(function(position) {
				newLocation(position);
				mapLoaded = true;
				locate();
			}, errorHandler, { enableHighAccuracy: true });
		}, 3000);
	} else {
		document.getElementById("message").innerHTML = "Geolocation is not supported by this browser.";
	}
}

function refreshUserMarker(coors) {
	if (mapLoaded != 0) {
		map.removeLayer(marker);
	}

	marker = L.marker(coors, { icon: locationIcon }).addTo(map);
}

function getFollowingPOIId(nextPOI) {

	var followingId = -2;
	for (poi in game)
	{
		if (game[poi].idNumber == nextPOI)
		{ 
			followingId = -1;
		}
		else if (followingId == -1)
		{ 
			return game[poi].idNumber;
		}
	}

	// -2 does not exist 
	// -1 is the last
	return followingId;
}

function errorHandler(err) {

	switch(err.code) {
        case err.TIMEOUT:
            document.getElementById("message").innerHTML = 'Geolocation Timeout';
            break;
        case err.POSITION_UNAVAILABLE:
            document.getElementById("message").innerHTML = 'Geolocation Position unavailable';
            break;
        case err.PERMISSION_DENIED:
            document.getElementById("message").innerHTML = 'Geolocation Permission denied';
            break;
        default:
            document.getElementById("message").innerHTML = 'Geolocation returned an error.code';
    }
}

function distanceInMetersFromPoints(p1,p2) {
	var lat1 = p1.lat;
	var lon1 = p1.lng;
	var lat2 = p2.lat;
	var lon2 = p2.lng;
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = Math.ceil(R * c * 1000); // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}
