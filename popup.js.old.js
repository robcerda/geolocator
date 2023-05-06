console.log("Popup script loaded");

function updateLocation(location) {
  document.getElementById('location').innerText = location;
}

async function fetchStateAndCountry(latitude, longitude) {
  const url = 
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const state = data.address.state;
    const country = data.address.country;
    return { state, country };
  } catch (error) {
    console.error('Error fetching state and country:', error);
    return { state: 'Unknown', country: 'Unknown' };
  }
}

async function fetchLocation() {
  if (!navigator.geolocation) {
    updateLocation('Geolocation is not supported by your browser.');
    return;
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    fetchStateAndCountry(latitude, longitude).then(({ state, country }) => 
{
      const locationText = `Latitude: ${latitude}\nLongitude: 
${longitude}\nAccuracy: ${accuracy} meters\nState: ${state}\nCountry: 
${country}`;
      updateLocation(locationText);
    });
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

