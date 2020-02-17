var myMap = L.map("curr_loc_map", {
    center: [43.668094, -79.397544],
    zoom: 13
  });

// var mylat = 43.668094;
// var mylong =-79.397544;
// var rate = 2;

var mylat = document.getElementById("lat").innerHTML
var mylong = document.getElementById("lng").innerHTML
var rate = document.getElementById("rate").innerHTML

console.log(mylat)
console.log(mylong)
console.log(rate)

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var SpotIcon = L.icon({
  iconUrl: '../static/asset/img/smile.png',
  iconSize:     [36, 36]
  // iconAnchor:   [22, 94], 
  // popupAnchor:  [-3, -76] 
})

L.marker([mylat, mylong],  {icon: SpotIcon})
.bindPopup("<h6>Your are here, your rate is: " + rate*2 + " CAD/Hour</h6>")
.addTo(myMap).openPopup();


// function displaynearby() {

//   var url = "/api/get_nearby_spots";
//   d3.json(url).then(function(response) {
//   console.log(response)
//   NearbyMarkers(response);
  
// });

// }

var url = "/api/get_nearby_spots";

d3.json(url).then(function(response) {
  console.log(response)
  NearbyMarkers(response);
  
});



function NearbyMarkers(response){
  // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
  for (var i = 0; i < response[0].Location_Address.length; i++) {
      
    coordinates = [response[0].lat[i], response[0].lng[i]];
      L.marker(coordinates)
      .bindPopup(`<h6>${response[0].Location_Name[i]} </h6><br><h6> Rate : ${response[0].Location_Price_Hour[i]} per hour </h6><br><h6> Address : ${response[0].Location_Address[i]} </h6>`)
      .addTo(myMap);
  } 
}

