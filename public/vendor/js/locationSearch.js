// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink, userData, locLatLng, filteredLocation, locSuggList, idLoc, selectData, locGeoJson, locLayer, inputText; 
let locationResult = [];


inputBox.addEventListener('keyup', delay(async function(e){  
    let userData = e.target.value;
    // icon.querySelector("i").className = 'icofont-close'
    locationResult = [];
    if(locationResult.length == 0){
        icon.innerHTML='';
        icon.innerHTML= '<div class="loader"></div>';
    }

    icon.onclick = ()=>{
        inputBox.value = "";
        userData = "";
        icon.querySelector("i").className = 'icofont-search-1';
        searchWrapper.classList.remove("active");
    }
    try{
        if (userData){
            locationResult = await geoSearch(userData);
            icon.innerHTML='';
            icon.innerHTML= '<i class="icofont-close">'
            locSuggList = locationResult.map((data)=>{
                // passing return data inside li tag
                if(data.icon == undefined){
                    data.icon = 'img/defaulticon.png';
                }

                return data = `<li value="${data.place_id}">
                <div style="display:flex">
                <div style="margin-right: 10px;"><img src="${data.icon}"></div>
                <div>${data.display_name}</div>
                </div>
                </li>`;
            });

            searchWrapper.classList.add("active"); //show autocomplete box
            showSuggestions(locSuggList);
            
            let allList = suggBox.querySelectorAll("li");
            for (let i = 0; i < allList.length; i++) {
                //adding onclick attribute in all li tag
                allList[i].setAttribute("onclick", `select(this, locationResult)`);
            }

        } else{
            icon.innerHTML= '<i class="icofont-search-1">'
            searchWrapper.classList.remove("active"); //hide autocomplete box
        }
    } catch(err){
        console.log(err);
    }
},1000));

function select(element, obj){
    if(map.hasLayer(locLayer)){
        map.removeLayer(locLayer)
    }

    idLoc = element.value;
    
    filteredLocation = obj.filter(function(el){return el.place_id == idLoc});
    filteredLocation = filteredLocation[0];

    let disName = filteredLocation.display_name;
    selectData = disName;
    inputBox.value = selectData;
    
    locGeoJson = filteredLocation.geojson;
    locLayer = L.geoJSON(locGeoJson)
    let locBounds = locLayer.getBounds();
    map.flyToBounds(locBounds);
    setTimeout(function(){
        locLayer.addTo(map)},1000);

    icon.querySelector("i").className = 'icofont-close'
    
    icon.onclick = ()=>{
        inputBox.value = "";
        icon.querySelector("i").className = 'icofont-search-1'
        map.removeLayer(locLayer)
    }
    
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li><strong>${userValue}</strong> are not found</li>`;
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}


let geoSearch = (keyword)=>{
    return fetch(`https://nominatim.openstreetmap.org/search/${keyword}?format=json&addressdetails=1&polygon_geojson=1`)
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
            return response;
        });
}

function delay(callback, ms) {
    var timer = 0;
    return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
    callback.apply(context, args);
    }, ms || 0);
};
}