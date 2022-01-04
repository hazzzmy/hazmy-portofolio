let markerCircle;

document.addEventListener('DOMContentLoaded', function(){    
    try{
        let locateBtn = document.getElementById("btn-find-loc");
        locateBtn.addEventListener("click", function (){            
            if (locateBtn.classList.contains("active-menu")){
                locateBtn.classList.remove("active-menu");
                map.removeLayer(markerCircle);
            } else{
                locateBtn.classList.add("active-menu");
                getLocationLeaflet();
            }
        });
    } catch(err){
        console.log(err);
    }
    
    $(function () {
        $(".btn").tooltip({ trigger: "hover" });
    });
});

async function onLocationFound(e) {
    var radius = Math.round(e.accuracy / 2);
    var location = e.latlng;
    locateInfo = await geoCode(location.lat,location.lng);
    
    locateMarker = L.marker(location);

    let circleColor = "blue";
    if(radius<50){
        circleColor = "green";
        locateMarker.bindPopup(`<h6>Your Location (Good accuracy: ${radius} m)</h6> <br> <strong>${locateInfo}</strong>`).openPopup();
    } else {
        circleColor = "red";
        locateMarker.bindPopup(`<h6>Your Location (Poor accuracy: ${radius} m)</h6> <br> <strong>${locateInfo}</strong> <br>`).openPopup();
    }

    locateCircle = L.circle(location, {radius:radius, fillColor:circleColor, color: '#000', opacity: 0.8})
    
    markerCircle = L.layerGroup([locateMarker, locateCircle]).addTo(map);
}


function onLocationError(e) {
    alert(e.message);
}

function getLocationLeaflet() {
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true});
}
// function clickMap(e){
//     map.on('click', function(e) {        
//         var popLocation= e.latlng;
//         var popup = L.popup()
//         .setLatLng(popLocation)
//         .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//         .openOn(map);        
//     });
// }

// function clickMap(e){
//         var popLocation= e.latlng;
//         var popup = L.popup()
//         .setLatLng(popLocation)
//         .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//         .openOn(map);
// }


// function geocode(y,x)
// {
//     let result=null;

//     $.ajax({
//         url: "https://nominatim.openstreetmap.org/reverse",
//         data: {lat:y,lon:x,format: "json"},
//         dataType: "json",
//         type: "GET",
//         async: false,
//         crossDomain: true,
//         success: function(res){
//                 let road = res.address.road;
//                 let suburb = res.address.suburb;
//                 let village = res.address.village;
//                 let county = res.address.county;
//                 let state = res.address.state;
//                 let postcode = res.address.postcode;
//                 let country = res.address.country;

//                 let address_param = [road, suburb, village, county, state, postcode, country]

//                 let new_address = [];
//                 for (i = 0; i < address_param.length; i++) {
//                     if (address_param[i] != undefined) {
//                         new_address.push(address_param[i]);
//                     }
//                 }
//                 new_address= new_address.join(", ");
//                 result =  new_address;
//             }
//         });
//     return result;
// };

let geoCode = (y,x)=>{
    return fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+`${y}&lon=${x}`)
        .then(response => {
            if(!response.ok){
                throw new Error(response.statusText);
            }

            return response.json();
        })
            
        .then(response => {
            if(response.Response === "False"){
                throw new Error(response.Error);
            }
            return response.display_name;
        });
}