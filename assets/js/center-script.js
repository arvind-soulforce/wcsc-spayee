"use strict";

// json data
var sky_centers_api = "https://cdn.jsdelivr.net/gh/WCSC-Engineering/wcsc-spayee@0.0.3/assets/data/centers/sky-centers-by-country.json";
var sky_center_geojson = "https://cdn.jsdelivr.net/gh/WCSC-Engineering/wcsc-spayee@0.0.3/assets/data/centers/centers.geojson";

//var sky_centers_api = "./sky-centers-by-country.json";
var centersList = [];

function fetchSkyCentersTable() {
  $.ajax({
    url: sky_centers_api,
    method: 'GET',
    cache: true,
    type: "text/json"
  })
    .done(function (evt) {
      centersList = evt;
      loadSkyCentersCountries(evt);
      loadSkyCentersTable(evt);
    })
    .fail(function () {
      alert('Error : Failed to reach API Url or check your connection');
    })
    .then(function (evt) {
    });
};

function loadSkyCentersCountries(centersByCountry) {

  /*
  if (centersJsonArr.length > 0) {
    var centersByCountry = {};
    for (var i = 0; i < centersJsonArr.length; i++) {
        var center = centersJsonArr[i];

        var centersArrayForCurrentCountry = centersByCountry[center.Country];
        if (!centersArrayForCurrentCountry) {
            centersArrayForCurrentCountry = [];
        }

        centersArrayForCurrentCountry.push(center);
        centersByCountry[center.Country] = centersArrayForCurrentCountry;
    }
  }*/

  var countries = Object.keys(centersByCountry);
  for (var j = 0; j < countries.length; j++) {
    $(".center-country").append('<option value="' + countries[j] + '">' + countries[j] + '</option>');
  }

}

function loadSkyCentersTable(centersJsonArr, mapbox) {
  // Set timeout for lazy loading
  setTimeout(function () {
    var tableHtml = "";
    if (centersJsonArr.length > 0) {
      tableHtml += '<table class="table table-striped mt32 skycenters-list">'
        + '<thead>'
        + '<tr>'
        + '<th style="font-size:0.8rem">Name</th>'
        + '<th style="font-size:0.8rem">City</th>'
        + '<th style="font-size:0.8rem">Address</th>'
        + '<th style="font-size:0.8rem">Contact</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';

      for (var j = 0; j < centersJsonArr.length; j++) {
        var contacts = [];
        if (centersJsonArr[j].ContactPersonName && centersJsonArr[j].ContactPersonName != "-") {
          contacts.push(centersJsonArr[j].ContactPersonName);
        }

        if (centersJsonArr[j].Mobile_1 && centersJsonArr[j].Mobile_1 != "-") {
          contacts.push(centersJsonArr[j].Mobile_1);
        }

        if (centersJsonArr[j].Mobile_2 && centersJsonArr[j].Mobile_2 != "-") {
          contacts.push(centersJsonArr[j].Mobile_2);
        }

        if (centersJsonArr[j].Landline && centersJsonArr[j].Landline != "-") {
          contacts.push(centersJsonArr[j].Landline);
        }

        if (centersJsonArr[j].Email && centersJsonArr[j].Email != "-") {
          contacts.push(centersJsonArr[j].Email);
        }

        if (centersJsonArr[j].Email_2 && centersJsonArr[j].Email_2 != "-") {
          contacts.push(centersJsonArr[j].Email_2);
        }

        var contactStr = '<p style="font-size:0.8rem; margin:0">' + contacts.join('</p><p style="font-size:0.8rem; margin:0">') + '</p>';

        tableHtml += '<tr>'
          + '<td style="font-size:0.8rem">' + centersJsonArr[j].Name + '</td>'
          + '<td style="font-size:0.8rem">' + centersJsonArr[j].City + ', ' + centersJsonArr[j].State + '</td>'
          + '<td style="font-size:0.8rem">' + centersJsonArr[j].Address + '</td>'
          + '<td style="font-size:0.8rem">' + contactStr + '</td>'
          + '</tr>';
      }
      tableHtml += '</tbody></table>';
    } else {
      tableHtml += '<p class="mt32">Please select the country to view the list of SKY Centers in your location.</p>';
    }

    // Set all content
    $('.table-skycenters').html(tableHtml);

    mapbox.setView([centersJsonArr[0].lat, centersJsonArr[0].long], 7);
  }, 1000);
}

