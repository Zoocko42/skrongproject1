function geoCode(input) {
  var encodedAddress = encodeURIComponent(input);
  var encodedAddressFetch = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDhJwyfviB0Kd7E59NtDJmZsFByIhgqjHg`
  )
    .then((response) => response.json())
    .then((data) => data.results[0].geometry.location);
  return encodedAddressFetch;
}

async function initMap() {
  var input = document.getElementById("autocomplete").value;
  var addressInput = await geoCode(input);
  console.log(addressInput);
  var options = {
    zoom: 18,
    center: addressInput
  };
  new window.google.maps.Map(document.getElementById("map"), options);
}

var searchButton = document.getElementById("button2");
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
