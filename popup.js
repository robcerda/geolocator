let timerId = null;

// Function to get geolocation data
function getGeoLocation() {
    if (!navigator.geolocation){
        console.log("Geolocation is not supported by your browser");
        return;
    }

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                const locationText = `Latitude: ${latitude} °, Longitude: ${longitude} °, Accuracy: ${accuracy} m, State: ${data.principalSubdivision}, Country: ${data.countryName}`;
                const state = data.principalSubdivision;
                const country = data.countryName;

                const locationData = {
                    latitude,
                    longitude,
                    accuracy,
                    state,
                    country
                };

                downloadData(locationData);
                updateLocation(locationText);
            })
            .catch(error => console.error('Error:', error));
    }

    function error() {
        console.log("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// Function to create and download a file with the location data
function downloadData(data) {
    const blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url,
        filename: 'location_data.json'
    });
}

// Function to update location in the popup
function updateLocation(locationText) {
    const locationElement = document.getElementById('location');
    locationElement.textContent = locationText;
}

// Function to handle getLocation button click
function startReporting() {
    if (timerId) {
        return;
    }

    getGeoLocation();
    timerId = setInterval(getGeoLocation, 5000);  // Adjust the interval as needed
}

// Add event listener to getLocation button
document.getElementById('getLocation').addEventListener('click', startReporting);
