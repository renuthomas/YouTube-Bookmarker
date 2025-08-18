import { getCurrentTab } from "./utils.js";

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.includes("youtube.com/watch")) {
    const queryParameters = details.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(details.tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const activeTab = await getCurrentTab();
  if (activeTab) {
    switch (request.type) {
      case "PLAY_BOOKMARK":
        chrome.tabs.sendMessage(activeTab.id, {
          type: "PLAY",
          value: request.value,
        });
        break;
      case "DELETE_BOOKMARK":
        chrome.tabs.sendMessage(activeTab.id, {
          type: "DELETE",
          value: request.value,
        });
        break;
      default:
        console.log("Unknown message type:", request.type);
    }
  }
});
