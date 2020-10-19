  var myMap = L.map("mapid", {
  center: [36.77, -119.41],
  zoom: 3
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 13,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);



// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  function markerSize(mags){
    return mags*35000;
  }

function color(magnitude){
  switch (true) {
      case magnitude>=5:
          return "red";
      case magnitude>=4:
          return "orange";
      case magnitude>=3:
          return "yellow";
      case magnitude>=2:
          return "green"; 
      case magnitude>=0:
          return "green";     
      default:
          return "green";
  }
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data);

// loop through locations
  for( var i=0; i <data.features.length; i++){
// setting the markerSize
    L.circle(data.features[i].geometry.coordinates.reverse().slice(1), {
            fillOpacity:0.75,
            color: 'black',
            fillColor:color(data.features[i].properties.mag),
            radius:markerSize(data.features[i].properties.mag)
  // Bind popup- so when you click on the point it gives you data

        }).bindPopup("<h1>" + data.features[i].properties.place + "</h1><hr><h3>Magnitude: "+data.features[i].properties.mag + "</h3> </h3>Time:" + new Date(data.features[i].properties.time)+ "</h3>")
        .addTo(myMap);
  }
// Add a Legend
  var legend=L.control({position:'bottomright'});

  legend.onAdd=function(myMap){
  
      var div=L.DomUtil.create('div', 'info legend'),
          mags=[0,2,3,4,5],
          labels=[];
  
          for (var i=0; i< mags.length; i++){
            console.log(mags[i] + labels[i]);
              div.innerHTML +=
                  '<i style="background:' + color(mags[i]+1)+ '"></i>'+
                  mags[i]+(mags[i+1]?'&ndash;' +mags[i+1] + '<br>' : '+'); 
          }
  
          return div;
  };
  
  legend.addTo(myMap);


});