var mymap = L.map('mapid').setView([43.668094, -79.397544], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
}).addTo(mymap);

var layerGroup = L.layerGroup().addTo(mymap);

function testFunction1() {
    layerGroup.clearLayers();
    mymap.closePopup();
    marker = L.marker([43.652705,-79.377218]).addTo(layerGroup);
    marker.bindPopup("37 Queen Street East").openPopup();
}

function testFunction2() {
    layerGroup.clearLayers();
    mymap.closePopup();
    marker = L.marker([43.687092,-79.39285]).addTo(layerGroup);
    marker.bindPopup("21 Pleasant Blvd.").openPopup();
}

function testFunction3() {
    layerGroup.clearLayers();
    mymap.closePopup();
    marker = L.marker([43.6455358,-79.3827237]).addTo(layerGroup);
    marker.bindPopup("40 York Street").openPopup();
}