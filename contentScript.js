(() => {
  let youtubeRightControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];
  let isVideoReady = false;

  const getTime = (t) => {
    var date = new Date(0);
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
    const currentTime = youtubePlayer.currentTime;

    const newBookmark = {
      time: currentTime,
      desc: `Bookmark at ${getTime(currentTime)}`,
    };
    console.log("New bookmark:", newBookmark);

    let currentVideoBookmarks = await fetchBookmarks(currentVideo);

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

    youtubeRightControls.prepend(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

    currentVideo = videoId;
    currentVideoBookmarks = await fetchBookmarks(videoId);
    isVideoReady = true;
  };

  // This function is for initial page load only
  const checkForPlayer = (mutations, observer) => {
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    youtubeRightControls =
      document.getElementsByClassName("ytp-right-controls")[0];

    if (youtubePlayer && youtubeRightControls) {
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get("v");
      if (videoId) {
        newVideoLoaded(videoId);
      }
      2;
      observer.disconnect();
    }
  };
  const observer = new MutationObserver(checkForPlayer);
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value } = obj;

    if (type === "NEW") {
      isVideoReady = false;
      const existingBtn = document.getElementsByClassName("bookmark-btn")[0];
      if (existingBtn) {
        existingBtn.remove();
      }
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (type === "PLAY" && isVideoReady) {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE" && isVideoReady) {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });
      response(currentVideoBookmarks);
    }
  });
})();
