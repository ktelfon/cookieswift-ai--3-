import React, { useState, useEffect } from 'react';

declare const chrome: any;

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if key exists (don't reveal it for security, just show if it's there)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
          setHasKey(true);
        }
      });
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    setStatus('saving');

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ geminiApiKey: apiKey.trim() }, () => {
        setStatus('saved');
        setHasKey(true);
        setApiKey(''); // Clear input for security
        setTimeout(() => setStatus('idle'), 2000);
      });
    } else {
      // Dev mode fallback
      console.log('Saved key:', apiKey);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 font-sans">
      <div className="flex-1 flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CookieSwift AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">Automated Consent Manager</p>
        </header>

        <div className="glass p-5 rounded-xl border border-gray-700/50">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasKey ? "Key stored (enter to update)" : "Enter your API key"}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-600"
            />
            {hasKey && !apiKey && (
              <div className="absolute right-3 top-3 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your key is stored locally in your browser.
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
              Get a key here
            </a>.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!apiKey || status === 'saving'}
          className={`w-full py-3 rounded-lg font-medium transition-all ${status === 'saved'
            ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved Successfully' : 'Save Configuration'}
        </button>

        {hasKey && (
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Extension Active & Ready
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
