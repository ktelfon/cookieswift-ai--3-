
(function() {
  async function init() {
    if (typeof chrome === 'undefined' || !chrome.storage) return;

    chrome.storage.local.get(['isEnabled'], async (result) => {
      if (result.isEnabled === false) return;

      const banner = findCookieBanner();
      if (banner) {
        const htmlSnippet = banner.outerHTML.substring(0, 1000);
        
        chrome.runtime.sendMessage({
          type: 'BANNER_DETECTED',
          html: htmlSnippet
        }, (response) => {
          if (response && response.buttonText) {
            executeAutoClick(banner, response.buttonText);
          }
        });
      }
    });
  }

  function findCookieBanner() {
    const commonSelectors = [
      '#cookie-banner', '#cookie-notice', '.cookie-consent', '.banner', 
      '[id*="cookie"]', '[class*="cookie"]', '[id*="gdpr"]', '[class*="consent"]'
    ];
    
    for (const selector of commonSelectors) {
      const el = document.querySelector(selector);
      if (el && el.offsetParent !== null && el.innerText.length > 20) {
        const text = el.innerText.toLowerCase();
        if (text.includes('cookie') || text.includes('privacy') || text.includes('consent')) {
          return el;
        }
      }
    }
    return null;
  }

  function executeAutoClick(container, buttonText) {
    const elements = container.querySelectorAll('button, a, [role="button"]');
    const target = Array.from(elements).find(el => 
      el.innerText.toLowerCase().includes(buttonText.toLowerCase())
    );

    if (target) {
      target.click();
      showNotification();
    }
  }

  function showNotification() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:20px;right:20px;background:#3b82f6;color:white;padding:10px 16px;border-radius:12px;font-size:13px;z-index:9999999;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.3);pointer-events:none;transition:all 0.4s ease-out;font-family:sans-serif;border:1px solid rgba(255,255,255,0.2);';
    overlay.innerText = '✓ CookieSwift Bypassed';
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'translateY(-20px)';
      setTimeout(() => overlay.remove(), 400);
    }, 2500);
  }

  init();

  let scanTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(init, 2000);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
