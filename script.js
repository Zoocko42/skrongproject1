var input = document.getElementById('autocomplete').value
console.log(input)


var searchButton = document.getElementById('button2');
searchButton.addEventListener('click', initMap);


function initMap(){
    var options = {
      zoom:12,
      center: {lat:50, lng:50}
    }

//     var map = new
//     google.maps.Map(document.getElementById('map'), options);

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


  //  var autocomplete;
//  function initAutocomplete() {
//    autocomplete = new google.maps.places.Autocomplete(
//      document.getElementById('autocomplete'),
//    {
//      types: ['establisment'],
//      componentRestrictions: {'country':['AU']},
//      fields: ['place_id', 'geometry', 'name']
//    })
//  autocomplete.addEventListener('place_changed', onPlaceChanged);
//  }
//  function onPlaceChanged(){
//    var place = autocomplete.getPlace();

//    if (place.geometry){
//      document.getElementById('autocomplete').placeholder = 'Search';

//    }  else {
//      document.getElementById('details').innerHTML = place.name;
//    }
//  }