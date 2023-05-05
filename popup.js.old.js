console.log("Popup script loaded");

function updateLocation(location) {
  document.getElementById('location').innerText = location;
}

function fetchLocation() {
  if (!navigator.geolocation) {
    updateLocation('Geolocation is not supported by your browser.');
    return;
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const locationText = `Latitude: ${latitude}\nLongitude: ${longitude}\nAccuracy: ${accuracy} meters`;
    updateLocation(locationText);
  }

  function error(err) {
    console.log(err);
    updateLocation('Unable to retrieve your location.');
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0
  });
}

// Fetch the location initially
fetchLocation();

// Create an alarm to fetch the location every minute (60000 ms)
chrome.alarms.create("fetchLocation", { periodInMinutes: 1 });

// Listen for the alarm event and fetch the location when the alarm is triggered
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchLocation") {
    fetchLocation();
  }
});
