// This handles the geo-coding.
function geoCode(input) {
  var encodedAddress = encodeURIComponent(input);
  var encodedAddressFetch = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDhJwyfviB0Kd7E59NtDJmZsFByIhgqjHg`
  )
    .then((response) => response.json())
    .then((data) => data.results[0].geometry.location);
  return encodedAddressFetch;
}


var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", initMap);


var autocomplete;
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("showMap"),
    {
      types: ["establishment"],
      componentRestrictions: { country: ["AU"] },
      fields: ["place_id", "geometry", "name"],
    }
  );
  autocomplete.addEventListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
	if (place.geometry) {
    document.getElementById("showMap").placeholder = "Search";
  } else {
    document.getElementById("details").innerHTML = place.name;
  }
}
// Moved the initMap function that generates the map here, added new code that helps it 
// interacts with the Places API.
async function initMap() {
  // Create the map.
  var input = document.getElementById("showMap").value;
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
// This adds the "More Results" function.
  moreButton.onclick = function () {
    moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  //The "checkedParam" variable checks the radio selections to see which option is selected. The value is then
  //passed into service.nearbySearch under "type".
  var checkedParam = document.querySelector("input[name=paramRadios]:checked").value;
  // The addressRange variable checks the value selected in the slider bar and the value is then put into
  // service.nearbySearch under "radius"
  var addressRange = document.getElementById("addressRange").value;
  function milesToMeters (miles) {
    var meters = (miles) * 1609.34;
    return meters;
  };
  var addressMeters = milesToMeters(addressRange);
  service.nearbySearch(
    { location: await geoCode(input), radius: addressMeters, type: checkedParam },
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
// This part of the function adds the populated results to the map.
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
// This calls and initializes the map.
window.initMap = initMap;

// The code below saves previous searches to local storage.
var prevSearches = []

function storePrevSearches() {
  localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
}

searchButton.addEventListener("click", function(event) {
	event.preventDefault();
	
	var searchText = showMap.value.trim();

	if (searchText == "") {
		return;
	}

	prevSearches.push(searchText);
	showMap.value = ""

	storePrevSearches();
});