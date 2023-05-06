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
                const locationObj = {
                    latitude,
                    longitude,
                    accuracy,
                    city: data.city,
                    state: data.principalSubdivision,
                    country: data.countryName
                };

                saveToLocalFile(locationObj);
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
    const textToSave = JSON.stringify(location) + '\n';
    const blob = new Blob([textToSave], {type: 'application/json'});
    const fileURL = URL.createObjectURL(blob);
    
    chrome.downloads.download({
        url: fileURL,
        filename: 'location.json',
        conflictAction: 'overwrite'
    });
}

// Start reporting on browser startup
chrome.runtime.onStartup.addListener(() => {
    getGeoLocation();
});

// Start reporting at an interval
chrome.alarms.create('locationAlarm', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'locationAlarm') {
        getGeoLocation();
    }
});
