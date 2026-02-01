declare const chrome: any;

/**
 * CookieSwift AI Content Script
 * Optimized for minimal background interference.
 */

(function() {
  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors with other files
  async function init() {
    // Check if extension is enabled before doing anything
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['isEnabled'], async (result: any) => {
        if (result.isEnabled === false) return;

        console.log('CookieSwift: AI Scanning...');
        const banner = findCookieBanner();
        
        if (banner) {
          const htmlSnippet = banner.outerHTML.substring(0, 1500);
          
          chrome.runtime.sendMessage({
            type: 'BANNER_DETECTED',
            html: htmlSnippet
          }, (response: any) => {
            if (response && response.buttonText) {
              executeAutoClick(banner, response.buttonText);
            }
          });
        }
      });
    }
  }

  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors
  function findCookieBanner(): HTMLElement | null {
    const commonSelectors = [
      '#cookie-banner', '#cookie-notice', '.cookie-consent', '.banner', 
      '[id*="cookie"]', '[class*="cookie"]', '[id*="gdpr"]', '[class*="consent"]'
    ];
    
    for (const selector of commonSelectors) {
      const el = document.querySelector(selector) as HTMLElement;
      // Basic heuristics: visible, has text, contains keywords
      if (el && el.offsetParent !== null && el.innerText.length > 30) {
        const text = el.innerText.toLowerCase();
        if (text.includes('cookie') || text.includes('privacy') || text.includes('consent')) {
          return el;
        }
      }
    }
    return null;
  }

  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors
  function executeAutoClick(container: HTMLElement, buttonText: string) {
    const elements = container.querySelectorAll('button, a, [role="button"]');
    const target = Array.from(elements).find(el => 
      (el as HTMLElement).innerText.toLowerCase().includes(buttonText.toLowerCase())
    ) as HTMLElement;

    if (target) {
      console.log(`CookieSwift: Auto-accepting via "${buttonText}"`);
      target.click();
      
      // Brief visual confirmation for user
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:10px;right:10px;background:#3b82f6;color:white;padding:8px 12px;border-radius:8px;font-size:12px;z-index:9999999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5);pointer-events:none;transition:opacity 0.5s;';
      overlay.innerText = '✓ CookieSwift Bypassed';
      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
      }, 2000);
    }
  }

  // Start scanning on load
  init();

  // Fix: Scoped variables to avoid "Cannot redeclare block-scoped variable" errors
  let scanTimer: any;
  const observer = new MutationObserver(() => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(init, 3000);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
