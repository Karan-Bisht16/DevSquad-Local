$(document).ready(function() {
    $(window).scroll(function() {
        $('.title-card').each(function() {
            var elementTop = $(this).offset().top;
            var viewportTop = $(window).scrollTop();
            if (elementTop < viewportTop + window.innerHeight/1.25) {
                $(this).addClass('fade-in');
            }
        });
    });
});

let lat=28.6139, lng=77.2090, marker, circle, zoomed;
var map = L.map('map').setView([lat, lng], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: '&copy; <a href="https://stamen.com">Stamen Design</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 18,
    ext: 'png'
});

const streetsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

const baseLayers = {
    'Streets': streetsLayer,
    'Terrain': terrainLayer,
    'OSM': osmHOT
};

L.control.layers(baseLayers).addTo(map);

navigator.geolocation.watchPosition(success, error);

async function sendPostionToServer(object) {
    const currentURL = window.location.href;
    try {
        const response = await fetch(currentURL, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(object)
        });
        const url = await response.json();
        if (url["data"]==='done'){
            return true;
        } else {
            console.error("Server side error")
            return false;
        }
    } catch (error) {
        console.error("Error in adding to server ",error);
        return false;
    }
}

function success(position) {
    if (Math.abs(lat-position.coords.latitude) || Math.abs(lng-position.coords.longitude)){
        positionObj = {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        };
        sendPostionToServer(positionObj)
    }
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    const acc = position.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    marker = L.marker([lat,lng]).addTo(map);
    circle = L.circle([lat,lng,{radius: acc}]).addTo(map);
    
    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }
    
}

function error() {
    if (error.code === 1) {
        alert("Allow geolocation access");
    } else {
        console.log("Cannot get current location");
    }
}