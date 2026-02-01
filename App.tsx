
declare const chrome: any;

import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [totalBypassed, setTotalBypassed] = useState(0);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['isEnabled', 'totalBypassed'], (result: any) => {
        setIsEnabled(result.isEnabled !== false); // Default to true
        setTotalBypassed(result.totalBypassed || 0);
      });
    }
  }, []);

  const toggleStatus = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ isEnabled: newState });
    }
  };

  return (
    <div className="w-[300px] bg-[#030712] text-white p-6 font-sans select-none overflow-hidden">
      <div className="flex flex-col items-center">
        {/* Brand */}
        <div className="flex items-center space-x-2 mb-8">
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-gray-600'}`}></div>
          <h1 className="text-sm font-bold tracking-widest uppercase opacity-80">CookieSwift</h1>
        </div>

        {/* Big Power Button */}
        <button 
          onClick={toggleStatus}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border-2 
            ${isEnabled 
              ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
              : 'bg-white/5 border-white/10 shadow-none'}`}
        >
          <svg 
            className={`w-10 h-10 transition-colors duration-500 ${isEnabled ? 'text-blue-400' : 'text-gray-600'}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          
          {/* Inner Glow Ring */}
          {isEnabled && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-ping"></div>
          )}
        </button>

        {/* Status Label */}
        <div className="mt-6 text-center">
          <p className={`text-lg font-bold transition-colors ${isEnabled ? 'text-blue-400' : 'text-gray-500'}`}>
            {isEnabled ? 'SYSTEM ACTIVE' : 'SYSTEM PAUSED'}
          </p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
            {isEnabled ? 'AI Agent scanning web traffic' : 'Bypass engine currently idle'}
          </p>
        </div>

        {/* Counter */}
        <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-between items-center opacity-60">
          <span className="text-[10px] uppercase font-medium">Bypassed</span>
          <span className="text-xs font-mono font-bold text-blue-400">{totalBypassed.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
