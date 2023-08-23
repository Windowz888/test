// Fetch the JSON data and console.log it
let url = "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Homicides_Open_Data_asr_rc_tbl_002/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

d3.json(url).then(function(data) {

  console.log('Total Data (2004-2022):', data);

  // Store homicide coordinates in empty arrays
  let features = data.features;
  let heatArrayPreCovid = [];
  let heatArrayPostCovid = [];

  // Use for loop to push coordinates to applicable arrays and console.log arrays
  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    let year = features[i].properties.OCC_YEAR;
    if (year >= 2017 && year <= 2019 && (location)) {
      heatArrayPreCovid.push([location.coordinates[1], location.coordinates[0]]);
    } else if (year >= 2020 && year <= 2022 && (location)) {
      heatArrayPostCovid.push([location.coordinates[1], location.coordinates[0]]);
    }
  }

  console.log('Pre-Covid Data (2017-2019):', heatArrayPreCovid);
  console.log('Post-Covid Data (2020-2022):', heatArrayPostCovid);

// Create heat layers for each year range
// PreCovid
let heatMapPreCovid = L.heatLayer(heatArrayPreCovid, {
  radius: 25,
  blur: 5,
  minOpacity: 0.5
});

// PostCovid
let heatMapPostCovid = L.heatLayer(heatArrayPostCovid, {
  radius: 25,
  blur: 5,
  minOpacity: 0.5
});

// Create the base layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a baseMap object
let baseMap = {
"Street Map": street,
};

// Create an overlay object
let overlayMaps = {
"Pre-Covid (2017-2019)": heatMapPreCovid,
"Post-Covid (2020-2022)": heatMapPostCovid,
};

// Define a map object
let myMap = L.map("map", {
center: [43.651070, -79.347015],
zoom: 10,
layers: [street, heatMapPostCovid]
});

// Pass our map layers to our layer control
// Add the layer control to the map
L.control.layers(baseMap, overlayMaps, {
collapsed: false
}).addTo(myMap);

});