var map;
var markers = [];
var markerCluster;
var adminToggle = document.getElementById('admin') ? document.getElementById('admin').classList.contains('show') : 'false';
var listener;
var newMarkerSaved = true;
var newMarker = null;

function initMap() {
  var docs = JSON.parse(document.getElementById('map').getAttribute('data-locations'));
  console.log(docs);

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.09024,  
      lng: -95.712891
    },
    zoom: 5,
    disableDefaultUI: true
  });

  map.addListener('idle', function (e) {
    console.log('idle');
    console.log(markers);
    var markerCluster = new MarkerClusterer(map, markers, {
      imagePath: './images/m'
    });
  });

  docs.forEach( doc => {
    console.log(doc);
    if (doc.position) {
      placeMarker(
        {
          position: JSON.parse(doc.position),
          title: doc.title,
          url: doc.url,
          id: doc._id
        },
        map,
        linkToUrl
      );
    }
  });

}

function enableNew() {
  return map.addListener('click', function (e) {
    updateLocation(e.latLng.toJSON());
    placeMarker(
      {
        position: e.latLng
      },
      map
    );
  });
}

function preventNew(listener) {
  google.maps.event.removeListener(listener);
}

function adminMode(){
  if (adminToggle) {
    console.log('off')
    preventNew(listener);
  } else {
    console.log('admin')
    listener = enableNew();
  }
  adminToggle = !adminToggle;
}

function placeMarker(data, map, cb) {
  console.log(data);
  if (newMarkerSaved) {
    newMarker = new google.maps.Marker({
      position: data.position,
      title: data.title || '',
      id: data.id,
      map: map
    });
  
    if (cb) {
      cb(newMarker, data.url);
    } else {
      newMarkerSaved = false;
      preventNew(listener);
    }
    //console.log(markers);
  }

}

function updateLocation(position) {
  document.getElementById('position').setAttribute('value', JSON.stringify(position));
  document.getElementById('title').setAttribute('value', '');
  document.getElementById('url').setAttribute('value', '');
}

function linkToUrl(marker, url) {
  marker.addListener('click', function() {
    newMarkerSaved = false;
    preventNew(listener);
    if (document.getElementById('admin') ? document.getElementById('admin').classList.contains('show') : false) {
      document.getElementById('position').setAttribute('value', marker.getPosition());
      document.getElementById('title').setAttribute('value', marker.title);
      document.getElementById('url')
      .setAttribute('value', url)
      
      if (!document.getElementById('id')){
        document.getElementById('url').parentNode
        .insertAdjacentHTML('afterend', '<div class="form-group"><label for="id">ID:</label><input class="form-control" type="text" id="id" name="id" disabled></div>');
        //.appendChild('<div class="form-group"><label for="id">ID:</label><input class="form-control" type="text" id="id" name="id"></div>');
        document.getElementById('id').setAttribute('value', marker.id);
      } else {
        document.getElementById('id').setAttribute('value', marker.id);
      }
    } else {
      window.location.href = url;
    }
  });
  markers.push(newMarker);
  newMarker = null;
}

function clearAdminForm() {
  document.getElementById('position').setAttribute('value', '');
  document.getElementById('title').setAttribute('value', '');
  document.getElementById('url').setAttribute('value', '');
  if (document.getElementById('id')){
    document.getElementById('id').parentNode.remove();
  }
  listener = enableNew();
  if (newMarker) {
    newMarker.setMap(null);
  }
  newMarker = null;
  newMarkerSaved = true;
}