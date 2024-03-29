const serverURL = 'https://script.google.com/macros/s/AKfycbyOfWynyBsjhuad7aaGifstsXe57SChLp4-ATKO_2-BfAvfw-DGPdZPFSHzITJ5iKpC/exec';

document.getElementById('getLocation').addEventListener('click', async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const userInfo = await new Promise((resolve) => {
      chrome.identity.getProfileUserInfo(resolve);
    });
    const userEmail = userInfo.email;

    const { latitude, longitude } = position.coords;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    const locationData = await response.json();

    const city = locationData.address.city || locationData.address.town || locationData.address.village;
    const state = locationData.address.state;
    const country = locationData.address.country;
    const userAgent = navigator.userAgent; // Getting the user agent

    const locationInfo = {
      latitude,
      longitude,
      city,
      state,
      country,
      userAgent, // Assuming this is already added
      email: userEmail, // Include the user's email here
    };

    // Send a message to the background script with the location data
    chrome.runtime.sendMessage({ locationInfo });

  } catch (error) {
    console.error('Failed to fetch location:', error);
  }
});
