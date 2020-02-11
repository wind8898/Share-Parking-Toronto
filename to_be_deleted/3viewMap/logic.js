var map = null;

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

// Each parking object contains the parking address, location and type
var parking = [{
      lat: 43.6527,
      lng: -79.3772,
      address: "37 Queen Street East",
      type: "Garage",
    },
    {
      lat: 43.6871,
      lng: -79.3928,
      address: "21 Pleasant Blvd.",
      type: "Outdoor",
    },
    {
      lat: 43.6455,
      lng: -79.3827,
      address: "40 York Street",
      type: "Garage",
    }
  ];
  console.log(parking);
  // Loop through the parking array and create one marker for each parking object
  parkingMarkers = [];
  for (var i = 0; i < parking.length; i++) {
     // loop through the parking array, create a new marker, push it to the parkingMarkers array
  parkingMarkers.push(
    L.marker([parking[i].lat,parking[i].lng])
      .bindPopup("<h1>" + parking[i].address + "</h1> <hr> <h3>Type " + parking[i].type + "</h3>")
  );
  }

  // Add all the parkingMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
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
var map = L.map("map", {
  center: [43.6683,-79.3977],
  zoom: 14,
  layers: [streetmap, cityLayer]
});
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed:false
}).addTo(map);
