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

                saveToLocalFile({
                    latitude,
                    longitude,
                    accuracy,
                    state,
                    country
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function error() {
        console.log("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// Function to save geolocation data to a local file
function saveToLocalFile(location) {
    const textToSave = `Latitude: ${location.latitude}, Longitude: ${location.longitude}, Accuracy: ${location.accuracy}, State: ${location.state}, Country: ${location.country}\n`;
    const blob = new Blob([textToSave], {type: 'text/plain'});
    const fileURL = URL.createObjectURL(blob);
    
    chrome.downloads.download({
        url: fileURL,
        filename: 'location.txt',
        conflictAction: 'overwrite'
    });
}

// Start reporting when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    getGeoLocation();
    timerId = setInterval(getGeoLocation, 5000);  // Adjust the interval as needed
});