function setupFilterSkyCentersTable(mapbox) {
  $(".search-input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".skycenters-list tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $('.center-country').change(function () {
    let selectedCountry = this.options[this.selectedIndex].text;
    loadSkyCentersTable(centersList[selectedCountry], mapbox);
  });
}

// Excerpt from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
function geoFindMe(map) {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    return;
  }
  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    map.setView([latitude, longitude], 10);
    //reverseGeocodingWithGoogle(longitude, latitude)
  }
  function error() {
    console.log("Unable to retrieve your location");
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function setupMapbox() {
  var centers = $.ajax({
    url: sky_center_geojson,
    dataType: "json",
    success: console.log("SKY Centers data successfully loaded."),
    error: function (xhr) {
      alert(xhr.statusText)
    }
  })

  var map = L.map('map')
    .setView([10.473799125094542, 76.95133214647043], 10);

  $.when(centers).done(function () {

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoia2FydGhpY2tiYWJ1IiwiYSI6ImNraXdycHd1bjF6ZG8ycXA0bnQ3NXh4dTQifQ.RJzV6rqtSSvEBKE6Ja113w'
    }).addTo(map);

    var searchControl = L.esri.Geocoding.geosearch().addTo(map);
    var results = L.layerGroup().addTo(map);


    var searchAddrMarkerOptions = {
      radius: 8,
      fillColor: "#2954A3",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    searchControl.on('results', function (data) {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.circleMarker(data.results[i].latlng, searchAddrMarkerOptions));
      }
    });

    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#EB870E",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    // Add requested external GeoJSON to map
    var skyCenters = L.geoJSON(centers.responseJSON, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature: function (feature, layer) {
        var phoneDetails = [];
        if (feature.properties.Mobile_1 && (feature.properties.Mobile_1 != "-")) {
          phoneDetails.push(feature.properties.Mobile_1);
        }

        if (feature.properties.Mobile_2 && (feature.properties.Mobile_2 != "-")) {
          phoneDetails.push(feature.properties.Mobile_2);
        }

        if (feature.properties.Landline && (feature.properties.Landline != "-")) {
          phoneDetails.push(feature.properties.Mobile_2);
        }

        var emailDetails = [];
        if (feature.properties.Email && (feature.properties.Email != "-")) {
          emailDetails.push(feature.properties.Email);
        }

        if (feature.properties.Email_2 && (feature.properties.Email_2 != "-")) {
          emailDetails.push(feature.properties.Email_2);
        }

        layer.bindPopup(
          '<h3 style="color: rgb(235, 135, 14); font: bold 1.2em Arial, sans-serif;">' + feature.properties.Name + '</h3>'
          + '<p style="color: #2954A3; font: 1em Arial, sans-serif;line-height: 1em"> <strong>Address:</strong> ' + feature.properties.Address + '</p>'
          + '<p style="color: #2954A3; font: 1em Arial, sans-serif;line-height: 1em"> <strong>Contact Person:</strong> ' + feature.properties.ContactPersonName + '</p>'
          + '<p style="color: #2954A3; font: 1em Arial, sans-serif;line-height: 1em"> <strong>Contact Phone:</strong> ' + phoneDetails.join(", ") + '</p>'
          + '<p style="color: #2954A3; font: 1em Arial, sans-serif;line-height: 1em"> <strong>E-Mail:</strong> ' + emailDetails.join(", ") + '</p>'
        );
      }
    }).addTo(map);

    geoFindMe(map);
  });

  return map;
}


$(document).ready(function () {
  var mapbox = setupMapbox();

  fetchSkyCentersTable();
  setupFilterSkyCentersTable(mapbox);

});
