function getLocationAndHospitals() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap);
    } else {
        alert("Geolocation not supported");
    }
}

function showMap(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup("You are here")
        .openPopup();

    const hospitals = [
        { name: "City Hospital", lat: lat + 0.01, lon: lon + 0.01 },
        { name: "Apollo Clinic", lat: lat - 0.01, lon: lon - 0.01 },
        { name: "Care Hospital", lat: lat + 0.02, lon: lon - 0.01 }
    ];

    const list = document.getElementById("hospitalList");
    list.innerHTML = "";

    hospitals.forEach(h => {
        L.marker([h.lat, h.lon]).addTo(map)
            .bindPopup(h.name);

        const li = document.createElement("li");
        li.textContent = h.name;
        list.appendChild(li);
    });
}