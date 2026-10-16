// AliFilter Popup Script
document.addEventListener('DOMContentLoaded', async () => {
  const masterToggle = document.getElementById('masterToggle');
  const modeControl = document.getElementById('modeControl');
  const colorPicker = document.getElementById('colorPicker');
  const hideAdsCheckbox = document.getElementById('hideAds');
  const showFloatingBarCheckbox = document.getElementById('showFloatingBar');
  const showMatchBadgeCheckbox = document.getElementById('showMatchBadge');
  const statusLabel = document.getElementById('statusLabel');
  const statusSub = document.getElementById('statusSub');
  const statusDot = document.getElementById('statusDot');
  const saveMsg = document.getElementById('saveMsg');

  // Default Settings
  const defaults = {
    enabled: true,
    mode: 'hide', // 'hide' | 'dim' | 'highlight-only'
    matchCondition: 'AND', // 'AND' | 'OR'
    highlightColor: '#ffd60a',
    hideAds: true,
    showFloatingBar: true,
    showMatchBadge: true
  };

  // Load Settings
  const settings = await chrome.storage.local.get(defaults);

  // Apply UI from loaded settings
  masterToggle.checked = settings.enabled;
  hideAdsCheckbox.checked = settings.hideAds;
  showFloatingBarCheckbox.checked = settings.showFloatingBar;
  showMatchBadgeCheckbox.checked = settings.showMatchBadge;

  // Mode buttons
  modeControl.querySelectorAll('.segment-btn').forEach(btn => {
    if (btn.dataset.mode === settings.mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Radio matchCondition
  const radio = document.querySelector(`input[name="matchCondition"][value="${settings.matchCondition}"]`);
  if (radio) radio.checked = true;

  // Highlight color
  colorPicker.querySelectorAll('.color-dot').forEach(btn => {
    if (btn.dataset.color === settings.highlightColor) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Check current tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('aliexpress.')) {
      statusDot.classList.add('active');
      statusLabel.textContent = '알리익스프레스 활성화됨';

      // Parse search keyword from URL
      try {
        const urlObj = new URL(tab.url);
        const searchParam = urlObj.searchParams.get('SearchText') || 
                               urlObj.searchParams.get('searchText') || 
                               urlObj.searchParams.get('searchTerm');
        if (searchParam) {
          statusSub.textContent = `현재 검색어: "${decodeURIComponent(searchParam)}"`;
        } else if (urlObj.pathname.includes('/wholesale-')) {
          const slug = urlObj.pathname.split('/wholesale-')[1]?.replace('.html', '')?.replace(/-/g, ' ');
          statusSub.textContent = slug ? `검색 카테고리: "${decodeURIComponent(slug)}"` : '알리 검색 페이지 감지됨';
        } else {
          statusSub.textContent = '알리익스프레스 페이지에서 정상 동작 중';
        }
      } catch (e) {
        statusSub.textContent = '알리익스프레스 페이지 감지됨';
      }
    } else {
      statusDot.classList.remove('active');
      statusLabel.textContent = '알리 외 페이지';
      statusSub.textContent = '알리익스프레스(aliexpress.com) 접속 시 자동 활성화됩니다.';
    }
  } catch (err) {
    console.warn('Tab query error:', err);
  }

  // Save helper function
  async function saveSettings(partial) {
    await chrome.storage.local.set(partial);
    saveMsg.textContent = '✓ 설정이 즉시 반영되었습니다.';
    saveMsg.style.color = '#10b981';
    setTimeout(() => {
      saveMsg.textContent = '설정이 실시간으로 자동 저장됩니다.';
      saveMsg.style.color = '';
    }, 1500);

    // Notify active tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED', settings: partial });
      }
    } catch (e) {
      // Tab may not have content script running
    }
  }

  // Event Listeners
  masterToggle.addEventListener('change', () => {
    saveSettings({ enabled: masterToggle.checked });
  });

  modeControl.addEventListener('click', (e) => {
    const btn = e.target.closest('.segment-btn');
    if (!btn) return;
    modeControl.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveSettings({ mode: btn.dataset.mode });
  });

  document.querySelectorAll('input[name="matchCondition"]').forEach(input => {
    input.addEventListener('change', () => {
      saveSettings({ matchCondition: input.value });
    });
  });

  colorPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-dot');
    if (!btn) return;
    colorPicker.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveSettings({ highlightColor: btn.dataset.color });
  });

  hideAdsCheckbox.addEventListener('change', () => {
    saveSettings({ hideAds: hideAdsCheckbox.checked });
  });

  showFloatingBarCheckbox.addEventListener('change', () => {
    saveSettings({ showFloatingBar: showFloatingBarCheckbox.checked });
  });

  showMatchBadgeCheckbox.addEventListener('change', () => {
    saveSettings({ showMatchBadge: showMatchBadgeCheckbox.checked });
  });
});
