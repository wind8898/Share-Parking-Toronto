var myMap = L.map("map", {
    center: [43.651070, -79.347015],
    zoom: 8
  });
  
  // Add a tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


  function addMarkers() {
    /* data route */
  var url = "/api/get_parking_spots";
  d3.json(url).then(function(response) {

    console.log(response);

    //var data = response;
    
  });
}

addMarkers();