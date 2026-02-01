
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
    const result = await identifyCookieButton(html);
    
    // Log the successful bypass to storage for the dashboard stats
    const stats = await chrome.storage.local.get(['totalBypassed', 'timeSaved']);
    await chrome.storage.local.set({
      totalBypassed: (stats.totalBypassed || 0) + 1,
      timeSaved: (stats.timeSaved || 0) + 5
    });

    sendResponse(result);
  } catch (error) {
    console.error('CookieSwift Background Error:', error);
    sendResponse(null);
  }
}
