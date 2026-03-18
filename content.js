let isEnabled = true;
let rules = [];
let observer = null;

const removeElements = () => {
  if (!isEnabled) return;

  rules.forEach(rule => {
    try {
      if (rule.type === 'xpath') {
        const result = document.evaluate(rule.value, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
          const node = result.snapshotItem(i);
          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        }
      } else if (rule.type === 'class') {
        const elements = document.querySelectorAll(rule.value.startsWith('.') ? rule.value : `.${rule.value}`);
        elements.forEach(el => el.remove());
      } else if (rule.type === 'id') {
        const id = rule.value.startsWith('#') ? rule.value.slice(1) : rule.value;
        const el = document.getElementById(id);
        if (el) el.remove();
      }
    } catch (e) {
      console.error('Error removing element for rule:', rule, e);
    }
  });
};

const init = () => {
  chrome.storage.sync.get(['isEnabled', 'rules'], (data) => {
    isEnabled = data.isEnabled !== false;
    rules = data.rules || [];

    if (isEnabled) {
      removeElements();
      startObserver();
    }
  });
};

const startObserver = () => {
  if (observer) observer.disconnect();
  observer = new MutationObserver((mutations) => {
    removeElements();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
};

const stopObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    isEnabled = message.isEnabled;
    if (isEnabled) {
      removeElements();
      startObserver();
    } else {
      stopObserver();
      // Optionally reload or just stop removing new ones
    }
  }
});

// Start the extension logic
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
