document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleExtension');
  const statusText = document.getElementById('statusText');
  const openOptions = document.getElementById('openOptions');

  // Load initial state
  chrome.storage.sync.get('isEnabled', (data) => {
    toggle.checked = data.isEnabled !== false; // Default to ON if not set
    statusText.innerText = toggle.checked ? 'ON' : 'OFF';
  });

  // Toggle state
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ isEnabled }, () => {
      statusText.innerText = isEnabled ? 'ON' : 'OFF';
      // Notify content scripts of the change
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'toggle', isEnabled }).catch(err => {
            // Some tabs might not have the content script (e.g., chrome://)
          });
        });
      });
    });
  });

  // Open options page
  openOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
