let navMenu = document.getElementById("portofolio")
navMenu.classList.add("active-2");



let map = L.map('map',{
    attributionControl: false,
    zoomControl:false,
    minZoom:5, 
    maxZoom:20,
    }).setView([-2.3197641,117.4150274],5);

let url="https://gsdev.lokasimaps.com/geoserver/lokasimaps/wms";

let lokasiMaps = L.tileLayer.wms(url, {
            layers: 'lokasimaps',
            tiled:true,
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            maxZoom:20,
            minZoom:5,
            crs: L.CRS.EPSG3857,
            authkey:'8c2843a4-2630-42a4-957c-58b3ecfb27ee'
        });
lokasiMaps.addTo(map);