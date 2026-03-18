document.addEventListener('DOMContentLoaded', () => {
  const ruleList = document.getElementById('ruleList');

  // Input elements
  const xpathInput = document.getElementById('xpathInput');
  const classInput = document.getElementById('classInput');
  const idInput = document.getElementById('idInput');

  // Buttons
  const addXpath = document.getElementById('addXpath');
  const addClass = document.getElementById('addClass');
  const addId = document.getElementById('addId');

  // Load rules
  const loadRules = () => {
    chrome.storage.sync.get('rules', (data) => {
      const rules = data.rules || [];
      renderRules(rules);
    });
  };

  const renderRules = (rules) => {
    ruleList.innerHTML = '';
    rules.forEach((rule, index) => {
      const li = document.createElement('li');
      li.className = 'rule-item';
      li.innerHTML = `
        <span class="rule-type">${rule.type.toUpperCase()}:</span>
        <span class="rule-value">${rule.value}</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      ruleList.appendChild(li);
    });

    // Add delete events
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        deleteRule(index);
      });
    });
  };

  const saveRule = (type, value) => {
    if (!value) return;
    chrome.storage.sync.get('rules', (data) => {
      const rules = data.rules || [];
      rules.push({ type, value });
      chrome.storage.sync.set({ rules }, () => {
        loadRules();
        // Clear inputs
        if (type === 'xpath') xpathInput.value = '';
        if (type === 'class') classInput.value = '';
        if (type === 'id') idInput.value = '';
      });
    });
  };

  const deleteRule = (index) => {
    chrome.storage.sync.get('rules', (data) => {
      const rules = data.rules || [];
      rules.splice(index, 1);
      chrome.storage.sync.set({ rules }, () => {
        loadRules();
      });
    });
  };

  addXpath.addEventListener('click', () => saveRule('xpath', xpathInput.value));
  addClass.addEventListener('click', () => saveRule('class', classInput.value));
  addId.addEventListener('click', () => saveRule('id', idInput.value));

  loadRules();
});
