var polygons = []; 

function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },

    polygonOptions: {
      fillColor: '#ff0000',
      editable: true
    },

    rectangleOptions: {
      fillColor: '#ff0000',
      editable: true
    }

  });

  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {

    markers = setMarkers(map, getPolygonCoordinates(polygon));
    polygons.push({'polygon' : getPolygonCoordinates(polygon), 'markers' : markers});

    addPolygonListeners(map, polygon);

  });

  google.maps.event.addListener(drawingManager, 'rectanglecomplete', function (rectangle) {

    markers = setMarkers(map, getRectangleCoordinates(rectangle));
    polygons.push({'polygon' : getRectangleCoordinates(rectangle), 'markers' : markers});

    addRectangleListerners(map, rectangle);

  });



}

function addPolygonListeners(map, polygon) {

  google.maps.event.addListener(polygon.getPath(), 'set_at', function() {

    polygons.forEach(function(p) {
      if(comparePolygons(p.polygon, getPolygonCoordinates(polygon))) updateMarker(map, p);
    });

  });

  google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {

    polygons.forEach(function(p) {
      if(comparePolygons(p.polygon, getPolygonCoordinates(polygon))) updateMarker(map, p);
    });

  });

}

function addRectangleListerners(map, rectangle) {

  rectangle.addListener('bounds_changed', function() {

    polygons.forEach(function(p) {
      if(compareRectangles(p.polygon, getRectangleCoordinates(rectangle))) {
        p.polygon = getRectangleCoordinates(rectangle);
        updateMarker(map, p);
      }
    });
    
  });

}

function removeMarkers(markers) {

  markers.forEach(function(marker) {
    marker.setMap(null);
  });

}

function getRectangleCoordinates(rectangle) {

  var bounds = rectangle.getBounds();

  var NE = bounds.getNorthEast();
  var SW = bounds.getSouthWest();
  var NW = new google.maps.LatLng(NE.lat(),SW.lng());
  var SE = new google.maps.LatLng(SW.lat(),NE.lng());

  return [NE, SW, NW, SE];

}

function comparePolygons(p1, p2) {

  var cont = 0;

  var path1;
  var path2;

  if(p1.length < p2.length) {
    path1 = p1;
    path2 = p2;
  }
  else {
    path1 = p2;
    path2 = p1;   
  }

  for(i = 0; i < path1.length; ++i) {

    if(path1[i].lat != path2[i].lat || path1[i].lng != path2[i].lng) ++cont;

  }

  return cont == 0 || cont == 1;

}

function compareRectangles(r1, r2) {

  for(i = 0; i < r1.length; ++i) {
    if(r1[i].lat() == r2[i].lat() && r1[i].lng() == r1[i].lng()) return true;
  }

  return false;

}

function getPolygonCoordinates(polygon) {
  return polygon.getPath().getArray();
}

function setMarkers(map, coordinates) {

  markers = [];

  coordinates.forEach(function(c) {

    var marker = new google.maps.Marker({
      position: c,
      map: map,
      title: 'lat: ' + c.lat() + ' lng: ' + c.lng()

    });

    markers.push(marker);

    //on click handler to show lat and lng to markers
	marker.addListener('click', function() {
    	info = new google.maps.InfoWindow({
          position: c,
          content: '<strong>Latitude:</strong> ' + c.lat()  + '<br/><strong>Longitude:</strong> ' + c.lng(),
        });
    	info.open(map);
  	});

  });


  return markers;

}




function updateMarker(map, p) {
  removeMarkers(p.markers);
  p.markers = setMarkers(map, p.polygon);
}

function clearMap() {

  polygons.forEach(function(p) {

    p.polygon.setMap(null);

    p.markers.forEach(function(m){
      m.setMap(null);
    });

  });
  
}

function submit() {

  var forms = [];

  polygons.forEach(function(p) {

    var coord = [];

    p.polygon.forEach(function(c) {
      coord.push({lat : c.lat(), lng : c.lng()});
    });

    forms.push(coord);

  });

  return JSON.stringify(forms);

}