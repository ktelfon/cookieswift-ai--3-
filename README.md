# CookieSwift AI 🍪🤖

CookieSwift AI is an intelligent Chrome Extension that automatically detects and accepts cookie consent banners, allowing you to browse the web seamlessly. It leverages **Google's Gemini API** to analyze complex or unknown cookie banners while using optimized "fast paths" for common Consent Management Platforms.

## ✨ Features

- **⚡ Fast-Path Detection**: Instantly handles common cookie banners (OneTrust, Usercentrics, CookieConsent, etc.) without API calls.
- **🧠 AI-Powered Analysis**: Uses Google Gemini to visually analyze and identify "Accept/Allow" buttons on unknown or complex banners.
- **🛡️ Privacy First**: Your Gemini API Key is stored locally in your browser. No data is sent to external servers other than the HTML snippets sent to Gemini for analysis.
- **📊 Dashboard**: Track how many banners have been bypassed and how much time you've saved.
- **🔔 Unobtrusive Notifications**: Get a subtle notification when a banner is auto-handled.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini API (`@google/genai`)
- **Platform**: Chrome Extension (Manifest V3)

## 🚀 Installation

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API Key (get one [here](https://aistudio.google.com/app/apikey)).

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cookieswift-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```
   This will create a `dist` folder containing the compiled extension.

4. **Load into Chrome**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked**.
   - Select the `dist` directory from the project folder.

## ⚙️ Configuration

1. Click the **CookieSwift AI** extension icon in your browser toolbar.
2. Enter your **Gemini API Key**.
3. Click **Save Configuration**.
4. The extension is now active and will start handling cookie banners automatically!

## 💻 Development

- **Run Dev Server** (for popup UI):
  ```bash
  npm run dev
  ```
  *Note: Since this is a browser extension, most changes (especially to background/content scripts) require a rebuild (`npm run build`) to take effect in the browser context.*

## 📂 Project Structure

- `App.tsx`: The main React component for the extension popup/dashboard.
- `background.ts`: Service worker handling AI logic and API communication.
- `content.ts`: Content script that scans the DOM and interacts with banners.
- `public/manifest.json`: Chrome Extension configuration.
- `vite.config.ts`: Build configuration for bundling the extension.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
