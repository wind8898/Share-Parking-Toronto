

var map = L.map("map3").setView([43.668094, -79.397544], 13);

function whereAmI() {
    var myresult = document.getElementById("demo");
    if (!navigator.geolocation) {
        myresult.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }
    function success(position) {
        var latitude = position.coords.latitude;
        var longitude =position.coords.longitude;
        myresult.innerHTML = "<p>Latitude is " + latitude + "<br>Longitude is " + longitude + "</p>";
        makeMyMap(latitude, longitude);
    }
    function error() {
        myresult.innerHTML = "Unable to retrieve your location";
    }
    myresult.innerHTML = "<p>Locating...</p>";
    navigator.geolocation.getCurrentPosition(success, error);
    }

function makeMyMap(mylat,mylong) {
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
accessToken: API_KEY
}).addTo(map);
 
L.marker([mylat,mylong]).addTo(map)
        .bindPopup("<b>You are here!</b>").openPopup();
    L.circle([mylat,mylong], 500, {
        color: 'red',
        fillColor: '#f2d5df',
        fillOpacity: 0.2
    }).addTo(map).bindPopup("");
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on("click", onMapClick);

};

whereAmI();