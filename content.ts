declare const chrome: any;

/**
 * CookieSwift AI Content Script
 * Optimized for minimal background interference.
 */

(function () {
  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors with other files
  let scanTimer: any;
  let observer: MutationObserver | null = null;
  let isScanningStopped = false;

  function stopScanning() {
    if (isScanningStopped) return;
    console.log('CookieSwift: Task complete. Stopping background scanning to save resources.');
    isScanningStopped = true;
    if (scanTimer) clearTimeout(scanTimer);
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  async function init() {
    if (isScanningStopped) return; // Prevent re-running if stopped

    // Check if extension is enabled before doing anything
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['isEnabled'], async (result: any) => {
        if (result.isEnabled === false) return;
        if (isScanningStopped) return;

        console.log('CookieSwift: AI Scanning...');

        // 1. FAST PATH: Check for known rigid selectors first (OneTrust, etc.)
        // This avoids API calls for common banners
        const fastClickSuccess = await attemptFastActions();
        if (fastClickSuccess) {
          console.log('CookieSwift: Fast-path click successful. Skipping AI analysis.');
          stopScanning(); // SUCCESS!
          return;
        }

        // 2. AI PATH: Use Gemini for unknown or complex banners
        const banner = findCookieBanner();

        if (banner) {
          console.log('CookieSwift: Banner found. Sending HTML to background for analysis...');
          // Increased snippet size to ensure button is captured
          const htmlSnippet = banner.outerHTML.substring(0, 5000);

          chrome.runtime.sendMessage({
            type: 'BANNER_DETECTED',
            html: htmlSnippet
          }, (response: any) => {
            if (isScanningStopped) return; // Ignore response if we already stopped (e.g. race condition)

            console.log('CookieSwift: Received response from background:', response);
            if (chrome.runtime.lastError) {
              console.error('CookieSwift: Runtime error:', chrome.runtime.lastError);
              return;
            }

            if (response && response.buttonText && response.buttonText.length < 50 && !response.buttonText.includes('No button found')) {
              console.log(`CookieSwift: AI identified button text: "${response.buttonText}". Attempting click...`);
              executeAutoClick(banner, response.buttonText);
            } else {
              console.warn('CookieSwift: AI did not return valid button text or returned error message.');
            }
          });
        }
      });
    }
  }

  async function attemptFastActions(): Promise<boolean> {
    // 1. Known Selectors
    const fastSelectors = [
      '#onetrust-accept-btn-handler', // OneTrust
      '#uc-btn-accept-banner', // Usercentrics
      '.cc-btn-accept-all', // CookieConsent
      '[data-testid="uc-accept-all-button"]'
    ];

    for (const selector of fastSelectors) {
      const btn = document.querySelector(selector) as HTMLElement;
      if (btn && btn.offsetParent !== null) {
        console.log(`CookieSwift: Fast-path found button via "${selector}". Clicking...`);
        btn.click();
        showNotification(true);
        return true;
      }
    }

    // 2. Generic Text Search
    const targetTexts = ['Accept All', 'Allow All', 'Accept Cookies', 'I Agree', 'Accept', 'Alles akzeptieren'];
    const targetSet = new Set(targetTexts.map(t => t.toLowerCase()));
    const candidates = document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"], .btn, div[class*="button"]');

    for (const node of candidates) {
      const el = node as HTMLElement;
      if (el.offsetParent === null) continue; // Skip invisible elements
      const text = el.innerText.trim().toLowerCase();

      if (targetSet.has(text)) {
        if (el.offsetParent === null) continue; // Skip invisible elements
        console.log(`CookieSwift: Found text-match button: "${el.innerText}". Clicking...`);
        el.click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI update
        if (el.offsetParent === null || !document.body.contains(el)) {
          console.log('CookieSwift: Element disappeared. Success.');
          showNotification(true);
          return true;
        }
      }
    }

    return false;
  }

  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors
  function findCookieBanner(): HTMLElement | null {
    const commonSelectors = [
      '#onetrust-banner-sdk', // OneTrust (CNN uses this often)
      '#usercentrics-root', // Usercentrics
      '.qc-cmp2-container', // Quantcast
      '#cookie-banner', '#cookie-notice', '.cookie-consent', '.banner',
      '#cmpbox', '#cmpbox2', '#gdpr-consent-tool',
      '[id*="cookie"]', '[class*="cookie"]', '[id*="gdpr"]', '[class*="consent"]',
      '[aria-label*="cookie"]'
    ];

    console.log('CookieSwift: Searching for banner with selectors:', commonSelectors);

    for (const selector of commonSelectors) {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        console.log(`CookieSwift: Found candidate element via "${selector}"`);
        // Relaxed visibility check for debugging
        if (el.innerText.length > 10) {
          console.log('CookieSwift: Candidate accepted');
          return el;
        } else {
          console.log('CookieSwift: Candidate rejected (text too short)');
        }
      }
    }

    console.log('CookieSwift: No banner found matching selectors.');
    return null;
  }

  // Fix: Scoped to IIFE to avoid "Duplicate function implementation" errors
  function executeAutoClick(container: HTMLElement, buttonText: string) {
    console.log(`CookieSwift: searching for button with text "${buttonText}" inside banner.`);
    const elements = container.querySelectorAll('button, a, [role="button"]');
    console.log(`CookieSwift: Found ${elements.length} interactive elements in banner.`);

    const target = Array.from(elements).find(el => {
      const text = (el as HTMLElement).innerText.toLowerCase();
      console.log(`CookieSwift: Checking element text: "${text}"`); // Debug log
      const match = text.includes(buttonText.toLowerCase());
      if (match) {
        console.log(`CookieSwift: matched element:`, el);
      }
      return match;
    }) as HTMLElement;

    if (target) {
      console.log(`CookieSwift: Auto-accepting via "${buttonText}"`);
      target.click();
      showNotification();
      stopScanning(); // SUCCESS!
    } else {
      console.warn(`CookieSwift: Could not find button matching "${buttonText}"`);
    }
  }

  function showNotification(isFast = false) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:10px;right:10px;background:#3b82f6;color:white;padding:8px 12px;border-radius:8px;font-size:12px;z-index:9999999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5);pointer-events:none;transition:opacity 0.5s;';
    overlay.innerText = isFast ? '⚡ CookieSwift Fast-Pass' : '✓ CookieSwift Bypassed';
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    }, 2000);
  }

  // Start scanning on load
  init();

  // Fix: Scoped variables to avoid "Cannot redeclare block-scoped variable" errors
  observer = new MutationObserver(() => {
    if (isScanningStopped) return;
    clearTimeout(scanTimer);
    scanTimer = setTimeout(init, 3000);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
