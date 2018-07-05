/* global chrome */

chrome.runtime.onMessage.addListener(request => {
    console.log('Selected:', request);
    chrome.storage.sync.set({
        'selected': request
    });
});

const parent = chrome.contextMenus.create({
    id: 'CookBook',
    title: 'CookBook',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'Check Pantry',
    parentId: parent,
    title: 'Check Pantry',
    contexts: ['all'],
  });

chrome.contextMenus.onClicked.addListener(clickData => {
    if (clickData.menuItemId === 'Check Pantry') {
        chrome.storage.sync.get(['selected'], result => {
            if (result.selected.ingredients) {
                console.log('BACKGROUND INGREDIENTS', result.selected.ingredients);
            }
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "openModal"});
           });
    }
});

// function mycallback(info, tab) {
//     chrome.runtime.sendMessage(tab.id, "getClickedEl", (clickedEl) => {
//         console.log('ELEMENT', clickedEl.value);
//         elt.value = clickedEl.value;
//     });
// }

// let windowId = 0;
// const CONTEXT_MENU_ID = 'example_context_menu';

// // function closeIfExist() {
// //   if (windowId > 0) {
// //     chrome.windows.remove(windowId);
// //     windowId = chrome.windows.WINDOW_ID_NONE;
// //   }
// // }

// function popWindow(type) {
//   closeIfExist();
//   const options = {
//     type: 'popup',
//     left: 100,
//     top: 100,
//     width: 800,
//     height: 475,
//   };
//   if (type === 'open') {
//     options.url = 'window.html';
//     chrome.windows.create(options, (win) => {
//       windowId = win.id;
//     });
//   }
// }



// chrome.contextMenus.onClicked.addListener((event) => {
//   if (event.menuItemId === CONTEXT_MENU_ID) {
//     popWindow('open');
//   }
// });