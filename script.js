function geoCode(input) {
  var encodedAddress = encodeURIComponent(input);
  var encodedAddressFetch = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDhJwyfviB0Kd7E59NtDJmZsFByIhgqjHg`
  )
    .then((response) => response.json())
    .then((data) => data.results[0].geometry.location);
  return encodedAddressFetch;
}

// async function initMap() {
//   var input = document.getElementById("autocomplete").value;
//   var addressInput = await geoCode(input);
//   console.log(addressInput);
//   var options = {
//     zoom: 18,
//     center: addressInput,
//   };
//   new window.google.maps.Map(document.getElementById("map"), options);
// }

var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", initMap);

//     var marker = new google.maps.Marker({
//       position: '',
//       map:map,
//       icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
//     });

//     var infoWindow = new google.maps.InfoWindow({

//       content: '<h3>Your new home</h3>'
//     });

//     marker.addEventListener('click', function(){
//       infoWindow.open(map, marker)
//     })

//   }

var autocomplete;
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      types: ["establisment"],
      componentRestrictions: { country: ["AU"] },
      fields: ["place_id", "geometry", "name"],
    }
  );
  autocomplete.addEventListener("place_changed", onPlaceChanged);
}
function onPlaceChanged() {
  var place = autocomplete.getPlace();

  if (place.geometry) {
    document.getElementById("autocomplete").placeholder = "Search";
  } else {
    document.getElementById("details").innerHTML = place.name;
  }
}
// ****EXPERIMENTAL SECTION******
async function initMap() {
  // Create the map.
  var input = document.getElementById("autocomplete").value;
  var addressInput = await geoCode(input);
  console.log(addressInput);
  var options = {
    zoom: 18,
    center: addressInput,
    mapId: "84238f2a7b7e9921",
  };
  var map = new window.google.maps.Map(document.getElementById("map"), options);
  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");

  moreButton.onclick = function () {
    moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  var checkedParam = document.querySelector("input[name=paramRadios]:checked");
  var addressRange = document.getElementById("customRange1").value;
  service.nearbySearch(
    { location: await geoCode(input), radius: addressRange, type: checkedParam.value },
    (results, status, pagination) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      moreButton.disabled = !pagination || !pagination.hasNextPage;
      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
}

function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });

      const li = document.createElement("li");

      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
    }
  }
}

window.initMap = initMap;