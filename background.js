
import { identifyCookieButton } from './services/geminiService.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'BANNER_DETECTED') {
    handleBannerDetection(request.html, sendResponse);
    return true; 
  }
});

async function handleBannerDetection(html, sendResponse) {
  try {
    const result = await identifyCookieButton(html);
    if (result && result.buttonText) {
      const stats = await chrome.storage.local.get(['totalBypassed']);
      await chrome.storage.local.set({
        totalBypassed: (stats.totalBypassed || 0) + 1
      });
      sendResponse(result);
    } else {
      sendResponse(null);
    }
  } catch (error) {
    console.error('CookieSwift Background Error:', error);
    sendResponse(null);
  }
}
