let navMenu = document.getElementById("demo")
navMenu.classList.add("active-3");

let map, baseMaps, selectedProvider, viewMap,clickedMarker;;

let basemapsPanel = document.getElementById('basemaps-panel');
basemapsPanel.style.display = 'none';

let markerInfo = document.getElementById('marker-info');
markerInfo.style.display = 'none';

let closeMarkerInfo = document.getElementById('close-marker-info');


document.addEventListener('DOMContentLoaded', async function(){
    try{
        map = L.map('map',{
            zoomControl:false, 
            maxZoom:20,
            }).setView([-1.3197641,117.4150274],5);

        clickMap();
        closeMarkerInfo.addEventListener("click", closeMarkerInfo);

        const mapsProvider = await getMapProvider();

        selectedProvider = loadToMap(mapsProvider[0]);
        
        let basemapsMenu = document.getElementById('btn-basemaps');
        basemapsMenu.addEventListener('click', function(e){
            if(e.target.classList.contains('active-menu')){
                basemapsMenu.classList.remove("active-menu");
                basemapsPanel.style.display = 'none';
            } else{
                basemapsMenu.classList.add("active-menu");
                basemapsPanel.style.display = 'flex';
                loadBasemapList(mapsProvider);
                eventApplyBasemaps(mapsProvider);
                }
            });

    } catch(err){
        console.log(err);
    }
});

function closeInfoMarker(){
    map.removeLayer(clickedMarker);
    markerInfo.style.display = 'none';        
}

let clickMap = ()=>{
    map.on('click', async function(e) {
        try{
            let markerlatlng = document.getElementById('marker-latlng');
            let markerGeoCode = document.getElementById('marker-name-location');
            let clickedLatLng = `Lat : ${(e.latlng.lat).toFixed(5)}, Lon : ${(e.latlng.lng).toFixed(5)}`
            let clickedGeoCode = await geoCode(e.latlng.lat,e.latlng.lng);
            
            if(map.hasLayer(clickedMarker)){
                map.removeLayer(clickedMarker)
            }
            clickedMarker =new L.Marker(e.latlng).addTo(map);
            
            markerInfo.style.display = 'flex';
            markerlatlng.innerHTML = clickedLatLng;
            markerGeoCode.innerHTML = `<strong>${clickedGeoCode}</strong>`;

            closeMarkerInfo.addEventListener('click',closeInfoMarker)
        
        } catch (err){
            console.log(err);
        }
    });
}



let getMapProvider=()=>{
    return fetch('http://localhost:9000/basemaps-providers')
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

let loadToMap = (providers)=>{
    baseMaps = L.tileLayer(providers.properties.url, {
                    transparent: true,
                    maxZoom:20,
                    crs: L.CRS.EPSG3857,
                    attribution: providers.properties.attribution
                });
    baseMaps.addTo(map);

    return providers;
}

let loadBasemapListRunning = false;

let loadBasemapList =(providers)=>{
    if(!loadBasemapListRunning){
        providers.forEach(p => {
            loadProvider(p);
            let btnApply = document.getElementById(`btn-${p.name}`);
            if(p.name === selectedProvider.name){
                btnApply.classList.add('active-apply'); 
            }
        });
        loadBasemapListRunning = false;
    }
}


let loadProvider = (providers)=>{
    viewMap = L.map(providers.name,{
            attributionControl: false,
            zoomControl:false,
        }).setView([-2.3197641,117.4150274],2);
        
    let providerMaps = L.tileLayer(providers.properties.url, {
                    transparent: true,
                    maxZoom:20,
                    crs: L.CRS.EPSG3857,
                });
    providerMaps.addTo(viewMap);
}


let eventApplyBasemaps =(providers)=>{
    providers.forEach( p=>{
    let btnApply = document.getElementById(`btn-${p.name}`);
    btnApply.addEventListener("click",()=>{
        if (!btnApply.classList.contains("active-apply")){
            clearActiveApply();
            btnApply.classList.add('active-apply');
            map.removeLayer(baseMaps);
            loadToMap(p);
        }
    })   
    
    })
}

let clearActiveApply = ()=>{
    var elems = document.querySelectorAll(".active-apply");
    [].forEach.call(elems, function(el) {
        el.classList.remove("active-apply");
    })
}