# YouTube Bookmark Chrome Extension

A lightweight Chrome extension to save and manage timestamped bookmarks while watching YouTube videos. Perfect for revisiting important moments in tutorials, lectures, or long-form content.

---

## Features

- 🔖 Add bookmarks at specific timestamps directly from the YouTube player.
- 🧠 Save video titles and timestamps automatically.
- 🎯 Jump to any saved moment with a single click.
- 📦 Bookmarks are stored using Chrome Sync — accessible across devices.
- 🧩 Clean popup UI for managing and navigating bookmarks.

---

## Demo

![Screenshot](./screenshot.png)

## 🧩 Installation

### 👉 From Chrome Web Store

> 📥 **Recommended**: Install directly from the Chrome Web Store.

[**➤ Install from Chrome Web Store**](https://chrome.google.com/webstore/detail/YOUR-EXTENSION-ID)

### 💻 Manual Installation (for developers)

1. Clone or download the repository:

   ```bash
   git clone https://github.com/yourusername/youtube-bookmark-extension.git

   ```

2. Open Chrome and go to chrome://extensions.

3. Enable Developer Mode (top right toggle).

4. Click Load Unpacked and select the root folder of the extension.

5. Open any YouTube video and start bookmarking!

## How to Use

1. While watching a YouTube video, click the 🔖 button near the player controls to create a bookmark at the current time.

2. Open the extension popup to:

- View saved bookmarks.
- Click a bookmark to instantly jump to that point in the video.

# Folder Structure

```bash
youtube-bookmark-extension/
├── manifest.json           # Extension metadata
├── background.js           # Handles message passing and storage
├── contentScript.js        # Injects button & listens for clicks on YouTube pages
├── popup.html              # Bookmark management UI
├── popup.js                # Logic for displaying and jumping to bookmarks
├── popup.css               # Popup styling
└── icons/                  # Browser action icons

```

# Permissions

This extension uses the following Chrome permissions:

- storage – to save your bookmarks.
- activeTab – to access the currently active YouTube tab.
- scripting – for injecting scripts into YouTube pages.

# Development Notes

- Built with Manifest V3 and JavaScript modules.
- Bookmarks are stored using chrome.storage.sync for cloud-backed persistence.

# Future Improvements

✅ Add descriptions to each bookmark.

🔍 Search through all saved bookmarks.

🌐 Export bookmarks to JSON or shareable links.

# License

MIT License — free for personal or commercial use.
