document.getElementById('startSession').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start-focus-session' });
    console.log('Start focus session clicked');
  });
  
  document.getElementById('stopSession').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop-focus-session' });
    console.log('Stop focus session clicked');
  });
  document.getElementById('startEyeTracking').addEventListener('click', () => {
    chrome.windows.create({
      url: 'eye-tracking.html',
      type: 'popup',
      width: 800,
      height: 600
    });
  });
  
  