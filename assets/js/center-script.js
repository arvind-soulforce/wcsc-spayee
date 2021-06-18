"use strict";

// json data
var sky_centers_api = "https://cdn.jsdelivr.net/gh/karthickbabu/wcsc@0.0.20/skyyoga/assets/data/sky-centers-by-country.json";

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

function loadSkyCentersTable(centersJsonArr) {
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

        var contactStr = contacts.join(" / ");

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
  }, 1000);
}

function setupFilterSkyCentersTable() {
  $(".search-input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".skycenters-list tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $('.center-country').change(function () {
    let selectedCountry = this.options[this.selectedIndex].text;
    loadSkyCentersTable(centersList[selectedCountry]);
  });
}

$(document).ready(function () {
  fetchSkyCentersTable();
  setupFilterSkyCentersTable();
});
