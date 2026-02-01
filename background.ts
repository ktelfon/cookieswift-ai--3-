// Declare chrome for TypeScript to recognize the extension API
declare const chrome: any;

import { identifyCookieButton } from './services/geminiService';

chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.type === 'BANNER_DETECTED') {
    handleBannerDetection(request.html, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function handleBannerDetection(html: string, sendResponse: (res: any) => void) {
  try {
    const storage = await chrome.storage.local.get(['geminiApiKey', 'totalBypassed', 'timeSaved']);
    const apiKey = storage.geminiApiKey;

    if (!apiKey) {
      console.warn('CookieSwift: No API key found. User needs to configure extension.');
      sendResponse({ buttonText: 'No button found', error: 'API_KEY_MISSING' }); // Return specific error to frontend if needed
      return;
    }

    const result = await identifyCookieButton(html, apiKey);
    // const result = { buttonText: 'DEBUG_DISABLED' }; // Mock result

    await chrome.storage.local.set({
      totalBypassed: (storage.totalBypassed || 0) + 1,
      timeSaved: (storage.timeSaved || 0) + 5
    });

    sendResponse(result);
  } catch (error) {
    console.error('CookieSwift Background Error:', error);
    sendResponse(null);
  }
}
