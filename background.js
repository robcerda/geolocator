let lastLocation = null;

function fetchLocation() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    lastLocation = `Latitude: ${latitude}\nLongitude: 
${longitude}\nAccuracy: ${accuracy} meters`;
  }

  function error(err) {
    console.log(err);
    lastLocation = 'Unable to retrieve your location.';
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0
  });
}

// Fetch the location initially
fetchLocation();

// Fetch the location every minute (60000 ms)
setInterval(fetchLocation, 60000);

