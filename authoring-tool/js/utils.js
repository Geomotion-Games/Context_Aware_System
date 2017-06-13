function locate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var coors = {lng: position.coords.longitude, lat: position.coords.latitude};
                map.panTo(coors);
                map.setZoom(15);
            });
    } else {
        coordinates.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showLocation(position) {
    var coords = {lng: position.coords.longitude, lat: position.coords.latitude};
    map.panTo(position);
}
