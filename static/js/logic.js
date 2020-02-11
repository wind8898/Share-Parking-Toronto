/*var myMap = L.map("map", {
    center: [43.651070, -79.347015],
    zoom: 12
  });
  */
  // Add a tile layer
 /* L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 100,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);*/

  
// Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});
var comicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.comic",
  accessToken: API_KEY
});
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

parkingMarkers = [];

  //function addMarkers() {
    /* data route */
  var url = "/api/get_parking_spots";
  d3.json(url).then(function(response) {

    console.log(response);
//    console.log(response[0].length);
  //  console.log(response[0].address.length);
    //console.log(response[0].lat[3]);

    //var coordinates = [];
    //var hoverText = [];

  // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
  /*for (var i = 0; i < response[0].address.length; i++) {
    //if(response[0].lat[i]  response[0].lng[i]])
    //coordinates.push([response[0].lat[i], response[0].lng[i]]);
    coordinates = [response[0].lat[i], response[0].lng[i]];
    parkingMarkers.push(L.marker(coordinates)
      .bindPopup("<h3>Address:" + response[0].address[i] + "</h3> <hr> <h3>Price per 30 min: " + esponse[0].price_per_half_hour[i]+ "</h3>")
    )
      //.addTo(myMap);
    //hoverText.push("<h1>Garage ID:" + response[0].garage_id[i] + "</h1> <hr> <h3>Price per 30 min: " + response[0].price_per_half_hour[i] + "</h3>");


  }*/
    
   // console.log(coordinates);
    //console.log(hoverText);

   // L.marker(coordinates)
     // //.bindPopup(hoverText)
      //.addTo(myMap);
    
  });

  //return parkingMarkers;
//}


//addMarkers();

var cityLayer = L.layerGroup(parkingMarkers);

  
// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Comic  Map": comicmap,
  "Satellite Map": satellitemap
};

// Overlays that may be toggled on or off
var overlayMaps = {
  Parking: cityLayer
};

// Define a map object
var myMap = L.map("map", {
  center: [43.6683,-79.3977],
  zoom: 14,
  layers: [streetmap, cityLayer]
});
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed:false
}).addTo(myMap);


