// Placeholder for background tasks.
// Currently, popup.js and content.js handle state changes and messaging.

chrome.runtime.onInstalled.addListener(() => {
  console.log('Elements Remover extension installed.');
  // Initialize default state to true
  chrome.storage.sync.get('isEnabled', (data) => {
    if (data.isEnabled === undefined) {
      chrome.storage.sync.set({ isEnabled: true });
    }
  });
});
