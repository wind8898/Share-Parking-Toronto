

var map = L.map("map3", {
    center: [43.668094, -79.397544],
    zoom: 13
  });

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
/* data route */
var url_near = "/api/get_parking_spots";

function nearbyparking(response){
    // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
    for (var i = 0; i < response[0].address.length; i++) {
        
      coordinates = [response[0].lat[i], response[0].lng[i]];
      //parkingMarkers.push(
        L.marker(coordinates)
        .bindPopup("<h3>Address:" + response[0].address[i] + "</h3> <hr> <h3>Price per 30 min: " + response[0].rate_per_half_hour[i]+ " CAD </h3>")
        .addTo(map);
      //)
    } 
  }

d3.json(url_near).then(function(response) {
    console.log(response);
    nearbyparking(response);  
});
