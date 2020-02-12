// Define a map object
var myMap = null;
var tableMap = null;
  
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

function addMarkers(response){
  // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
  for (var i = 0; i < response[0].address.length; i++) {
      
    coordinates = [response[0].lat[i], response[0].lng[i]];
    //parkingMarkers.push(
      L.marker(coordinates)
      .bindPopup("<h3>Address:" + response[0].address[i] + "</h3> <hr> <h3>Price per 30 min: " + response[0].rate_per_half_hour[i]+ "</h3>")
      .addTo(myMap);
    //)
  } 
}

function addTable(response){
  data = response[0];
  table_data = [];
  
  for (i=0; i<=5; i++)
  {
    table_data.push([data.address[i], 
                    data.rate_per_half_hour[i], 
                    data.lat[i], 
                    data.lng[i]
                  ]);
  }

  //console.log("data in table")
  console.log(table_data);

  function tabulate(data, columns) {
		var table = d3.select("#tab2").append("table");
        var header = table.append("thead").append("tr");
        header
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(d) { return d; });

        var tablebody = table.append("tbody");

        rows = tablebody
                .selectAll("tr")
                .data(data)
                .enter()
                .append("tr")
                .attr("class", "tableRow")
                .on("click", function(d) { displayData([d[2],d[3]], d[0])});

        // We built the rows using the nested array - now each row has its own array.
        cells = rows.selectAll("td")
            // each row has data associated; we get it and enter it for the cells.
                .data(function(d) {
                    console.log(d);
                    return d;
                })
                .enter()
                .append("td")
                .text(function(d) {
                    return d;
                });
	}

	// render the table(s)
  tabulate(table_data, ['address', 'rate_per_half_hour', 'lat', 'lng']); 
  
}


  /* data route */
  var url = "/api/get_parking_spots";
  d3.json(url).then(function(response) {

    addMarkers(response);
    addTable(response);  
  
  });

  

//addMarkers();
console.log("parkingmarkers");
console.log(parkingMarkers);

var cityLayer = L.layerGroup(parkingMarkers);

 //console.log(cityLayer);

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


var tableMap = L.map("map2", {
  center: [43.668094, -79.397544], 
  zoom: 14
 });


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(tableMap);

var layerGroup = L.layerGroup().addTo(tableMap);

function displayData(coordinates, hovertext) {
    console.log(coordinates);
    console.log(hovertext);
    layerGroup.clearLayers();
    tableMap.closePopup();
    marker = L.marker(coordinates).addTo(layerGroup);
    marker.bindPopup(hovertext).openPopup()
          .addTo(tableMap);
}

/*
////////////////////////////////////////////
d3.json(url).then(function(response) {

  data = response[0];
  table_data = [];
  
  for (i=0; i<=20; i++)
  {
    table_data.push([data.address[i], 
                    data.rate_per_half_hour[i], 
                    data.lat[i], 
                    data.lng[i]
                  ]);
  }

  //console.log("data in table")
  console.log(table_data);

  function tabulate(data, columns) {
		var table = d3.select("#tab2").append("table");
        var header = table.append("thead").append("tr");
        header
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(d) { return d; });

        var tablebody = table.append("tbody");

        rows = tablebody
                .selectAll("tr")
                .data(data)
                .enter()
                .append("tr")
                .attr("class", "tableRow")
                .on("click", function(d) { displayData([d[2],d[3]], d[0])});

        // We built the rows using the nested array - now each row has its own array.
        cells = rows.selectAll("td")
            // each row has data associated; we get it and enter it for the cells.
                .data(function(d) {
                    console.log(d);
                    return d;
                })
                .enter()
                .append("td")
                .text(function(d) {
                    return d;
                });
	}

	// render the table(s)
	tabulate(table_data, ['address', 'rate_per_half_hour', 'lat', 'lng']); 

});*/


