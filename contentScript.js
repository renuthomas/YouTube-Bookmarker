(() => {
  let youtubeRightControls, youtubePlayer;
  let currentVideo = "";
  let isVideoReady = false;

  const getTime = (t) => {
    const date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substring(11, 19);
  };

  const fetchBookmarks = async (videoId) => {
    const result = await chrome.storage.sync.get(videoId);
    try {
      return result[videoId] ? JSON.parse(result[videoId]) : [];
    } catch {
      return [];
    }
  };

  const addNewBookmarkEventHandler = async () => {
    if (!youtubePlayer || !currentVideo) return;

    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: `Bookmark at ${getTime(currentTime)}`,
    };
    console.log("New bookmark:", newBookmark);
    
    const currentVideoBookmarks = await fetchBookmarks(currentVideo);
    currentVideoBookmarks.push(newBookmark);
    currentVideoBookmarks.sort((a, b) => a.time - b.time);

    await chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(currentVideoBookmarks),
    });

    console.log("Updated bookmarks:", currentVideoBookmarks);
  };

  const newVideoLoaded = async (videoId) => {
    if (document.getElementsByClassName("bookmark-btn")[0]) {
      return;
    }

    const bookmarkBtn = document.createElement("img");
    bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "ytp-button bookmark-btn";
    bookmarkBtn.title = "Click to bookmark current timestamp";
    bookmarkBtn.style.cursor = "pointer";

    youtubeRightControls.prepend(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

    currentVideo = videoId;
    isVideoReady = true;
  };

  const checkForPlayer = (mutations, observer) => {
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];

    if (youtubePlayer && youtubeRightControls) {
      const videoId = new URLSearchParams(window.location.search).get("v") || window.location.href.match(/[?&]v=([^&#]+)/)?.[1];
      if (videoId) {
        newVideoLoaded(videoId);
      }
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(checkForPlayer);
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    const { type, value } = obj;

    if (type === "NEW") {
      isVideoReady = false;
      const existingBtn = document.getElementsByClassName("bookmark-btn")[0];
      if (existingBtn) {
        existingBtn.remove();
      }
      observer.observe(document.body, { childList: true, subtree: true });
      sendResponse({ status: "Observer re-armed" }); // Closes channel safely
    } 
    
    else if (type === "PLAY" && isVideoReady && youtubePlayer) {
      youtubePlayer.currentTime = value;
      sendResponse({ status: "Playback jumped" }); // Closes channel safely
    } 
    
    else if (type === "DELETE" && isVideoReady) {
      fetchBookmarks(currentVideo).then((bookmarks) => {
        const filteredBookmarks = bookmarks.filter((b) => b.time != value);
        chrome.storage.sync.set({
          [currentVideo]: JSON.stringify(filteredBookmarks),
        }, () => {
          sendResponse(filteredBookmarks);
        });
      });

      return true; // Keeps channel open explicitly for async sendResponse
    }

    return false; // Safely tells Chrome no async response is coming for other types
  }); 
})();