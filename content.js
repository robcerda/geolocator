// Function to get the location data and send it to the background script
function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      chrome.runtime.sendMessage({ location: { latitude, longitude } });
    });
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getLocation') {
      getLocation();
    }
  });
  
  // Get the location data when the content script is first injected
  getLocation();
  