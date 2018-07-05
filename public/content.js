/* global chrome */

window.addEventListener("mouseup", () => {
  let selectedText = window
    .getSelection()
    .toString()
    .trim();
  let ingredients = parseToArray(selectedText);
  console.log("INGREDIENTS", ingredients);
  if (ingredients.length) {
    let message = {
      ingredients: ingredients
    };
    chrome.runtime.sendMessage(message);
  }
});

//Button trigger modal
{
  /* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
  Launch demo modal
</button> */
}

//Modal
//$('body').append('');

// $('body').append("<div style='position: absolute;left: 100px;top: 150px'>hello world</div>");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "openModal":
      chrome.storage.sync.set({
          'isModal': true
      });
      document.body.innerHTML +=
        '<dialog style="height:300px;" id="cookbook-dialog"><iframe style="height:250px;" id="cookbookFrame"></iframe><div><button>Close</button></div></dialog>';
      var iframe = document.getElementById("cookbookFrame");
      iframe.src = chrome.extension.getURL("index.html");
      iframe.frameBorder = 0;
      var dialog = document.querySelector("dialog");
      dialog.querySelector("button").addEventListener("click", function() {
        dialog.close();
      });
      dialog.showModal();
    // var iframe = document.createElement('iframe');
    // iframe.src = chrome.extension.getURL("http://facebook.com");
    // iframe.frameBorder = 0;
    // iframe.id = "myFrame";
    // //$(iframe).hide();//necessary otherwise frame will be visible
    // $(iframe).appendTo("body");
    // $('#myModal').modal({
    //    backdrop: 'static',
    //    keyboard: false
    // });
    // break;
  }
});

// const createDictionary = () => {
// axios.post(`http://${IP}/api/parse`, {
//     ingredients: parsed,
//   }).then(results => {
//         full.forEach((ingredient, index) => {
//             dictionary[ingredient] = results.data[index];
//         });
//         console.log('BEHOLD MY MIGHTY DICTIONARY', dictionary);
//   }).catch(error => {
//     console.log('Error in parsing selection:', error);
//   });

//}

// for (var i = 0; i < elements.length; i++) {
//     var element = elements[i];

//     for (var j = 0; j < element.childNodes.length; j++) {
//         var node = element.childNodes[j];

//         if (node.nodeType === 3) {
//             var text = node.nodeValue;
//             var replacedText = text.replace(/light brown sugar/gi, '✓ light brown sugar');

//             if (replacedText !== text) {
//                 element.replaceChild(document.createTextNode(replacedText), node);
//             }
//         }
//     }
// }

//content script
// var clickedEl = null;

// document.addEventListener("mousedown", (event) => {
//     //right click

//     if(event.button == 2) {
//         clickedEl = event.target;
//     }
// }, true);

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // if(request == "getClickedEl") {
//     //     sendResponse({value: clickedEl.value});
//     // }
// });

// Helper functions
window.parseToArray = string => {
  let arr = string.split(/\n/);
  arr.forEach((str, index) => {
    // Take out unnecesary text
    let cutOffs = [str.indexOf(","), str.indexOf("(")];
    cutOffs.forEach(index => {
      if (index > 5) {
        str = str.substring(0, index);
      } else if (index > 0) {
        if (str.includes("can")) {
          str = convertFromCan(str, "can");
        } else if (str.includes("jar")) {
          str = convertFromCan(str, "jar");
        }
      }
    });
    arr[index] = str.trim();
    // Check for empty strings
    if (!str.replace(/\s/g, "").length) {
      arr[index] = undefined;
    }
  });
  // Remove empty strings
  arr = arr.filter(el => el !== undefined);
  return arr;
};

window.convertFromCan = (str, canOrJar) => {
  let realUnits = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
  return realUnits + str.substring(str.indexOf(canOrJar) + 3);
};
