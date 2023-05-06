document.getElementById('getLocation').addEventListener('click', async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
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
      };
  
      const blob = new Blob([JSON.stringify(locationInfo, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      chrome.downloads.download({
        url: url,
        filename: `geolocation_${Date.now()}.json`,
        conflictAction: 'uniquify',
      });
  
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  });
  