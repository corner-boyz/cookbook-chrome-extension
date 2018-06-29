/* global chrome */

chrome.runtime.onMessage.addListener(request => {
    console.log('Selected:', request);
    chrome.storage.sync.set({
        'selected': request
    });
});