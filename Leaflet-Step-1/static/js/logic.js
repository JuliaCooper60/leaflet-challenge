
// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level for sf
// This gets inserted into the div with an id of 'map' in index.html

// var API_KEY = "pk.eyJ1IjoianVsaWFjb29wZXI2MCIsImEiOiJjbDc1eG5lN3cwYWljM3dscWdqcHNtbmV2In0.ItVjV-79CarwaxVm0B0AmA";

var lightmap  = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create the map object - We set the longitude, latitude, and the starting zoom level for sf

var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5,
  layers: [lightmap],
});
var earthquakes = new L.layerGroup();
var overlays = {
  Earthquakes: earthquakes
}

  // Add our 'graymap' tile layer to the map
  lightmap .addTo(myMap);
  
  
  // Create a control for our layers, add our overlay layers to it
  L.control.layers(null, overlays).addTo(myMap);
  
  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);
  


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
     // Returns the style data for each of the earthquakes plotted on the map
      //Pass the magnitude of the earthquake into two separate functions to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
  // add a GeoJSON layer to the map once the file is loaded.
L.geoJson(data,{

  // Turn each feature into a circleMarker on the map.

    pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);  
    },

    // set the style for each circleMarker using our styleInfo function.

    style: styleInfo,

     // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled

    onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
}).addTo(myMap);

// an object legend
var legend = L.control({
  position: "bottomright"
});

 // details for the legend
 legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

  var grades = [0, 1, 2, 3, 4, 5];
  var colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

 // Looping through the intervals of colors to put it in the label
 for (var i = 0; i < grades.length; i++) {
  div.innerHTML +=
    "<i style='background: " + colors[i] + "'></i> " +
    grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
}
return div;
};

// Finally, we our legend to the map.
legend.addTo(myMap);
});

