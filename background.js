const updateBadge = (isEnabled) => {
  if (isEnabled) {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
  } else {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#64748b' });
  }
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Elements Remover extension installed.');
  chrome.storage.sync.get('isEnabled', (data) => {
    const enabled = data.isEnabled !== false;
    if (data.isEnabled === undefined) {
      chrome.storage.sync.set({ isEnabled: true });
    }
    updateBadge(enabled);
  });
});

// Listen for storage changes to update badge globally
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.isEnabled) {
    updateBadge(changes.isEnabled.newValue);
  }
});
